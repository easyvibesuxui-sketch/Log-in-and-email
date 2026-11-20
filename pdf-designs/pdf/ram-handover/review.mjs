// Builds the review page: the handover reports laid out as A4 pages with paged.js, one HTML file
// with fonts and photos inlined, published as a claude.ai artifact so the design can be reviewed by
// comment.
//   node pdf/ram-handover/review.mjs [out.html] [paged.js URL]
// The print template itself does not change: this only adapts the running header and footer to
// paged.js, which does not repeat table headers.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHandover } from './render.mjs';
import { variants } from './samples/variants.mjs';

const R = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] ?? 'handover-review.html';
const PAGED_SRC = process.argv[3] ?? 'https://cdn.jsdelivr.net/npm/pagedjs@0.4.3/dist/paged.min.js';

const mime = { woff2: 'font/woff2', svg: 'image/svg+xml', jpg: 'image/jpeg', png: 'image/png' };
const cache = new Map();
const dataUri = (path) => {
  if (!cache.has(path)) {
    const ext = path.split('.').pop();
    cache.set(path, `data:${mime[ext]};base64,${readFileSync(path).toString('base64')}`);
  }
  return cache.get(path);
};

// The print stylesheet, adapted for paged.js on screen
let css = readFileSync(`${R}/handover.css`, 'utf8');
css = css.replace(/@media screen \{[\s\S]*?\n\}\n/, ''); // the browser "paper" view; paged.js draws the pages
css = css.replace(/\nbody \{/, '\n.ho-doc {'); // report base type applies to the pages only
css = css.replace(/url\('fonts\/([^']+)'\)/g, (_, f) => `url('${dataUri(`${R}/fonts/${f}`)}')`);
css += `
/* Review build: the running header is a paged.js running element (print uses a repeating table header) */
.ho-header { position: running(hoHeader); }
@page body {
  margin: 56pt 0 35.7pt 0;
  @top-left { content: element(hoHeader); vertical-align: top; width: 100%; }
  @bottom-left {
    content: "syniotec Software 2025 / We synchronize you with the future!\\A syniotec.com";
    white-space: pre; vertical-align: top; text-align: left;
    padding: 10pt 0 0 28.35pt;
    font-family: 'Montserrat', Arial, sans-serif; font-size: 6pt; line-height: 9.7pt; color: #a7b0b3;
  }
  @bottom-right {
    content: counter(page); vertical-align: top; text-align: right;
    padding: 2.6pt 0 0 0;
    font-family: 'Montserrat', Arial, sans-serif; font-size: 7pt; color: #a7b0b3;
  }
}
.pagedjs_margin-bottom-left > .pagedjs_margin-content { white-space: pre; align-self: start; }
.pagedjs_margin-bottom-right > .pagedjs_margin-content { align-self: start; }
.pagedjs_margin-bottom-right { border-top: 0.25pt solid #f1f1f1; margin: 13.3pt 28.35pt 0 auto; width: 112pt; box-sizing: border-box; }
/* paged.js ignores break-after: avoid. A heading carries the room its content needs to start as
   unbreakable bottom padding and gives it back with a negative margin, so it moves to the next page
   with its content instead of staying alone at the bottom. */
.ho-section > .ho-section-title { break-inside: avoid; padding-bottom: 200pt; margin-bottom: calc(9.6pt - 200pt); }
.ho-subtitle { break-inside: avoid; padding-bottom: 120pt; margin-bottom: calc(6.6pt - 120pt); }
.ho-closing .ho-section > .ho-section-title { padding-bottom: 0; margin-bottom: 12.1pt; }
`;

const docs = [
  { id: 'compare', label: 'Hand in · compare on · EN', data: variants['hand-in-compare']('en') },
  { id: 'bulk', label: 'Bulk · hand out · DE', data: variants.bulk('de') },
  { id: 'without-booking', label: 'Without booking · EN', data: variants['without-booking']('en') },
  { id: 'field-types', label: 'All field types · EN', data: variants['field-types']('en') },
];

const bodies = docs.map((d) => {
  // The review page names each field's template type after its label
  let html = renderHandover(d.data, { assetBase: '../', showFieldTypes: true });
  html = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>'));
  // Unwrap the print-only table frame
  html = html
    .replace(/<table class="ho-body__frame" role="presentation">\s*<thead><tr><td>/, '')
    .replace(/<\/td><\/tr><\/thead>\s*<tbody><tr><td>/, '')
    .replace(/<\/td><\/tr><\/tbody>\s*<\/table>(\s*<\/section>)/, '$1');
  html = html.replace(/src="\.\.\/(assets\/[^"]+)"/g, (_, p) => `src="${dataUri(`${R}/${p}`)}"`);
  return `<div class="ho-doc" data-doc="${d.id}" data-label="${d.label}">${html}</div>`;
});

const page = `<title>Handover Report Review</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
  /* Review page around the A4 sheets: one fixed paper look, no dark theme (the report is print). */
  :root {
    --rv-ground: #d9dcdd;
    --rv-ink: #151515;
    --rv-muted: #5f6668;
    --rv-brand: #ff1900;
    --rv-chip: #ffffff;
    --rv-line: #c4c9cb;
    color-scheme: light;
  }
  body { background: var(--rv-ground); color: var(--rv-ink); font: 14px/1.45 Montserrat, 'Helvetica Neue', Arial, sans-serif; }
  .rv-bar {
    padding-block: 20px 8px;
    padding-left: max(16px, env(safe-area-inset-left, 0px));
    padding-right: max(16px, env(safe-area-inset-right, 0px));
    max-width: 860px; margin: 0 auto;
  }
  .rv-bar h1 { margin: 0; font-size: 20px; line-height: 1.25; font-weight: 600; text-wrap: balance; }
  .rv-bar p { margin: 6px 0 0; color: var(--rv-muted); max-width: 65ch; }
  .rv-docs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .rv-docs button {
    font: inherit; font-size: 13px; color: var(--rv-ink); background: var(--rv-chip);
    border: 1px solid var(--rv-line); border-radius: 8px; padding: 6px 12px; cursor: pointer;
  }
  .rv-docs button:hover { border-color: var(--rv-ink); }
  .rv-docs button:focus-visible { outline: 2px solid var(--rv-brand); outline-offset: 2px; }
  .rv-docs span { color: var(--rv-muted); margin-left: 4px; font-variant-numeric: tabular-nums; }
  .rv-status { margin-top: 12px; color: var(--rv-muted); font-size: 13px; }
  #rv-pages { display: flex; justify-content: center; padding: 8px 0 40px; overflow: hidden; }
  #rv-pages .pagedjs_pages { transform-origin: top center; }
  #rv-pages .pagedjs_page { background: #ffffff; box-shadow: 0 2px 14px rgb(21 21 21 / 0.16); margin: 0 auto 20px; }
  .rv-pageno { font: 12px Montserrat, Arial, sans-serif; color: var(--rv-muted); text-align: center; margin: -12px 0 14px; }
  #rv-source { display: none; }
  @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }
</style>

<header class="rv-bar">
  <h1>RAM Handover Report</h1>
  <p>The handover PDF template as A4 pages, with ABC Favorit and Syn colours. Comment on any element to change the design.</p>
  <nav class="rv-docs" id="rv-docs" aria-label="Reports"></nav>
  <div class="rv-status" id="rv-status" role="status">Laying out pages…</div>
</header>
<main id="rv-pages"></main>
<template id="rv-source">${bodies.join('\n')}</template>
<script type="text/plain" id="rv-css">${css.replace(/<\/script/gi, '<\\/script')}</script>
<script src="${PAGED_SRC}"></script>
<script>
(async () => {
  const status = document.getElementById('rv-status');
  const target = document.getElementById('rv-pages');
  const P = window.Paged || window.PagedModule;
  if (!P) { status.textContent = 'The page layout library did not load. Reload the page to try again.'; return; }
  const css = document.getElementById('rv-css').textContent;
  const content = document.getElementById('rv-source').content.cloneNode(true);
  try {
    const previewer = new P.Previewer();
    await previewer.preview(content, [{ [location.href]: css }], target);
  } catch (e) {
    status.textContent = 'Could not lay out the pages: ' + (e && e.message ? e.message : e);
    return;
  }
  const pages = [...target.querySelectorAll('.pagedjs_page')];
  // Find where each report starts (its cover) and number the sheets
  const nav = document.getElementById('rv-docs');
  let docIndex = -1;
  const starts = [];
  pages.forEach((pg, i) => {
    const note = document.createElement('div');
    note.className = 'rv-pageno';
    note.textContent = 'Page ' + (i + 1);
    pg.after(note);
    if (pg.querySelector('.ho-cover')) starts.push(i);
  });
  const labels = [...document.getElementById('rv-source').content.querySelectorAll('.ho-doc')].map((d) => d.dataset.label);
  starts.forEach((s, k) => {
    const end = (starts[k + 1] ?? pages.length) - 1;
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '';
    b.append(labels[k] ?? 'Report ' + (k + 1));
    const span = document.createElement('span');
    span.textContent = 'p. ' + (s + 1) + '–' + (end + 1);
    b.append(span);
    b.addEventListener('click', () => pages[s].scrollIntoView({ behavior: 'smooth', block: 'start' }));
    nav.append(b);
  });
  status.textContent = pages.length + ' pages in ' + starts.length + ' reports.';
  // Fit the A4 sheets to narrow screens
  const fit = () => {
    const box = target.querySelector('.pagedjs_pages');
    if (!box) return;
    const w = pages[0].getBoundingClientRect().width / (parseFloat(box.style.zoom) || 1);
    const z = Math.min(1, (window.innerWidth - 32) / w);
    box.style.zoom = z < 1 ? String(z) : '';
  };
  fit();
  window.addEventListener('resize', fit);
})();
</script>
`;
writeFileSync(OUT, page);
console.log(OUT, (page.length / 1024).toFixed(0) + ' KB');
