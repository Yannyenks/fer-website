#!/usr/bin/env powershell

# Script to start both PHP backend and React frontend for development

Write-Host "🚀 Starting FER development environment..." -ForegroundColor Green

# Check if PHP is installed
if (!(Get-Command php -ErrorAction SilentlyContinue)) {
    Write-Host "❌ PHP is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PHP from https://www.php.net/downloads.php" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed  
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Set environment variables
$env:VITE_API_URL = "http://localhost:8000/api"

Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
npm install

# Start PHP backend in background
Write-Host "🐘 Starting PHP backend server on http://localhost:8000..." -ForegroundColor Blue
$phpJob = Start-Job -ScriptBlock {
    Set-Location $using:pwd
    php -S localhost:8000 -t server
}

# Wait a moment for PHP server to start
Start-Sleep -Seconds 2

# Check if PHP server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000" -TimeoutSec 5
    Write-Host "✅ PHP backend is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to start PHP backend" -ForegroundColor Red
    Stop-Job $phpJob
    Remove-Job $phpJob
    exit 1
}

Write-Host "⚡ Starting React frontend on http://localhost:5173..." -ForegroundColor Blue
Write-Host "🔗 Backend API: http://localhost:8000/api" -ForegroundColor Cyan
Write-Host "📚 API Documentation: http://localhost:8000/swagger" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow

# Start frontend (this will block)
try {
    npm run dev
} finally {
    # Cleanup: stop PHP server when frontend exits
    Write-Host "`n🛑 Stopping servers..." -ForegroundColor Yellow
    Stop-Job $phpJob -ErrorAction SilentlyContinue
    Remove-Job $phpJob -ErrorAction SilentlyContinue
    Write-Host "✅ Development environment stopped" -ForegroundColor Green
}