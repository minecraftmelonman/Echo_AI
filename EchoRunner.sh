#!/usr/bin/env bash

# set pythonpath to backend, because it works that way
export PYTHONPATH=backend

pnpm --dir frontend dev &
FRONTEND_PID=$!

# handles linux + macos
sleep 2
if command -v open > /dev/null; then
  open http://localhost:8000
elif command -v xdg-open > /dev/null; then
  xdg-open http://localhost:8000
fi

trap "kill $FRONTEND_PID" EXIT

uv run uvicorn backend.app.main:app --reload --port 8000