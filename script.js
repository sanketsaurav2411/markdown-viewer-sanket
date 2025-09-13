// script.js — final, corrected version
// - Extract math blocks before markdown-it to preserve LaTeX exactly
// - Reinsert math as DOM placeholders and set textContent to avoid HTML mangling
// - Works with: $$..$$, \[..\], [..] (display), \(..\), (\..), [\..] (inline), \begin{env}...\end{env}
// - Also handles mermaid, highlight.js, TOC, file open/drag-drop, theme toggle, print

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

  // Optional plugin registration (graceful fallback if not loaded)
  try { if (window.markdownitEmoji) md.use(window.markdownitEmoji); } catch (e) {}
  try { if (window.markdownitDeflist) md.use(window.markdownitDeflist); } catch (e) {}
  try { if (window.markdownitFootnote) md.use(window.markdownitFootnote); } catch (e) {}
  try { if (window.markdownitMark) md.use(window.markdownitMark); } catch (e) {}
  try { if (window.markdownitSub) md.use(window.markdownitSub); } catch (e) {}
  try { if (window.markdownitSup) md.use(window.markdownitSup); } catch (e) {}
  try { if (window.markdownitTaskLists) md.use(window.markdownitTaskLists, { enabled: true }); } catch (e) {}
  try { if (window.markdownitAttrs) md.use(window.markdownitAttrs); } catch (e) {}
  try { if (window.markdownitLinkifyImages) md.use(window.markdownitLinkifyImages); } catch (e) {}

  // --- Theme handling ---
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

  // ---------------- Math extraction & reinsertion helpers ----------------

  /**
   * Extract math blocks and replace with placeholders.
   * Returns { text: stringWithPlaceholders, math: [{inner, isDisplay}, ...] }
   */
  function extractMathBlocks(text) {
    const math = [];
    if (!text) return { text: '', math };

    // Normalize line endings
    text = text.replace(/\r\n/g, '\n');

    // Helper to store math and return token
    function store(inner, isDisplay) {
      const token = `@@MATH_${math.length}@@`;
      math.push({ inner, isDisplay: !!isDisplay });
      return token;
    }

    // 0) Protect \begin{env}...\end{env} (treat as display)
    // Use a loop to capture nested same env occurrences properly
    text = text.replace(/\\begin\{([a-zA-Z*0-9_-]+)\}([\s\S]*?)\\end\{\1\}/g, function(_, env, inner) {
      return store(`\\begin{${env}}${inner}\\end{${env}}`, true);
    });

    // 1) $$ ... $$ (display)
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, function(_, inner) {
      return store(inner, true);
    });

    // 2) \[ ... \] (display) - multi or single line
    text = text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, function(_, inner) {
      return store(inner, true);
    });

    // 3) [ ... ] as display when on its own lines:
    // require that the opening '[' is at start of line (allow spaces) and closing ']' at line end
    text = text.replace(/(^|\n)[ \t]*\[[ \t]*\n([\s\S]*?)\n[ \t]*\][ \t]*(?=\n|$)/g, function(m, lead, inner) {
      return lead + store(inner, true);
    });

    // 4) \(...\) inline standard TeX
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, function(_, inner) {
      return store(inner, false);
    });

    // 5) Inline bracketed LaTeX starting with backslash: [\alpha], [\frac{..}] -> inline
    text = text.replace(/\[\s*(\\[^\]\n]+?)\s*\]/g, function(_, inner) {
      return store(inner, false);
    });

    // 6) Parenthesis-wrapped inline LaTeX when '(' immediately followed by backslash:
    //    (\bar{x} = ...)
    text = text.replace(/\(\s*(\\[^)\n]+?)\s*\)/g, function(_, inner) {
      return store(inner, false);
    });

    // Return placeholdered text and math array
    return { text, math };
  }

  /**
   * Reinsert placeholders into HTML string as DOM placeholders:
   * - display -> <div class="md-math-block" data-math-index="i"></div>
   * - inline  -> <span class="md-math-inline" data-math-index="i"></span>
   *
   * This avoids inserting raw $...$ into HTML where parsing could mangle backslashes.
   */
  function reinsertMathIntoHtmlSafely(htmlString, math) {
    if (!math || !math.length) return htmlString;
    for (let i = 0; i < math.length; i++) {
      const token = `@@MATH_${i}@@`;
      const placeholder = math[i].isDisplay
        ? `<div class="md-math-block" data-math-index="${i}"></div>`
        : `<span class="md-math-inline" data-math-index="${i}"></span>`;
      htmlString = htmlString.split(token).join(placeholder);
    }
    return htmlString;
  }

  /**
   * Populate the DOM placeholders with exact math text using textContent (preserves backslashes).
   * This must be called after viewer.innerHTML is set but before MathJax typesetting.
   */
  function populateMathPlaceholders(math) {
    if (!math || !math.length) return;
    try {
      // Inline spans
      const inlines = viewer.querySelectorAll('span.md-math-inline');
      inlines.forEach(span => {
        const idx = Number(span.getAttribute('data-math-index'));
        if (!Number.isNaN(idx) && math[idx]) {
          const item = math[idx];
          span.textContent = `$${item.inner}$`;
        }
      });

      // Block divs
      const blocks = viewer.querySelectorAll('div.md-math-block');
      blocks.forEach(div => {
        const idx = Number(div.getAttribute('data-math-index'));
        if (!Number.isNaN(idx) && math[idx]) {
          const item = math[idx];
          div.textContent = `$$${item.inner}$$`;
        }
      });
    } catch (e) {
      console.warn('populateMathPlaceholders error', e);
    }
  }

  // ---------------- Render pipeline ----------------
  async function renderMarkdown(rawMarkdownText, sourceLabel = '') {
    try {
      // 1) Extract math -> placeholders
      const { text: withPlaceholders, math } = extractMathBlocks(rawMarkdownText || '');

      // 2) Remove UI placeholder if present
      if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);

      // 3) Render markdown-it on the placeholdered text
      const renderedHtml = md.render(withPlaceholders);

      // 4) Replace tokens with DOM placeholders to avoid HTML parsing issues
      const safeHtml = reinsertMathIntoHtmlSafely(renderedHtml, math);

      // 5) Inject into viewer
      viewer.innerHTML = safeHtml;

      // 6) Populate placeholders' textContent with exact math strings
      populateMathPlaceholders(math);

      // 7) Build TOC (headings now exist)
      buildTOC();

      // 8) Syntax highlight
      document.querySelectorAll('pre code').forEach(el => {
        try { hljs.highlightElement(el); } catch (e) {}
      });

      // 9) Mermaid rendering: replace mermaid code blocks with divs and init
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
        console.warn('mermaid rendering failed', e);
      }

      // 10) Finally, typeset math with MathJax
      if (window.MathJax && window.MathJax.typesetPromise) {
        try {
          await window.MathJax.typesetPromise();
        } catch (e) {
          console.warn('MathJax typesetPromise error', e);
        }
      } else {
        console.warn('MathJax not loaded or typesetPromise unavailable.');
      }

      // Focus for keyboard scrolling; update title
      viewer.focus();
      if (sourceLabel) document.title = `${sourceLabel} — Markdown Viewer`;
    } catch (err) {
      console.error('Render error', err);
      viewer.innerHTML = `<pre style="color:crimson">Render error: ${err && err.message ? err.message : err}</pre>`;
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

  // auto-load from ?src=
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

  // Optional: demo initial load (commented)
  // const sample = 'https://raw.githubusercontent.com/simov/markdown-viewer/main/README.md';
  // urlInput.value = sample; loadFromUrl(sample);

})();

// *** UI toggles: small, safe, non-invasive ***
(() => {
  const tocToggle = document.getElementById('tocToggle');
  const sidebar = document.getElementById('sidebar');
  const loadUrlBtn = document.getElementById('loadUrlBtn');
  const urlInput = document.getElementById('urlInput');

  if (tocToggle && sidebar) {
    tocToggle.addEventListener('click', (e) => {
      sidebar.classList.toggle('open');
      e.stopPropagation();
    });
    // close on escape
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && sidebar.classList.contains('open')) sidebar.classList.remove('open');
    });
  }

  // quick enter => load URL
  if (urlInput && loadUrlBtn) {
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loadUrlBtn.click();
    });
  }
})();
