#!/usr/bin/env powershell

# Script rapide pour créer le premier administrateur
# Usage: .\create-admin.ps1

Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🔐 CRÉATION DU SUPER-ADMINISTRATEUR FER            ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Vérifier si PHP est installé
if (!(Get-Command php -ErrorAction SilentlyContinue)) {
    Write-Host "❌ PHP n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host "Veuillez installer PHP depuis https://www.php.net/downloads.php" -ForegroundColor Yellow
    exit 1
}

# Vérifier si le fichier existe
$scriptPath = "server\create-first-admin.php"
if (!(Test-Path $scriptPath)) {
    Write-Host "❌ Fichier introuvable : $scriptPath" -ForegroundColor Red
    Write-Host "Assurez-vous d'être dans le répertoire racine du projet" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Vérification des administrateurs existants..." -ForegroundColor Blue
Write-Host ""

# Vérifier les admins existants
$checkScript = "server\check-admins.php"
if (Test-Path $checkScript) {
    php $checkScript
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

# Proposer de continuer
Write-Host "🚀 Voulez-vous créer un nouvel administrateur ? (O/N) : " -NoNewline -ForegroundColor Yellow
$response = Read-Host

if ($response -notmatch '^[oO]$') {
    Write-Host "❌ Opération annulée" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "📝 Création en cours..." -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

# Exécuter le script de création
php $scriptPath

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "✅ SUCCÈS ! Administrateur créé avec succès" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 Prochaines étapes :" -ForegroundColor Cyan
    Write-Host "   1. Démarrez les serveurs :" -ForegroundColor White
    Write-Host "      • Backend  : cd server; php -S localhost:8000" -ForegroundColor DarkGray
    Write-Host "      • Frontend : npm run dev" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "   2. Connectez-vous :" -ForegroundColor White
    Write-Host "      • URL : http://localhost:3001/login" -ForegroundColor DarkGray
    Write-Host "      • Cochez 'Mode admin'" -ForegroundColor DarkGray
    Write-Host "      • Utilisez les identifiants créés" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "   3. Gérez votre plateforme :" -ForegroundColor White
    Write-Host "      • /admin/candidates   → Gestion des candidats" -ForegroundColor DarkGray
    Write-Host "      • /admin/votes        → Statistiques de vote" -ForegroundColor DarkGray
    Write-Host "      • /admin/invitations  → Créer des admins" -ForegroundColor DarkGray
    Write-Host ""
    
    # Proposer de démarrer les serveurs
    Write-Host "🚀 Voulez-vous démarrer les serveurs maintenant ? (O/N) : " -NoNewline -ForegroundColor Yellow
    $startServers = Read-Host
    
    if ($startServers -match '^[oO]$') {
        Write-Host ""
        Write-Host "📦 Démarrage du serveur backend..." -ForegroundColor Blue
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; php -S localhost:8000"
        Start-Sleep -Seconds 2
        
        Write-Host "⚡ Démarrage du serveur frontend..." -ForegroundColor Blue
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
        
        Write-Host ""
        Write-Host "✅ Serveurs démarrés !" -ForegroundColor Green
        Write-Host "   Backend  : http://localhost:8000" -ForegroundColor Cyan
        Write-Host "   Frontend : http://localhost:3001 (ou 3000)" -ForegroundColor Cyan
    }
    
} else {
    Write-Host ""
    Write-Host "❌ Une erreur s'est produite lors de la création" -ForegroundColor Red
    Write-Host "Consultez le guide complet : SUPER_ADMIN_GUIDE.md" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📚 Besoin d'aide ? Consultez :" -ForegroundColor Cyan
Write-Host "   • SUPER_ADMIN_GUIDE.md - Guide complet" -ForegroundColor White
Write-Host "   • ADMIN_LOGIN.md - Guide de connexion" -ForegroundColor White
Write-Host "   • README.md - Documentation générale" -ForegroundColor White
Write-Host ""
