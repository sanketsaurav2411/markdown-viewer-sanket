// script.js — final corrected: DOM-safe token replacement for math placeholders
// Replace your current script.js with this file.

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

  // Optional plugins
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

  // ---------------- Math extraction & reinsertion ----------------

  function extractMathBlocks(text) {
    const math = [];
    if (!text) return { text: '', math };
    text = text.replace(/\r\n/g, '\n'); // normalize

    function store(inner, isDisplay) {
      const token = `@@MATH_${math.length}@@`;
      math.push({ inner, isDisplay: !!isDisplay });
      return token;
    }

    // protect \begin{env}...\end{env}
    text = text.replace(/\\begin\{([a-zA-Z*0-9_-]+)\}([\s\S]*?)\\end\{\1\}/g, function(_, env, inner) {
      return store(`\\begin{${env}}${inner}\\end{${env}}`, true);
    });

    // $$...$$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, function(_, inner) { return store(inner, true); });

    // \[...\]
    text = text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, function(_, inner) { return store(inner, true); });

    // [ ... ] display when on own lines
    text = text.replace(/(^|\n)[ \t]*\[[ \t]*\n([\s\S]*?)\n[ \t]*\][ \t]*(?=\n|$)/g, function(m, lead, inner) { return lead + store(inner, true); });

    // \(...\) inline
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, function(_, inner) { return store(inner, false); });

    // [\... ] inline
    text = text.replace(/\[\s*(\\[^\]\n]+?)\s*\]/g, function(_, inner) { return store(inner, false); });

    // (\... ) inline
    text = text.replace(/\(\s*(\\[^)\n]+?)\s*\)/g, function(_, inner) { return store(inner, false); });

    return { text, math };
  }

  /**
   * DOM-aware replacement:
   * Walk text nodes under viewer and replace occurrences of @@MATH_N@@ with placeholder elements.
   * This avoids the issue where tokens survive string replace due to markdown-it dividing text.
   */
  function replaceMathTokensInDOM(math) {
    if (!math || !math.length) return;

    const re = /@@MATH_(\d+)@@/g;
    const walker = document.createTreeWalker(viewer, NodeFilter.SHOW_TEXT, null, false);
    const nodesToReplace = [];

    let node;
    while ((node = walker.nextNode())) {
      if (re.test(node.nodeValue)) nodesToReplace.push(node);
      re.lastIndex = 0;
    }

    nodesToReplace.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent) return;
      const frag = document.createDocumentFragment();
      let lastIndex = 0;
      let m;
      re.lastIndex = 0;
      const str = textNode.nodeValue;
      while ((m = re.exec(str)) !== null) {
        const idx = m.index;
        if (idx > lastIndex) {
          frag.appendChild(document.createTextNode(str.slice(lastIndex, idx)));
        }
        const mathIndex = Number(m[1]);
        const isDisplay = math[mathIndex] && math[mathIndex].isDisplay;
        const el = isDisplay ? document.createElement('div') : document.createElement('span');
        el.className = isDisplay ? 'md-math-block' : 'md-math-inline';
        el.setAttribute('data-math-index', String(mathIndex));
        frag.appendChild(el);
        lastIndex = re.lastIndex;
      }
      if (lastIndex < str.length) frag.appendChild(document.createTextNode(str.slice(lastIndex)));
      parent.replaceChild(frag, textNode);
      re.lastIndex = 0;
    });
  }

  function populateMathPlaceholders(math) {
    if (!math || !math.length) return;
    try {
      // inline spans
      const inlines = viewer.querySelectorAll('span.md-math-inline');
      inlines.forEach(span => {
        const idx = Number(span.getAttribute('data-math-index'));
        if (!Number.isNaN(idx) && math[idx]) span.textContent = `$${math[idx].inner}$`;
      });
      // block divs
      const blocks = viewer.querySelectorAll('div.md-math-block');
      blocks.forEach(div => {
        const idx = Number(div.getAttribute('data-math-index'));
        if (!Number.isNaN(idx) && math[idx]) div.textContent = `$$${math[idx].inner}$$`;
      });
    } catch (e) {
      console.warn('populateMathPlaceholders error', e);
    }
  }

  // ---------------- Render pipeline ----------------
  async function renderMarkdown(rawMarkdownText, sourceLabel = '') {
    try {
      const { text: withPlaceholders, math } = extractMathBlocks(rawMarkdownText || '');

      if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);

      const renderedHtml = md.render(withPlaceholders);

      // inject rendered HTML first
      viewer.innerHTML = renderedHtml;

      // then replace math tokens inside the DOM text nodes with placeholders
      replaceMathTokensInDOM(math);

      // now populate placeholders with exact math text (textContent)
      populateMathPlaceholders(math);

      // build TOC
      buildTOC();

      // syntax highlight
      document.querySelectorAll('pre code').forEach(el => {
        try { hljs.highlightElement(el); } catch (e) {}
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
      } catch (e) {
        console.warn('mermaid rendering failed', e);
      }

      // typeset math
      if (window.MathJax && window.MathJax.typesetPromise) {
        try {
          await window.MathJax.typesetPromise();
        } catch (e) {
          console.warn('MathJax typesetPromise error', e);
        }
      } else {
        console.warn('MathJax not loaded or typesetPromise unavailable.');
      }

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
        h.id = (h.textContent || h.innerText).trim().toLowerCase().replace(/[^\w\- ]+/g,'').replace(/\s+/g,'-');
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

  // auto-load ?src
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
  ['dragenter','dragover'].forEach(evt => window.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); }));
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

})();
