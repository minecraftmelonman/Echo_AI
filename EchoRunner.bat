:: IM SORRY FOR USING AI, ITS JUST DRIVING ME CRAZY

@echo off
title Echo AI

set PYTHONPATH=backend

:: Create local .venv if missing
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

:: Sync all requirements into .venv
call .venv\Scripts\python.exe -m pip install -r backend\requirements.txt

start http://localhost:8000

:: Run uvicorn using .venv's Python executable
call .venv\Scripts\python.exe -m uvicorn app.main:app --reload --reload-dir backend --port 8000