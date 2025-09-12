// script.js — Kerzol-style MathJax rendering + mermaid/hljs/TOC/file-drop support
// Simpler math pipeline: render markdown -> inject HTML -> MathJax.typesetPromise([viewer])
// Also: auto-convert ambiguous display [ ... ] blocks to \[ ... \] to reduce Markdown ambiguity.

(() => {
  // DOM refs (adjust if your HTML uses different IDs)
  const viewer = document.getElementById('viewer');
  const toc = document.getElementById('toc');
  const fileInput = document.getElementById('fileInput');
  const urlInput = document.getElementById('urlInput');
  const loadUrlBtn = document.getElementById('loadUrlBtn');
  const toggleThemeBtn = document.getElementById('toggleTheme');
  const downloadPdfBtn = document.getElementById('downloadPdf');

  // markdown-it
  const md = window.markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  });

  // optional plugins (if present)
  try { if (window.markdownitEmoji) md.use(window.markdownitEmoji); } catch(e){}
  try { if (window.markdownitDeflist) md.use(window.markdownitDeflist); } catch(e){}
  try { if (window.markdownitFootnote) md.use(window.markdownitFootnote); } catch(e){}
  try { if (window.markdownitMark) md.use(window.markdownitMark); } catch(e){}
  try { if (window.markdownitSub) md.use(window.markdownitSub); } catch(e){}
  try { if (window.markdownitSup) md.use(window.markdownitSup); } catch(e){}
  try { if (window.markdownitTaskLists) md.use(window.markdownitTaskLists, { enabled: true }); } catch(e){}
  try { if (window.markdownitAttrs) md.use(window.markdownitAttrs); } catch(e){}
  try { if (window.markdownitLinkifyImages) md.use(window.markdownitLinkifyImages); } catch(e){}

  // Theme toggle (optional)
  function setTheme(t) {
    if (t === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('mdv_theme', t);
  }
  setTheme(localStorage.getItem('mdv_theme') || 'light');
  toggleThemeBtn && toggleThemeBtn.addEventListener('click', () => {
    const cur = document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light';
    setTheme(cur === 'dark' ? 'light' : 'dark');
  });

  // Minor helper: convert display blocks written as:
  // [<newline> ... <newline>]
  // into \[ ... \] which is safer for MathJax (and avoids some Markdown list ambiguity).
  function normalizeAmbiguousDisplayBlocks(mdText) {
    // Replace occurrences where a line starts with '[' and ends with ']' on its own lines.
    return mdText.replace(/(^|\n)[ \t]*\[[ \t]*\n([\s\S]*?)\n[ \t]*\][ \t]*(?=\n|$)/g, function(m, lead, inner){
      return lead + '\\[\\n' + inner + '\\n\\]\\n';
    });
  }

  // Build TOC simple
  function buildTOC() {
    if (!toc || !viewer) return;
    toc.innerHTML = '';
    const headings = viewer.querySelectorAll('h1,h2,h3,h4,h5,h6');
    if (!headings.length) { toc.innerHTML = '<p style="color:var(--muted)">No headings</p>'; return; }
    headings.forEach(h=>{
      if (!h.id) h.id = (h.textContent || h.innerText).trim().toLowerCase().replace(/[^\w\- ]+/g,'').replace(/\s+/g,'-');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      a.style.paddingLeft = `${(parseInt(h.tagName.substring(1))-1)*8}px`;
      a.addEventListener('click', ev => { ev.preventDefault(); document.getElementById(h.id).scrollIntoView({behavior:'smooth'}); });
      toc.appendChild(a);
    });
  }

  // Render pipeline (simple: markdown -> inject -> MathJax)
  async function renderMarkdown(rawMdText, sourceLabel='') {
    try {
      if (!rawMdText) rawMdText = '';

      // 1) normalize ambiguous display blocks that use [ ... ] (optional but helpful)
      const normalized = normalizeAmbiguousDisplayBlocks(rawMdText);

      // 2) render markdown to HTML
      const html = md.render(normalized);

      // 3) inject HTML
      if (viewer) viewer.innerHTML = html;

      // 4) syntax highlight (hljs)
      document.querySelectorAll('pre code').forEach(el => {
        try { hljs.highlightElement(el); } catch(e) {}
      });

      // 5) mermaid: convert code blocks to mermaid containers
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
      } catch(e) { console.warn('mermaid render error', e); }

      // 6) Build TOC
      buildTOC();

      // 7) Now ask MathJax to typeset the viewer
      if (window.MathJax && window.MathJax.typesetPromise) {
        try {
          await MathJax.typesetPromise([viewer]);
        } catch (e) {
          // MathJax reported errors — log them and show offending TeX snippets for debugging.
          console.warn('MathJax typesetPromise error', e);
          // attempt to locate problematic math nodes and print their text content
          const bad = [];
          (viewer.querySelectorAll('script[type^="math/tex"], .math, .tex')).forEach(n=>{
            bad.push({node: n.tagName, text: (n.textContent || '').slice(0,300)});
          });
          console.warn('MathJax: unable to typeset some math. Example snippets:', bad.slice(0,10));
        }
      } else {
        console.warn('MathJax not loaded or typesetPromise unavailable.');
      }

      // focus and optional title update
      viewer && viewer.focus();
      if (sourceLabel) document.title = `${sourceLabel} — Markdown Viewer`;
    } catch (err) {
      console.error('renderMarkdown error', err);
      if (viewer) viewer.innerHTML = `<pre style="color:crimson">Render error: ${err && err.message ? err.message : err}</pre>`;
    }
  }

  // Load from URL
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

  // auto load ?src=...
  const params = new URLSearchParams(location.search);
  if (params.get('src')) {
    const src = params.get('src');
    if (urlInput) urlInput.value = src;
    loadFromUrl(src);
  }

  // file input & drag/drop
  fileInput && fileInput.addEventListener('change', async (ev) => {
    const f = ev.target.files && ev.target.files[0]; if (!f) return;
    try { const txt = await f.text(); await renderMarkdown(txt, f.name); } catch(e){ console.error(e); }
  });
  ['dragenter','dragover'].forEach(evt => window.addEventListener(evt, e=>{ e.preventDefault(); e.stopPropagation(); }));
  window.addEventListener('drop', async e => {
    e.preventDefault(); e.stopPropagation();
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) { try { const txt = await f.text(); await renderMarkdown(txt, f.name); } catch(e){ console.error(e); } }
  });

  // print / pdf
  downloadPdfBtn && downloadPdfBtn.addEventListener('click', () => window.print());

  // scroll helpers (optional)
  // ... you can add scrollTo top/bottom bindings if you have buttons

  // optional demo:
  // const sample = 'https://raw.githubusercontent.com/simov/markdown-viewer/main/README.md';
  // loadFromUrl(sample);

  // export render for console/testing
  window.MDV_renderMarkdown = renderMarkdown;
})();
