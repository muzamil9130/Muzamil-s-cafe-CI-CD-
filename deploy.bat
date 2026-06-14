@echo off
echo === Cafe Muzamil Windows Deployment Script ===

:: 1. Pull latest code
echo Pulling latest changes from git...
git pull origin main || echo Git pull skipped (remote branch not found or offline).

:: 2. Install dependencies
echo Installing dependencies...
call npm install

:: 3. Build frontend static assets
echo Building production frontend assets...
call npm run build

:: 4. Start production server
echo Starting Unified Express Server on port 5000 in production mode...
set NODE_ENV=production
npx tsx server.ts
