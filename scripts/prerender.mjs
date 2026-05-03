/**
 * Post-build prerender script.
 * Generates per-route HTML files with correct meta tags, JSON-LD schemas,
 * image preloads, and noscript fallbacks — zero new dependencies.
 *
 * Keep schema data in sync with src/components/SchemaOrg.jsx
 * Keep meta values in sync with usePageMeta() calls in src/pages/*.jsx
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

const SITE_URL = 'https://www.nzmeltingpot.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/branding/logo-512x512.png`;

/* ------------------------------------------------------------------ */
/*  Schema data (mirrored from src/components/SchemaOrg.jsx)          */
/* ------------------------------------------------------------------ */

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NZ Melting Pot',
  url: SITE_URL,
  logo: `${SITE_URL}/images/branding/logo-512x512.png`,
  description:
    'A registered not-for-profit charity in Auckland, New Zealand that brings communities together through live music events.',
  email: 'info@nzmeltingpot.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Auckland',
    addressCountry: 'NZ',
  },
  sameAs: [],
};

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NZ Melting Pot',
  url: SITE_URL,
  description:
    'A not-for-profit charity bringing Auckland communities together through live music events.',
  inLanguage: 'en-NZ',
};

const talentShowcaseEventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'NZ Melting Pot Musical Talent Showcase 2026',
  startDate: '2026-07-18T10:00:00+12:00',
  endDate: '2026-07-18T18:00:00+12:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Auckland',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Auckland',
      addressCountry: 'NZ',
    },
  },
  image: `${SITE_URL}/images/talent-showcase/showcase-01.webp`,
  description:
    "Auckland's annual stage for solo artists, instrumentalists, and groups. Sign up, show up, and let your music do the talking.",
  organizer: {
    '@type': 'Organization',
    name: 'NZ Melting Pot',
    url: SITE_URL,
  },
  performer: {
    '@type': 'PerformingGroup',
    name: 'Various community performers',
  },
  offers: {
    '@type': 'Offer',
    price: '10.00',
    priceCurrency: 'NZD',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/musical-talent-showcase`,
    validThrough: '2026-06-01T23:59:00+12:00',
    description:
      'Early Bird performer registration fee (until 1 June 2026). Standard rate $15 NZD thereafter, until registration closes 1 July 2026.',
  },
  isAccessibleForFree: false,
};

const ensembleEventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'NZ Melting Pot Musical Ensemble',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Auckland',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Auckland',
      addressCountry: 'NZ',
    },
  },
  image: `${SITE_URL}/images/musical-ensemble/ensemble-01.webp`,
  description:
    'No auditions, no competition. Musicians from across Auckland come together for an afternoon of playing, learning, and making music as a group.',
  organizer: {
    '@type': 'Organization',
    name: 'NZ Melting Pot',
    url: SITE_URL,
  },
  isAccessibleForFree: false,
};

/* ------------------------------------------------------------------ */
/*  Page definitions                                                   */
/* ------------------------------------------------------------------ */

const NAV_LINKS = `
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/musical-talent-showcase">Musical Talent Showcase</a></li>
          <li><a href="/musical-ensemble">Musical Ensemble</a></li>
        </ul>
      </nav>`;

const PAGES = [
  {
    route: '/',
    outputPath: 'index.html',
    title: 'NZ Melting Pot \u2014 Auckland Community Music Events & Talent Showcase',
    description:
      'NZ Melting Pot is a not-for-profit charity in Auckland bringing communities together through two annual community music events \u2014 the Musical Talent Showcase and the Musical Ensemble.',
    canonical: SITE_URL,
    ogImage: DEFAULT_IMAGE,
    preloadImage: '/images/talent-showcase/showcase-01.webp',
    schemas: [organizationSchema, webSiteSchema],
    noscriptHeading: 'NZ Melting Pot',
    noscriptText:
      'NZ Melting Pot is a not-for-profit charity in Auckland bringing communities together through two annual community music events.',
  },
  {
    route: '/musical-talent-showcase',
    outputPath: 'musical-talent-showcase/index.html',
    title: 'Musical Talent Showcase 2026 \u2014 NZ Melting Pot Auckland',
    description:
      "Register for Auckland's annual Musical Talent Showcase. Solo vocalists, instrumentalists, groups, and duets \u2014 all ages welcome. Live judges, Saturday 18 July 2026. Performer fee from $10 NZD per participant.",
    canonical: `${SITE_URL}/musical-talent-showcase`,
    ogImage: DEFAULT_IMAGE,
    preloadImage: '/images/talent-showcase/showcase-01.webp',
    schemas: [organizationSchema, talentShowcaseEventSchema],
    noscriptHeading: 'Musical Talent Showcase \u2014 NZ Melting Pot',
    noscriptText:
      "Auckland's annual Musical Talent Showcase. Solo vocalists, instrumentalists, groups, and duets welcome. Saturday 18 July 2026. Performer fee from $10 NZD per participant.",
  },
  {
    route: '/musical-ensemble',
    outputPath: 'musical-ensemble/index.html',
    title: 'Musical Ensemble \u2014 NZ Melting Pot Auckland Community Jam',
    description:
      'Join the NZ Melting Pot Musical Ensemble in Auckland. No auditions, no competition \u2014 musicians of all ages and skill levels come together to play, learn, and make music as a group. All welcome.',
    canonical: `${SITE_URL}/musical-ensemble`,
    ogImage: DEFAULT_IMAGE,
    preloadImage: '/images/musical-ensemble/ensemble-01.webp',
    schemas: [organizationSchema, ensembleEventSchema],
    noscriptHeading: 'Musical Ensemble \u2014 NZ Melting Pot',
    noscriptText:
      'No auditions, no competition. Musicians from across Auckland come together to play, learn, and make music as a group. All welcome.',
  },
];

/* ------------------------------------------------------------------ */
/*  Replacement helpers                                                */
/* ------------------------------------------------------------------ */

function replaceTag(html, regex, replacement) {
  return html.replace(regex, replacement);
}

function buildSchemaScripts(schemas) {
  return schemas
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n  ');
}

function buildNoscript(heading, text) {
  return `<noscript>
    <div style="max-width:700px;margin:2rem auto;padding:0 1rem;font-family:system-ui,sans-serif">
      <h1>${heading}</h1>
      <p>${text}</p>${NAV_LINKS}
      <p><small>Please enable JavaScript for the full experience.</small></p>
    </div>
  </noscript>`;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

const baseHtml = readFileSync(resolve(distDir, 'index.html'), 'utf-8');

console.log('Prerendering pages...');

for (const page of PAGES) {
  let html = baseHtml;

  // 1. Title
  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${page.title}</title>`);

  // 2. Meta description
  html = replaceTag(
    html,
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${page.description}">`,
  );

  // 3. Canonical
  html = replaceTag(
    html,
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${page.canonical}">`,
  );

  // 4. OG tags
  html = replaceTag(
    html,
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${page.title}">`,
  );
  html = replaceTag(
    html,
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${page.description}">`,
  );
  html = replaceTag(
    html,
    /<meta property="og:url" content="[^"]*">/,
    `<meta property="og:url" content="${page.canonical}">`,
  );
  html = replaceTag(
    html,
    /<meta property="og:image" content="[^"]*">/,
    `<meta property="og:image" content="${page.ogImage}">`,
  );

  // 5. Twitter tags
  html = replaceTag(
    html,
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${page.title}">`,
  );
  html = replaceTag(
    html,
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${page.description}">`,
  );
  html = replaceTag(
    html,
    /<meta name="twitter:image" content="[^"]*">/,
    `<meta name="twitter:image" content="${page.ogImage}">`,
  );

  // 6. Image preload
  html = replaceTag(
    html,
    /<link rel="preload" as="image" type="image\/webp" href="[^"]*">/,
    `<link rel="preload" as="image" type="image/webp" href="${page.preloadImage}">`,
  );

  // 7. Insert JSON-LD schemas before </head>
  const schemaBlock = buildSchemaScripts(page.schemas);
  html = html.replace('</head>', `  ${schemaBlock}\n</head>`);

  // 8. Replace noscript block (target the body noscript with the div, not the font noscript)
  html = html.replace(
    /<noscript>\s*<div style="max-width:700px[^]*?<\/noscript>/,
    buildNoscript(page.noscriptHeading, page.noscriptText),
  );

  // Write output
  const outPath = resolve(distDir, page.outputPath);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf-8');
  console.log(`  \u2713 ${page.outputPath}`);
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

let errors = 0;
for (const page of PAGES) {
  const outPath = resolve(distDir, page.outputPath);
  const html = readFileSync(outPath, 'utf-8');

  if (!html.includes(`<title>${page.title}</title>`)) {
    console.error(`  \u2717 ${page.outputPath}: title mismatch`);
    errors++;
  }
  if (!html.includes(`<link rel="canonical" href="${page.canonical}">`)) {
    console.error(`  \u2717 ${page.outputPath}: canonical mismatch`);
    errors++;
  }
  if (!html.includes('application/ld+json')) {
    console.error(`  \u2717 ${page.outputPath}: missing JSON-LD`);
    errors++;
  }
}

if (errors) {
  console.error(`\nPrerender completed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log(`\nPrerendered ${PAGES.length} pages successfully.`);
}
