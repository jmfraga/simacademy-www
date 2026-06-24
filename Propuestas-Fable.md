# Propuestas Fable — simacademy-www
> Auditoría: 2026-06-10 · Auditor: fable-auditor (Fable-5) · Estado: pendiente de revisión
> Instrucción para la sesión que implemente: marcar [x] cada hallazgo resuelto y anotar fecha/commit. NO borrar hallazgos.

## Resumen (3-5 líneas)
Auditoría ligera (sitio Astro 5 estático). Sin hallazgos: historial git limpio de secretos, `.gitignore` correcto y completo (cubre `.env`, `dist/`, `node_modules/`, `.DS_Store` y el directorio `inbox/` con 4.6 MB de material crudo que correctamente NO está trackeado), datos de contacto publicados son corporativos.

## Hallazgos
Sin hallazgos.

## Notas positivas (verificadas, sin hallazgo)
- Historial completo sin secretos: scan de patrones (`AIza…`, `sk-ant-…`, `ghp_…`, claves privadas) sobre todos los commits dio 0 resultados. La mención de `ANTHROPIC_API_KEY` en `docs/phase-2-feedback-debriefing.md:29` es documentación de diseño (nombre de variable), no un valor.
- `.gitignore` cubre `inbox/` (4.6 MB de fotos/material crudo, 0 archivos trackeados de ahí), `dist/`, `.astro/`, `node_modules/`, `.env*` y `.DS_Store` — exactamente el patrón que se busca en esta auditoría.
- Newsletter y widget WhatsApp de Clientify usan IDs públicos de embed (`src/layouts/BaseLayout.astro:84`, `src/components/Footer.astro:70`), no credenciales.
- Contactos publicados son corporativos (`contacto@`, `facturacion@simacademy.lat`); las bios de equipo (commit `3a5c5cc`) son contenido público intencional.

## Implementado en auditorías previas
(ninguna — primera auditoría)
