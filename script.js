// script.js — marked + MathJax + highlight.js + mermaid integration
// Converts math to <script type="math/tex"> nodes before parsing with marked (so MathJax sees clean math).

(() => {
  const viewer = document.getElementById('viewer');
  const fileInput = document.getElementById('fileInput');
  const urlInput = document.getElementById('urlInput');
  const loadUrlBtn = document.getElementById('loadUrlBtn');
  const toggleThemeBtn = document.getElementById('toggleTheme');
  const downloadPdfBtn = document.getElementById('downloadPdf');
  const toc = document.getElementById('toc');
  const app = document.querySelector('.app');

  // Theme handling
  function setTheme(t){
    app.setAttribute('data-theme', t);
    localStorage.setItem('mdv_theme', t);
  }
  const saved = localStorage.getItem('mdv_theme') || 'light';
  setTheme(saved);
  toggleThemeBtn && toggleThemeBtn.addEventListener('click', () => setTheme(app.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  // Normalize ambiguous display [ ... ] into \[ ... \]
  function normalizeDisplay(md) {
    return md.replace(/(^|\n)[ \t]*\[[ \t]*\n([\s\S]*?)\n[ \t]*\][ \t]*(?=\n|$)/g, (m, lead, inner) => {
      return lead + '\\[\\n' + inner + '\\n\\]\\n';
    });
  }

  // Convert math delimiters to MathJax script tags (so MathJax gets clean math after marked renders)
  function convertMathToScriptTags(md) {
    let s = md.replace(/\r\n/g, '\n');

    // protect fenced code blocks: temporarily replace with placeholders
    const codeBlocks = [];
    s = s.replace(/(^|\n)(```[\s\S]*?```)(?=\n|$)/g, function(_, lead, block){
      const token = `@@CODEBLOCK_${codeBlocks.length}@@`;
      codeBlocks.push(block);
      return lead + token;
    });

    // \begin{env}...\end{env}
    s = s.replace(/\\begin\{([a-zA-Z*0-9_\-]+)\}([\s\S]*?)\\end\{\1\}/g, (m) => {
      return `\n\n<script type="math/tex; mode=display">${m.replace(/<\/script>/g,'&lt;/script>')}</script>\n\n`;
    });

    // $$ ... $$
    s = s.replace(/\$\$([\s\S]*?)\$\$/g, (m, inner) => {
      return `\n\n<script type="math/tex; mode=display">${inner}</script>\n\n`;
    });

    // \[ ... \]
    s = s.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (m, inner) => {
      return `\n\n<script type="math/tex; mode=display">${inner}</script>\n\n`;
    });

    // \( ... \) inline
    s = s.replace(/\\\(([\s\S]*?)\\\)/g, (m, inner) => {
      return `<script type="math/tex">${inner}</script>`;
    });

    // Inline $...$ (conservative: only convert simple safe cases)
    s = s.replace(/(^|[^\$])\$([^\n\$][^\$]*?)\$([^\$]|$)/g, (m, a, inner, b) => {
      return `${a}<script type="math/tex">${inner}</script>${b}`;
    });

    // bracketed backslash forms [\...], (\...)
    s = s.replace(/\[\s*(\\[^\]\n]+?)\s*\]/g, (m, inner) => `<script type="math/tex">${inner}</script>`);
    s = s.replace(/\(\s*(\\[^)\n]+?)\s*\)/g, (m, inner) => `<script type="math/tex">${inner}</script>`);

    // restore code blocks
    for (let i=0;i<codeBlocks.length;i++){
      s = s.split(`@@CODEBLOCK_${i}@@`).join(codeBlocks[i]);
    }

    return s;
  }

  // Build a small TOC from headings
  function buildTOC(){
    if (!toc || !viewer) return;
    toc.innerHTML = '';
    const headings = viewer.querySelectorAll('h1,h2,h3,h4,h5,h6');
    if (!headings.length) { toc.innerHTML = '<div class="muted">No headings</div>'; return; }
    headings.forEach(h => {
      if (!h.id) h.id = (h.textContent || '').trim().toLowerCase().replace(/[^\w\- ]+/g,'').replace(/\s+/g,'-');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      a.style.paddingLeft = `${(parseInt(h.tagName.substring(1))-1)*8}px`;
      a.addEventListener('click', (e) => { e.preventDefault(); document.getElementById(h.id).scrollIntoView({behavior:'smooth'}); });
      toc.appendChild(a);
    });
  }

  // Render pipeline
  async function renderMarkdown(mdText, sourceLabel){
    try {
      if (!mdText) mdText = '';

      // normalize ambiguous display blocks
      mdText = normalizeDisplay(mdText);

      // convert math to script tags
      const withMathScripts = convertMathToScriptTags(mdText);

      // configure marked safely
      marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: true,
        mangle: false // important to avoid email mangling affecting math
      });

      const html = marked.parse(withMathScripts);
      viewer.innerHTML = html;

      // highlight code
      document.querySelectorAll('pre code').forEach((el) => {
        try { hljs.highlightElement(el); } catch (e) { /* ignore */ }
      });

      // mermaid render
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
      } catch(e){ console.warn('mermaid error', e); }

      // build TOC
      buildTOC();

      // typeset math with MathJax
      if (window.MathJax && window.MathJax.typesetPromise) {
        try {
          await MathJax.typesetPromise([viewer]);
        } catch (e) {
          console.warn('MathJax typeset error', e);
          // try to log some suspicious snippets for debugging
          const bad = [];
          viewer.querySelectorAll('script[type^="math/tex"]').forEach(s => {
            if (!s.textContent || s.textContent.trim()==='') bad.push(s.textContent);
          });
          if (bad.length) console.warn('Empty/invalid math snippets:', bad.slice(0,10));
        }
      } else {
        console.warn('MathJax not loaded');
      }

      if (sourceLabel) document.title = `${sourceLabel} — Markdown Viewer`;
    } catch(err) {
      console.error('renderMarkdown error', err);
      viewer.innerHTML = `<pre style="color:crimson">Render error: ${err && err.message ? err.message : err}</pre>`;
    }
  }

  // Load markdown from URL (raw)
  async function loadFromUrl(url){
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const txt = await res.text();
      await renderMarkdown(txt, url);
    } catch (e) {
      alert('Failed to load URL: ' + e.message);
      console.error(e);
    }
  }

  // wire UI
  loadUrlBtn && loadUrlBtn.addEventListener('click', () => {
    const u = urlInput && urlInput.value && urlInput.value.trim();
    if (u) loadFromUrl(u);
  });

  // handle file input
  fileInput && fileInput.addEventListener('change', async (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    const txt = await f.text();
    await renderMarkdown(txt, f.name);
  });

  // drag & drop
  ['dragenter','dragover'].forEach(evt => window.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); }));
  window.addEventListener('drop', async e => {
    e.preventDefault(); e.stopPropagation();
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) {
      const txt = await f.text();
      await renderMarkdown(txt, f.name);
    }
  });

  // print/PDF
  downloadPdfBtn && downloadPdfBtn.addEventListener('click', () => window.print());

  // quick demo: if URL param ?src=... is present, auto-load
  const params = new URLSearchParams(location.search);
  if (params.get('src')) {
    const src = params.get('src');
    urlInput.value = src;
    loadFromUrl(src);
  }

  // expose for manual testing
  window.MDV_renderMarkdown = renderMarkdown;
})();
