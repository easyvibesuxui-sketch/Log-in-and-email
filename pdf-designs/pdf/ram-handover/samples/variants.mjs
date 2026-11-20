// Sample data for the handover variants, in English and German.
// The tabs follow the reference PDFs (dummy text typos corrected); `field-types` shows every template
// field type with its Last Answer.

const P = '../assets/photos/';
const ph = (name, label) => ({ src: `${P}${name}.jpg`, ...(label ? { label } : {}) });

const company = {
  en: {
    name: 'syniotec',
    brandLine: 'A brand of Sharemac GmbH',
    columns: [
      ['Address: Am Wall 146', 'City: Bremen', 'Postcode: 28195', 'Country: Germany'],
      ['T +49 421 83679700', 'M info@syniotec.com', 'www.syniotec.com'],
      ['VAT ID: DE316314130', 'Register no.: HRB 33169'],
      ['Bank: Deutsche Bank', 'BIC/SWIFT: DEUTDEFFXXX', 'IBAN: DE34 5001 0517 3163 9812 79'],
    ],
    management: 'Management: Manuel Kimanov',
    termsTitle: 'Terms and conditions',
    terms:
      '“Terms and Conditions” is the document governing the contractual relationship between the provider of a service and its user. On the web, this document is often also called “Terms of Service” (ToS), “Terms of Use”, EULA (“End-User License Agreement”), “General Conditions” or “Legal Notes”.',
  },
  de: {
    name: 'syniotec',
    brandLine: 'Eine Marke der Sharemac GmbH',
    columns: [
      ['Adresse: Am Wall 146', 'Stadt: Bremen', 'PLZ: 28195', 'Land: Deutschland'],
      ['T +49 421 83679700', 'M info@syniotec.com', 'www.syniotec.com'],
      ['USt-IdNr.: DE316314130', 'Registernr.: HRB 33169'],
      ['Bank: Deutsche Bank', 'BIC/SWIFT: DEUTDEFFXXX', 'IBAN: DE34 5001 0517 3163 9812 79'],
    ],
    management: 'Geschäftsführung: Manuel Kimanov',
    termsTitle: 'Allgemeine Geschäftsbedingungen',
    terms:
      'Die „Allgemeinen Geschäftsbedingungen“ regeln das Vertragsverhältnis zwischen dem Anbieter einer Leistung und ihrem Nutzer. Im Web heißt dieses Dokument oft auch „Nutzungsbedingungen“, „Terms of Service“ (ToS), EULA („Endbenutzer-Lizenzvertrag“) oder „Rechtliche Hinweise“.',
  },
};

const text = {
  en: {
    createdAt: '20 May 2025, 11:00 (Europe/Berlin)',
    footer: { slogan: 'syniotec Software 2025 / We synchronize you with the future!', website: 'syniotec.com' },
    crawler: 'Crawler excavator',
    smallInv: 'Small inventory',
    bigInv: 'Big inventory',
    fence: 'Fence',
    longFence: 'Long fence',
    fences: 'Fences',
    longFences: 'Long fences',
    dates: '01.01.2028 14:42 – 02.02.2029 16:48',
    address: '28195 Bremen, Germany',
    category: 'Crawler excavator',
    subtitle: 'Volvo excavator over 50 t',
    subtitleWb: 'Crawler excavator Volvo',
    tabs: {
      rental: 'Rental information',
      attachments: 'Attachments',
      general: 'General information',
      checklist: 'Question group',
      lights: 'Lights',
      photos: 'Photos',
      views: '360 views',
      rating: 'Rating',
    },
    warehouse: 'Warehouse',
    warehouseV: 'Halensee Warehouse',
    rentalId: 'Rental ID',
    companyCustomer: 'Company/customer',
    placeOfUse: 'Place of use',
    placeOfUseV: 'Bremen Roadworks',
    tankLevel: 'Tank level',
    attachment: 'Attachment',
    scratches: 'Scratches on front mirror',
    techCheck: 'Technical check in PDF',
    document: 'Document',
    uvv: 'UVV',
    workingHour: 'Working hour',
    cleaning: 'Cleaning in order?',
    group: 'Group',
    heading: 'General',
    q: [
      'General operating licence / registration certificate',
      'Operating instructions',
      'Hazard assessment',
      'Last test certificate',
      'Type plate / CE marking',
      'Declaration of conformity',
      'Warning signs / information plates',
      'Last test certificate',
      'Type plate / CE marking',
      'Last test certificate',
      'Type plate / CE marking',
      'Last test certificate',
      'Type plate / CE marking',
    ],
    damage:
      'The damage always indicates the failure or impairment of a machine or technical system. Machine damage can take many forms and often has a significant impact on efficiency.',
    damageOld: 'Small scratch on the left side, already known at hand out.',
    headlights: 'Headlights',
    cabinLights: 'Cabin lights',
    photoLabels: ['Front view', 'Left side 45 degrees', 'Back view', 'Right side 45 degrees', 'Cabin', 'Bucket', 'Other image'],
    ext: '360° view exterior',
    int: '360° view interior',
    rate: 'Rate the equipment',
    comment: 'The quick brown fox jumps over the lazy dog',
    commentOld: 'Clean and ready to use',
    // field showcase
    showcase: 'All field types',
    fText: 'Hydraulic pipe problem',
    fTextV: 'Back side',
    fDate: 'Problem date',
    fTime: 'Problem time',
    fYes: 'Hydraulic pipe problem',
    fRating: 'Problem rating',
    fRange: 'Problem range',
    fDesc: 'Problem description',
    fChooser: 'Problem chooser',
    fRow: (n) => `Row ${n}`,
    fSlider: 'Problem slider',
    fChecks: 'Problem checks',
    fOptions: ['Second option', 'Third option'],
    fOptionsOld: ['First option', 'Third option'],
    fImage: 'Problem image',
    fFile: 'Problem file',
    fGallery: 'Problem gallery',
    fAi: 'Problem AI',
    fProblem: (n) => `Problem ${n}`,
    fGroup: 'Problem group',
    fGroupTab: 'Groups and photos',
    fQuestion: ['First question', 'Second question', 'Third question', 'Fourth question'],
    fSwitch: 'Problem switcher',
    fHelper: 'Engine stops when the switch is off',
    fDropdown: 'Problem dropdown',
    fNo: 'No',
    fCount: 'Problem count',
    reason: 'Something was changed in details',
  },
  de: {
    createdAt: '20.05.2025, 11:00 (Europe/Berlin)',
    footer: { slogan: 'syniotec Software 2025 / We synchronize you with the future!', website: 'syniotec.com' },
    crawler: 'Raupenbagger',
    smallInv: 'Kleininventar',
    bigInv: 'Großinventar',
    fence: 'Zaun',
    longFence: 'Langer Zaun',
    fences: 'Zäune',
    longFences: 'Lange Zäune',
    dates: '01.01.2028 14:42 – 02.02.2029 16:48',
    address: '28195 Bremen, Deutschland',
    category: 'Raupenbagger',
    subtitle: 'Volvo-Bagger über 50 t',
    subtitleWb: 'Raupenbagger Volvo',
    tabs: {
      rental: 'Mietinformationen',
      attachments: 'Anhänge',
      general: 'Allgemeine Informationen',
      checklist: 'Fragengruppe',
      lights: 'Beleuchtung',
      photos: 'Fotos',
      views: '360°-Ansichten',
      rating: 'Bewertung',
    },
    warehouse: 'Lager',
    warehouseV: 'Lager Halensee',
    rentalId: 'Miet-ID',
    companyCustomer: 'Firma/Kunde',
    placeOfUse: 'Einsatzort',
    placeOfUseV: 'Straßenbau Bremen',
    tankLevel: 'Tankfüllstand',
    attachment: 'Anhang',
    scratches: 'Kratzer am Frontspiegel',
    techCheck: 'Technische Prüfung als PDF',
    document: 'Dokument',
    uvv: 'UVV',
    workingHour: 'Arbeitszeit',
    cleaning: 'Reinigung in Ordnung?',
    group: 'Gruppe',
    heading: 'Allgemein',
    q: [
      'Allgemeine Betriebserlaubnis / Zulassungsbescheinigung',
      'Betriebsanleitung',
      'Gefährdungsbeurteilung',
      'Letzte Prüfbescheinigung',
      'Typenschild / CE-Kennzeichnung',
      'Konformitätserklärung',
      'Warn- und Hinweisschilder',
      'Letzte Prüfbescheinigung',
      'Typenschild / CE-Kennzeichnung',
      'Letzte Prüfbescheinigung',
      'Typenschild / CE-Kennzeichnung',
      'Letzte Prüfbescheinigung',
      'Typenschild / CE-Kennzeichnung',
    ],
    damage:
      'Ein Schaden bedeutet immer den Ausfall oder die Beeinträchtigung einer Maschine oder technischen Anlage. Maschinenschäden haben viele Formen und wirken sich oft stark auf die Effizienz aus.',
    damageOld: 'Kleiner Kratzer links, bei der Ausgabe bereits bekannt.',
    headlights: 'Scheinwerfer',
    cabinLights: 'Kabinenbeleuchtung',
    photoLabels: ['Vorderansicht', 'Linke Seite 45 Grad', 'Rückansicht', 'Rechte Seite 45 Grad', 'Kabine', 'Löffel', 'Weiteres Bild'],
    ext: '360°-Ansicht außen',
    int: '360°-Ansicht innen',
    rate: 'Gerät bewerten',
    comment: 'Franz jagt im komplett verwahrlosten Taxi quer durch Bayern',
    commentOld: 'Sauber und einsatzbereit',
    showcase: 'Alle Feldtypen',
    fText: 'Problem an der Hydraulikleitung',
    fTextV: 'Rückseite',
    fDate: 'Datum des Problems',
    fTime: 'Uhrzeit des Problems',
    fYes: 'Problem an der Hydraulikleitung',
    fRating: 'Bewertung des Problems',
    fRange: 'Bereich des Problems',
    fDesc: 'Beschreibung des Problems',
    fChooser: 'Auswahl',
    fRow: (n) => `Zeile ${n}`,
    fSlider: 'Schieberegler',
    fChecks: 'Mehrfachauswahl',
    fOptions: ['Zweite Option', 'Dritte Option'],
    fOptionsOld: ['Erste Option', 'Dritte Option'],
    fImage: 'Bild',
    fFile: 'Datei',
    fGallery: 'Galerie',
    fAi: 'KI-Analyse',
    fProblem: (n) => `Problem ${n}`,
    fGroup: 'Fragengruppe',
    fGroupTab: 'Gruppen und Fotos',
    fQuestion: ['Erste Frage', 'Zweite Frage', 'Dritte Frage', 'Vierte Frage'],
    fSwitch: 'Schalter',
    fHelper: 'Motor stoppt, wenn der Schalter aus ist',
    fDropdown: 'Dropdown',
    fNo: 'Nein',
    fCount: 'Anzahl',
    reason: 'An den Details wurde etwas geändert',
  },
};

// Answers of the reference checklist: [answer, condition (after Yes), with additional information]
const checklist = [
  ['yes', false, true],
  ['not_relevant'],
  ['no'],
  ['yes', true],
  ['not_relevant'],
  ['no'],
  ['not_relevant'],
  ['no'],
  ['not_relevant'],
  ['no'],
  ['not_relevant'],
  ['yes', true, true],
  ['not_relevant'],
];

// ---------- Tabs of the handover template -------------------------------------------------------------

function tabs(x, { compare = false } = {}) {
  // Last answer: what the previous report said. Most fields keep their value, a few changed.
  const was = (f, last) => (compare ? { ...f, lastAnswer: last === undefined ? pick(f) : last } : f);
  const pick = ({ value, answer, condition, files, photos, comment, helper, unit }) =>
    Object.fromEntries(Object.entries({ value, answer, condition, files, photos, comment, helper, unit }).filter(([, v]) => v !== undefined));

  const docs = [
    { name: x.document, date: '14.02.2020', url: '#' },
    { name: x.document, date: '14.02.2020', url: '#' },
  ];

  return [
    {
      title: x.tabs.rental,
      fields: [
        was({ type: 'text', label: x.warehouse, value: x.warehouseV }),
        was({ type: 'text', label: x.rentalId, value: 'RC15484BTT' }),
        was({ type: 'text', label: x.companyCustomer, value: 'Reisebüro GmbH' }),
        was({ type: 'text', label: x.placeOfUse, value: x.placeOfUseV }),
        was(
          { type: 'slider', label: x.tankLevel, icon: 'fuel', value: 65, unit: '%', photos: [ph('tank-gauge')] },
          { value: 90, unit: '%', photos: [ph('tank-gauge')] },
        ),
      ],
    },
    {
      title: x.tabs.attachments,
      fields: [
        was(
          { type: 'description', label: `${x.attachment} 1`, value: x.scratches, photos: [ph('attachment-mirror-1'), ph('attachment-mirror-2')] },
          { value: x.scratches, photos: [ph('attachment-mirror-1')] },
        ),
        was({ type: 'file', label: `${x.attachment} 2`, note: x.techCheck, files: docs }, { files: docs.slice(0, 1) }),
      ],
    },
    {
      title: x.tabs.general,
      fields: [
        was({ type: 'date', label: x.uvv, value: '26.01.2021' }),
        was({ type: 'time', label: x.workingHour, value: '8:00 AM' }, { value: '7:30 AM' }),
        was({ type: 'yesno', label: x.cleaning, answer: 'yes' }),
      ],
    },
    {
      title: x.tabs.checklist,
      fields: [
        {
          type: 'group',
          label: x.group,
          heading: x.heading,
          fields: checklist.map(([answer, condition, withInfo], i) =>
            was(
              {
                type: 'yesno',
                no: `1.${i + 1}`,
                label: x.q[i],
                answer,
                ...(answer === 'yes' ? { condition } : {}),
                ...(withInfo ? { comment: x.damage } : {}),
                ...(i === 11 ? { photos: [ph('answer-cabin-light')] } : {}),
              },
              i === 0
                ? { answer: 'yes', condition: true, comment: x.damageOld, photos: [ph('answer-cabin-light')] }
                : i === 2
                  ? { answer: 'yes', condition: true }
                  : undefined,
            ),
          ),
        },
      ],
    },
    {
      title: x.tabs.lights,
      fields: [
        was({ type: 'yesno', label: x.headlights, answer: 'yes' }),
        was(
          { type: 'yesno', label: x.cabinLights, answer: 'no', photos: [ph('cabin-lights-1'), ph('cabin-lights-2')] },
          { answer: 'yes', photos: [ph('cabin-lights-1')] },
        ),
      ],
    },
    {
      title: x.tabs.photos,
      fields: [
        {
          type: 'gallery',
          items: ['front-view', 'left-45', 'back-view', 'right-45', 'cabin', 'bucket', 'other'].map((f, i) => ({
            label: x.photoLabels[i],
            src: `${P}${f}.jpg`,
            ...(compare ? { lastAnswer: i === 6 ? null : { src: `${P}${f}.jpg` } } : {}),
          })),
        },
      ],
    },
    {
      title: x.tabs.views,
      closing: true,
      fields: [
        was({ type: 'video', label: x.ext, files: [{ name: 'Exterior video.mp4', url: '#', kind: 'video' }] }),
        was({ type: 'video', label: x.int, files: [{ name: 'Interior video.mp4', url: '#', kind: 'video' }] }),
      ],
    },
    {
      title: x.tabs.rating,
      closing: true,
      fields: [was({ type: 'rating', label: x.rate, value: { score: 3, max: 5 }, comment: x.comment }, { value: { score: 4, max: 5 }, comment: x.commentOld })],
    },
  ];
}

// Every field type of the template, each with its Last Answer
function showcase(x) {
  const la = (f, last) => ({ ...f, lastAnswer: last });
  return [
    {
      title: x.showcase,
      fields: [
        la({ type: 'text', label: x.fText, value: x.fTextV }, { value: x.fTextV }),
        la({ type: 'date', label: x.fDate, value: '01.01.2028' }, { value: '01.01.2027' }),
        la({ type: 'time', label: x.fTime, value: '14:42' }, { value: '09:15' }),
        la(
          { type: 'yesno', label: x.fYes, answer: 'yes', comment: x.damage, photos: [ph('attachment-mirror-1'), ph('attachment-mirror-2')] },
          { answer: 'yes', comment: x.damage, photos: [ph('attachment-mirror-1'), ph('attachment-mirror-2')] },
        ),
        la({ type: 'yesno', label: x.fYes, answer: 'no', comment: x.damage }, { answer: 'yes' }),
        la({ type: 'rating', label: x.fRating, value: { score: 3, max: 5 }, comment: x.damage }, { value: { score: 3, max: 5 }, comment: x.damage }),
        la({ type: 'range', label: x.fRange, value: { from: 10, to: 50 }, unit: '%' }, { value: { from: 10, to: 50 }, unit: '%' }),
        la({ type: 'description', label: x.fDesc, value: x.damage }, { value: x.damage }),
        la({ type: 'choice', label: x.fChooser, value: x.fRow(2) }, { value: x.fRow(2) }),
        la({ type: 'slider', label: x.fSlider, value: 50, unit: '%', comment: x.damage }, { value: 30, unit: '%' }),
        la({ type: 'checks', label: x.fChecks, value: x.fOptions }, { value: x.fOptionsOld }),
        la({ type: 'image', label: x.fImage, photos: [ph('other')] }, { photos: [ph('back-view')] }),
        la({ type: 'file', label: x.fFile, files: [{ name: 'File name.pdf', url: '#' }] }, { files: [{ name: 'File name.pdf', url: '#' }] }),
        la({ type: 'switch', label: x.fSwitch, value: false, helper: x.fHelper }, { value: false, helper: x.fHelper }),
        la({ type: 'dropdown', label: x.fDropdown, value: x.fNo }, { value: x.fNo }),
        la({ type: 'count', label: x.fCount, value: 12 }, { value: 12 }),
      ],
    },
    {
      title: x.fGroupTab,
      fields: [
        {
          type: 'group',
          label: x.fGroup,
          heading: x.heading,
          fields: [
            la({ type: 'yesno', label: x.fQuestion[0], answer: 'yes', condition: true }, { answer: 'no', comment: x.damageOld }),
            la({ type: 'yesno', label: x.fQuestion[1], answer: 'not_relevant' }, { answer: 'not_relevant' }),
            la({ type: 'yesno', label: x.fQuestion[2], answer: 'yes', condition: false }, { answer: 'yes', condition: true }),
            la({ type: 'yesno', label: x.fQuestion[3], answer: 'no', comment: x.damage }, null),
          ],
        },
        {
          type: 'gallery',
          label: x.fGallery,
          items: [4, 5, 6].map((n, i) => ({ label: x.fProblem(n), src: `${P}${['front-view', 'left-45', 'back-view'][i]}.jpg`, lastAnswer: { src: `${P}${['front-view', 'left-45', 'back-view'][i]}.jpg` } })),
        },
        {
          type: 'ai',
          label: x.fAi,
          items: [1, 2].map((n, i) => ({ label: x.fProblem(n), src: `${P}${['right-45', 'bucket'][i]}.jpg`, lastAnswer: { src: `${P}${['right-45', 'bucket'][i]}.jpg` } })),
        },
      ],
    },
  ];
}

// ---------- Reports -----------------------------------------------------------------------------------

function base(lang, opts = {}) {
  const x = text[lang];
  return {
    lang,
    createdAt: x.createdAt,
    handoverId: 'RC15484BTT',
    contractId: 'RC15484BTT',
    brand: { name: 'syniotec', logo: 'syniotec-logo.svg' },
    footer: x.footer,
    compare: Boolean(opts.compare),
    tabs: tabs(x, opts),
    company: company[lang],
  };
}

// With a transport provider: three people at the handover
const withTransport = (first) => ({
  parties: [
    { role: first, name: 'Max Mustermann', company: 'GmbH Große Mode' },
    { role: 'transportProvider', name: 'John Doe', company: 'GmbH Holidayquelle' },
    { role: 'customer', name: 'Max Mustermann', company: 'GmbH Reisefokus' },
  ],
  signatures: [
    { role: first, name: 'Max Mustermann', company: 'GmbH Große Mode', signature: null },
    { role: 'transportProvider', name: 'John Doe', company: 'GmbH Holidayquelle', signature: null },
    { role: 'customer', name: 'Max Mustermann', company: 'GmbH Reisefokus', email: 'max.mustermann@reisefokus.de' },
  ],
});

// Without a transport provider: two people
const direct = (first) => ({
  parties: [
    { role: first, name: 'Max Mustermann', company: 'GmbH Große Mode' },
    { role: 'customer', name: 'Max Mustermann', company: 'GmbH Reisefokus' },
  ],
  signatures: [
    { role: first, name: 'Max Mustermann', company: 'GmbH Große Mode', signature: null },
    { role: 'customer', name: 'Max Mustermann', company: 'GmbH Reisefokus', email: 'max.mustermann@reisefokus.de' },
  ],
});

const threeRows = (x) => [
  { no: 1, product: x.crawler, name: 'Volvo F504', bookingDates: x.dates, quantity: 1 },
  { no: 2, product: x.smallInv, name: x.fence, bookingDates: x.dates, quantity: 100 },
  { no: 3, product: x.bigInv, name: x.longFence, bookingDates: x.dates, quantity: 100 },
];

export const variants = {
  // Hand out with a transport provider (3 people): Handover Protocol Hand out
  'hand-out': (lang) => {
    const x = text[lang];
    return {
      ...base(lang),
      type: 'hand_out',
      ...withTransport('owner'),
      overview: threeRows(x),
      inventory: [
        { name: x.fences, total: 100, delivered: 98 },
        { name: x.longFences, total: 100, delivered: 98 },
      ],
    };
  },

  // Hand out without a transport provider (2 people)
  'hand-out-direct': (lang) => {
    const x = text[lang];
    return { ...base(lang), type: 'hand_out', ...direct('rentalCompany'), overview: threeRows(x).slice(0, 1) };
  },

  // Hand in, equipment and inventory, 3 people: Handover handin Protocol
  'hand-in': (lang) => {
    const x = text[lang];
    return {
      ...base(lang),
      type: 'hand_in',
      ...withTransport('owner'),
      overview: threeRows(x),
      inventory: [
        { name: x.fences, total: 100, returned: 98, remaining: 0, lostDamaged: 2 },
        { name: x.longFences, total: 100, returned: 98, remaining: 0, lostDamaged: 2 },
      ],
    };
  },

  // Hand in, only equipment, 2 people: Handover Protocol Hand in only equipment
  'hand-in-direct': (lang) => {
    const x = text[lang];
    return { ...base(lang), type: 'hand_in', ...direct('rentalCompany'), overview: threeRows(x).slice(0, 1) };
  },

  // Hand in filled with compare on: every field shows its Last Answer
  'hand-in-compare': (lang) => {
    const x = text[lang];
    return { ...base(lang, { compare: true }), type: 'hand_in', ...withTransport('rentalCompany'), overview: threeRows(x).slice(0, 1) };
  },

  // Compare was on, but the template changed since the last report
  'hand-in-not-comparable': (lang) => {
    const x = text[lang];
    return {
      ...base(lang, { compare: true }),
      comparable: false,
      type: 'hand_in',
      ...direct('rentalCompany'),
      overview: threeRows(x).slice(0, 1),
    };
  },

  // Bulk: several pieces of equipment, construction site, equipment details strip
  bulk: (lang) => {
    const x = text[lang];
    const rows = threeRows(x);
    rows[0].details = { id: '564564', category: x.category, subtitle: x.subtitle, serialNumber: '564564' };
    return {
      ...base(lang),
      type: 'hand_out',
      parties: [
        { role: 'rentalCompany', company: 'GmbH Große Mode', address: x.address },
        { role: 'customer', company: 'GmbH Große Mode', address: x.address },
      ],
      signatures: withTransport('rentalCompany').signatures,
      constructionSite: x.placeOfUseV,
      overview: rows,
      inventory: [
        { name: x.fences, total: 100, delivered: 98 },
        { name: x.longFences, total: 100, delivered: 98 },
      ],
      operatingHours: [
        { no: 1, equipment: 'Volvo F504', hours: '45 h' },
        { no: 4, equipment: 'Volvo F504', hours: '45 h' },
      ],
    };
  },

  // Without booking: one piece of equipment, no booking overview
  'without-booking': (lang) => {
    const x = text[lang];
    return {
      ...base(lang),
      type: 'hand_out',
      handoverId: '',
      parties: [
        { role: 'rentalCompany', company: 'GmbH Große Mode', address: x.address },
        { role: 'customer', company: 'GmbH Große Mode', address: x.address },
      ],
      signatures: direct('rentalCompany').signatures,
      constructionSite: x.placeOfUseV,
      equipment: { title: 'Volvo 2019 F507', id: '5645646DB784', category: x.category, subtitle: x.subtitleWb, serialNumber: '6556456' },
      operatingHours: [{ hours: '45 h' }],
    };
  },

  // Every field type with its Last Answer
  'field-types': (lang) => {
    const x = text[lang];
    return {
      ...base(lang, { compare: true }),
      type: 'hand_in',
      ...withTransport('rentalCompany'),
      overview: threeRows(x).slice(0, 1),
      tabs: showcase(x),
    };
  },
};
