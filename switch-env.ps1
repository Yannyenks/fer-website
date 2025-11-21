# Script PowerShell pour switcher entre environnements
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('development', 'production')]
    [string]$Environment
)

$ErrorActionPreference = "Stop"

Write-Host "🔄 Switching to $Environment environment..." -ForegroundColor Cyan

# Chemins
$serverDir = Join-Path $PSScriptRoot "server"
$envFile = Join-Path $serverDir ".env"
$sourceFile = Join-Path $serverDir ".env.$Environment"

# Vérifier que le fichier source existe
if (-not (Test-Path $sourceFile)) {
    Write-Host "❌ Error: $sourceFile not found!" -ForegroundColor Red
    exit 1
}

# Backup de l'ancien .env si existe
if (Test-Path $envFile) {
    $backupFile = Join-Path $serverDir ".env.backup"
    Copy-Item $envFile $backupFile -Force
    Write-Host "📦 Backed up current .env to .env.backup" -ForegroundColor Yellow
}

# Copier le fichier d'environnement
Copy-Item $sourceFile $envFile -Force
Write-Host "✅ Copied .env.$Environment to .env" -ForegroundColor Green

# Définir la variable d'environnement APP_ENV
[System.Environment]::SetEnvironmentVariable('APP_ENV', $Environment, 'User')
Write-Host "✅ Set APP_ENV=$Environment" -ForegroundColor Green

# Afficher les configurations actuelles
Write-Host "`n📋 Current configuration:" -ForegroundColor Cyan
$envContent = Get-Content $envFile | Where-Object { $_ -match "^[^#]" -and $_ -match "=" }
foreach ($line in $envContent) {
    if ($line -match "(APP_ENV|DB_HOST|DB_NAME|APP_URL|API_URL)=") {
        Write-Host "  $line" -ForegroundColor White
    }
}

Write-Host "`n🎉 Environment switched to $Environment successfully!" -ForegroundColor Green
Write-Host "⚠️  Remember to restart your PHP server and frontend dev server!" -ForegroundColor Yellow
