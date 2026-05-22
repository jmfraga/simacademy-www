# simacademy-www

Sitio principal de SimAcademy — `https://www.simacademy.lat`.

## Stack

- **Astro 6** con TypeScript strict
- **Tailwind CSS v4** vía `@tailwindcss/vite`
- **React 19** (islands para componentes interactivos)
- **@astrojs/sitemap** (auto-gen)
- **@fontsource** Playfair Display + Inter (self-hosted)
- Hosting: **GitHub Pages** con dominio custom `www.simacademy.lat`

## Comandos

| Comando            | Acción                                       |
| :----------------- | :------------------------------------------- |
| `npm install`      | Instala dependencias                         |
| `npm run dev`      | Servidor local en `http://localhost:4321`    |
| `npm run build`    | Build estático a `./dist/`                   |
| `npm run preview`  | Preview del build                            |

## Estructura

```
src/
├── pages/        # rutas
├── components/   # Header, Footer, etc.
├── layouts/      # BaseLayout
├── content/      # collections (cursos, etc.)
├── styles/       # tokens.css + global.css
└── assets/       # imágenes optimizadas por Astro
public/           # estáticos servidos tal cual (CNAME, logo, robots)
.github/workflows # deploy a GitHub Pages
```

## Tokens visuales

Paleta base en `src/styles/tokens.css`:

- Morado `#6B21A8`, verde `#059669`
- Tipografía: Playfair Display (display) + Inter (body)
- Escala de tinta (`--ink-900` a `--ink-300`), papel (`--paper`)

## Deploy

Push a `main` dispara el workflow `.github/workflows/deploy.yml` que construye y publica a GitHub Pages.

**Setup manual pendiente:** Settings → Pages → Source: **GitHub Actions**.

## Producción

- URL final: <https://www.simacademy.lat>
- Subdominios hermanos: `info.`, `blog.`, `moodle.`, `kanban.`
