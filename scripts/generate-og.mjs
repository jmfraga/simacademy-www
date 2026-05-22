// Generate static OG images (1200x630) for every page using sharp's SVG renderer.
// No runtime deps added — sharp is already a transitive dep of Astro.
//
// Output: public/og/<slug>.png
// Slugs: home, sobre, oferta-educativa, calendario, recursos, juegos-serios,
//        codigo-de-conducta, codigo-de-etica, comunidad, contacto, pagos, cancelaciones, default.

import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'public', 'og');

const pages = [
  { slug: 'home', title: 'SimAcademy', subtitle: 'Educación en simulación clínica para LATAM.' },
  { slug: 'sobre', title: 'Sobre SimAcademy', subtitle: 'Quiénes somos, historia, equipo y filosofía educativa.' },
  { slug: 'oferta-educativa', title: 'Oferta educativa', subtitle: 'Programas en simulación, debriefing, mindfulness, IA y actores.' },
  { slug: 'calendario', title: 'Calendario de cursos', subtitle: 'Todas las cohortes abiertas y futuras. Filtra por modalidad.' },
  { slug: 'recursos', title: 'Recursos abiertos', subtitle: 'Juegos serios, código de conducta y código de ética.' },
  { slug: 'juegos-serios', title: 'Juegos serios', subtitle: 'Diseño de juegos para la educación clínica.' },
  { slug: 'codigo-de-conducta', title: 'Código de conducta', subtitle: 'Principios para profesores y colaboradores de SimAcademy.' },
  { slug: 'codigo-de-etica', title: 'Código de ética', subtitle: 'Estándares éticos que guían a SimAcademy.' },
  { slug: 'comunidad', title: 'Comunidad SimAcademy', subtitle: 'Una red de profesionales de la salud que se siguen formando.' },
  { slug: 'contacto', title: 'Contacto', subtitle: 'Habla con SimAcademy: formulario, WhatsApp o correo.' },
  { slug: 'pagos', title: 'Información de pagos', subtitle: 'Métodos de pago, facturación y proceso de inscripción.' },
  { slug: 'cancelaciones', title: 'Política de cancelación y reembolso', subtitle: 'Ventanas de tiempo, montos y proceso.' },
  { slug: 'default', title: 'SimAcademy', subtitle: 'Educación en simulación clínica para LATAM.' },
];

const escapeXml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

// Wrap subtitle into up to 3 lines (~ 60 chars per line at this font size).
function wrap(text, max = 60, maxLines = 3) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= max) cur = (cur + ' ' + w).trim();
    else { lines.push(cur); cur = w; if (lines.length === maxLines - 1) break; }
  }
  if (cur) lines.push(cur);
  if (words.join(' ').length > lines.join(' ').length) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[\s,.]*$/, '') + '…';
  }
  return lines;
}

function buildSvg({ title, subtitle }) {
  const subLines = wrap(subtitle, 58, 3);
  const subY = 430;
  const lineH = 46;
  const subTspans = subLines
    .map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : lineH}">${escapeXml(l)}</tspan>`)
    .join('');
  // Title wrap: 2 lines, up to ~26 chars per line at 88px.
  const titleLines = wrap(title, 28, 2);
  const titleTspans = titleLines
    .map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 96}">${escapeXml(l)}</tspan>`)
    .join('');
  const titleY = titleLines.length === 1 ? 320 : 260;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4C1D95"/>
      <stop offset="55%" stop-color="#6B21A8"/>
      <stop offset="100%" stop-color="#15803D"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.6">
      <stop offset="0%" stop-color="#F0ABFC" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#F0ABFC" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Logo mark (geometric) + brand wordmark -->
  <g transform="translate(80, 80)">
    <circle cx="22" cy="22" r="22" fill="#FFFFFF" opacity="0.95"/>
    <path d="M22 8 L34 22 L22 36 L10 22 Z" fill="#6B21A8"/>
    <text x="64" y="32" font-family="Georgia, 'Playfair Display', serif" font-size="32" font-weight="700" fill="#FFFFFF" letter-spacing="0.5">SimAcademy</text>
  </g>

  <!-- Title -->
  <text x="80" y="${titleY}" font-family="Georgia, 'Playfair Display', serif" font-size="84" font-weight="700" fill="#FFFFFF">
    ${titleTspans}
  </text>

  <!-- Divider -->
  <rect x="80" y="${subY - 50}" width="120" height="6" fill="#86EFAC" rx="3"/>

  <!-- Subtitle -->
  <text x="80" y="${subY}" font-family="'Helvetica Neue', Arial, sans-serif" font-size="34" font-weight="400" fill="#E9D5FF">
    ${subTspans}
  </text>

  <!-- Footer URL -->
  <text x="80" y="580" font-family="'Helvetica Neue', Arial, sans-serif" font-size="24" font-weight="500" fill="#FFFFFF" opacity="0.75">www.simacademy.lat</text>
</svg>`;
}

await mkdir(OUT_DIR, { recursive: true });

for (const p of pages) {
  const svg = buildSvg(p);
  const out = resolve(OUT_DIR, `${p.slug}.png`);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
  console.log(`og: wrote ${out}`);
}
console.log(`Generated ${pages.length} OG images.`);
