// script.js
// Mobile-friendly Markdown viewer (client-side).
// Requires markdown-it + plugin scripts loaded in index.html.

(() => {
  // --- DOM ---
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

  // plugins (some may be undefined depending on CDN)
  if (window.markdownitEmoji) md.use(window.markdownitEmoji);
  if (window.markdownitDeflist) md.use(window.markdownitDeflist);
  if (window.markdownitFootnote) md.use(window.markdownitFootnote);
  if (window.markdownitMark) md.use(window.markdownitMark);
  if (window.markdownitSub) md.use(window.markdownitSub);
  if (window.markdownitSup) md.use(window.markdownitSup);
  if (window.markdownitTaskLists) md.use(window.markdownitTaskLists, {enabled: true});
  if (window.markdownitAttrs) md.use(window.markdownitAttrs);
  // linkify images helper if present
  if (window.markdownitLinkifyImages) md.use(window.markdownitLinkifyImages);

  // Helper: escape if needed (not used here)
  function setTheme(t) {
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('mdv_theme', t);
  }
  // init theme
  setTheme(localStorage.getItem('mdv_theme') || 'light');

  toggleThemeBtn.addEventListener('click', () => {
    const current = document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // --- Render function ---
  async function renderMarkdown(markdownText, sourceLabel = '') {
    try {
      placeholder && placeholder.remove();
      const rendered = md.render(markdownText);

      // insert HTML
      viewer.innerHTML = rendered;

      // build TOC
      buildTOC();

      // highlight
      document.querySelectorAll('pre code').forEach((el) => {
        try { hljs.highlightElement(el); } catch (e) {}
      });

      // mermaid init
      try {
        // replace mermaid code fences if necessary: if fenced with ```mermaid markdown-it keeps .language-mermaid class
        // mermaid.init will find .language-mermaid blocks
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
        // convert any <code class="language-mermaid">blocks to mermaid diagrams
        document.querySelectorAll('pre code.language-mermaid, code.language-mermaid').forEach((c, idx) => {
          const txt = c.textContent || c.innerText;
          const wrapper = document.createElement('div');
          wrapper.className = 'mermaid';
          wrapper.textContent = txt;
          c.parentNode && c.parentNode.parentNode && c.parentNode.parentNode.replaceChild(wrapper, c.parentNode);
        });
        mermaid.init();
      } catch (e) {
        console.warn('mermaid init failed', e);
      }

      // MathJax typeset
      if (window.MathJax && window.MathJax.typesetPromise) {
        try {
          await window.MathJax.typesetPromise();
        } catch (e) {
          console.warn('MathJax failed', e);
        }
      }

      // focus viewer for keyboard scroll on mobile
      viewer.focus();
      // set document title
      if (sourceLabel) document.title = `${sourceLabel} — Markdown Viewer`;
    } catch (err) {
      console.error('Render error', err);
      viewer.innerHTML = `<pre style="color:crimson">Render error: ${err.message}</pre>`;
    }
  }

  // --- build TOC ---
  function buildTOC() {
    toc.innerHTML = '';
    const headings = viewer.querySelectorAll('h1,h2,h3,h4,h5,h6');
    if (!headings.length) { toc.innerHTML = '<p style="color:var(--muted)">No headings</p>'; return; }
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
        document.getElementById(h.id).scrollIntoView({behavior:'smooth'});
      });
      toc.appendChild(a);
    });
  }

  // --- Load from URL/param ---
  async function loadFromUrl(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const md = await res.text();
      await renderMarkdown(md, url);
    } catch (e) {
      alert('Failed to load URL: ' + e.message);
    }
  }

  loadUrlBtn.addEventListener('click', () => {
    const u = urlInput.value.trim();
    if (u) loadFromUrl(u);
  });

  // If page has ?src=...
  const params = new URLSearchParams(location.search);
  if (params.get('src')) {
    const src = params.get('src');
    urlInput.value = src;
    loadFromUrl(src);
  }

  // --- File input & drag/drop ---
  fileInput.addEventListener('change', async (ev) => {
    const f = ev.target.files[0];
    if (!f) return;
    const text = await f.text();
    await renderMarkdown(text, f.name);
  });

  // drag/drop
  ['dragenter','dragover'].forEach(evt => {
    window.addEventListener(evt, (e) => {
      e.preventDefault(); e.stopPropagation();
    });
  });
  window.addEventListener('drop', async (e) => {
    e.preventDefault(); e.stopPropagation();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) {
      const text = await f.text();
      await renderMarkdown(text, f.name);
    }
  });

  // --- PDF download (rudimentary) ---
  downloadPdfBtn.addEventListener('click', () => {
    // use print as fallback (mobile browsers often offer Save as PDF)
    window.print();
  });

  // --- scroll helpers ---
  scrollTopBtn && scrollTopBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  scrollBottomBtn && scrollBottomBtn.addEventListener('click', () => window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'}));

  // --- initial demo (optional) ---
  // If you want to show a sample readme on load, uncomment and set sample URL
  // const sample = 'https://raw.githubusercontent.com/simov/markdown-viewer/main/README.md';
  // urlInput.value = sample; loadFromUrl(sample);

})();
