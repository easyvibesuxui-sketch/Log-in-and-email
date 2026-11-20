# RAM Handover Report

The handover protocol RAM produces when equipment is handed out to a customer or handed back in. On site
the handover template is filled in, everyone signs, and the report is generated: this folder is that report,
rebuilt as HTML from the InDesign layouts (*Hand out*, *Hand in*, *Hand in only equipment*, *Bulk*, *Without
Booking*, *Last answer*), with Syn's colours and fonts, in English and German.

Handover is RAM only.

## What the report holds

1. **Cover**: date, logo, Handover ID, Contract ID, Type (Hand Out / Hand In), the people at the handover,
   the booked items and inventory counts (or the equipment card for a handover without booking).
2. **Body**: the template's **tabs**, each with its **fields**, under a running header (logo, "Handover Report
   ID", date) with the footer (slogan, website, page number from 1).
3. **Closing page**: tabs marked `closing` (360° views and Rating in the reference), the signatures and the
   company details.

**Two or three people.** With a transport provider in between, three people take part and sign (Rental
Company or Owner, Transport Provider, Customer); without one, two (Rental Company, Customer). The cover and
the signatures follow the `parties` and `signatures` lists.

**Compare (Last Answer).** When the template was filled with compare on (`compare: true`), every field is
followed by the PDF's *Last Answer* card with the value from the previous report: short values on the
card's title line, long text, lists, files and comments under it, photos as thumbnails on the right, and in
galleries one card per photo. A field without a previous value says "No previous answer". When the template
changed since the last report (`comparable: false`), the body starts with the *Not comparable* banner and no
Last Answers are shown.

## Examples

`examples/` has every variant as `.html` (open in a browser), `.json` (the data that made it) and `.pdf`
(printed with Chromium), in `en` and `de`.

| Example | Shows |
| --- | --- |
| `hand-out` | Hand out with a transport provider (3 people); inventory as Total / Delivered |
| `hand-out-direct` | Hand out without a transport provider (2 people) |
| `hand-in` | Hand in, 3 people; inventory as Total / Returned / Remaining / Lost/Damaged |
| `hand-in-direct` | Hand in of one piece of equipment, 2 people |
| `hand-in-compare` | Hand in filled with compare on: a Last Answer after every field |
| `hand-in-not-comparable` | Compare on, but the template changed: the Not comparable banner |
| `bulk` | Several pieces of equipment, Construction Site, the equipment details strip, operating hours per piece |
| `without-booking` | The equipment card instead of the booking overview |
| `field-types` | Every field type of the template, each with its Last Answer |

## Field types

Every field has a `type` and a `label`; every field may also have `photos` (printed large, as in the PDF's
attachments), a `comment` ("Additional information"), and, when compare is on, a `lastAnswer` holding the
previous values in the same keys.

| `type` | Template field | Value keys | Printed as |
| --- | --- | --- | --- |
| `text` | Input | `value` | Value under the label |
| `number`, `count` | Number, Count | `value`, `unit` | Value |
| `date` | Date | `value` (formatted) | Calendar icon on the label |
| `time` | Time | `value` (formatted) | Clock icon on the label |
| `dropdown`, `choice` | Dropdown, Chooser | `value` | Value |
| `switch` | Switcher | `value` (true / false / text), `helper` | Yes / No and the helper text |
| `slider` | Slider | `value`, `unit` (default %) | "65%" |
| `range` | Range | `value: { from, to }`, `unit` | "From 10% • To 50%" |
| `rating` | Rating | `value: { score, max }`, `comment` | "3/5 ★", the comment under it as Additional information, like every other field |
| `description` | Text area | `value` | Text, line breaks kept |
| `checks` | Multi-select | `value: [ … ]` | One option per line |
| `yesno` | Yes / No | `answer: 'yes' \| 'no'`, `comment`, `photos` | One field: tick or cross, no Not relevant, no Condition |
| `image` | Image | `photos` | The photo |
| `file`, `video` | File, 360° video | `files: [ { name, date, url } ]`, `note` | Amber links with a chevron; one file without a note sits on the band (360 views) |
| `gallery`, `ai` | Gallery, AI | `items: [ { label, src, lastAnswer: { src } \| null } ]` | Labelled photos, 3 (gallery) or 2 (AI) per row |
| `group` | Group | `heading`, `fields: [ { no, label, answer: 'yes' \| 'no' \| 'not_relevant', condition (after Yes), comment, photos } ]` | The checklist: question · Complete · Condition/function OK?, a Last Answer under each question |

**Yes / No** is one field: Yes or No, each with additional information and photos. It has no Not relevant
and no Condition. A **group** is a checklist of questions with three buttons, as in the app: **Yes** asks
*Condition is OKAY* and takes additional information and photos, **No** takes additional information and
photos, **Not relevant** takes nothing. In the checklist the *Complete* column shows the tick, cross or
"Not relevant"; *Condition/function OK?* shows Okay (black) or Not okay (grey) after a Yes.

Simple fields of a tab are printed as bands, every second one filled (Cultured); groups and galleries stand
on their own.

## Data

`examples/*.json` are complete examples.

```jsonc
{
  "lang": "en",                         // "en" or "de": the fixed labels (i18n.mjs)
  "type": "hand_out",                   // "hand_out" | "hand_in"
  "createdAt": "20 May 2025, 11:00 (Europe/Berlin)",   // formatted by the backend
  "handoverId": "RC15484BTT",
  "contractId": "RC15484BTT",
  "brand": { "name": "syniotec", "logo": "syniotec-logo.svg" },   // file in assets/
  "footer": { "slogan": "…", "website": "syniotec.com" },

  "compare": true,                      // filled with compare on: Last Answers after every field
  "comparable": false,                  // template changed: banner, no Last Answers
  "notComparableReason": "…",           // optional banner title

  "parties": [ { "role": "rentalCompany" | "owner" | "transportProvider" | "customer",
                 "name": "…", "company": "…", "address": "…" } ],
  "constructionSite": "Bremen Roadworks",   // shown on the cover when given (Bulk, Without booking)
  "overview": [ { "no": 1, "product": "…", "name": "…", "bookingDates": "…", "quantity": 1,
                  "details": { "id": "…", "category": "…", "subtitle": "…", "serialNumber": "…" } } ],
  "equipment": { "title": "…", "id": "…", "category": "…", "subtitle": "…", "serialNumber": "…" },
  "inventory": [ { "name": "Fences", "total": 100, "delivered": 98 } ],                      // hand out
  //           [ { "name": "Fences", "total": 100, "returned": 98, "remaining": 0, "lostDamaged": 2 } ]  // hand in
  "operatingHours": [ { "no": 1, "equipment": "Volvo F504", "hours": "45 h" } ],

  "tabs": [
    { "title": "Rental information",
      "fields": [
        { "type": "text", "label": "Warehouse", "value": "Halensee Warehouse",
          "lastAnswer": { "value": "Halensee Warehouse" } },
        { "type": "slider", "label": "Tank level", "icon": "fuel", "value": 65, "unit": "%",
          "photos": [ { "src": "url" } ], "lastAnswer": { "value": 90, "photos": [ { "src": "url" } ] } }
      ] },
    { "title": "Question group",
      "fields": [ { "type": "group", "label": "Group", "heading": "General", "fields": [
        { "type": "yesno", "no": "1.1", "label": "…", "answer": "yes", "condition": false,
          "comment": "…", "lastAnswer": { "answer": "yes", "condition": true, "photos": [ … ] } } ] } ] },
    { "title": "360 views", "closing": true, "fields": [ … ] }
  ],

  "signatures": [ { "role": "rentalCompany", "name": "…", "company": "…", "signature": "url or null" },
                  { "role": "customer", "name": "…", "company": "…", "email": "…", "signedAt": "…" } ],
  "company": { "name": "syniotec", "brandLine": "A brand of Sharemac GmbH",
               "columns": [ [ "Address: …" ], [ "T …" ], [ "VAT ID: …" ], [ "Bank: …" ] ],
               "management": "…", "termsTitle": "…", "terms": "…" }
}
```

Tab titles, field labels and values come in the report's language; only the fixed labels (Handover Report,
Contract ID, Complete, Yes / No, Last Answer …) are translated by the template.

## Build

```bash
npm install          # Playwright, only needed for --pdf
npm run handover     # examples/*.html and *.json
npm run handover:pdf # also examples/*.pdf
```

In the backend:

```js
import { renderHandover } from './pdf/ram-handover/render.mjs';

const html = renderHandover(data, { assetBase: 'https://cdn.example.com/ram-handover/' });
// Print with a Chromium engine (Puppeteer, Playwright, Gotenberg):
await page.setContent(html, { waitUntil: 'networkidle' });
await page.pdf({ preferCSSPageSize: true, printBackground: true });
```

`assetBase` is where `handover.css`, `fonts/` and `assets/` are served from; `inlineCss: <the CSS text>` puts
the stylesheet inside the HTML instead. Photo, file and signature URLs in the data are used as they are.

**The print engine must be Chromium.** The template uses named pages, `@page` margin boxes for the footer and
page number, and a table header that repeats on every page; wkhtmltopdf does not support these.

## Design

- The layout is the *Last answer* PDF, measured in pt, so pages can be checked against it 1:1: A4, 10 mm
  side margins, the same type sizes, bands, rules and photo sizes.
- Syn colours: Candy Apple labels and type, Jet cover text, Eerie Black values, Silver Chalice for muted
  text, hairlines and the Last Answer card, Cultured bands, Amber links, Mantis and Honey in the status icons.
- Syn fonts: **ABC Favorit Expanded** for titles and labels, **Montserrat** for values (the PDFs' Myriad
  Pro). Montserrat runs wider than Myriad, so a few lines wrap differently.
- The logo is the syniotec wordmark taken from the PDFs as vector (`assets/syniotec-logo.svg`).
- Every report is laid out the same way: one cover (parties, then construction site, equipment and
  overview when given), the same field types and one closing page, with or without compare.
- Content of any length stays on the page: long words, IDs and file names wrap, photos and links wrap
  onto new lines, and a long overview continues on a second cover page. Nothing can be wider than
  the page, because Chromium would then shrink every page of the PDF.
- Galleries run from the left to the right content edge: three photos per row, the gaps between them
  shared out evenly.
- Only http, https, mailto and relative links are printed as links; any other link target in the data
  becomes "#".
- Page breaks: a tab title never stays alone at the bottom of a page; it moves to the next page with the
  start of its content. Field bands, questions and rows of photos are not split; a gallery breaks between
  rows. This needs the tab body in block flow (`.ho-tab` is `flow-root`, not flex): Chromium keeps a
  heading with what follows only there.

### ABC Favorit

The licensed ABC Favorit files are in `fonts/` as WOFF2 (converted from the OpenType files uploaded to the Syn
design system artifact):

| File | Used for |
| --- | --- |
| `ABCFavoritExpanded-Medium.woff2` | Titles and labels (weight 500), Syn's title face |
| `ABCFavoritExpanded-Regular.woff2` | Muted keys in the Bulk details strip and the operating hours (400) |
| `ABCFavoritExtended-Bold.woff2` | Bold titles (700): Overview, inventory names, document and video links, the rating score. Expanded has no Bold; the InDesign PDFs use Extended Bold here too |
| `ABCFavoritExtended-Regular`, `-Book`, `-Medium.woff2` | Not used by the report yet; kept with the family |

The family is licensed for this use. Do not copy the files into projects outside syniotec.

### Corrected from the PDFs

- Dummy text typos (Softvares, Eurpe/Bremen, Additioanl, excavaror, Craweler, Adress, Managment, Deutshe
  bank, GMBH), the date "02.022.2029", the time "14:86", the postcode "0177447".
- One date format, and the cover and header show the same date.
- No German labels in the English report (Einsatzort, Vollständig, Raupenbagger).
- The checklist numbers run 1.1 to 1.13 instead of repeating 1.8 and 1.9.
- Condition is printed only after a Yes (the PDF had it after Not Relevant).
- A Hand out shows Total / Delivered; the Bulk PDF, a Hand out, had the Hand in columns.
- Text cut off on the closing page of Bulk and Without Booking ("Max Muster-") fits.
- The Last Answer is a card after every field, not one block at the end of the checklist.

## Files

| File | What |
| --- | --- |
| `render.mjs` | `renderHandover(data, options)` → HTML: cover, tabs and field types, Last Answer, closing page |
| `handover.css` | Print stylesheet: pages, header and footer, every block and field type |
| `i18n.mjs` | Fixed labels, English and German |
| `samples/variants.mjs` | Example data for every variant |
| `build.mjs` | Writes `examples/` (and the PDFs with `--pdf`) |
| `assets/` | Logo and the example photos (taken from the PDFs) |
| `fonts/` | ABC Favorit (licensed) and Montserrat (OFL) |

## Design review page

`npm run handover:review` writes `handover-review.html`: the compare, Bulk, Without booking and field-types
reports laid out as A4 pages with paged.js, fonts and photos inlined, to publish as a claude.ai artifact and
review by comment. Only the running header and footer are adapted to paged.js; the layout is the print
stylesheet. Each field's label is followed by its template type in grey, "Warehouse (Input)"
(`renderHandover(data, { showFieldTypes: true })`); real reports leave it out. Page breaks can fall slightly differently from Chromium's print (the Bulk example takes one page
more there); the PDFs in `examples/` are the reference. paged.js ignores `break-after: avoid`, so the review
page keeps titles with their content by giving them room below as unbreakable padding.
