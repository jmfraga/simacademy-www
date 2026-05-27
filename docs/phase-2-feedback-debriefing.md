# Fase 2 — Hostear "Feedback de Debriefing" en simacademy.lat

**Estado actual (Fase 1):** link card en `/recursos` apunta al artifact público en Claude.ai. Ship 2026-05-26.

**Source del artifact (referencia):** `inbox/debriefing-feedback.jsx` — 753 líneas, React + lucide-react + i18n (EN/ES/FR), llama a `api.anthropic.com/v1/messages` directo (funciona dentro del sandbox de Claude.ai).

## Razones para migrar a Fase 2

- URL profesional: `simacademy.lat/herramientas/feedback-debriefing` en vez de `claude.ai/public/artifacts/...`
- No dependemos de que Anthropic mantenga el artifact vivo
- **Captura de datos anonimizados** (decisión de JM): conocer qué frameworks usan los educadores, qué focos eligen, longitud de transcripts, etc.

## Arquitectura propuesta

```
[Browser]  →  POST /api/feedback  →  [Cloudflare Worker]  →  api.anthropic.com
                                            ↓
                                       [D1 SQLite]
                                       (registro anonimizado)
```

### Frontend (Astro)
- Convertir `inbox/debriefing-feedback.jsx` a una página Astro con island React
- Cambiar `fetch('https://api.anthropic.com/v1/messages', ...)` →
  `fetch('/api/feedback', ...)` (proxy a través del Worker)
- Mantener i18n EN/ES/FR

### Cloudflare Worker (`/api/feedback`)
- Secret env var: `ANTHROPIC_API_KEY`
- Recibe POST con `{ transcript, technique, focuses, locale }`
- Inyecta headers (`x-api-key`, `anthropic-version: 2023-06-01`)
- Proxy a `api.anthropic.com/v1/messages`
- Rate limiting por IP (ej. 5 análisis/día via Cloudflare KV o headers)
- Registra evento anonimizado en D1 antes de devolver respuesta

### Schema D1 (anonimizado, sin PII)

```sql
CREATE TABLE feedback_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL DEFAULT (datetime('now')),
  locale TEXT NOT NULL,
  technique TEXT NOT NULL,
  focuses TEXT NOT NULL,         -- JSON array
  transcript_chars INTEGER,       -- longitud, NO el contenido
  transcript_words INTEGER,
  feedback_text TEXT,             -- la respuesta de Claude (esto SÍ se guarda)
  model TEXT NOT NULL,            -- 'claude-sonnet-4-...'
  duration_ms INTEGER,
  ip_hash TEXT NOT NULL,          -- SHA-256 de IP+salt para rate-limit, no reversible
  country TEXT,                   -- de cf-ipcountry header, para stats
  user_agent_class TEXT           -- 'mobile' | 'desktop' | 'tablet'
);

CREATE INDEX idx_feedback_events_ts ON feedback_events(ts);
CREATE INDEX idx_feedback_events_technique ON feedback_events(technique);
```

**Lo que NO se guarda:** el transcript original (PII riesgo: posibles nombres de pacientes/colegas), IP real, email, ningún identificador del usuario.

**Lo que SÍ se guarda:** el feedback generado por Claude (es texto sintético sobre simulación, no PII), métricas agregadas, técnica + foco elegidos.

### Dashboard interno
- Endpoint protegido `/admin/feedback-stats` (auth básica con BASIC_AUTH env var)
- Muestra: distribución de techniques, focuses, total uses por día/semana, países, hora del día
- Export CSV de los `feedback_text` para análisis posterior

## Costos estimados

- **Anthropic API**: Sonnet 4.x ~$3/M input + $15/M output. Un análisis típico: ~3k input + 1k output = $0.024/análisis. 100 análisis/día = ~$2.40/día = ~$72/mes en el escenario "se viraliza".
- **Rate limit por IP** (5/día) + opcional captura de email antes del 1er uso para mitigar.
- **Cloudflare Worker + D1**: free tier hasta 100k requests/día. Probablemente $0/mes.

## Hooks de captura

- Antes del análisis: pedir email opcional ("Recibe los resultados a tu correo + novedades de SimAcademy"). Si lo da, lo guardamos en otra tabla y NO se vincula al feedback_event vía ip_hash, solo flag boolean.
- Después del análisis: CTA explícita "¿Quieres formación formal en debriefing? → info.simacademy.lat/debriefing" (ya está en el artifact original).

## Tiempo estimado

- Cloudflare Worker + D1 setup: 30 min
- Conversión JSX → Astro island: 1 h
- Schema D1 + logging: 30 min
- Dashboard `/admin`: 1 h
- Rate limiting + email capture: 30 min
- Testing end-to-end: 1 h

**Total: ~4-5 h** para Fase 2 completa.

## Trigger para Fase 2

Empezar cuando se cumpla alguna de:
- 10+ clicks/semana al link card (medible vía CF Analytics)
- JM lo decide proactivamente (caso de uso de marketing, conferencia, etc.)
- Anthropic baja la URL del artifact público
