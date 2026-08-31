#!/usr/bin/env bash

# Set directory to script root
cd "$(dirname "$0")"
export PYTHONPATH=backend

# Create virtual environment if missing
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

# Install/sync dependencies into .venv
.venv/bin/python -m pip install -r backend/requirements.txt

# Start pnpm dev in background
pnpm --dir frontend dev &
FRONTEND_PID=$!

# Open browser to Next.js frontend port (3000)
sleep 2
if command -v open > /dev/null; then
  open http://localhost:3000
elif command -v xdg-open > /dev/null; then
  xdg-open http://localhost:3000
fi

# Kill background pnpm process when script exits
trap "kill $FRONTEND_PID" EXIT

# Run Uvicorn directly on app.main
.venv/bin/python -m uvicorn app.main:app --reload --reload-dir backend --port 8000