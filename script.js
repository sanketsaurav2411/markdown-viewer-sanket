// script.js — robust final version using private-use sentinel tokens
// - Shields code regions, extracts math safely, reinserts as DOM placeholders using textContent,
//   uses TreeWalker+fallback replacement, then MathJax.typesetPromise([viewer])

(() => {
  // DOM refs (adjust IDs if your HTML differs)
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

  // safer sentinel tokens (private-use area characters)
  const SENTINEL = {
    CODE_OPEN: "\uF111",
    CODE_CLOSE: "\uF112",
    MATH_OPEN: "\uF121",
    MATH_CLOSE: "\uF122"
  };

  // markdown-it setup
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

  // theme handling (optional)
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

  // ---------------- Utility: shield code regions ----------------
  function shieldCodeRegions(text) {
    const codeBlocks = [];
    if (!text) return { text: '', codeBlocks };
    text = text.replace(/\r\n/g,'\n');

    // 1) fenced blocks ```...```
    text = text.replace(/(^|\n)(```[\s\S]*?```)(?=\n|$)/g, function(_, lead, block){
      const token = `${SENTINEL.CODE_OPEN}CODE_BLOCK_${codeBlocks.length}${SENTINEL.CODE_CLOSE}`;
      codeBlocks.push(block);
      return lead + token;
    });

    // 2) indented blocks (simple capture)
    text = text.replace(/(^|\n)((?:[ \t]{4}.*\n?)+)/g, function(_, lead, block){
      const token = `${SENTINEL.CODE_OPEN}CODE_BLOCK_${codeBlocks.length}${SENTINEL.CODE_CLOSE}`;
      codeBlocks.push(block);
      return lead + token;
    });

    // 3) inline code ticks `...` (handles varying tick lengths via regex)
    text = text.replace(/(`+)([\s\S]*?)\1/g, function(_, ticks, inner){
      const token = `${SENTINEL.CODE_OPEN}CODE_BLOCK_${codeBlocks.length}${SENTINEL.CODE_CLOSE}`;
      codeBlocks.push(ticks + inner + ticks);
      return token;
    });

    // 4) HTML pre/code
    text = text.replace(/(<pre[\s\S]*?<\/pre>)/gi, function(_, block){
      const token = `${SENTINEL.CODE_OPEN}CODE_BLOCK_${codeBlocks.length}${SENTINEL.CODE_CLOSE}`;
      codeBlocks.push(block);
      return token;
    });
    text = text.replace(/(<code[\s\S]*?<\/code>)/gi, function(_, block){
      const token = `${SENTINEL.CODE_OPEN}CODE_BLOCK_${codeBlocks.length}${SENTINEL.CODE_CLOSE}`;
      codeBlocks.push(block);
      return token;
    });

    return { text, codeBlocks };
  }

  // ---------------- Math extraction ----------------
  function extractMathBlocks(text) {
    const math = [];
    if (!text) return { text: '', math };
    text = text.replace(/\r\n/g,'\n');

    function store(inner, isDisplay) {
      const token = `${SENTINEL.MATH_OPEN}MATH_${math.length}${SENTINEL.MATH_CLOSE}`;
      math.push({ inner, isDisplay: !!isDisplay });
      return token;
    }

    // protect \begin{...}...\end{...}
    text = text.replace(/\\begin\{([a-zA-Z*0-9_\-]+)\}([\s\S]*?)\\end\{\1\}/g, function(_, env, inner){
      return store(`\\begin{${env}}${inner}\\end{${env}}`, true);
    });

    // $$ ... $$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, function(_, inner){ return store(inner, true); });

    // \[ ... \] display
    text = text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, function(_, inner){ return store(inner, true); });

    // [ ... ] display when on its own lines (common in some notes)
    text = text.replace(/(^|\n)[ \t]*\[[ \t]*\n([\s\S]*?)\n[ \t]*\][ \t]*(?=\n|$)/g, function(_, lead, inner){
      return lead + store(inner, true);
    });

    // \( ... \) inline
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, function(_, inner){ return store(inner, false); });

    // [\something] inline (bracket with backslash)
    text = text.replace(/\[\s*(\\[^\]\n]+?)\s*\]/g, function(_, inner){ return store(inner, false); });

    // (\something) inline (parenthesis with leading backslash)
    text = text.replace(/\(\s*(\\[^)\n]+?)\s*\)/g, function(_, inner){ return store(inner, false); });

    return { text, math };
  }

  // ---------------- DOM-aware token replacement (TreeWalker) ----------------
  function replaceTokensInDOM(math, codeBlocks) {
    // We will look for SENTINEL.MATH_OPEN and SENTINEL.CODE_OPEN inside textNodes and split them.
    const walker = document.createTreeWalker(viewer, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) {
      const v = node.nodeValue || '';
      if (v.indexOf(SENTINEL.MATH_OPEN) !== -1 || v.indexOf(SENTINEL.CODE_OPEN) !== -1) nodes.push(node);
    }

    nodes.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent) return;
      const s = textNode.nodeValue || '';
      let cursor = 0;
      const frag = document.createDocumentFragment();
      // scan string for sentinel tokens
      while (cursor < s.length) {
        const iMath = s.indexOf(SENTINEL.MATH_OPEN, cursor);
        const iCode = s.indexOf(SENTINEL.CODE_OPEN, cursor);
        let nextIdx = -1;
        let kind = null;
        if (iMath === -1 && iCode === -1) nextIdx = -1;
        else if (iMath === -1) { nextIdx = iCode; kind='CODE'; }
        else if (iCode === -1) { nextIdx = iMath; kind='MATH'; }
        else { nextIdx = Math.min(iMath, iCode); kind = nextIdx===iMath?'MATH':'CODE'; }

        if (nextIdx === -1) {
          frag.appendChild(document.createTextNode(s.slice(cursor)));
          break;
        }

        // append text before token
        if (nextIdx > cursor) frag.appendChild(document.createTextNode(s.slice(cursor, nextIdx)));

        if (kind === 'MATH') {
          const closeIdx = s.indexOf(SENTINEL.MATH_CLOSE, nextIdx + 1);
          if (closeIdx === -1) {
            // malformed: no close sentinel — append remainder and break
            frag.appendChild(document.createTextNode(s.slice(nextIdx)));
            break;
          }
          const tokenInner = s.slice(nextIdx + SENTINEL.MATH_OPEN.length, closeIdx);
          // tokenInner should be like 'MATH_N'
          const m = tokenInner.match(/^MATH_(\d+)$/);
          const idx = m ? Number(m[1]) : NaN;
          const el = document.createElement(math[idx] && math[idx].isDisplay ? 'div' : 'span');
          el.className = (math[idx] && math[idx].isDisplay) ? 'md-math-block' : 'md-math-inline';
          el.setAttribute('data-math-index', String(idx));
          frag.appendChild(el);
          cursor = closeIdx + SENTINEL.MATH_CLOSE.length;
        } else {
          // CODE placeholder
          const closeIdx = s.indexOf(SENTINEL.CODE_CLOSE, nextIdx + 1);
          if (closeIdx === -1) {
            frag.appendChild(document.createTextNode(s.slice(nextIdx)));
            break;
          }
          const tokenInner = s.slice(nextIdx + SENTINEL.CODE_OPEN.length, closeIdx);
          const m = tokenInner.match(/^CODE_BLOCK_(\d+)$/);
          const idx = m ? Number(m[1]) : NaN;
          const el = document.createElement('div');
          el.className = 'md-code-block-placeholder';
          el.setAttribute('data-code-index', String(idx));
          frag.appendChild(el);
          cursor = closeIdx + SENTINEL.CODE_CLOSE.length;
        }
      } // end scan
      parent.replaceChild(frag, textNode);
    });
  }

  // populate placeholders safely using textContent (preserves backslashes)
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
      // restore as <pre><code>
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = raw;
      pre.appendChild(code);
      div.parentNode && div.parentNode.replaceChild(pre, div);
    });
  }

  // ---------- Fallback innerHTML replacement for any remaining sentinel tokens ----------
  function fallbackReplaceRemainingMathTokens(math, codeBlocks) {
    try {
      if (viewer.innerHTML.indexOf(SENTINEL.MATH_OPEN) === -1) return;
      // protect pre/code innerHTML
      const protectedList = [];
      viewer.querySelectorAll('pre, code').forEach((el, i) => {
        const token = `${SENTINEL.CODE_OPEN}PROT_${i}${SENTINEL.CODE_CLOSE}`;
        protectedList.push({ token, html: el.innerHTML });
        el.innerHTML = token;
      });

      // Replace all remaining math tokens in the HTML
      for (let i = 0; i < math.length; i++) {
        const token = `${SENTINEL.MATH_OPEN}MATH_${i}${SENTINEL.MATH_CLOSE}`;
        if (viewer.innerHTML.indexOf(token) !== -1) {
          const placeholderHtml = math[i].isDisplay
            ? `<div class="md-math-block" data-math-index="${i}"></div>`
            : `<span class="md-math-inline" data-math-index="${i}"></span>`;
          viewer.innerHTML = viewer.innerHTML.split(token).join(placeholderHtml);
        }
      }

      // restore protected code blocks
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
      // 1) shield code regions
      const { text: shieldedText, codeBlocks } = shieldCodeRegions(rawMd || '');

      // 2) extract math blocks (math tokens inserted in shielded text)
      const { text: placeholdered, math } = extractMathBlocks(shieldedText);

      // 3) render markdown-it on placeholdered text
      const rendered = md.render(placeholdered);

      // 4) insert HTML
      if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
      viewer.innerHTML = rendered;

      // 5) attempt DOM TreeWalker replacement for sentinel tokens
      replaceTokensInDOM(math, codeBlocks);

      // 6) fallback: if any sentinel math tokens remain, do protected innerHTML replacement
      fallbackReplaceRemainingMathTokens(math, codeBlocks);

      // 7) populate placeholders using textContent (preserve LaTeX exactly)
      populatePlaceholders(math, codeBlocks);

      // 8) build TOC
      buildTOC();

      // 9) syntax highlighting
      document.querySelectorAll('pre code').forEach(el => {
        try { hljs.highlightElement(el); } catch(e) {}
      });

      // 10) mermaid (replace code blocks with mermaid divs and render)
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
      } catch (e) { console.warn('mermaid error', e); }

      // 11) MathJax typeset (target the viewer for speed and to avoid re-rendering the whole page)
      if (window.MathJax && window.MathJax.typesetPromise) {
        try {
          // some MathJax configs have startup document helpers; call if available (defensive)
          if (window.MathJax.startup && window.MathJax.startup.document && typeof MathJax.startup.document.updateDocument === 'function') {
            MathJax.startup.document.updateDocument();
          }
          await MathJax.typesetPromise([viewer]);
        } catch (e) {
          console.warn('MathJax.typesetPromise error', e);
        }
      } else {
        console.warn('MathJax not available or typesetPromise missing.');
      }

      // focus & title
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

  // ---------- Loading helpers ----------
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

  // ---------- file input & drag/drop ----------
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

  // optional demo load
  // const sample = 'https://raw.githubusercontent.com/simov/markdown-viewer/main/README.md';
  // urlInput.value = sample; loadFromUrl(sample);

})(); 
