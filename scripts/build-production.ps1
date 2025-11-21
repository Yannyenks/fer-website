#!/usr/bin/env powershell

# Production Build Script for FER Website

Write-Host "Building FER Website for Production..." -ForegroundColor Green

# Check if npm is installed
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Blue
npm install

# Set production environment
$env:NODE_ENV = "production"

# Build the project
Write-Host "Building frontend..." -ForegroundColor Blue
npm run build

# Check if build was successful
if (Test-Path "dist") {
    Write-Host "Frontend build successful!" -ForegroundColor Green
    
    # Display build info
    $buildSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "Build size: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Cyan
    
    Write-Host "`nBuild contents:" -ForegroundColor Yellow
    Get-ChildItem "dist" -Name | ForEach-Object { Write-Host "   $_" }
    
    Write-Host "`nDeployment Instructions:" -ForegroundColor Green
    Write-Host "1. Upload the 'dist/' folder contents to your web server" -ForegroundColor White
    Write-Host "2. Upload the 'server/' folder to your PHP hosting" -ForegroundColor White
    Write-Host "3. Configure server/.env with your database credentials" -ForegroundColor White
    Write-Host "4. Run 'php server/init-db.php' once to setup the database" -ForegroundColor White
    Write-Host "5. Test your deployment with 'php server/check-production.php'" -ForegroundColor White
    
    Write-Host "`nDocumentation:" -ForegroundColor Cyan
    Write-Host "   See DEPLOY.md for detailed deployment instructions" -ForegroundColor White
    
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nProduction build complete!" -ForegroundColor Green