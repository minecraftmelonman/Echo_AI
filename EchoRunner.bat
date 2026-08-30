@echo off

title Echo AI

:: set pythonpath to backend, because it works that way
set PYTHONPATH=backend

start http://localhost:8000

call uv run uvicorn backend.app.main:app --reload --port 8000