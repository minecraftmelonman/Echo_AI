:: IM SORRY FOR USING AI, ITS JUST DRIVING ME CRAZY

@echo off
title Echo AI

set PYTHONPATH=backend

:: Create local .venv if missing
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

:: Sync dependencies into .venv
call .venv\Scripts\python.exe -m pip install -r backend\requirements.txt

:: Launch pnpm dev in a NEW separate terminal window
start "Echo AI - Frontend" cmd /k "cd frontend && pnpm dev"

:: Open browser
start http://localhost:3000

:: Run uvicorn in the CURRENT terminal window
call .venv\Scripts\python.exe -m uvicorn app.main:app --reload --reload-dir backend --port 8000