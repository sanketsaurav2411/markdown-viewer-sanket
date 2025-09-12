// script.js (updated - stronger math preprocessing + debug snippet)
// Replace your existing script.js with this file and push to GitHub Pages.

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
  toggleThemeBtn.addEventListener('click', () => {
    const current = document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ---------------- Strong math preprocessing ----------------
  // This converts many nonstandard math wrappers into MathJax-friendly $...$ and $$...$$.
  function preprocessMath(markdownText) {
    let text = markdownText;

    // Normalize line endings to \n for regex simplicity
    text = text.replace(/\r\n/g, '\n');

    // 1) Convert display blocks where [ and ] appear alone on lines (allow spaces/indentation)
    //    matches:
    //      [    \n  ... \n  ]
    //    or with indentation/spaces. This will produce:
    //      $$\n ... \n$$
    text = text.replace(/(^|\n)[ \t]*\[[ \t]*\n([\s\S]*?)\n[ \t]*\][ \t]*(?=\n|$)/g, function(_, lead, inner) {
      inner = inner.replace(/^\s+|\s+$/g, ''); // trim inner
      return `\n\n$$\n${inner}\n$$\n\n`;
    });

    // 2) Convert display blocks where [ and ] are on same line but content spans multiple lines separated by blank lines:
    //    "[\n ... \n ]" already handled; this tries to catch stray variants.
    // (No-op: covered above)

    // 3) Convert single-line inline bracketed LaTeX: [\frac{...}] -> $ \frac{...} $
    //    and also [\alpha], [\bar{x}] etc.
    text = text.replace(/\[\s*(\\(?:[^]\r\n]|\\\]|\\\r|\n)+?)\s*\]/g, function(_, inner) {
      // inner is LaTeX starting with backslash
      inner = inner.replace(/^\s+|\s+$/g, '');
      return `$${inner}$`;
    });

    // 4) Convert parenthesis-wrapped inline LaTeX when '(' immediately followed by backslash:
    //    (\bar{x}_{respondents} = 75{,}000)  -> $ \bar{x}_{respondents} = 75{,}000 $
    text = text.replace(/\(\s*(\\(?:[^)\r\n]|\\\)|\\\r|\n)+?)\s*\)/g, function(_, inner) {
      inner = inner.replace(/^\s+|\s+$/g, '');
      return `$${inner}$`;
    });

    // 5) Convert bracket display blocks that start with optional whitespace then '[' and end with ']' possibly with surrounding blank lines
    //    This is additional safety for files with variable spacing
    text = text.replace(/(^|\n)[ \t]*\[\s*\n([\s\S]*?)\n[ \t]*\][ \t]*(?=\n|$)/g, function(_, lead, inner) {
      inner = inner.trim();
      return `\n\n$$\n${inner}\n$$\n\n`;
    });

    // 6) Collapse multiple blank lines (nice for rendering)
    text = text.replace(/\n{3,}/g, '\n\n');

    // Debugging: log first 800 chars of processed text so you can verify conversion in console
    try {
      if (typeof console !== 'undefined' && console.debug) {
        console.debug('--- preprocessMath sample (first 800 chars) ---\n', text.slice(0, 800));
      }
    } catch (e) {}

    return text;
  }

  // ---------------- Render pipeline ----------------
  async function renderMarkdown(markdownText, sourceLabel = '') {
    try {
      // preprocess math early
      markdownText = preprocessMath(markdownText);

      // remove placeholder
      if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);

      // render markdown to HTML
      const rendered = md.render(markdownText);
      viewer.innerHTML = rendered;

      // build TOC
      buildTOC();

      // highlight code
      [...viewer.querySelectorAll('pre code')].forEach(el => {
        try { hljs.highlightElement(el); } catch (e) {}
      });

      // mermaid: convert code blocks marked as mermaid into .mermaid containers
      try {
        const mermaidBlocks = viewer.querySelectorAll('pre code.language-mermaid, code.language-mermaid');
        mermaidBlocks.forEach(c => {
          const text = c.textContent || c.innerText || '';
          const div = document.createElement('div');
          div.className = 'mermaid';
          div.textContent = text;
          const pre = c.closest('pre');
          if (pre && pre.parentNode) pre.parentNode.replaceChild(div, pre);
          else if (c.parentNode) c.parentNode.replaceChild(div, c);
        });
        if (window.mermaid) {
          mermaid.initialize({ startOnLoad: false, theme: 'default' });
          mermaid.init(undefined, viewer.querySelectorAll('.mermaid'));
        }
      } catch (e) {
        console.warn('mermaid error', e);
      }

      // MathJax typeset after HTML insertion
      if (window.MathJax && window.MathJax.typesetPromise) {
        try {
          await window.MathJax.typesetPromise();
        } catch (e) {
          console.warn('MathJax typeset error', e);
        }
      } else {
        // If MathJax not loaded, show a console warning (helps debugging)
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

  loadUrlBtn.addEventListener('click', () => {
    const u = (urlInput && urlInput.value || '').trim();
    if (u) loadFromUrl(u);
  });

  // auto-load ?src=...
  const params = new URLSearchParams(location.search);
  if (params.get('src')) {
    const src = params.get('src');
    urlInput.value = src;
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

  // Optional: initial sample load (commented)
  // const sample = 'https://raw.githubusercontent.com/simov/markdown-viewer/main/README.md';
  // urlInput.value = sample; loadFromUrl(sample);

})(); 
