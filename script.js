// script.js — robust loader + marked + MathJax + hljs + mermaid integration
// Ensures marked is present (with fallback), waits for MathJax, and provides robust file input handling.

(async () => {
  console.log('[mdv] script starting');

  // --- Configuration ---
  const MARKED_CDN = 'https://cdn.jsdelivr.net/gh/markedjs/marked@cd535c69875d370aeb0726ecf6c079d7515d24ad/marked.min.js';
  const MARKED_FALLBACK = 'https://unpkg.com/marked@4.4.0/marked.min.js'; // fallback

  // helper: dynamic script loader
  function loadScript(src, attrs = {}) {
    return new Promise((resolve, reject) => {
      try {
        const s = document.createElement('script');
        s.src = src;
        Object.keys(attrs || {}).forEach(k => s.setAttribute(k, attrs[k]));
        s.onload = () => { console.log(`[mdv] loaded script ${src}`); resolve(s); };
        s.onerror = (e) => reject(new Error('Failed to load ' + src));
        document.head.appendChild(s);
      } catch (e) { reject(e); }
    });
  }

  // ensure `marked` is available
  async function ensureMarked() {
    if (window.marked) { console.log('[mdv] marked already present'); return window.marked; }
    try {
      await loadScript(MARKED_CDN);
      if (window.marked) return window.marked;
    } catch (e) {
      console.warn('[mdv] primary marked CDN failed, trying fallback', e);
    }
    try {
      await loadScript(MARKED_FALLBACK);
      if (window.marked) return window.marked;
    } catch (e) {
      console.error('[mdv] failed to load marked from fallback', e);
      throw new Error('marked library not available. Please ensure network or include marked locally.');
    }
    if (!window.marked) throw new Error('marked not available after attempted loads.');
    return window.marked;
  }

  // wait for MathJax readiness
  function ensureMathJaxReady(timeoutMs = 15000) {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      console.log('[mdv] MathJax already ready');
      return Promise.resolve(window.MathJax);
    }
    const start = Date.now();
    return new Promise((resolve, reject) => {
      (function waitLoop() {
        if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') return resolve(window.MathJax);
        if (Date.now() - start > timeoutMs) return reject(new Error('MathJax not available after timeout'));
        setTimeout(waitLoop, 150);
      })();
    });
  }

  // load marked (or bail)
  try {
    await ensureMarked();
  } catch (err) {
    console.error('[mdv] Fatal: marked missing', err);
    const viewer = document.getElementById('viewer');
    if (viewer) viewer.innerHTML = `<pre style="color:crimson">Fatal error: required library <strong>marked</strong> failed to load. Check network or include marked locally.</pre>`;
    return;
  }

  // --- DOM references ---
  const viewer = document.getElementById('viewer');
  const fileInput = document.getElementById('fileInput');
  const urlInput = document.getElementById('urlInput');
  const loadUrlBtn = document.getElementById('loadUrlBtn');
  const toggleThemeBtn = document.getElementById('toggleTheme');
  const downloadPdfBtn = document.getElementById('downloadPdf');
  const toc = document.getElementById('toc');
  const app = document.querySelector('.app');

  console.log('[mdv] DOM refs', { viewer: !!viewer, fileInput: !!fileInput, urlInput: !!urlInput });

  // Theme handling
  function setTheme(t) {
    if (!app) return;
    app.setAttribute('data-theme', t);
    localStorage.setItem('mdv_theme', t);
  }
  setTheme(localStorage.getItem('mdv_theme') || 'light');
  toggleThemeBtn && toggleThemeBtn.addEventListener('click', () => setTheme(app.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  // Normalize ambiguous display [ ... ] into \[ ... \]
  function normalizeDisplay(md) {
    return md.replace(/(^|\n)[ \t]*\[[ \t]*\n([\s\S]*?)\n[ \t]*\][ \t]*(?=\n|$)/g, (m, lead, inner) => {
      return lead + '\\[\\n' + inner + '\\n\\]\\n';
    });
  }

  // Convert math delimiters to MathJax <script> tags (protect fenced code blocks)
  function convertMathToScriptTags(md) {
    let s = md.replace(/\r\n/g, '\n');

    // Temporarily shield fenced code blocks
    const codeBlocks = [];
    s = s.replace(/(^|\n)(```[\s\S]*?```)(?=\n|$)/g, function(_, lead, block) {
      const token = `@@CODEBLOCK_${codeBlocks.length}@@`;
      codeBlocks.push(block);
      return lead + token;
    });

    // \begin{env}...\end{env}
    s = s.replace(/\\begin\{([a-zA-Z*0-9_\-]+)\}([\s\S]*?)\\end\{\1\}/g, (m) => {
      return `\n\n<script type="math/tex; mode=display">${m.replace(/<\/script>/g, '&lt;/script>')}</script>\n\n`;
    });

    // $$ ... $$
    s = s.replace(/\$\$([\s\S]*?)\$\$/g, (m, inner) => {
      return `\n\n<script type="math/tex; mode=display">${inner}</script>\n\n`;
    });

    // \[ ... \]
    s = s.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (m, inner) => {
      return `\n\n<script type="math/tex; mode=display">${inner}</script>\n\n`;
    });

    // \( ... \)
    s = s.replace(/\\\(([\s\S]*?)\\\)/g, (m, inner) => `<script type="math/tex">${inner}</script>`);

    // simple inline $...$ (conservative)
    s = s.replace(/(^|[^\$])\$([^\n\$][^\$]*?)\$([^\$]|$)/g, (m, a, inner, b) => `${a}<script type="math/tex">${inner}</script>${b}`);

    // bracketed backslash forms [\...], (\...)
    s = s.replace(/\[\s*(\\[^\]\n]+?)\s*\]/g, (m, inner) => `<script type="math/tex">${inner}</script>`);
    s = s.replace(/\(\s*(\\[^)\n]+?)\s*\)/g, (m, inner) => `<script type="math/tex">${inner}</script>`);

    // restore code blocks
    for (let i = 0; i < codeBlocks.length; i++) {
      s = s.split(`@@CODEBLOCK_${i}@@`).join(codeBlocks[i]);
    }

    return s;
  }

  // Build TOC
  function buildTOC() {
    if (!toc || !viewer) return;
    toc.innerHTML = '';
    const headings = viewer.querySelectorAll('h1,h2,h3,h4,h5,h6');
    if (!headings.length) { toc.innerHTML = '<div class="muted">No headings</div>'; return; }
    headings.forEach(h => {
      if (!h.id) h.id = (h.textContent || '').trim().toLowerCase().replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      a.style.paddingLeft = `${(parseInt(h.tagName.substring(1)) - 1) * 8}px`;
      a.addEventListener('click', (e) => { e.preventDefault(); document.getElementById(h.id).scrollIntoView({ behavior: 'smooth' }); });
      toc.appendChild(a);
    });
  }

  // Render pipeline
  async function renderMarkdown(mdText, sourceLabel) {
    try {
      if (!mdText) mdText = '';
      mdText = normalizeDisplay(mdText);
      const withMathScripts = convertMathToScriptTags(mdText);

      // marked options (safe)
      marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: true,
        mangle: false
      });

      const html = marked.parse(withMathScripts);
      if (!viewer) {
        console.warn('[mdv] no #viewer element found; aborting render');
        return;
      }
      viewer.innerHTML = html;

      // highlight code
      document.querySelectorAll('pre code').forEach((el) => {
        try { hljs.highlightElement(el); } catch (e) { /* ignore */ }
      });

      // mermaid
      try {
        const mermaidBlocks = viewer.querySelectorAll('pre code.language-mermaid, code.language-mermaid');
        mermaidBlocks.forEach(c => {
          const txt = c.textContent || c.innerText || '';
          const d = document.createElement('div');
          d.className = 'mermaid';
          d.textContent = txt;
          const pre = c.closest('pre');
          if (pre && pre.parentNode) pre.parentNode.replaceChild(d, pre);
          else if (c.parentNode) c.parentNode.replaceChild(d, c);
        });
        if (window.mermaid) {
          mermaid.initialize({ startOnLoad: false, theme: 'default' });
          mermaid.init(undefined, viewer.querySelectorAll('.mermaid'));
        }
      } catch (e) { console.warn('[mdv] mermaid error', e); }

      buildTOC();

      // MathJax typeset
      try {
        await ensureMathJaxReady();
        if (window.MathJax && window.MathJax.typesetPromise) {
          await MathJax.typesetPromise([viewer]);
        } else {
          console.warn('[mdv] MathJax not available after wait');
        }
      } catch (e) {
        console.warn('[mdv] MathJax typeset error or not ready', e);
      }

      if (sourceLabel) document.title = `${sourceLabel} — Markdown Viewer`;
      console.log('[mdv] render complete for', sourceLabel || 'inline content');
    } catch (err) {
      console.error('[mdv] renderMarkdown error', err);
      if (viewer) viewer.innerHTML = `<pre style="color:crimson">Render error: ${err && err.message ? err.message : err}</pre>`;
    }
  }

  // Load markdown from URL
  async function loadFromUrl(url) {
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const txt = await res.text();
      await renderMarkdown(txt, url);
    } catch (e) {
      alert('Failed to load URL: ' + e.message);
      console.error('[mdv] loadFromUrl error', e);
    }
  }

  // Robust file input handler (File.text() preferred, FileReader fallback)
  fileInput && fileInput.addEventListener('change', async (ev) => {
    try {
      const f = ev.target && ev.target.files && ev.target.files[0];
      if (!f) {
        console.warn('[mdv] No file selected.');
        return;
      }
      console.log('[mdv] Selected file:', f.name, f.type, f.size);

      let text;
      if (typeof f.text === 'function') {
        try {
          text = await f.text();
        } catch (errText) {
          console.warn('[mdv] f.text() failed, will try FileReader fallback', errText);
        }
      }
      if (text === undefined) {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('FileReader error'));
          reader.readAsText(f, 'utf-8');
        });
      }

      if (typeof text !== 'string') throw new Error('Read file returned non-string');
      await renderMarkdown(text, f.name);
      console.log('[mdv] File rendered:', f.name);
    } catch (err) {
      console.error('[mdv] Error reading/opening file:', err);
      const ph = document.getElementById('placeholder');
      if (ph) ph.innerHTML = `<div style="color:crimson">Failed to open file: ${err.message}</div>`;
    }
  });

  // Drag & drop handlers
  ['dragenter','dragover'].forEach(evt => window.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); }));
  window.addEventListener('drop', async e => {
    e.preventDefault(); e.stopPropagation();
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) {
      try {
        let text;
        if (typeof f.text === 'function') {
          text = await f.text();
        } else {
          text = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error('FileReader error'));
            reader.readAsText(f, 'utf-8');
          });
        }
        await renderMarkdown(text, f.name);
        console.log('[mdv] Drag-drop file rendered:', f.name);
      } catch (err) {
        console.error('[mdv] drag-drop read error', err);
      }
    }
  });

  // Wire UI: load URL button
  loadUrlBtn && loadUrlBtn.addEventListener('click', () => {
    const u = urlInput && urlInput.value && urlInput.value.trim();
    if (u) loadFromUrl(u);
  });

  // Print/PDF
  downloadPdfBtn && downloadPdfBtn.addEventListener('click', () => window.print());

  // Auto load ?src=...
  const params = new URLSearchParams(location.search);
  if (params.get('src')) {
    const src = params.get('src');
    if (urlInput) urlInput.value = src;
    loadFromUrl(src);
  }

  // expose for debug
  window.MDV_renderMarkdown = renderMarkdown;

  console.log('[mdv] script ready');
})();
