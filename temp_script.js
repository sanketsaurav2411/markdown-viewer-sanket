// script.js (fixed: better handling for \[ ... \] and [ ... ] display math blocks)
// Replace existing script.js with this file and push to GitHub Pages.

(() => {
  // --- DOM refs ---
  const viewer = document.getElementById('viewer');
  const placeholder = document.getElementById('placeholder');
  const toc = document.getElementById('toc');
  const fileInput = document.getElementById('fileInput');
  const urlInput = document.getElementById('urlInput');
  const loadUrlBtn = document.getElementById('loadUrlBtn');
  const toggleThemeBtn = document.getElementById('toggleTheme');
  const downloadPdfBtn = document.getElementById('downloadPdf');
  const scrollTopBtn = document.getElementById('scrollTop');
  const scrollBottomBtn = document.getElementById('scrollBottom');

  // --- markdown-it setup ---
  const md = window.markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  });

  // register plugins (if available)
  try { if (window.markdownitEmoji) md.use(window.markdownitEmoji); } catch {}
  try { if (window.markdownitDeflist) md.use(window.markdownitDeflist); } catch {}
  try { if (window.markdownitFootnote) md.use(window.markdownitFootnote); } catch {}
  try { if (window.markdownitMark) md.use(window.markdownitMark); } catch {}
  try { if (window.markdownitSub) md.use(window.markdownitSub); } catch {}
  try { if (window.markdownitSup) md.use(window.markdownitSup); } catch {}
  try { if (window.markdownitTaskLists) md.use(window.markdownitTaskLists, { enabled: true }); } catch {}
  try { if (window.markdownitAttrs) md.use(window.markdownitAttrs); } catch {}
  try { if (window.markdownitLinkifyImages) md.use(window.markdownitLinkifyImages); } catch {}

  // --- theme toggle ---
  function setTheme(t) {
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('mdv_theme', t);
  }
  setTheme(localStorage.getItem('mdv_theme') || 'light');
  toggleThemeBtn && toggleThemeBtn.addEventListener('click', () => {
    const current = document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ---------------- Improved math preprocessing ----------------
  // Converts:
  //   \[ ... \]   -> $$ ... $$
  //   [ ... ]     -> $$ ... $$
  //   [\... ]     -> $ ... $
  //   (\... )     -> $ ... $
  // Leaves existing $$...$$ and \(..\) untouched.
  function preprocessMath(markdownText) {
    let text = (markdownText || '');

    // Normalize line endings
    text = text.replace(/\r\n/g, '\n');

    // 0) Quick unescape: convert sequences like "\\[" (literal backslash escaped) into "\["
    // This makes later regexes simpler. We replace double-backslash before [ and ] with single backslash.
    // Only do this when backslash is directly before bracket.
    text = text.replace(/\\\\\[/g, '\\['); // \\\[ -> \[
    text = text.replace(/\\\\\]/g, '\\]'); // \\\] -> \]

    // 1) HANDLE backslash-square display blocks: \[ ... \]
    // Match \[ on its own line (allow spaces) then content then \] on its own line.
    // Also tolerate multiple backslashes (e.g. "\\[") because we pre-unescaped above.
    text = text.replace(/(^|\n)[ \t]*\\\[[ \t]*\n([\s\S]*?)\n[ \t]*\\\][ \t]*(?=\n|$)/g, function(_, lead, inner) {
        inner = inner.replace(/^\s+|\s+$/g, '');
        return `\n\n$$\n${inner}\n$$\n\n`;
    });

    // 2) HANDLE backslash-square inline on same line: \[ ... \]
    // e.g. "Before \[ \frac{a}{b} \] After" -> convert to display math
    text = text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, function(_, inner) {
        // If inner contains newlines, treat as display; else still make display to match ChatGPT rendering
        inner = inner.replace(/^\s+|\s+$/g, '');
        return `\n\n$$\n${inner}\n$$\n\n`;
    });

    // 3) HANDLE square-bracket display blocks [ ... ] (literal bracket on its own lines)
    text = text.replace(/(^|\n)[ \t]*\[[ \t]*\n([\s\S]*?)\n[ \t]*\][ \t]*(?=\n|$)/g, function(_, lead, inner) {
        inner = inner.replace(/^\s+|\s+$/g, '');
        return `\n\n$$\n${inner}\n$$\n\n`;
    });

    // 4) Inline bracketed LaTeX starting with backslash: [\frac{...}] or [\alpha]
    // Convert to inline math $...$
    text = text.replace(/\[\s*(\\(?:[^\]\r\n]|\\\]|\\\r|\n)+?)\s*\]/g, function(_, inner) {
        inner = inner.replace(/^\s+|\s+$/g, '');
        return `$${inner}$`;
    });

    // 5) Parenthesis-wrapped inline LaTeX when '(' immediately followed by backslash:
    // (\bar{x} = 75{,}000) -> $ \bar{x} = 75{,}000 $
    text = text.replace(/\(\s*(\\(?:[^)\r\n]|\\\)|\\\r|\n)+?)\s*\)/g, function(_, inner) {
        inner = inner.replace(/^\s+|\s+$/g, '');
        return `$${inner}$`;
    });

    // 6) Collapse many blank lines for cleaner HTML
    text = text.replace(/\n{3,}/g, '\n\n');

    // Debug: show a small sample in console so you can verify conversion
    try {
        if (console && console.debug) {
        console.debug('preprocessMath sample >>>', text.slice(0, 800).replace(/\n/g, '\\n'));
        }
    } catch(e){}

    return text;
    }


  // ---------------- Render pipeline ----------------
  async function renderMarkdown(markdownText, sourceLabel = '') {
    try {
      // Preprocess math first
      markdownText = preprocessMath(markdownText);

      // Remove placeholder if present
      if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);

      // Render to HTML
      const rendered = md.render(markdownText);
      viewer.innerHTML = rendered;

      // Build TOC
      buildTOC();

      // Syntax highlight
      document.querySelectorAll('pre code').forEach(el => {
        try { hljs.highlightElement(el); } catch (e) {}
      });

      // Mermaid rendering: convert code blocks with language-mermaid into .mermaid divs
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
      } catch (e) {
        console.warn('mermaid error', e);
      }

      // MathJax typeset after injecting HTML
      if (window.MathJax && window.MathJax.typesetPromise) {
        try {
          await window.MathJax.typesetPromise();
        } catch (e) {
          console.warn('MathJax typeset error', e);
        }
      } else {
        if (typeof console !== 'undefined') console.warn('MathJax not available to typeset.');
      }

      viewer.focus();
      if (sourceLabel) document.title = `${sourceLabel} — Markdown Viewer`;
    } catch (err) {
      console.error('Render error', err);
      viewer.innerHTML = `<pre style="color:crimson">Render error: ${err.message}</pre>`;
    }
  }

  // ---------------- Build TOC ----------------
  function buildTOC() {
    if (!toc) return;
    toc.innerHTML = '';
    const headings = viewer.querySelectorAll('h1,h2,h3,h4,h5,h6');
    if (!headings.length) {
      toc.innerHTML = '<p style="color:var(--muted)">No headings</p>';
      return;
    }
    headings.forEach(h => {
      if (!h.id) {
        h.id = (h.textContent || h.innerText).trim().toLowerCase()
               .replace(/[^\w\- ]+/g,'').replace(/\s+/g,'-');
      }
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      a.style.paddingLeft = `${(parseInt(h.tagName.substring(1)) - 1) * 8}px`;
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        document.getElementById(h.id).scrollIntoView({ behavior: 'smooth' });
      });
      toc.appendChild(a);
    });
  }

  // ---------------- Load from URL ----------------
  async function loadFromUrl(url) {
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const mdText = await res.text();
      await renderMarkdown(mdText, url);
    } catch (e) {
      alert('Failed to load URL: ' + e.message);
      console.error('loadFromUrl error', e);
    }
  }

  loadUrlBtn && loadUrlBtn.addEventListener('click', () => {
    const u = urlInput && urlInput.value && urlInput.value.trim();
    if (u) loadFromUrl(u);
  });

  // auto-load ?src=...
  const params = new URLSearchParams(location.search);
  if (params.get('src')) {
    const src = params.get('src');
    if (urlInput) urlInput.value = src;
    loadFromUrl(src);
  }

  // ---------------- File & Drag/Drop ----------------
  fileInput && fileInput.addEventListener('change', async (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      await renderMarkdown(text, f.name);
    } catch (e) {
      console.error('file read error', e);
    }
  });

  ['dragenter','dragover'].forEach(evt => {
    window.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); });
  });
  window.addEventListener('drop', async (e) => {
    e.preventDefault(); e.stopPropagation();
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) {
      try {
        const text = await f.text();
        await renderMarkdown(text, f.name);
      } catch (err) {
        console.error('drop file read error', err);
      }
    }
  });

  // ---------------- Print / Save as PDF ----------------
  downloadPdfBtn && downloadPdfBtn.addEventListener('click', () => window.print());

  // ---------------- Scroll helpers ----------------
  scrollTopBtn && scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  scrollBottomBtn && scrollBottomBtn.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));

  // Optional sample load (commented)
  // const sample = 'https://raw.githubusercontent.com/simov/markdown-viewer/main/README.md';
  // urlInput.value = sample; loadFromUrl(sample);

})();
