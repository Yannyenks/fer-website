# Test complet du système d'authentification JVEPI Centre
# Version PowerShell - Windows

Write-Host "🔐 Test Système d'Authentification JVEPI Centre" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

$API_BASE = "http://localhost:8000/api"

# Fonction pour faire des requêtes HTTP
function Invoke-APIRequest {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [hashtable]$Body = @{},
        [hashtable]$Headers = @{}
    )
    
    try {
        $uri = "$API_BASE$Endpoint"
        $params = @{
            Uri = $uri
            Method = $Method
            Headers = $Headers
        }
        
        if ($Method -ne "GET" -and $Body.Count -gt 0) {
            $params.Body = ($Body | ConvertTo-Json)
            $params.ContentType = "application/json"
        }
        
        Write-Host "📡 $Method $uri" -ForegroundColor Yellow
        
        $response = Invoke-RestMethod @params
        Write-Host "✅ Succès: $($response | ConvertTo-Json -Compress)" -ForegroundColor Green
        return $response
    } catch {
        Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "   Code: $statusCode" -ForegroundColor Red
        }
        return $null
    }
}

# Test 1: Inscription utilisateur
Write-Host "🧪 Test 1: Inscription Utilisateur" -ForegroundColor Magenta
$userReg = Invoke-APIRequest -Endpoint "/user/register" -Method "POST" -Body @{
    username = "test_user_$(Get-Date -Format 'HHmmss')"
    email = "test@example.com"
    password = "test123"
}

Start-Sleep 1

# Test 2: Inscription admin
Write-Host ""
Write-Host "🧪 Test 2: Inscription Administrateur" -ForegroundColor Magenta
$adminReg = Invoke-APIRequest -Endpoint "/admin/register" -Method "POST" -Body @{
    username = "test_admin_$(Get-Date -Format 'HHmmss')"
    email = "admin@example.com"
    password = "admin123"
}

Start-Sleep 1

# Test 3: Connexion utilisateur
Write-Host ""
Write-Host "🧪 Test 3: Connexion Utilisateur" -ForegroundColor Magenta
$userLogin = Invoke-APIRequest -Endpoint "/user/login" -Method "POST" -Body @{
    username = "test_user"
    password = "test123"
}

Start-Sleep 1

# Test 4: Connexion admin
Write-Host ""
Write-Host "🧪 Test 4: Connexion Administrateur" -ForegroundColor Magenta
$adminLogin = Invoke-APIRequest -Endpoint "/admin/login" -Method "POST" -Body @{
    username = "admin"
    password = "admin123"
}

Start-Sleep 1

# Test 5: Inscription FER participant
Write-Host ""
Write-Host "🧪 Test 5: Inscription FER Participant" -ForegroundColor Magenta
$ferParticipant = Invoke-APIRequest -Endpoint "/fer/register" -Method "POST" -Body @{
    name = "Jean Participant"
    email = "jean@example.com"
    type = "participant"
}

Start-Sleep 1

# Test 6: Inscription FER candidat
Write-Host ""
Write-Host "🧪 Test 6: Inscription FER Candidat" -ForegroundColor Magenta
$ferCandidate = Invoke-APIRequest -Endpoint "/fer/register" -Method "POST" -Body @{
    name = "Marie Candidate"
    email = "marie@example.com"
    type = "candidate"
    category = "miss"
}

Start-Sleep 1

# Test 7: Accès admin aux candidats (si admin connecté)
if ($adminLogin -and $adminLogin.api_key) {
    Write-Host ""
    Write-Host "🧪 Test 7: Accès Admin Candidats" -ForegroundColor Magenta
    $candidates = Invoke-APIRequest -Endpoint "/admin/candidates" -Headers @{
        "X-ADMIN-KEY" = $adminLogin.api_key
    }
}

# Résumé
Write-Host ""
Write-Host "📊 RÉSUMÉ DES TESTS" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

$tests = @(
    @{Name="Inscription Utilisateur"; Result=$userReg},
    @{Name="Inscription Admin"; Result=$adminReg},
    @{Name="Connexion Utilisateur"; Result=$userLogin},
    @{Name="Connexion Admin"; Result=$adminLogin},
    @{Name="Inscription FER Participant"; Result=$ferParticipant},
    @{Name="Inscription FER Candidat"; Result=$ferCandidate}
)

if ($adminLogin -and $adminLogin.api_key) {
    $tests += @{Name="Accès Admin Candidats"; Result=$candidates}
}

foreach ($test in $tests) {
    $status = if ($test.Result) { "✅ SUCCÈS" } else { "❌ ÉCHEC" }
    $color = if ($test.Result) { "Green" } else { "Red" }
    Write-Host "$($test.Name): $status" -ForegroundColor $color
}

Write-Host ""
Write-Host "🌐 Ouvrez test-auth-system.html dans votre navigateur pour les tests interactifs" -ForegroundColor Yellow
Write-Host "🖥️  Interface React disponible sur http://localhost:5173" -ForegroundColor Yellow