// Writes examples/<variant>.<lang>.html and .json from samples/variants.mjs.
//   node pdf/ram-handover/build.mjs   (or: npm run handover)
// With --pdf it also prints every example to PDF with Playwright (Chromium).

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderHandover } from './render.mjs';
import { variants } from './samples/variants.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'examples');
const langs = ['en', 'de'];
const wantPdf = process.argv.includes('--pdf');
const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7);

await mkdir(out, { recursive: true });

const written = [];
for (const [name, make] of Object.entries(variants)) {
  if (only && !only.split(',').includes(name)) continue;
  for (const lang of langs) {
    const data = make(lang);
    const html = renderHandover(data, { assetBase: '../' });
    const file = join(out, `${name}.${lang}`);
    await writeFile(`${file}.html`, html);
    await writeFile(`${file}.json`, `${JSON.stringify(data, null, 2)}\n`);
    written.push(file);
  }
}
console.log(`Wrote ${written.length} examples to ${out}`);

if (wantPdf) {
  // Playwright from the project, or a global install (require honours NODE_PATH, import does not)
  const { createRequire } = await import('node:module');
  const { chromium } = createRequire(import.meta.url)('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const file of written) {
    await page.goto(pathToFileURL(`${file}.html`).href, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: `${file}.pdf`, preferCSSPageSize: true, printBackground: true });
  }
  await browser.close();
  console.log(`Printed ${written.length} PDFs`);
}
