#!/usr/bin/env bash

cd "$(dirname "$0")"
export PYTHONPATH=backend

if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

.venv/bin/python -m pip install -r backend/requirements.txt

pnpm --dir frontend dev &
FRONTEND_PID=$!

sleep 2
if command -v open > /dev/null; then
  open http://localhost:8000
elif command -v xdg-open > /dev/null; then
  xdg-open http://localhost:8000
fi

trap "kill $FRONTEND_PID" EXIT

.venv/bin/python -m uvicorn backend.app.main:app --reload --port 8000