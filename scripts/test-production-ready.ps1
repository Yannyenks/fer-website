#!/usr/bin/env powershell

# Script de test complet pour vérifier la readiness production
# Teste toutes les fonctionnalités critiques du système FER

Write-Host "🧪 Test complet FER - Vérification Production Ready" -ForegroundColor Green
Write-Host "=" * 60

$errors = @()
$warnings = @()
$tests_passed = 0
$tests_total = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{"Content-Type"="application/json"},
        [string]$Body = $null,
        [int]$ExpectedStatus = 200
    )
    
    $script:tests_total++
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "✅ $Name" -ForegroundColor Green
            $script:tests_passed++
            return $response
        } else {
            Write-Host "❌ $Name - Status: $($response.StatusCode)" -ForegroundColor Red
            $script:errors += "$Name - Unexpected status code: $($response.StatusCode)"
        }
    } catch {
        Write-Host "❌ $Name - Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:errors += "$Name - $($_.Exception.Message)"
    }
}

function Test-ServerRunning {
    param([string]$Url, [string]$Name)
    
    $script:tests_total++
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ $Name est en marche" -ForegroundColor Green
        $script:tests_passed++
        return $true
    } catch {
        Write-Host "❌ $Name n'est pas accessible" -ForegroundColor Red
        $script:errors += "$Name server not running"
        return $false
    }
}

# 1. Vérifier que les serveurs sont lancés
Write-Host "`n🔍 1. Vérification des serveurs..." -ForegroundColor Yellow

$backend_running = Test-ServerRunning "http://localhost:8000" "Backend PHP"
$frontend_running = Test-ServerRunning "http://localhost:3000" "Frontend React"

if (!$frontend_running) {
    $frontend_running = Test-ServerRunning "http://localhost:3001" "Frontend React (port 3001)"
}

if (!$backend_running -or !$frontend_running) {
    Write-Host "`n❌ Serveurs manquants. Lancement automatique..." -ForegroundColor Red
    
    if (!$backend_running) {
        Write-Host "Démarrage du backend PHP..." -ForegroundColor Blue
        Start-Job -ScriptBlock { Set-Location $using:pwd; cd server; php -S localhost:8000 } -Name "PHPServer"
        Start-Sleep 3
    }
    
    if (!$frontend_running) {
        Write-Host "Démarrage du frontend React..." -ForegroundColor Blue
        Start-Job -ScriptBlock { Set-Location $using:pwd; npm run dev } -Name "ReactServer"
        Start-Sleep 5
    }
}

# 2. Tests API Backend
Write-Host "`n🔍 2. Tests API Backend..." -ForegroundColor Yellow

Test-Endpoint "API Health Check" "http://localhost:8000"
Test-Endpoint "Swagger Documentation" "http://localhost:8000/swagger"
Test-Endpoint "Liste des candidats" "http://localhost:8000/api/candidates"
Test-Endpoint "Liste des catégories" "http://localhost:8000/api/categories"
Test-Endpoint "Liste des événements" "http://localhost:8000/api/events"

# 3. Test Authentification Admin
Write-Host "`n🔍 3. Tests Authentification..." -ForegroundColor Yellow

$admin_body = @{
    username = "testuser"
    password = "testpass123"
} | ConvertTo-Json

$register_response = Test-Endpoint "Création compte admin" "http://localhost:8000/api/admin/register" "POST" @{"Content-Type"="application/json"} $admin_body 200

if ($register_response) {
    $admin_data = $register_response.Content | ConvertFrom-Json
    if ($admin_data.api_key) {
        $api_key = $admin_data.api_key
        Write-Host "   API Key reçue: $($api_key.Substring(0,10))..." -ForegroundColor Cyan
        
        # Test login
        $login_response = Test-Endpoint "Connexion admin" "http://localhost:8000/api/admin/login" "POST" @{"Content-Type"="application/json"} $admin_body 200
        
        # Test endpoint protégé
        $candidate_body = @{
            name = "Candidat Test"
            bio = "Candidat de test pour vérification"
            category_id = 1
        } | ConvertTo-Json
        
        Test-Endpoint "Création candidat (admin)" "http://localhost:8000/api/candidate" "POST" @{"Content-Type"="application/json"; "X-ADMIN-KEY"=$api_key} $candidate_body 200
    }
}

# 4. Test Vote Public
Write-Host "`n🔍 4. Tests Vote Public..." -ForegroundColor Yellow

$vote_body = @{
    candidate_id = 1
} | ConvertTo-Json

Test-Endpoint "Vote pour candidat" "http://localhost:8000/api/vote" "POST" @{"Content-Type"="application/json"} $vote_body 200

# Test vote duplicate (devrait échouer)
$duplicate_vote = Test-Endpoint "Vote duplicate (doit échouer)" "http://localhost:8000/api/vote" "POST" @{"Content-Type"="application/json"} $vote_body 409

# 5. Test Frontend
Write-Host "`n🔍 5. Tests Frontend..." -ForegroundColor Yellow

$frontend_url = if (Test-ServerRunning "http://localhost:3000" "Check Port 3000") { "http://localhost:3000" } else { "http://localhost:3001" }

Test-Endpoint "Page d'accueil" $frontend_url
Test-Endpoint "Assets statiques" "$frontend_url/assets/manifest.json"

# 6. Test Build Production
Write-Host "`n🔍 6. Test Build Production..." -ForegroundColor Yellow

$script:tests_total++
try {
    Write-Host "Building production..." -ForegroundColor Blue
    $build_result = & npm run build 2>&1
    
    if (Test-Path "dist/index.html") {
        Write-Host "✅ Build production réussi" -ForegroundColor Green
        $script:tests_passed++
        
        # Taille du build
        $build_size = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1KB
        Write-Host "   Taille: $([math]::Round($build_size, 1)) KB" -ForegroundColor Cyan
        
        # Test des fichiers critiques
        $critical_files = @("dist/index.html", "dist/assets")
        foreach ($file in $critical_files) {
            if (Test-Path $file) {
                Write-Host "   ✓ $file existe" -ForegroundColor Gray
            } else {
                $script:warnings += "Fichier manquant: $file"
            }
        }
    } else {
        Write-Host "❌ Build production échoué" -ForegroundColor Red
        $script:errors += "Production build failed"
    }
} catch {
    Write-Host "❌ Erreur lors du build: $($_.Exception.Message)" -ForegroundColor Red
    $script:errors += "Build error: $($_.Exception.Message)"
}

# 7. Test Configuration de Production
Write-Host "`n🔍 7. Vérification Configuration Production..." -ForegroundColor Yellow

$script:tests_total++
if (Test-Path "server/.env") {
    Write-Host "✅ Fichier .env existe" -ForegroundColor Green
    $script:tests_passed++
} else {
    Write-Host "❌ Fichier .env manquant" -ForegroundColor Red
    $script:errors += "Missing server/.env file"
}

$script:tests_total++
if (Test-Path "DEPLOY.md") {
    Write-Host "✅ Documentation déploiement disponible" -ForegroundColor Green
    $script:tests_passed++
} else {
    $script:warnings += "Documentation déploiement manquante"
}

# Résultats finaux
Write-Host "`n" + "=" * 60 -ForegroundColor Gray
Write-Host "📊 RÉSULTATS DES TESTS" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Gray

$success_rate = [math]::Round(($tests_passed / $tests_total) * 100, 1)

Write-Host "Tests réussis: $tests_passed / $tests_total ($success_rate%)" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "`n🎉 PARFAIT ! Prêt pour la production !" -ForegroundColor Green
    Write-Host "✅ Tous les tests sont passés" -ForegroundColor Green
    Write-Host "✅ Aucune erreur critique détectée" -ForegroundColor Green
    Write-Host "`n➡️  Tu peux déployer en toute sécurité !" -ForegroundColor White
} elseif ($errors.Count -eq 0) {
    Write-Host "`n⚠️  Prêt avec avertissements" -ForegroundColor Yellow
    Write-Host "✅ Aucune erreur critique" -ForegroundColor Green
    Write-Host "⚠️  $($warnings.Count) avertissement(s):" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   • $warning" -ForegroundColor Yellow
    }
    Write-Host "`n➡️  Déploiement possible, améliorer les points ci-dessus" -ForegroundColor White
} else {
    Write-Host "`n❌ ERREURS CRITIQUES DÉTECTÉES" -ForegroundColor Red
    Write-Host "❌ $($errors.Count) erreur(s) à corriger:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "   • $error" -ForegroundColor Red
    }
    if ($warnings.Count -gt 0) {
        Write-Host "⚠️  $($warnings.Count) avertissement(s):" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "   • $warning" -ForegroundColor Yellow
        }
    }
    Write-Host "`n❌ NE PAS DÉPLOYER - Corriger les erreurs d'abord" -ForegroundColor Red
}

Write-Host "`n📋 PROCHAINES ÉTAPES:" -ForegroundColor Cyan
if ($success_rate -eq 100) {
    Write-Host "1. Choisir un hébergeur (OVH, Hostinger, etc.)" -ForegroundColor White
    Write-Host "2. Uploader dist/ et server/ " -ForegroundColor White
    Write-Host "3. Configurer la base de données" -ForegroundColor White
    Write-Host "4. Exécuter php init-db.php" -ForegroundColor White
    Write-Host "5. Tester sur le domaine de production" -ForegroundColor White
} else {
    Write-Host "1. Corriger les erreurs listées ci-dessus" -ForegroundColor White
    Write-Host "2. Relancer ce script de test" -ForegroundColor White
    Write-Host "3. Déployer quand tous les tests passent" -ForegroundColor White
}

Write-Host "`n📚 Aide: Voir DEPLOY.md pour les instructions détaillées" -ForegroundColor Gray

# Nettoyage des jobs
Get-Job | Where-Object { $_.Name -in @("PHPServer", "ReactServer") } | Stop-Job -ErrorAction SilentlyContinue
Get-Job | Where-Object { $_.Name -in @("PHPServer", "ReactServer") } | Remove-Job -ErrorAction SilentlyContinue