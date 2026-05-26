# simacademy-www

Sitio principal de SimAcademy — `https://www.simacademy.lat`.

## Stack

- **Astro 6** con TypeScript strict
- **Tailwind CSS v4** vía `@tailwindcss/vite`
- **React 19** (islands para componentes interactivos)
- **@astrojs/sitemap** (auto-gen)
- **@fontsource** Playfair Display + Inter (self-hosted)
- Hosting: **TC SimAcademy** (Cloudflare Tunnel → nginx → `/var/www/simacademy-www/`)

## Comandos

| Comando            | Acción                                       |
| :----------------- | :------------------------------------------- |
| `npm install`      | Instala dependencias                         |
| `npm run dev`      | Servidor local en `http://localhost:4321`    |
| `npm run build`    | Build estático a `./dist/`                   |
| `npm run preview`  | Preview del build                            |
| `./scripts/deploy.sh` | Build + rsync a producción (TC SimAcademy) |

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
scripts/          # deploy.sh y utilidades
```

## Tokens visuales

Paleta base en `src/styles/tokens.css`:

- Morado `#6B21A8`, verde `#059669`
- Tipografía: Playfair Display (display) + Inter (body)
- Escala de tinta (`--ink-900` a `--ink-300`), papel (`--paper`)

## Deploy

```sh
./scripts/deploy.sh
```

Construye con `npm run build` y rsyncea `dist/` a
`simacademy@100.88.172.10:/var/www/simacademy-www/`.

El TC SimAcademy expone el contenido vía nginx (vhost
`/etc/nginx/sites-enabled/simacademy-www`) que recibe tráfico desde el
Cloudflare Tunnel `simacademy` para los hostnames `www.simacademy.lat` y
`simacademy.lat`. Cloudflare maneja el cert HTTPS y CDN.

## Producción

- URL final: <https://www.simacademy.lat>
- Subdominios hermanos: `info.`, `blog.`, `moodle.`, `kanban.`, `marketing.`
