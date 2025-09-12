// script.js — final with TreeWalker + fallback innerHTML replacement for leftover @@MATH tokens
// Shields code regions, extracts math, reinserts safely as DOM placeholders (textContent), then typesets MathJax.
// Also supports mermaid, highlight.js, TOC, file drag/drop, theme toggle, print.

(() => {
  // DOM refs
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

  // markdown-it
  const md = window.markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  });

  // optional plugins (graceful)
  try { if (window.markdownitEmoji) md.use(window.markdownitEmoji); } catch(e){}
  try { if (window.markdownitDeflist) md.use(window.markdownitDeflist); } catch(e){}
  try { if (window.markdownitFootnote) md.use(window.markdownitFootnote); } catch(e){}
  try { if (window.markdownitMark) md.use(window.markdownitMark); } catch(e){}
  try { if (window.markdownitSub) md.use(window.markdownitSub); } catch(e){}
  try { if (window.markdownitSup) md.use(window.markdownitSup); } catch(e){}
  try { if (window.markdownitTaskLists) md.use(window.markdownitTaskLists, { enabled: true }); } catch(e){}
  try { if (window.markdownitAttrs) md.use(window.markdownitAttrs); } catch(e){}
  try { if (window.markdownitLinkifyImages) md.use(window.markdownitLinkifyImages); } catch(e){}

  // theme handling
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

  // ---------- Shield code regions ----------
  function shieldCodeRegions(text) {
    const codeBlocks = [];
    if (!text) return { text: '', codeBlocks };

    text = text.replace(/\r\n/g,'\n');

    // fenced code blocks
    text = text.replace(/(^|\n)(```[\s\S]*?```)(?=\n|$)/g, function(_, lead, block) {
      const token = `@@CODE_BLOCK_${codeBlocks.length}@@`;
      codeBlocks.push(block);
      return lead + token;
    });

    // indented code blocks (simple capture)
    text = text.replace(/(^|\n)((?:[ \t]{4}.*\n?)+)/g, function(_, lead, block) {
      const token = `@@CODE_BLOCK_${codeBlocks.length}@@`;
      codeBlocks.push(block);
      return lead + token;
    });

    // inline code with backticks (handles varying lengths)
    text = text.replace(/(`+)([\s\S]*?)\1/g, function(_, ticks, inner) {
      const token = `@@CODE_BLOCK_${codeBlocks.length}@@`;
      codeBlocks.push(ticks + inner + ticks);
      return token;
    });

    // HTML <pre> and <code>
    text = text.replace(/(<pre[\s\S]*?<\/pre>)/gi, function(_, block) {
      const token = `@@CODE_BLOCK_${codeBlocks.length}@@`;
      codeBlocks.push(block);
      return token;
    });
    text = text.replace(/(<code[\s\S]*?<\/code>)/gi, function(_, block) {
      const token = `@@CODE_BLOCK_${codeBlocks.length}@@`;
      codeBlocks.push(block);
      return token;
    });

    return { text, codeBlocks };
  }

  // ---------- Math extraction ----------
  function extractMathBlocks(text) {
    const math = [];
    if (!text) return { text: '', math };
    text = text.replace(/\r\n/g,'\n');

    function store(inner, isDisplay){
      const token = `@@MATH_${math.length}@@`;
      math.push({ inner, isDisplay: !!isDisplay });
      return token;
    }

    // protect \begin...\end
    text = text.replace(/\\begin\{([a-zA-Z*0-9_\-]+)\}([\s\S]*?)\\end\{\1\}/g, function(_, env, inner) {
      return store(`\\begin{${env}}${inner}\\end{${env}}`, true);
    });

    // $$...$$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, function(_, inner) { return store(inner, true); });

    // \[ ... \]
    text = text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, function(_, inner) { return store(inner, true); });

    // [ ... ] display when on own lines
    text = text.replace(/(^|\n)[ \t]*\[[ \t]*\n([\s\S]*?)\n[ \t]*\][ \t]*(?=\n|$)/g, function(_, lead, inner) {
      return lead + store(inner, true);
    });

    // \( ... \) inline
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, function(_, inner) { return store(inner, false); });

    // inline bracketed starting with backslash [\...]
    text = text.replace(/\[\s*(\\[^\]\n]+?)\s*\]/g, function(_, inner) { return store(inner, false); });

    // parenthesis starting with backslash (\... )
    text = text.replace(/\(\s*(\\[^)\n]+?)\s*\)/g, function(_, inner) { return store(inner, false); });

    return { text, math };
  }

  // ---------- DOM-aware token replacement using TreeWalker ----------
  function replaceTokensInDOM(math, codeBlocks) {
    const tokenRe = /@@(MATH|CODE_BLOCK)_(\d+)@@/g;
    const walker = document.createTreeWalker(viewer, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (tokenRe.test(node.nodeValue)) nodes.push(node);
      tokenRe.lastIndex = 0;
    }

    nodes.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent) return;
      const frag = document.createDocumentFragment();
      const str = textNode.nodeValue;
      tokenRe.lastIndex = 0;
      let lastIndex = 0;
      let m;
      while ((m = tokenRe.exec(str)) !== null) {
        const idx = m.index;
        if (idx > lastIndex) frag.appendChild(document.createTextNode(str.slice(lastIndex, idx)));
        const type = m[1]; const id = Number(m[2]);
        if (type === 'MATH') {
          const isDisplay = math[id] && math[id].isDisplay;
          const el = isDisplay ? document.createElement('div') : document.createElement('span');
          el.className = isDisplay ? 'md-math-block' : 'md-math-inline';
          el.setAttribute('data-math-index', String(id));
          frag.appendChild(el);
        } else if (type === 'CODE_BLOCK') {
          const el = document.createElement('div');
          el.className = 'md-code-block-placeholder';
          el.setAttribute('data-code-index', String(id));
          frag.appendChild(el);
        }
        lastIndex = tokenRe.lastIndex;
      }
      if (lastIndex < str.length) frag.appendChild(document.createTextNode(str.slice(lastIndex)));
      parent.replaceChild(frag, textNode);
      tokenRe.lastIndex = 0;
    });
  }

  // populate placeholders using textContent to preserve exact characters
  function populatePlaceholders(math, codeBlocks) {
    viewer.querySelectorAll('span.md-math-inline').forEach(span => {
      const idx = Number(span.getAttribute('data-math-index'));
      if (!Number.isNaN(idx) && math[idx]) span.textContent = `$${math[idx].inner}$`;
    });
    viewer.querySelectorAll('div.md-math-block').forEach(div => {
      const idx = Number(div.getAttribute('data-math-index'));
      if (!Number.isNaN(idx) && math[idx]) div.textContent = `$$${math[idx].inner}$$`;
    });
    viewer.querySelectorAll('div.md-code-block-placeholder').forEach(div => {
      const idx = Number(div.getAttribute('data-code-index'));
      const raw = codeBlocks && codeBlocks[idx] ? codeBlocks[idx] : '';
      div.textContent = raw;
      // replace placeholder with <pre><code> to preserve style
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = raw;
      pre.appendChild(code);
      div.parentNode && div.parentNode.replaceChild(pre, div);
    });
  }

  // ---------- Fallback innerHTML replacement for leftover tokens ----------
  function fallbackReplaceRemainingMathTokens(math) {
    try {
      if (viewer.innerHTML.indexOf('@@MATH_') === -1) return;
      const protectedList = [];
      viewer.querySelectorAll('pre, code').forEach((el, i) => {
        const tagToken = `@@CODEPROT_${i}@@`;
        protectedList.push({ token: tagToken, html: el.innerHTML });
        el.innerHTML = tagToken;
      });

      for (let i = 0; i < math.length; i++) {
        const token = `@@MATH_${i}@@`;
        if (viewer.innerHTML.indexOf(token) !== -1) {
          const placeholderHtml = math[i].isDisplay
            ? `<div class="md-math-block" data-math-index="${i}"></div>`
            : `<span class="md-math-inline" data-math-index="${i}"></span>`;
          viewer.innerHTML = viewer.innerHTML.split(token).join(placeholderHtml);
        }
      }

      protectedList.forEach(p => {
        viewer.innerHTML = viewer.innerHTML.split(p.token).join(p.html);
      });
    } catch (e) {
      console.warn('fallbackReplaceRemainingMathTokens error', e);
    }
  }

  // ---------- Render pipeline ----------
  async function renderMarkdown(rawMd, sourceLabel='') {
    try {
      // 1) Shield code regions
      const { text: shieldedText, codeBlocks } = shieldCodeRegions(rawMd || '');

      // 2) Extract math blocks
      const { text: placeholdered, math } = extractMathBlocks(shieldedText);

      // 3) Render markdown-it
      const rendered = md.render(placeholdered);

      // 4) Inject rendered HTML
      if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
      viewer.innerHTML = rendered;

      // 5) Attempt TreeWalker replacement
      replaceTokensInDOM(math, codeBlocks);

      // 6) Fallback string-based replace if tokens remain
      fallbackReplaceRemainingMathTokens(math);

      // 7) Populate placeholders with exact textContent
      populatePlaceholders(math, codeBlocks);

      // 8) Build TOC
      buildTOC();

      // 9) Syntax highlight
      document.querySelectorAll('pre code').forEach(el => {
        try { hljs.highlightElement(el); } catch(e) {}
      });

      // 10) Mermaid rendering
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
      } catch(e) { console.warn('mermaid error', e); }

      // 11) MathJax typeset
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
      console.error('renderMarkdown error', err);
      viewer.innerHTML = `<pre style="color:crimson">Render error: ${err && err.message ? err.message : err}</pre>`;
    }
  }

  // ---------- Build TOC ----------
  function buildTOC() {
    if (!toc) return;
    toc.innerHTML = '';
    const headings = viewer.querySelectorAll('h1,h2,h3,h4,h5,h6');
    if (!headings.length) { toc.innerHTML = '<p style="color:var(--muted)">No headings</p>'; return; }
    headings.forEach(h => {
      if (!h.id) h.id = (h.textContent || h.innerText).trim().toLowerCase().replace(/[^\w\- ]+/g,'').replace(/\s+/g,'-');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      a.style.paddingLeft = `${(parseInt(h.tagName.substring(1))-1)*8}px`;
      a.addEventListener('click', ev => { ev.preventDefault(); document.getElementById(h.id).scrollIntoView({behavior:'smooth'}); });
      toc.appendChild(a);
    });
  }

  // ---------- Load from URL and events ----------
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

  const params = new URLSearchParams(location.search);
  if (params.get('src')) {
    const src = params.get('src');
    if (urlInput) urlInput.value = src;
    loadFromUrl(src);
  }

  // ---------- File input & drag/drop ----------
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

  // ---------- Print / PDF ----------
  downloadPdfBtn && downloadPdfBtn.addEventListener('click', () => window.print());

  // ---------- Scroll helpers ----------
  scrollTopBtn && scrollTopBtn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  scrollBottomBtn && scrollBottomBtn.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior:'smooth' }));

  // Optional: demo load
  // const sample = 'https://raw.githubusercontent.com/simov/markdown-viewer/main/README.md';
  // urlInput.value = sample; loadFromUrl(sample);

})();
