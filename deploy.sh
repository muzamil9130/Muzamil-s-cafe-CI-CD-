#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Cafe Muzamil Easiest Deployment Script ==="

# 1. Pull latest code from main branch
echo "Pulling latest changes from git..."
git pull origin main || echo "Git pull skipped (no git remote configured or offline)."

# 2. Install dependencies
echo "Installing dependencies..."
npm install

# 3. Compile frontend static assets (Vite React)
echo "Building production frontend assets..."
npm run build

# 4. Start/Reload Unified Express Server
# For production systems, using PM2 is highly recommended:
# To install: npm install -g pm2
if command -v pm2 &> /dev/null
then
    echo "Restarting Express server using PM2..."
    NODE_ENV=production pm2 restart server.ts --name cafe-muzamil || NODE_ENV=production pm2 start server.ts --name cafe-muzamil
else
    echo "PM2 not found. Starting server directly with Node/tsx..."
    NODE_ENV=production npx tsx server.ts
fi

echo "=== Deployment Completed Successfully! ==="
