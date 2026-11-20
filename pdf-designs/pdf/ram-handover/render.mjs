// RAM Handover Report: data -> HTML.
//
//   import { renderHandover } from './render.mjs';
//   const html = renderHandover(data, { assetBase: './' });
//
// The report is the filled handover template: a cover (IDs, parties, booked items), the template's tabs
// with their fields, and a closing page (signatures, company). Every field type of the template has its
// own rendering, and when the handover was filled with "compare" on, every field is followed by its
// Last Answer (the value from the previous report). README.md describes the data; examples/*.json are
// complete examples. Print the HTML with a Chromium engine to get the PDF (build.mjs --pdf).

import { translator } from './i18n.mjs';

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const has = (v) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);

// CSS string literal for @page margin boxes. "<" is written as an escape so the text can never close
// the <style> element it is printed in.
const cssString = (s) =>
  `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/</g, '\\3c ').replace(/\n/g, '\\A ')}"`;

// Link targets come from the report's data: only web, mail and relative links are printed as links.
const safeUrl = (u) => {
  const s = String(u ?? '').trim();
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(s)?.[1].toLowerCase();
  return s && (!scheme || scheme === 'http' || scheme === 'https' || scheme === 'mailto') ? s : '#';
};

// ---------- Icons (Syn "Main icons") ------------------------------------------------------------------

const icon = {
  yes: (label) =>
    `<svg class="ho-status" viewBox="0 0 12 12" role="img" aria-label="${esc(label)}"><circle cx="6" cy="6" r="5.3" fill="none" stroke="#a7b0b3" stroke-width="0.7"/><path d="M3.5 6.2 5.3 8l3.3-3.8" fill="none" stroke="#71c562" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  no: (label) =>
    `<svg class="ho-status" viewBox="0 0 12 12" role="img" aria-label="${esc(label)}"><circle cx="6" cy="6" r="5.3" fill="none" stroke="#a7b0b3" stroke-width="0.7"/><path d="m4.1 4.1 3.8 3.8m0-3.8L4.1 7.9" fill="none" stroke="#ffb30f" stroke-width="0.9" stroke-linecap="round"/></svg>`,
  notRelevant: (label) =>
    `<svg class="ho-status" viewBox="0 0 12 12" role="img" aria-label="${esc(label)}"><circle cx="6" cy="6" r="5.3" fill="none" stroke="#a7b0b3" stroke-width="0.7"/><path d="M3.6 6h4.8" stroke="#a7b0b3" stroke-width="0.9" stroke-linecap="round"/></svg>`,
  next: `<svg class="ho-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="M6.97 17L6 16.00L12.02 10L6 3.99L6.97 3L14 10L6.97 17Z" fill="currentColor"/></svg>`,
  calendar: `<svg class="ho-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M0 1.68H20V20H0V1.68ZM18.9 2.8H1.1V18.9H18.9V2.8ZM19.6 6.5H.4V5.7H19.6V6.5ZM4.6 4.1H3.9V0H4.6V4.1ZM16.1 4.1H15.4V0H16.1V4.1Z" fill="currentColor"/></svg>`,
  time: `<svg class="ho-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 20C11.97 20 13.91 19.41 15.55 18.31 17.19 17.21 18.48 15.65 19.23 13.82 19.99 11.99 20.19 9.98 19.8 8.04 19.42 6.1 18.46 4.32 17.07 2.92 15.67 1.53 13.88.57 11.95.19 10.01-.19 7.99 0 6.17.76 4.34 1.51 2.78 2.8 1.68 4.44.58 6.08 0 8.02 0 10 0 12.65 1.05 15.19 2.93 17.06 4.8 18.94 7.34 19.99 10 20ZM10 1.25C11.73 1.25 13.42 1.76 14.86 2.72 16.29 3.68 17.42 5.05 18.08 6.65 18.74 8.25 18.91 10.01 18.58 11.7 18.24 13.4 17.41 14.96 16.18 16.18 14.96 17.41 13.4 18.24 11.7 18.58 10 18.92 8.24 18.74 6.65 18.08 5.05 17.42 3.68 16.3 2.72 14.86 1.76 13.42 1.24 11.73 1.24 10 1.25 7.68 2.17 5.45 3.81 3.81 5.45 2.17 7.68 1.25 10 1.25ZM13.41 14.29 14.29 13.41 10.62 9.74V2.99H9.37V10C9.37 10.08 9.39 10.16 9.42 10.23 9.45 10.31 9.5 10.38 9.55 10.44L13.41 14.29Z" fill="currentColor"/></svg>`,
  fuel: `<svg class="ho-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 2h9v16H3zM4.3 3.3v5h6.4v-5z" fill="currentColor" fill-rule="evenodd"/><path d="M12 6.5h1.6l2.4 2.4v7.3a1.3 1.3 0 0 1-2.6 0V12H12v-1.2h2.6v5.4h.2V9.4L13.1 7.7H12z" fill="currentColor"/></svg>`,
  star: `<svg class="ho-star" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1 6.9 6.92 0 7.87 5 12.48 3.81 19 10 15.92 16.18 19 15 12.48 20 7.87 13.09 6.92Z" fill="currentColor"/></svg>`,
  info: `<svg class="ho-icon" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.6" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M10 8.6v5.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="10" cy="5.9" r="1" fill="currentColor"/></svg>`,
  pdf: `<svg class="ho-file-icon" viewBox="0 0 18 22" aria-hidden="true"><path d="M1 1h11l5 5v15H1z" fill="none" stroke="#fe7d00" stroke-width="1.2" stroke-linejoin="round"/><path d="M12 1v5h5" fill="none" stroke="#fe7d00" stroke-width="1.2" stroke-linejoin="round"/><text x="3" y="17.5" font-size="5.2" font-family="Montserrat, Arial, sans-serif" font-weight="700" fill="#fe7d00">PDF</text></svg>`,
  video: `<svg class="ho-file-icon" viewBox="0 0 18 22" aria-hidden="true"><path d="M1 1h11l5 5v15H1z" fill="none" stroke="#fe7d00" stroke-width="1.2" stroke-linejoin="round"/><path d="M12 1v5h5" fill="none" stroke="#fe7d00" stroke-width="1.2" stroke-linejoin="round"/><path d="M6.5 10.5v6l5-3z" fill="#fe7d00"/></svg>`,
};

// Template field type names as the app calls them, shown after the label with { showFieldTypes: true }
// (design review only; real reports leave them out).
const TYPE_NAMES = {
  text: 'Input', number: 'Number', count: 'Count', date: 'Date', time: 'Time', dropdown: 'Dropdown',
  choice: 'Chooser', switch: 'Switcher', slider: 'Slider', range: 'Range', rating: 'Rating',
  description: 'Description', checks: 'Checks', yesno: 'Yes / No', image: 'Image', file: 'File',
  video: 'Video', gallery: 'Gallery', ai: 'AI', group: 'Group',
};

function typeTag(ctx, type) {
  return ctx.showTypes && TYPE_NAMES[type] ? ` <span class="ho-type">(${esc(TYPE_NAMES[type])})</span>` : '';
}

// Field types with a one-line value: their Last Answer sits on the title line.
const INLINE = new Set(['text', 'number', 'count', 'date', 'time', 'dropdown', 'choice', 'switch', 'slider', 'range', 'rating', 'yesno']);

// ---------- Values ------------------------------------------------------------------------------------

function yesnoHtml(t, v, { withCondition = false } = {}) {
  if (!v || !has(v.answer)) return '';
  const map = {
    yes: [icon.yes(t('yes')), `<span class="ho-yes">${esc(t('yes'))}</span>`],
    no: [icon.no(t('no')), `<span class="ho-answer-no">${esc(t('no'))}</span>`],
    not_relevant: [icon.notRelevant(t('notRelevant')), `<span class="ho-na">${esc(t('notRelevant'))}</span>`],
  };
  const [ic, text] = map[v.answer] ?? ['', esc(v.answer)];
  // Condition belongs to group questions only (their Last Answer), and only after a Yes
  const condition =
    withCondition && v.answer === 'yes' && typeof v.condition === 'boolean'
      ? `<span class="ho-sub"><span class="ho-k">${esc(t('condition'))}</span><span>${esc(t(v.condition ? 'okay' : 'notOkay'))}</span></span>`
      : '';
  return `<span class="ho-yesno">${ic}${text}${condition}</span>`;
}

function unitValue(v, unit) {
  if (!has(v)) return '';
  return `${esc(v)}${unit ? `${unit === '%' ? '' : ' '}${esc(unit)}` : ''}`;
}

// The value of a field (or of its Last Answer, which has the same shape) as inline HTML.
function inlineValue(t, type, v, { inGroup = false } = {}) {
  switch (type) {
    case 'yesno':
      return yesnoHtml(t, v, { withCondition: inGroup });
    case 'switch':
      return has(v.value) ? esc(v.value === true ? t('yes') : v.value === false ? t('no') : v.value) : '';
    case 'slider':
      return unitValue(v.value, v.unit ?? '%');
    case 'number':
    case 'count':
      return unitValue(v.value, v.unit);
    case 'range':
      if (!v.value) return '';
      return `<span class="ho-range"><span class="ho-k">${esc(t('from'))}</span>${unitValue(v.value.from, v.unit ?? '%')}<span class="ho-dot" aria-hidden="true"></span><span class="ho-k">${esc(t('to'))}</span>${unitValue(v.value.to, v.unit ?? '%')}</span>`;
    case 'rating':
      if (!v.value) return '';
      return `<span class="ho-rating"><span class="ho-rating__score">${esc(v.value.score)}/${esc(v.value.max ?? 5)}</span>${icon.star}</span>`;
    default:
      return has(v.value) ? esc(v.value) : '';
  }
}

// Block parts that follow the value: long text, lists, files, photos.
function blockValue(t, type, v, { compact = false } = {}) {
  const out = [];
  if (type === 'description' && has(v.value)) out.push(`<div class="ho-text">${esc(v.value)}</div>`);
  if (type === 'checks' && has(v.value))
    out.push(`<ul class="ho-checks">${v.value.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>`);
  if (type === 'switch' && has(v.helper)) out.push(`<div class="ho-helper">${esc(v.helper)}</div>`);
  if ((type === 'file' || type === 'video') && has(v.files)) out.push(files(t, type, v.files, { compact }));
  return out.join('');
}

function files(t, type, list, { compact }) {
  return `<div class="ho-links${compact ? ' ho-links--compact' : ''}">${list
    .map(
      (f) => `<a class="ho-link" href="${esc(safeUrl(f.url))}">
          <span class="ho-link__name">${f.kind === 'video' || type === 'video' ? icon.video : icon.pdf}<span class="ho-link-text">${esc(f.name)}${has(f.date) ? `<span class="ho-gap">${esc(f.date)}</span>` : ''}</span></span>${compact ? '' : icon.next}
        </a>`,
    )
    .join('')}</div>`;
}

// Big photos (ho-photo, as in the PDF's attachments) or Last Answer thumbnails (ho-thumb)
function photos(list, cls = 'ho-photo', wrapClass = cls === 'ho-photo' ? 'ho-field__photos' : 'ho-thumbs') {
  if (!has(list)) return '';
  return `<div class="${wrapClass}">${list
    .map((p) => `<img class="${cls}" src="${esc(p.src)}" alt="${esc(p.label ?? p.alt ?? '')}">`)
    .join('')}</div>`;
}

function info(t, text) {
  if (!has(text)) return '';
  return `<div class="ho-info"><span class="ho-info__key">${esc(t('additionalInformation'))} *</span>${esc(text)}</div>`;
}

// ---------- Last Answer -------------------------------------------------------------------------------

// The PDF's Last Answer card, for one field. `prev` has the same shape as the field's value
// (value, answer, condition, files, photos, comment); null means there was no previous answer.
function lastAnswer(t, type, prev, { row = false } = {}) {
  const title = `<span class="ho-last__title">${esc(t('lastAnswer'))}</span>`;
  if (!prev) {
    return `<div class="ho-last${row ? ' ho-last--row' : ''}"><div class="ho-last__head">${title}<span class="ho-na">${esc(t('noPreviousAnswer'))}</span></div></div>`;
  }
  // One file sits on the title line like a short value; several files are listed below it
  const oneFile = (type === 'file' || type === 'video') && prev.files?.length === 1;
  const inline = INLINE.has(type) ? inlineValue(t, type, prev, { inGroup: row }) : oneFile ? files(t, type, prev.files, { compact: true }) : '';
  const block = oneFile ? '' : blockValue(t, type, prev, { compact: true });
  // A Not relevant answer carries nothing else
  const bare = type === 'yesno' && prev.answer === 'not_relevant';
  const comment = bare ? '' : info(t, prev.comment);
  const thumbs = bare ? '' : photos(prev.photos, 'ho-thumb');
  return `<div class="ho-last${row ? ' ho-last--row' : ''}${thumbs ? ' ho-last--photos' : ''}">
      <div class="ho-last__main">
        <div class="ho-last__head">${title}${inline}</div>
        ${block}${comment}
      </div>
      ${thumbs}
    </div>`;
}

// ---------- Fields ------------------------------------------------------------------------------------

const labelIcon = { date: 'calendar', time: 'time' };

function fieldBand(t, f, ctx) {
  const ic = icon[f.icon ?? labelIcon[f.type]] ?? '';
  // A note shown next to the label (Attachment 2  Technical check in PDF)
  const note = has(f.note) ? ` <span class="ho-field__inline">${esc(f.note)}</span>` : '';
  const compactFile = (f.type === 'file' || f.type === 'video') && f.files?.length === 1 && !has(f.note);
  const inline = INLINE.has(f.type) ? inlineValue(t, f.type, f) : '';

  let body;
  if (compactFile) {
    // 360 views: label and link on the band, chevron at the end
    const file = f.files[0];
    const fileIcon = file.kind === 'video' || f.type === 'video' ? icon.video : icon.pdf;
    body = `<a class="ho-link-row" href="${esc(safeUrl(file.url))}"><span><span class="ho-label ho-block">${esc(f.label)}${typeTag(ctx, f.type)}</span><span class="ho-link__name">${fileIcon}<span class="ho-link-text">${esc(file.name)}</span></span></span>${icon.next}</a>`;
  } else {
    body = `<div class="ho-field__label ho-label${ic ? ' ho-field__label--icon' : ''}">${esc(f.label)}${typeTag(ctx, f.type)}${ic}${note}</div>
        ${inline ? `<div class="ho-field__value ho-value">${inline}</div>` : ''}
        ${blockValue(t, f.type, f)}`;
  }

  const big = f.type === 'image' || has(f.photos) ? photos(f.photos) : '';
  const comment = info(t, f.comment);
  const last = ctx.compare ? lastAnswer(t, f.type, f.lastAnswer ?? null) : '';

  return `<div class="ho-field ho-field--${esc(f.type)}${big ? ' ho-field--with-photos' : ''}">
        ${body}
        ${big}${comment}${last}
      </div>`;
}

// Gallery and AI: labelled photos in a grid (3 or 2 columns), each with its own Last Answer.
function gallery(t, f, ctx) {
  const items = f.items ?? [];
  if (!items.length) return '';
  return `<div class="ho-field ho-field--gallery ho-field--${esc(f.type)}">
      ${has(f.label) || ctx.showTypes ? `<div class="ho-field__label ho-label">${esc(f.label ?? '')}${typeTag(ctx, f.type)}</div>` : ''}
      <div class="ho-photos${f.type === 'ai' ? ' ho-photos--two' : ''}">${rowsOf(items, f.type === 'ai' ? 2 : 3)
        .map((row) => `<div class="ho-photos__row">${row
        .map(
          (p) => `<figure>
          <figcaption class="ho-label">${esc(p.label)}</figcaption>
          <img class="ho-photo" src="${esc(p.src)}" alt="${esc(p.label)}">
          ${
            ctx.compare
              ? lastAnswer(t, 'image', p.lastAnswer === undefined ? null : p.lastAnswer && { photos: [{ src: p.lastAnswer.src }] })
              : ''
          }
        </figure>`,
        )
        .join('')}</div>`)
        .join('')}</div>
    </div>`;
}

// Photos in rows, so a gallery can break between rows and starts right under its title.
function rowsOf(list, n) {
  const rows = [];
  for (let i = 0; i < list.length; i += n) rows.push(list.slice(i, i + n));
  return rows;
}

// Group: the checklist (question / Complete / Condition OK?), each question with its Last Answer.
function group(t, f, ctx) {
  const rows = (f.fields ?? [])
    .map((q) => {
      const isYesNo = q.type === 'yesno' || q.type === undefined;
      const type = q.type ?? 'yesno';
      // Complete: the answer with its icon (Yes, No, Not relevant); Condition sits in its own column
      const complete = isYesNo
        ? yesnoHtml(t, q, { withCondition: false })
        : inlineValue(t, type, q) || blockValue(t, type, q, { compact: true });
      // As in the app: Yes asks Condition is OKAY and takes information and photos, No takes information
      // and photos, Not relevant takes nothing
      const nr = q.answer === 'not_relevant';
      const condition =
        q.answer === 'yes' && typeof q.condition === 'boolean'
          ? q.condition
            ? `<span class="ho-ok">${esc(t('okay'))}</span>`
            : `<span class="ho-no">${esc(t('notOkay'))}</span>`
          : '';
      return `<div class="ho-q">
            <div class="ho-q__main">
              <div class="ho-q__text">${esc([q.no, q.label].filter(has).join(' '))}${typeTag(ctx, type)}</div>
              <div class="ho-q__complete">${complete}</div>
              <div class="ho-q__condition">${condition}</div>
            </div>
            ${nr ? '' : info(t, q.comment)}
            ${nr ? '' : photos(q.photos, 'ho-thumb', 'ho-thumbs ho-q__photos')}
            ${ctx.compare ? lastAnswer(t, type, q.lastAnswer ?? null, { row: true }) : ''}
          </div>`;
    })
    .join('');
  return `<div class="ho-group">
      ${has(f.label) ? `<h3 class="ho-subtitle">${esc(f.label)}${typeTag(ctx, 'group')}</h3>` : ''}
      <div class="ho-check">
        <div class="ho-check__head">
          <div class="ho-label">${esc(f.heading ?? '')}</div>
          <div class="ho-label">${esc(t('complete'))}</div>
          <div class="ho-label">${esc(t('conditionOk'))}</div>
        </div>
        <div class="ho-check__rows">${rows}</div>
      </div>
    </div>`;
}

// A tab's fields: runs of simple fields become a zebra-striped list, groups and galleries stand alone.
function tabBody(t, tab, ctx) {
  const out = [];
  let run = [];
  const flush = () => {
    if (run.length) out.push(`<div class="ho-fields">${run.join('')}</div>`);
    run = [];
  };
  for (const f of tab.fields ?? []) {
    if (f.type === 'group') {
      flush();
      out.push(group(t, f, ctx));
    } else if (f.type === 'gallery' || f.type === 'ai') {
      flush();
      out.push(gallery(t, f, ctx));
    } else {
      run.push(fieldBand(t, f, ctx));
    }
  }
  flush();
  return `<div class="ho-tab">${out.join('')}</div>`;
}

function tabSection(t, tab, ctx, prefix = '') {
  const spaced = (tab.fields ?? []).some((f) => f.type === 'group' || f.type === 'gallery' || f.type === 'ai');
  return `<section class="ho-section${spaced ? ' ho-section--spaced' : ''}">
      ${prefix}
      ${has(tab.title) ? `<h2 class="ho-section-title">${esc(tab.title)}</h2>` : ''}
      ${tabBody(t, tab, ctx)}
    </section>`;
}

const rule = '\n    <div class="ho-rule" role="separator"></div>\n    ';

// ---------- Cover -------------------------------------------------------------------------------------

function cover(t, d, a) {
  const parties = d.parties ?? [];

  const partyCols = parties
    .map((p) => {
      // The same lines on every cover: name, company, address (each when given)
      const lines = [p.name, p.company, p.address];
      return `<div>
          <div class="ho-parties__role">${esc(t(p.role))}</div>
          ${lines
            .filter(has)
            .map((l) => `<div class="ho-parties__line">${esc(l)}</div>`)
            .join('')}
        </div>`;
    })
    .join('');

  const overview = has(d.overview)
    ? `<div class="ho-overview__title">${esc(t('overview'))}</div>
      <table class="ho-table ho-overview">
        <colgroup><col class="ho-col-no"><col class="ho-col-product"><col class="ho-col-name"><col class="ho-col-dates"><col></colgroup>
        <thead><tr><th></th><th>${esc(t('product'))}</th><th>${esc(t('name'))}</th><th>${esc(t('bookingDates'))}</th><th>${esc(t('quantity'))}</th></tr></thead>
        <tbody>
          ${d.overview
            .map(
              (r, i) => `<tr class="ho-overview__item${i > 0 ? ' ho-overview__item--ruled' : ''}">
            <td>#${esc(r.no ?? i + 1)}</td><td>${esc(r.product)}</td><td>${esc(r.name)}</td><td>${esc(r.bookingDates)}</td><td>${esc(r.quantity)}</td>
          </tr>${
            has(r.details)
              ? `<tr class="ho-overview__details"><td colspan="5"><div class="ho-details">
              <span><span class="ho-k">${esc(t('id'))}</span>${esc(r.details.id)}</span>
              <span><span class="ho-k">${esc(t('category'))}</span>${esc(r.details.category)}</span>
              <span><span class="ho-k">${esc(t('subtitle'))}</span>${esc(r.details.subtitle)}</span>
              <span><span class="ho-k">${esc(t('serialNumber'))}</span>${esc(r.details.serialNumber)}</span>
            </div></td></tr>`
              : ''
          }`,
            )
            .join('')}
        </tbody>
      </table>
      <div class="ho-hairline ho-overview__end"></div>`
    : '';

  const handIn = d.type === 'hand_in';
  const inventory = has(d.inventory)
    ? `<div class="ho-inventory">${d.inventory
        .map(
          (inv) => `<div class="ho-inventory__block">
          <div class="ho-inventory__name">${esc(inv.name)}</div>
          <table class="ho-table">
            <colgroup>${
              handIn
                ? '<col class="ho-col-total"><col class="ho-col-returned"><col class="ho-col-remaining"><col>'
                : '<col class="ho-col-total"><col>'
            }</colgroup>
            <thead><tr><th>${esc(t('total'))}</th>${
              handIn
                ? `<th>${esc(t('returned'))}</th><th>${esc(t('remaining'))}</th><th>${esc(t('lostDamaged'))}</th>`
                : `<th>${esc(t('delivered'))}</th>`
            }</tr></thead>
            <tbody><tr><td>${esc(inv.total)}</td>${
              handIn
                ? `<td>${esc(inv.returned)}</td><td>${esc(inv.remaining)}</td><td>${esc(inv.lostDamaged)}</td>`
                : `<td>${esc(inv.delivered)}</td>`
            }</tr></tbody>
          </table>
          <div class="ho-hairline ho-hairline--single"></div>
        </div>`,
        )
        .join('')}</div>`
    : '';

  const equipment = has(d.equipment)
    ? `<div class="ho-equipment">
        <div class="ho-equipment__key">${esc(t('title'))}</div>
        <div class="ho-equipment__title">${esc(d.equipment.title)}</div>
        <div class="ho-equipment__grid">
          ${['id', 'category', 'subtitle', 'serialNumber']
            .map(
              (k) => `<div><div class="ho-equipment__key">${esc(t(k))}</div><div class="ho-equipment__val">${esc(d.equipment[k])}</div></div>`,
            )
            .join('')}
        </div>
      </div>`
    : '';

  const site = has(d.constructionSite)
    ? `<div class="ho-site"><div class="ho-site__label">${esc(t('constructionSite'))}</div><div class="ho-site__value">${esc(d.constructionSite)}</div></div>`
    : '';

  return `<section class="ho-cover">
    <div class="ho-cover__date">${esc(d.createdAt)}</div>
    <img class="ho-cover__logo" src="${a}assets/${esc(d.brand?.logo ?? 'syniotec-logo.svg')}" alt="${esc(d.brand?.name ?? 'syniotec')}">
    <h1 class="ho-cover__title">${esc(t('handoverReport'))}</h1>
    <div class="ho-cover__row ho-cover__id-label">${esc(t('handoverId'))}</div>
    <div class="ho-cover__id">${esc(d.handoverId)}</div>
    <div class="ho-cover__row ho-cover__row--contract"><span class="ho-cover__row-label">${esc(t('contractId'))}</span><span>${esc(d.contractId)}</span></div>
    ${
      has(d.type)
        ? `<div class="ho-cover__row ho-cover__row--type"><span class="ho-cover__row-label">${esc(t('type'))}</span><span class="ho-cover__type">${esc(t(d.type))}</span></div>`
        : ''
    }
    <div class="ho-cover__lower">
      ${parties.length ? `<div class="ho-parties">${partyCols}</div>` : ''}
      ${site}
      <div class="ho-hairline ho-cover__divider"></div>
      ${equipment}
      ${overview}
      ${inventory}
    </div>
  </section>`;
}

// ---------- Body --------------------------------------------------------------------------------------

function operatingHours(t, d) {
  if (!has(d.operatingHours)) return '';
  if (d.operatingHours.length === 1 && !d.operatingHours[0].equipment) {
    return `<div class="ho-fields"><div class="ho-field ho-field--filled">
        <div class="ho-field__label ho-label">${esc(t('operatingHours'))}</div>
        <div class="ho-field__value ho-value">${esc(d.operatingHours[0].hours)}</div>
      </div></div>`;
  }
  return `<div class="ho-hours">${d.operatingHours
    .map(
      (h, i) => `<div class="ho-hours__row">
        <div class="ho-hours__no">#${esc(h.no ?? i + 1)}</div>
        <div class="ho-hours__cell"><div class="ho-label">${esc(t('equipment'))}</div><div class="ho-value">${esc(h.equipment)}</div></div>
        <div class="ho-hours__cell"><div class="ho-label">${esc(t('operatingHours'))}</div><div class="ho-value ho-value--book">${esc(h.hours)}</div></div>
      </div>`,
    )
    .join('')}</div>`;
}

function banner(t, d) {
  if (!d.compare || d.comparable !== false) return '';
  return `<div class="ho-banner" role="note">
      ${icon.info}
      <div><div class="ho-banner__title">${esc(d.notComparableReason ?? t('notComparableTitle'))}</div><div class="ho-banner__text">${esc(t('notComparable'))}</div></div>
    </div>`;
}

function body(t, d, a, tabs, ctx) {
  const hours = operatingHours(t, d);
  const parts = tabs.map((tab, i) =>
    tabSection(t, tab, ctx, i === 0 ? `${banner(t, d)}${hours ? `<div class="ho-hours-block">${hours}</div>` : ''}` : ''),
  );
  if (!parts.length && (hours || banner(t, d))) parts.push(`<section class="ho-section">${banner(t, d)}${hours}</section>`);
  if (!parts.length) return '';

  return `<section class="ho-body">
    <table class="ho-body__frame" role="presentation">
      <thead><tr><td>
        <header class="ho-header">
          <img class="ho-header__logo" src="${a}assets/${esc(d.brand?.logo ?? 'syniotec-logo.svg')}" alt="${esc(d.brand?.name ?? 'syniotec')}">
          <div class="ho-header__meta"><span>${esc(t('handoverReport'))}&nbsp;&nbsp;${esc(d.handoverId ?? '')}</span><span>${esc(d.createdAt)}</span></div>
        </header>
      </td></tr></thead>
      <tbody><tr><td>
        <div class="ho-content">
    ${parts.join(rule)}
        </div>
      </td></tr></tbody>
    </table>
  </section>`;
}

// ---------- Closing page ------------------------------------------------------------------------------

function closing(t, d, a, tabs, ctx) {
  const top = tabs.map((tab) => tabSection(t, tab, ctx)).join('<div class="ho-rule" role="separator"></div>');

  const signers = has(d.signatures)
    ? `<div class="ho-signers">${d.signatures
        .map((s) => {
          const isCustomer = s.role === 'customer';
          const lines = [s.name, s.company, s.email].filter(has);
          const right = s.signature
            ? `<div class="ho-signature"><img src="${esc(s.signature)}" alt="${esc(t('signature'))}"></div>`
            : isCustomer
              ? `<div class="ho-signer__stamp"><div>${esc(s.signedAt ?? d.createdAt)}</div><div class="ho-stamp-row"><span>${esc(t('handoverReport'))}</span><span class="ho-stamp-id">${esc(d.handoverId ?? '')}</span></div></div>`
              : `<div class="ho-signature" aria-label="${esc(t('signature'))}"></div>`;
          return `<div class="ho-signer">
            <div class="ho-signer__who">
              <div class="ho-label">${esc(t(s.role))}</div>
              <div class="ho-signer__lines">${lines
                .map((l, i) => `<div class="${isCustomer && i === 0 ? 'ho-signer__name--strong' : ''}">${esc(l)}</div>`)
                .join('')}</div>
            </div>
            ${right}
          </div>`;
        })
        .join('')}</div>`
    : '';

  const c = d.company;
  const company = c
    ? `<div class="ho-company">
        <img class="ho-company__logo" src="${a}assets/${esc(d.brand?.logo ?? 'syniotec-logo.svg')}" alt="${esc(c.name ?? 'syniotec')}">
        ${has(c.brandLine) ? `<div class="ho-company__brand">${esc(c.brandLine)}</div>` : ''}
        <div class="ho-company__grid">
          ${(c.columns ?? []).map((col) => `<div>${col.map((l) => `<div>${esc(l)}</div>`).join('')}</div>`).join('')}
        </div>
        ${has(c.management) ? `<div class="ho-company__mgmt">${esc(c.management)}</div>` : ''}
        ${
          has(c.terms)
            ? `<div class="ho-company__terms"><div class="ho-company__terms-title">${esc(c.termsTitle ?? '')}</div><p>${esc(c.terms)}</p></div>`
            : ''
        }
      </div>`
    : '';

  // Nothing to close with: no empty last page
  if (!top && !signers && !company) return '';

  return `<section class="ho-closing">
    ${top}
    ${signers ? `<div class="ho-dotted${top ? '' : ' ho-dotted--first'}" role="separator"></div>` : ''}
    ${signers}
    ${company}
  </section>`;
}

// ---------- Document ----------------------------------------------------------------------------------

export function renderHandover(data, { assetBase = './', inlineCss = null, showFieldTypes = false } = {}) {
  const t = translator(data.lang);
  const a = assetBase;
  // Last answers show only when the handover was filled with compare on and the template did not change.
  const ctx = { compare: Boolean(data.compare) && data.comparable !== false, showTypes: showFieldTypes };
  const tabs = data.tabs ?? [];
  const bodyTabs = tabs.filter((tab) => !tab.closing);
  const closingTabs = tabs.filter((tab) => tab.closing);

  const footer = [data.footer?.slogan, data.footer?.website].filter(has).join('\n');
  // Inline CSS: point its font URLs at assetBase, as the linked stylesheet would resolve them.
  const css = inlineCss
    ? `<style>\n${inlineCss.replace(/url\('fonts\//g, `url('${a}fonts/`)}\n</style>`
    : `<link rel="stylesheet" href="${a}handover.css">`;

  return `<!doctype html>
<html lang="${esc(data.lang ?? 'en')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t('handoverReport'))} ${esc(data.handoverId || data.contractId || '')}</title>
${css}
<style>@page body { @bottom-left { content: ${cssString(footer)}; } }</style>
</head>
<body>
  ${cover(t, data, a)}
  ${body(t, data, a, bodyTabs, ctx)}
  ${closing(t, data, a, closingTabs, ctx)}
</body>
</html>
`;
}
