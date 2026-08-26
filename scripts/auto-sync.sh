#!/usr/bin/env bash
set -u

SYNC_INTERVAL="${SAPI_SYNC_INTERVAL:-5}"

cleanup() {
  if [[ -n "${SYNC_PID:-}" ]]; then
    kill "$SYNC_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

sync_loop() {
  while true; do
    BEFORE="$(git rev-parse HEAD 2>/dev/null || true)"

    if git pull --ff-only --quiet; then
      AFTER="$(git rev-parse HEAD 2>/dev/null || true)"
      if [[ -n "$BEFORE" && -n "$AFTER" && "$BEFORE" != "$AFTER" ]]; then
        echo ""
        echo "🐸 Sapi atualizado: ${BEFORE:0:7} → ${AFTER:0:7}"
        echo "   O Metro deve recarregar o app automaticamente."
      fi
    else
      echo "⚠️  Auto-sync não conseguiu atualizar. Verifique alterações locais ou a conexão." >&2
    fi

    sleep "$SYNC_INTERVAL"
  done
}

echo "🐸 Auto-sync do Sapi ativo (a cada ${SYNC_INTERVAL}s)."
sync_loop &
SYNC_PID=$!

npx expo start
