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
  const fileListNav = document.getElementById('fileList');

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
    text = text.replace(/\\begin\{([a-zA-Z*0-9_-]+)\}([\s\S]*?)\\end\{\1\}/g, function(_, env, inner) {
      return store(`\\begin{${env}}${inner}\\end{${env}}`, true);
    });

    // 1) $$ ... $$ (display)
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, function(_, inner) {
      return store(inner, true);
    });

    // 2) \[ ... \] (display)
    text = text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, function(_, inner) {
      return store(inner, true);
    });

    // 3) [ ... ] as display when on its own lines
    text = text.replace(/(^|\n)[ \t]*\[[ \t]*\n([\s\S]*?)\n[ \t]*\][ \t]*(?=\n|$)/g, function(m, lead, inner) {
      return lead + store(inner, true);
    });

    // 4) \(...\) inline
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, function(_, inner) {
      return store(inner, false);
    });

    // 5) Inline bracketed LaTeX starting with backslash
    text = text.replace(/\[\s*(\\[^\]\n]+?)\s*\]/g, function(_, inner) {
      return store(inner, false);
    });

    // 6) Parenthesis-wrapped inline LaTeX when '(' immediately followed by backslash
    text = text.replace(/\(\s*(\\[^)\n]+?)\s*\)/g, function(_, inner) {
      return store(inner, false);
    });

    return { text, math };
  }

  /**
   * Reinsert placeholders into HTML string as DOM placeholders:
   * - display -> <div class="md-math-block" data-math-index="i"></div>
   * - inline  -> <span class="md-math-inline" data-math-index="i"></span>
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
      const inlines = viewer.querySelectorAll('span.md-math-inline');
      inlines.forEach(span => {
        const idx = Number(span.getAttribute('data-math-index'));
        if (!Number.isNaN(idx) && math[idx]) {
          const item = math[idx];
          span.textContent = `$${item.inner}$`;
        }
      });

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
      document.querySelectorAll('pre code').fo
