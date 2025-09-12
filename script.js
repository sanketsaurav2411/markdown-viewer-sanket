// script.js
// Full, self-contained client-side Markdown viewer script.
// - markdown-it + many plugins (loaded from index.html)
// - Preprocesses nonstandard math wrappers to MathJax-friendly delimiters
// - Mermaid diagrams, highlight.js, MathJax typesetting
// - File open / drag-drop, load from ?src=URL, TOC, theme toggle, print-to-PDF

(() => {
  // --- DOM references ---
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

  // Try to register available plugins (graceful if a plugin is not loaded)
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
  toggleThemeBtn.addEventListener('click', () => {
    const current = document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // --- Math preprocessing ---
  // Convert some common non-standard wrappers into MathJax-friendly delimiters.
  function preprocessMath(markdownText) {
    let text = markdownText;

    // 1) Convert square-bracket display blocks spanning lines:
    //    For blocks like:
    //    [
    //    \text{Population} = \frac{Deaths}{Rate}
    //    ]
    //    convert to:
    //    $$
    //    \text{Population} = \frac{Deaths}{Rate}
    //    $$
    text = text.replace(/^\[\s*\n([\s\S]*?)\n\]\s*$/gm, function(_, inner) {
      return "\n$$\n" + inner.trim() + "\n$$\n";
    });

    // 2) Inline [\math...] on same line -> $...$
    //    e.g. [\frac{a}{b}] -> $ \frac{a}{b} $
    text = text.replace(/\[\s*(\\[^\]]+?)\s*\]/g, function(_, inner) {
      return "$" + inner.trim() + "$";
    });

    // 3) Parenthesis-wrapped inline math when '(' immediately followed by backslash:
    //    e.g. (\bar{x} = 75{,}000) -> $ \bar{x} = 75{,}000 $
    text = text.replace(/\(\s*(\\[^)]+?)\s*\)/g, function(_, inner) {
      return "$" + inner.trim() + "$";
    });

    // 4) Optional: collapse repeated blank lines around display math for cleaner output
    text = text.replace(/\n{3,}/g, "\n\n");

    return text;
  }

  // --- Render function ---
  async function renderMarkdown(markdownText, sourceLabel = '') {
    try {
      // Preprocess math patterns so MathJax can find math delimiters
      markdownText = preprocessMath(markdownText);

      // Remove placeholder if present
      if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);

      // Render markdown -> HTML
      const rendered = md.render(markdownText);
      viewer.innerHTML = rendered;

      // Build TOC
      buildTOC();

      // Syntax highlight
      document.querySelectorAll('pre code').forEach((el) => {
        try { hljs.highlightElement(el); } catch (e) {}
      });

      // Mermaid handling:
      try {
        // Convert code fences with language mermaid into .mermaid containers
        document.querySelectorAll('pre code.language-mermaid, code.language-mermaid').forEach((c) => {
          const txt = c.textContent || c.innerText;
          const wrapper = document.createElement('div');
          wrapper.className = 'mermaid';
          wrapper.textContent = txt;
          // If code is inside pre, replace pre with wrapper; else replace code
          const pre = c.closest('pre');
          if (pre && pre.parentNode) pre.parentNode.replaceChild(wrapper, pre);
          else if (c.parentNode) c.parentNode.replaceChild(wrapper, c);
        });
        // Initialize mermaid to render diagrams
        if (window.mermaid) {
          mermaid.initialize({ startOnLoad: false, theme: 'default' });
          mermaid.init(undefined, viewer.querySelectorAll('.mermaid'));
        }
      } catch (e) {
        console.warn('mermaid rendering error', e);
      }

      // MathJax typeset after HTML insertion
      if (window.MathJax && window.MathJax.typesetPromise) {
        try {
          await window.MathJax.typesetPromise();
        } catch (e) {
          console.warn('MathJax.typesetPromise error', e);
        }
      } else {
        // if MathJax not present, do nothing
      }

      // Focus viewer for keyboard scrolling
      viewer.focus();

      // Update document title if source provided
      if (sourceLabel) document.title = `${sourceLabel} — Markdown Viewer`;
    } catch (err) {
      console.error('Render error', err);
      viewer.innerHTML = `<pre style="color:crimson">Render error: ${err.message}</pre>`;
    }
  }

  // --- Build TOC from headings ---
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
                .replace(/[^\w\- ]+/g,'')
                .replace(/\s+/g,'-');
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

  // --- Load from URL ---
  async function loadFromUrl(url) {
    try {
      // allow GitHub raw links or direct raw content
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const mdText = await res.text();
      await renderMarkdown(mdText, url);
    } catch (e) {
      alert('Failed to load URL: ' + e.message);
      console.error(e);
    }
  }

  loadUrlBtn.addEventListener('click', () => {
    const u = urlInput.value.trim();
    if (u) loadFromUrl(u);
  });

  // If page has ?src=... parameter, auto-load it
  const params = new URLSearchParams(location.search);
  if (params.get('src')) {
    const src = params.get('src');
    urlInput.value = src;
    loadFromUrl(src);
  }

  // --- File input & drag/drop handling ---
  fileInput.addEventListener('change', async (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      await renderMarkdown(text, f.name);
    } catch (e) {
      console.error('File read error', e);
    }
  });

  // Drag / drop
  ['dragenter','dragover'].forEach(evt => {
    window.addEventListener(evt, (e) => {
      e.preventDefault(); e.stopPropagation();
    });
  });
  window.addEventListener('drop', async (e) => {
    e.preventDefault(); e.stopPropagation();
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) {
      try {
        const text = await f.text();
        await renderMarkdown(text, f.name);
      } catch (err) {
        console.error('Drop file read error', err);
      }
    }
  });

  // --- Print / Save as PDF (rudimentary) ---
  downloadPdfBtn.addEventListener('click', () => {
    // Use browser print dialog; mobile browsers often support Save as PDF.
    window.print();
  });

  // --- Scroll helpers ---
  scrollTopBtn && scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  scrollBottomBtn && scrollBottomBtn.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));

  // --- Optional: show sample readme on load (uncomment to enable) ---
  // const sample = 'https://raw.githubusercontent.com/simov/markdown-viewer/main/README.md';
  // urlInput.value = sample;
  // loadFromUrl(sample);

  // --- End closure ---
})();
