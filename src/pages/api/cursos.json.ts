// Static endpoint that emits all cursos as structured calendar events.
// Output: /api/cursos.json at build time.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export type CalendarEvent = {
  slug: string;
  title: string;
  shortTitle?: string;
  modality: 'online' | 'presencial' | 'hibrido';
  href: string;
  accent: 'purple' | 'green' | 'gold';
  startDate: string | null;
  endDate: string | null;
  datesLabel: string;
  price?: string;
  audience?: string;
  location?: string;
  avalFlasic?: string;
  coBranded?: string;
  confirmed: boolean;
};

const MONTHS: Record<string, number> = {
  enero: 1, ene: 1,
  febrero: 2, feb: 2,
  marzo: 3, mar: 3,
  abril: 4, abr: 4,
  mayo: 5, may: 5,
  junio: 6, jun: 6,
  julio: 7, jul: 7,
  agosto: 8, ago: 8,
  septiembre: 9, sep: 9, sept: 9,
  octubre: 10, oct: 10,
  noviembre: 11, nov: 11,
  diciembre: 12, dic: 12,
};

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function iso(y: number, m: number, d: number): string {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[–—]/g, '-') // unify dashes
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse Spanish date-range strings. Returns null if cannot parse.
 * Supported patterns:
 *   "DD mes - DD mes YYYY"        (cross-month, e.g. "29 sep - 17 oct 2026")
 *   "DD - DD mes YYYY"            (same month, e.g. "24-26 sep 2026")
 *   "DD mes - DD mes YYYY"        ("16 jun - 21 jul 2026")
 *   "mes - mes YYYY"              (month range, e.g. "Ago - dic 2026")
 *   "mes YYYY"                    (single month)
 * Anything else: null.
 */
function parseDates(raw: string | undefined): { startDate: string | null; endDate: string | null; confirmed: boolean } {
  if (!raw) return { startDate: null, endDate: null, confirmed: false };
  const s = normalize(raw);

  // Reject "por confirmar" / explicitly unconfirmed
  if (/por confirmar|proxima cohorte|proximamente|pendiente/.test(s)) {
    return { startDate: null, endDate: null, confirmed: false };
  }

  const yearMatch = s.match(/(20\d{2})/);
  if (!yearMatch) return { startDate: null, endDate: null, confirmed: false };
  const year = parseInt(yearMatch[1], 10);
  const text = s.replace(yearMatch[1], '').trim();

  const monthsAlt = Object.keys(MONTHS).join('|');

  // Pattern: "DD mes - DD mes" (cross-month with day on each side)
  let m = text.match(new RegExp(`(\\d{1,2})\\s*(${monthsAlt})\\s*-\\s*(\\d{1,2})\\s*(${monthsAlt})`));
  if (m) {
    const d1 = parseInt(m[1], 10);
    const mo1 = MONTHS[m[2]];
    const d2 = parseInt(m[3], 10);
    const mo2 = MONTHS[m[4]];
    return { startDate: iso(year, mo1, d1), endDate: iso(year, mo2, d2), confirmed: true };
  }

  // Pattern: "DD - DD mes"  (same month, range of days)
  m = text.match(new RegExp(`(\\d{1,2})\\s*-\\s*(\\d{1,2})\\s*(${monthsAlt})`));
  if (m) {
    const d1 = parseInt(m[1], 10);
    const d2 = parseInt(m[2], 10);
    const mo = MONTHS[m[3]];
    return { startDate: iso(year, mo, d1), endDate: iso(year, mo, d2), confirmed: true };
  }

  // Pattern: "mes - mes" (month range, no days)
  m = text.match(new RegExp(`(${monthsAlt})\\s*-\\s*(${monthsAlt})`));
  if (m) {
    const mo1 = MONTHS[m[1]];
    const mo2 = MONTHS[m[2]];
    return {
      startDate: iso(year, mo1, 1),
      endDate: iso(year, mo2, daysInMonth(year, mo2)),
      confirmed: true,
    };
  }

  // Pattern: "DD mes" (single day with month)
  m = text.match(new RegExp(`(\\d{1,2})\\s*(${monthsAlt})`));
  if (m) {
    const d = parseInt(m[1], 10);
    const mo = MONTHS[m[2]];
    return { startDate: iso(year, mo, d), endDate: iso(year, mo, d), confirmed: true };
  }

  // Pattern: "mes" alone (single month)
  m = text.match(new RegExp(`(${monthsAlt})`));
  if (m) {
    const mo = MONTHS[m[1]];
    return {
      startDate: iso(year, mo, 1),
      endDate: iso(year, mo, daysInMonth(year, mo)),
      confirmed: true,
    };
  }

  return { startDate: null, endDate: null, confirmed: false };
}

// Static location hints by slug (extracted from course MD bodies where present).
const LOCATION_HINTS: Record<string, string> = {
  eusim1sep: 'Centro Médico ABC Santa Fe, CDMX',
  actores: 'Querétaro',
};

export const GET: APIRoute = async () => {
  const cursos = await getCollection('cursos');

  const events: CalendarEvent[] = cursos.map((curso) => {
    const { startDate, endDate, confirmed } = parseDates(curso.data.dates);

    if (curso.data.dates && !confirmed) {
      // Log a warning at build time; never throw.

      console.warn(`[cursos.json] could not parse dates for "${curso.id}": "${curso.data.dates}"`);
    }

    const ev: CalendarEvent = {
      slug: curso.id,
      title: curso.data.title,
      shortTitle: curso.data.shortTitle,
      modality: curso.data.modality,
      href: curso.data.href,
      accent: curso.data.accent,
      startDate,
      endDate,
      datesLabel: curso.data.dates ?? 'Próxima cohorte por confirmar',
      price: curso.data.price,
      audience: curso.data.audience,
      location: LOCATION_HINTS[curso.id],
      avalFlasic: curso.data.avalFlasic,
      coBranded: curso.data.coBranded,
      confirmed,
    };
    return ev;
  });

  // Sort: confirmed first by startDate asc, unconfirmed last.
  events.sort((a, b) => {
    if (a.confirmed && b.confirmed) {
      return (a.startDate ?? '').localeCompare(b.startDate ?? '');
    }
    if (a.confirmed) return -1;
    if (b.confirmed) return 1;
    return a.title.localeCompare(b.title);
  });

  return new Response(JSON.stringify(events, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
