/**
 * Post-build script: genera dist/llms.txt para www.simacademy.lat.
 *
 * Estrategia:
 *  1. Lee llms-header.md del repo (curado a mano: H1 + blockquote + intro
 *     + secciones que no son derivables del sitemap, como links externos).
 *  2. Lee dist/sitemap-0.xml (generado por @astrojs/sitemap durante astro
 *     build) para obtener todas las URLs públicas reales.
 *  3. Por cada URL, lee el HTML correspondiente en dist/ y extrae <title>.
 *  4. Concatena header + sección "## Páginas" + escribe dist/llms.txt.
 *
 * Diseño: cero npm deps nuevas. Si el archivo header no existe, falla
 * con error claro. Si una URL no tiene HTML correspondiente, la salta
 * con warning.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIST = path.join(REPO_ROOT, "dist");
const HEADER_PATH = path.join(REPO_ROOT, "llms-header.md");
const SITEMAP_PATH = path.join(DIST, "sitemap-0.xml");
const OUTPUT_PATH = path.join(DIST, "llms.txt");

// Rutas a excluir del listado público (playgrounds, drafts, redirects).
const EXCLUDE_PATTERNS = [/\/playground\/?$/, /\/api\//];

// Limpia el <title>: quita sufijo " · SimAcademy" o " | SimAcademy".
function cleanTitle(rawTitle, urlPath) {
  return (
    rawTitle
      .replace(/\s*[|·\-–—]\s*SimAcademy.*$/i, "")
      .trim() || urlPath
  );
}

// Limpia la URL a un path canónico para mostrar en orden.
function urlSortKey(u) {
  return new URL(u).pathname;
}

async function main() {
  const header = await fs.readFile(HEADER_PATH, "utf8");

  const sitemap = await fs.readFile(SITEMAP_PATH, "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => !EXCLUDE_PATTERNS.some((re) => re.test(u)))
    .sort((a, b) => urlSortKey(a).localeCompare(urlSortKey(b)));

  const items = [];
  for (const url of urls) {
    const pathname = new URL(url).pathname;
    // Astro genera ${path}/index.html para rutas no-root.
    const htmlPath =
      pathname === "/"
        ? path.join(DIST, "index.html")
        : path.join(DIST, pathname.replace(/^\/|\/$/g, ""), "index.html");
    let title = pathname;
    try {
      const html = await fs.readFile(htmlPath, "utf8");
      const m = html.match(/<title>([\s\S]*?)<\/title>/i);
      if (m) title = cleanTitle(m[1], pathname);
    } catch {
      console.warn(`[gen-llms-txt] no HTML para ${pathname}, saltando`);
      continue;
    }
    items.push(`- [${title}](${url})`);
  }

  // Inserta la sección "## Páginas" antes de cualquier otra sección "## "
  // en el header, para que las páginas internas aparezcan primero.
  const pagesSection = `\n## Páginas\n\n${items.join("\n")}\n`;
  const firstH2 = header.match(/^## /m);
  let output;
  if (firstH2) {
    const idx = header.indexOf(firstH2[0]);
    output = header.slice(0, idx) + pagesSection + "\n" + header.slice(idx);
  } else {
    output = header.trimEnd() + "\n" + pagesSection;
  }

  await fs.writeFile(OUTPUT_PATH, output);
  console.log(`[gen-llms-txt] escrito ${OUTPUT_PATH} (${items.length} páginas)`);
}

main().catch((err) => {
  console.error(`[gen-llms-txt] ERROR:`, err.message);
  process.exit(1);
});
