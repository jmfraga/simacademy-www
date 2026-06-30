#!/usr/bin/env bash
# Despliega el sitio a producción (TC SimAcademy).
# Requiere: SSH funcional a simacademy@<tailscale-ip> (clave en agent).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Build..."
npm run build

echo "→ Rsync a TC SimAcademy..."
rsync -az --delete dist/ simacademy@<tailscale-ip>:/var/www/simacademy-www/

echo "→ Done. Verificación:"
curl -sI "https://www.simacademy.lat/?cb=$(date +%s)" | head -3
