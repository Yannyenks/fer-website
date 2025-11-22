# Script de Vérification Post-Déploiement
# Vérifie que tout fonctionne correctement après upload sur LWS

param(
    [Parameter(Mandatory=$false)]
    [string]$Domain = "https://jvepi.com"
)

Write-Host "🔍 Vérification du déploiement pour: $Domain" -ForegroundColor Cyan
Write-Host ""

$tests = @()

# Test 1: Frontend accessible
Write-Host "1. Test du Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $Domain -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200 -and $response.Content -match "JVEPI") {
        Write-Host "   ✅ Frontend accessible" -ForegroundColor Green
        $tests += @{Name="Frontend"; Status="OK"}
    } else {
        Write-Host "   ⚠️  Frontend accessible mais contenu inattendu" -ForegroundColor Yellow
        $tests += @{Name="Frontend"; Status="WARNING"}
    }
} catch {
    Write-Host "   ❌ Frontend inaccessible: $($_.Exception.Message)" -ForegroundColor Red
    $tests += @{Name="Frontend"; Status="FAIL"}
}

# Test 2: API accessible
Write-Host "2. Test de l'API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$Domain/api/candidates" -Method GET -TimeoutSec 10
    $data = $response.Content | ConvertFrom-Json
    if ($data) {
        Write-Host "   ✅ API fonctionne ($($data.Count) candidats)" -ForegroundColor Green
        $tests += @{Name="API"; Status="OK"}
    } else {
        Write-Host "   ⚠️  API répond mais données vides" -ForegroundColor Yellow
        $tests += @{Name="API"; Status="WARNING"}
    }
} catch {
    Write-Host "   ❌ API inaccessible: $($_.Exception.Message)" -ForegroundColor Red
    $tests += @{Name="API"; Status="FAIL"}
}

# Test 3: Swagger accessible
Write-Host "3. Test de Swagger..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$Domain/swagger" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200 -and $response.Content -match "swagger") {
        Write-Host "   ✅ Swagger accessible" -ForegroundColor Green
        $tests += @{Name="Swagger"; Status="OK"}
    } else {
        Write-Host "   ⚠️  Swagger accessible mais contenu inattendu" -ForegroundColor Yellow
        $tests += @{Name="Swagger"; Status="WARNING"}
    }
} catch {
    Write-Host "   ❌ Swagger inaccessible: $($_.Exception.Message)" -ForegroundColor Red
    $tests += @{Name="Swagger"; Status="FAIL"}
}

# Test 4: Routes SPA (client-side routing)
Write-Host "4. Test du routing SPA..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$Domain/concours/candidates" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200 -and $response.Content -match "JVEPI") {
        Write-Host "   ✅ Routing SPA fonctionne" -ForegroundColor Green
        $tests += @{Name="SPA Routing"; Status="OK"}
    } else {
        Write-Host "   ⚠️  Route accessible mais contenu inattendu" -ForegroundColor Yellow
        $tests += @{Name="SPA Routing"; Status="WARNING"}
    }
} catch {
    Write-Host "   ❌ Routing SPA ne fonctionne pas: $($_.Exception.Message)" -ForegroundColor Red
    $tests += @{Name="SPA Routing"; Status="FAIL"}
}

# Test 5: CORS headers
Write-Host "5. Test des headers CORS..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$Domain/api/candidates" -Method OPTIONS -TimeoutSec 10
    $corsHeader = $response.Headers['Access-Control-Allow-Origin']
    if ($corsHeader) {
        Write-Host "   ✅ CORS configuré: $corsHeader" -ForegroundColor Green
        $tests += @{Name="CORS"; Status="OK"}
    } else {
        Write-Host "   ⚠️  CORS header manquant" -ForegroundColor Yellow
        $tests += @{Name="CORS"; Status="WARNING"}
    }
} catch {
    Write-Host "   ⚠️  Impossible de tester CORS: $($_.Exception.Message)" -ForegroundColor Yellow
    $tests += @{Name="CORS"; Status="WARNING"}
}

# Résumé
Write-Host ""
Write-Host "📊 Résumé des Tests" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
$okCount = ($tests | Where-Object { $_.Status -eq "OK" }).Count
$warnCount = ($tests | Where-Object { $_.Status -eq "WARNING" }).Count
$failCount = ($tests | Where-Object { $_.Status -eq "FAIL" }).Count

Write-Host "✅ Réussis: $okCount" -ForegroundColor Green
Write-Host "⚠️  Warnings: $warnCount" -ForegroundColor Yellow
Write-Host "❌ Échecs: $failCount" -ForegroundColor Red

Write-Host ""
if ($failCount -eq 0 -and $warnCount -eq 0) {
    Write-Host "🎉 Tous les tests sont passés! Le site est opérationnel." -ForegroundColor Green
} elseif ($failCount -eq 0) {
    Write-Host "✅ Déploiement réussi avec quelques warnings mineurs." -ForegroundColor Yellow
} else {
    Write-Host "❌ Des problèmes ont été détectés. Consultez les logs ci-dessus." -ForegroundColor Red
}

Write-Host ""
Write-Host "🔗 URLs à tester manuellement:" -ForegroundColor Cyan
Write-Host "   - Frontend: $Domain" -ForegroundColor White
Write-Host "   - Candidats: $Domain/concours/candidates" -ForegroundColor White
Write-Host "   - API: $Domain/api/candidates" -ForegroundColor White
Write-Host "   - Swagger: $Domain/swagger" -ForegroundColor White
