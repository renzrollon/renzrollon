// Builds assets/banner-dark.svg and assets/banner-light.svg from one layout.
//
// Text is converted to outlines with opentype.js, so the SVGs carry no font dependency:
// GitHub shows README images through its camo proxy, where external fonts never load.
// The fonts (Instrument Serif, Manrope, JetBrains Mono, all SIL Open Font License) are
// downloaded at build time from the google/fonts repository into a cache directory and
// are not committed. Override the cache with BANNER_FONT_DIR.
//
//   npm run banner

import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const opentype = require('opentype.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = process.env.BANNER_FONT_DIR || join(process.env.TMPDIR || '/tmp', 'renzrollon-banner-fonts');
const FONT_FILES = {
  serif: 'ofl/instrumentserif/InstrumentSerif-Regular.ttf',
  sans: 'ofl/manrope/Manrope%5Bwght%5D.ttf',
  mono: 'ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf',
};

async function loadFont(key) {
  const file = join(CACHE, `${key}.ttf`);
  if (!existsSync(file)) {
    mkdirSync(CACHE, { recursive: true });
    const url = `https://raw.githubusercontent.com/google/fonts/main/${FONT_FILES[key]}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`font download failed: ${url} (${res.status})`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  const buf = readFileSync(file);
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

// The escape wheel from the CV site's favicon (renzrollon.github.io/favicon.svg), 64-unit box.
const WHEEL_PATH = 'M53.00 32.00 L53.55 31.10 L54.37 30.12 L55.32 29.05 L56.35 27.88 L57.43 26.59 L57.28 25.93 L52.42 27.10 L52.21 26.30 L51.97 25.51 L52.22 24.48 L52.70 23.30 L53.27 21.99 L53.89 20.56 L54.52 19.00 L54.17 18.42 L49.91 21.03 L49.46 20.33 L48.99 19.66 L48.90 18.60 L49.00 17.33 L49.14 15.91 L49.28 14.35 L49.40 12.68 L48.89 12.23 L45.64 16.03 L45.00 15.51 L44.34 15.01 L43.94 14.03 L43.63 12.80 L43.33 11.40 L42.98 9.88 L42.58 8.25 L41.95 7.98 L40.04 12.60 L39.27 12.30 L38.49 12.03 L37.80 11.23 L37.13 10.14 L36.41 8.91 L35.61 7.57 L34.72 6.14 L34.04 6.08 L33.65 11.06 L32.82 11.02 L32.00 11.00 L31.10 10.45 L30.12 9.63 L29.05 8.68 L27.88 7.65 L26.59 6.57 L25.93 6.72 L27.10 11.58 L26.30 11.79 L25.51 12.03 L24.48 11.78 L23.30 11.30 L21.99 10.73 L20.56 10.11 L19.00 9.48 L18.42 9.83 L21.03 14.09 L20.33 14.54 L19.66 15.01 L18.60 15.10 L17.33 15.00 L15.91 14.86 L14.35 14.72 L12.68 14.60 L12.23 15.11 L16.03 18.36 L15.51 19.00 L15.01 19.66 L14.03 20.06 L12.80 20.37 L11.40 20.67 L9.88 21.02 L8.25 21.42 L7.98 22.05 L12.60 23.96 L12.30 24.73 L12.03 25.51 L11.23 26.20 L10.14 26.87 L8.91 27.59 L7.57 28.39 L6.14 29.28 L6.08 29.96 L11.06 30.35 L11.02 31.18 L11.00 32.00 L10.45 32.90 L9.63 33.88 L8.68 34.95 L7.65 36.12 L6.57 37.41 L6.72 38.07 L11.58 36.90 L11.79 37.70 L12.03 38.49 L11.78 39.52 L11.30 40.70 L10.73 42.01 L10.11 43.44 L9.48 45.00 L9.83 45.58 L14.09 42.97 L14.54 43.67 L15.01 44.34 L15.10 45.40 L15.00 46.67 L14.86 48.09 L14.72 49.65 L14.60 51.32 L15.11 51.77 L18.36 47.97 L19.00 48.49 L19.66 48.99 L20.06 49.97 L20.37 51.20 L20.67 52.60 L21.02 54.12 L21.42 55.75 L22.05 56.02 L23.96 51.40 L24.73 51.70 L25.51 51.97 L26.20 52.77 L26.87 53.86 L27.59 55.09 L28.39 56.43 L29.28 57.86 L29.96 57.92 L30.35 52.94 L31.18 52.98 L32.00 53.00 L32.90 53.55 L33.88 54.37 L34.95 55.32 L36.12 56.35 L37.41 57.43 L38.07 57.28 L36.90 52.42 L37.70 52.21 L38.49 51.97 L39.52 52.22 L40.70 52.70 L42.01 53.27 L43.44 53.89 L45.00 54.52 L45.58 54.17 L42.97 49.91 L43.67 49.46 L44.34 48.99 L45.40 48.90 L46.67 49.00 L48.09 49.14 L49.65 49.28 L51.32 49.40 L51.77 48.89 L47.97 45.64 L48.49 45.00 L48.99 44.34 L49.97 43.94 L51.20 43.63 L52.60 43.33 L54.12 42.98 L55.75 42.58 L56.02 41.95 L51.40 40.04 L51.70 39.27 L51.97 38.49 L52.77 37.80 L53.86 37.13 L55.09 36.41 L56.43 35.61 L57.86 34.72 L57.92 34.04 L52.94 33.65 L52.98 32.82 Z';
const WHEEL_HOLES = [[32, 18], [18.69, 27.67], [23.77, 43.33], [40.23, 43.33], [45.31, 27.67]];

const W = 1200;
const H = 260;
const LEFT = 72;

const THEMES = {
  dark: {
    bg: '#141416', bgGlow: '#1d1c1a', name: '#F2EADB', subtitle: '#B8B3A8', muted: '#8E8A82',
    brass: '#C9A961', pivot: '#8B2635',
  },
  light: {
    bg: '#F4EFE6', bgGlow: '#FBF8F2', name: '#141416', subtitle: '#4A4845', muted: '#76726B',
    brass: '#B5913E', pivot: '#8B2635',
  },
};

const COPY = {
  eyebrow: 'SINGAPORE · ENGINEERING LEADERSHIP',
  name: 'Carl Rollon',
  subtitle: 'Expert Software Engineer & Delivery Lead',
  url: 'renzrollon.github.io',
};

function outline(font, text, x, y, size, options = {}) {
  const path = font.getPath(text, x, y, size, { kerning: true, ...options });
  return path.toPathData(2);
}

function banner(theme, fonts) {
  const t = THEMES[theme];
  const eyebrow = outline(fonts.mono, COPY.eyebrow, LEFT, 78, 13, { letterSpacing: 0.28 });
  const name = outline(fonts.serif, COPY.name, LEFT - 2, 150, 84);
  const subtitle = outline(fonts.sans, COPY.subtitle, LEFT, 188, 23);
  const url = outline(fonts.mono, COPY.url, LEFT + 64, 224, 12.5, { letterSpacing: 0.04 });

  // Wheel: centred right of the text, large enough to bleed off the bottom and right edges.
  const cx = 1058, cy = 164, scale = 6.4;
  const holes = WHEEL_HOLES.map(([hx, hy]) => `<circle cx="${hx}" cy="${hy}" r="3" fill="${t.bg}"/>`).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">
<title id="title">Carl Rollon, Expert Software Engineer and Delivery Lead</title>
<desc id="desc">Singapore, engineering leadership. CV at renzrollon.github.io</desc>
<defs>
<radialGradient id="glow" cx="0.28" cy="0.5" r="0.75"><stop offset="0" stop-color="${t.bgGlow}"/><stop offset="1" stop-color="${t.bg}"/></radialGradient>
<clipPath id="frame"><rect width="${W}" height="${H}"/></clipPath>
</defs>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<g clip-path="url(#frame)" transform="translate(${cx} ${cy}) scale(${scale}) translate(-32 -32)">
<path d="${WHEEL_PATH}" fill="${t.brass}"/>${holes}<circle cx="32" cy="32" r="7" fill="${t.bg}"/><circle cx="32" cy="32" r="2.2" fill="${t.pivot}"/>
</g>
<path d="${eyebrow}" fill="${t.muted}"/>
<path d="${name}" fill="${t.name}"/>
<path d="${subtitle}" fill="${t.subtitle}"/>
<rect x="${LEFT}" y="219" width="44" height="1.5" fill="${t.brass}"/>
<path d="${url}" fill="${t.muted}"/>
</svg>
`;
}

const fonts = {
  serif: await loadFont('serif'),
  sans: await loadFont('sans'),
  mono: await loadFont('mono'),
};
for (const theme of Object.keys(THEMES)) {
  const out = join(ROOT, 'assets', `banner-${theme}.svg`);
  const svg = banner(theme, fonts);
  writeFileSync(out, svg);
  console.log(`${out}: ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
}
