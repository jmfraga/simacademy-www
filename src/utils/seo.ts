// SEO helpers used by BaseLayout to build canonical URLs, OG image paths
// and Schema.org JSON-LD blocks.

export type OgType = 'website' | 'article';

export interface SeoInput {
  /** Absolute site URL, e.g. new URL(Astro.url.pathname, Astro.site). */
  pageUrl: URL;
  /** Site URL (Astro.site). */
  siteUrl: URL;
  title: string;
  description: string;
  ogImage?: string;
  ogType?: OgType;
}

/**
 * Map a pathname (e.g. "/oferta-educativa/calendario") to a generated OG
 * filename in /og/. Falls back to "default" if no slug matches.
 */
export function ogSlugForPath(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '').replace(/^\/+/, '');
  if (clean === '' || clean === 'index') return 'home';
  const map: Record<string, string> = {
    sobre: 'sobre',
    'oferta-educativa': 'oferta-educativa',
    'oferta-educativa/calendario': 'calendario',
    recursos: 'recursos',
    'recursos/juegos-serios': 'juegos-serios',
    'recursos/codigo-de-conducta': 'codigo-de-conducta',
    'recursos/codigo-de-etica': 'codigo-de-etica',
    comunidad: 'comunidad',
    contacto: 'contacto',
    pagos: 'pagos',
    cancelaciones: 'cancelaciones',
  };
  return map[clean] ?? 'default';
}

export function buildOgImageUrl(pathname: string, siteUrl: URL, override?: string): string {
  if (override) return new URL(override, siteUrl).toString();
  const slug = ogSlugForPath(pathname);
  return new URL(`/og/${slug}.png`, siteUrl).toString();
}

/** Organization JSON-LD — present on every page. */
export function organizationLd(siteUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SimAcademy',
    url: siteUrl.origin,
    logo: new URL('/logo.png', siteUrl).toString(),
    sameAs: [
      'https://www.linkedin.com/company/simacademy-latam/',
      'https://instagram.com/simacademy.lat',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Paseo Jurica 105-29',
      addressLocality: 'Querétaro',
      addressCountry: 'MX',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+52-442-218-4424',
        contactType: 'customer service',
        areaServed: 'MX',
        availableLanguage: ['es-MX', 'en'],
      },
    ],
  };
}

/** LocalBusiness JSON-LD for /contacto. */
export function localBusinessLd(siteUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'SimAcademy',
    url: siteUrl.origin,
    telephone: '+52-442-218-4424',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Paseo Jurica 105-29',
      addressLocality: 'Querétaro',
      addressCountry: 'MX',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
  };
}

export interface CourseInput {
  title: string;
  description: string;
  modality: 'online' | 'presencial' | 'hibrido';
  href: string;
  dates?: string;
}

/** Course JSON-LD for a single curso. */
export function courseLd(c: CourseInput, siteUrl: URL) {
  const modeMap = {
    online: 'https://schema.org/OnlineEventAttendanceMode',
    presencial: 'https://schema.org/OfflineEventAttendanceMode',
    hibrido: 'https://schema.org/MixedEventAttendanceMode',
  } as const;

  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: c.title,
    description: c.description,
    inLanguage: 'es-MX',
    provider: {
      '@type': 'Organization',
      name: 'SimAcademy',
      sameAs: siteUrl.origin,
    },
    url: c.href,
  };

  if (c.dates) {
    base.hasCourseInstance = {
      '@type': 'CourseInstance',
      courseMode: modeMap[c.modality],
      // Free-text dates are kept as-is; structured parsing happens in /api/cursos.json.
      eventSchedule: { '@type': 'Schedule', description: c.dates },
    };
  }

  return base;
}
