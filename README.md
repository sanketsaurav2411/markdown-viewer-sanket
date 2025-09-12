# Markdown Viewer — Sanket

Static in-browser Markdown viewer (mobile-friendly) that supports:

- MathJax (LaTeX math)
- Mermaid diagrams
- Syntax highlighting (highlight.js)
- markdown-it with many plugins (abbr, attrs, deflist, footnotes, emoji, task lists, sub/sup, mark)
- Load a local file or remote raw MD via `?src=URL`

## Usage

1. Open `index.html` in your browser (or publish to GitHub Pages).
2. Use "Open file" to load local `.md` files, or supply a raw URL in the input and press "Load URL".
3. On mobile/tablet, use the file picker or pass `?src=` link.

## Deploy to GitHub Pages

1. Create a repo (e.g., `markdown-viewer-sanket`).
2. Push these files to `main` branch.
3. In GitHub repo Settings → Pages → Source: `main` branch → root (`/`), save.
4. Your site will be available at `https://<username>.github.io/<repo>/`.

## Notes & customization

- To change CSS, edit `styles.css`.
- To force a sample README on first load, edit `script.js` sample url section.
- If you need client-side PDF rendering (with proper page breaks), integrate a server-side printer or use headless Chromium on your server.

Enjoy!
