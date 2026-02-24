@echo off
echo Starting Forecast Management Backend...
cd backend
call ..\..\..\.venv\Scripts\activate
uvicorn main:app --reload --port 8000
