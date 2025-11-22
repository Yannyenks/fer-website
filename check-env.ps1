# Script pour vérifier l'environnement actuel
$ErrorActionPreference = "Stop"

Write-Host "🔍 Checking Current Environment Configuration..." -ForegroundColor Cyan
Write-Host ""

# Chemins
$serverDir = Join-Path $PSScriptRoot "server"
$envFile = Join-Path $serverDir ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "❌ No .env file found in server directory!" -ForegroundColor Red
    Write-Host "💡 Run: .\switch-env.ps1 development" -ForegroundColor Yellow
    exit 1
}

# Lire le fichier .env
$envContent = Get-Content $envFile

Write-Host "📋 Current .env Configuration:" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Variables importantes à afficher
$importantVars = @('APP_ENV', 'APP_DEBUG', 'APP_URL', 'API_URL', 'DB_HOST', 'DB_NAME', 'DB_USER', 'FRONTEND_URL')

foreach ($var in $importantVars) {
    $line = $envContent | Where-Object { $_ -match "^$var=" } | Select-Object -First 1
    if ($line) {
        $color = "White"
        if ($var -eq 'APP_ENV') {
            $color = if ($line -match 'production') { "Red" } else { "Green" }
        }
        Write-Host "  $line" -ForegroundColor $color
    }
}

Write-Host ""

# Déterminer l'environnement
$appEnvLine = $envContent | Where-Object { $_ -match "^APP_ENV=" } | Select-Object -First 1
if ($appEnvLine -match "production") {
    Write-Host "🔴 Running in PRODUCTION mode" -ForegroundColor Red
    Write-Host "   - Using production database" -ForegroundColor Yellow
    Write-Host "   - Debug mode should be OFF" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 To switch to development:" -ForegroundColor Cyan
    Write-Host "   .\switch-env.ps1 development" -ForegroundColor White
} else {
    Write-Host "🟢 Running in DEVELOPMENT mode" -ForegroundColor Green
    Write-Host "   - Using local database" -ForegroundColor Yellow
    Write-Host "   - Debug mode should be ON" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 To switch to production:" -ForegroundColor Cyan
    Write-Host "   .\switch-env.ps1 production" -ForegroundColor White
}

Write-Host ""
Write-Host "🌍 Server Detection:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  OS: $([System.Environment]::OSVersion.Platform)" -ForegroundColor White
Write-Host "  Host: $env:COMPUTERNAME" -ForegroundColor White
if ($env:HTTP_HOST) {
    Write-Host "  HTTP Host: $env:HTTP_HOST" -ForegroundColor White
}

# Vérifier les marqueurs
$prodMarker = Join-Path $serverDir ".production-marker"
if (Test-Path $prodMarker) {
    Write-Host "  ⚠️  Production marker found!" -ForegroundColor Red
} else {
    Write-Host "  ✅ No production marker (good for dev)" -ForegroundColor Green
}
