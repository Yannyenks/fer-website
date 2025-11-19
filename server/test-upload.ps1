# Script de test pour l'API Upload - FER Website
# PowerShell

# Configuration
$API_URL = "http://localhost/api"
$ADMIN_KEY = "votre_cle_admin_ici" # Remplacez par votre vraie clé

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Tests API Upload - FER Website" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Upload simple d'image
function Test-SimpleUpload {
    Write-Host "Test 1: Upload simple d'image" -ForegroundColor Yellow
    Write-Host "------------------------------" -ForegroundColor Yellow
    
    # Créez un fichier image de test ou utilisez un existant
    $imagePath = Read-Host "Chemin vers l'image à uploader"
    
    if (-not (Test-Path $imagePath)) {
        Write-Host "❌ Fichier introuvable: $imagePath" -ForegroundColor Red
        return
    }
    
    $uri = "$API_URL/upload"
    
    # Créer le form data
    $form = @{
        image = Get-Item -Path $imagePath
        prefix = "test"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $uri -Method Post `
            -Headers @{"X-ADMIN-KEY" = $ADMIN_KEY} `
            -Form $form
        
        Write-Host "✅ Upload réussi!" -ForegroundColor Green
        Write-Host "URL: $($response.url)" -ForegroundColor Green
        Write-Host "Filename: $($response.filename)" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 3
    }
    catch {
        Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host $_.Exception.Response
    }
    Write-Host ""
}

# Test 2: Créer un candidat avec photo
function Test-CreateCandidate {
    Write-Host "Test 2: Créer un candidat avec photo" -ForegroundColor Yellow
    Write-Host "-------------------------------------" -ForegroundColor Yellow
    
    $imagePath = Read-Host "Chemin vers la photo du candidat"
    
    if (-not (Test-Path $imagePath)) {
        Write-Host "❌ Fichier introuvable: $imagePath" -ForegroundColor Red
        return
    }
    
    $name = Read-Host "Nom du candidat"
    $bio = Read-Host "Bio du candidat (optionnel)"
    $categoryId = Read-Host "Catégorie ID (optionnel, appuyez sur Entrée pour ignorer)"
    
    $uri = "$API_URL/candidate"
    
    # Créer le form data
    $form = @{
        name = $name
        image = Get-Item -Path $imagePath
    }
    
    if ($bio) { $form['bio'] = $bio }
    if ($categoryId) { $form['category_id'] = $categoryId }
    
    try {
        $response = Invoke-RestMethod -Uri $uri -Method Post `
            -Headers @{"X-ADMIN-KEY" = $ADMIN_KEY} `
            -Form $form
        
        Write-Host "✅ Candidat créé avec succès!" -ForegroundColor Green
        Write-Host "ID: $($response.id)" -ForegroundColor Green
        Write-Host "Image URL: $($response.image_url)" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 3
    }
    catch {
        Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host $_.Exception.Response
    }
    Write-Host ""
}

# Test 3: Vérifier qu'une image est accessible
function Test-ImageAccess {
    Write-Host "Test 3: Vérifier l'accès à une image" -ForegroundColor Yellow
    Write-Host "-------------------------------------" -ForegroundColor Yellow
    
    $imageUrl = Read-Host "URL complète de l'image (ex: http://localhost/storage/test_xxx.jpg)"
    
    try {
        $response = Invoke-WebRequest -Uri $imageUrl -Method Get
        
        Write-Host "✅ Image accessible!" -ForegroundColor Green
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Green
        Write-Host "Taille: $($response.RawContentLength) bytes" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Menu
function Show-Menu {
    Write-Host "Choisissez un test:" -ForegroundColor Cyan
    Write-Host "1. Upload simple d'image"
    Write-Host "2. Créer un candidat avec photo"
    Write-Host "3. Vérifier l'accès à une image"
    Write-Host "4. Quitter"
    Write-Host ""
}

# Boucle principale
do {
    Show-Menu
    $choice = Read-Host "Votre choix (1-4)"
    Write-Host ""
    
    switch ($choice) {
        "1" { Test-SimpleUpload }
        "2" { Test-CreateCandidate }
        "3" { Test-ImageAccess }
        "4" { 
            Write-Host "Au revoir! 👋" -ForegroundColor Cyan
            break
        }
        default { 
            Write-Host "Choix invalide. Réessayez." -ForegroundColor Red
            Write-Host ""
        }
    }
} while ($choice -ne "4")
