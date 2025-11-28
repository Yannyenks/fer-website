#!/usr/bin/env powershell

# Script pour appliquer la migration de la colonne 'type' aux candidats

Write-Host "🔄 Application de la migration pour ajouter le champ 'type' aux candidats..." -ForegroundColor Blue

$migrationFile = "add-candidate-type.sql"

if (!(Test-Path $migrationFile)) {
    Write-Host "❌ Fichier de migration introuvable : $migrationFile" -ForegroundColor Red
    exit 1
}

# Lire la configuration de la base de données depuis db.php
$dbConfigFile = "db.php"
if (!(Test-Path $dbConfigFile)) {
    Write-Host "❌ Fichier db.php introuvable" -ForegroundColor Red
    exit 1
}

Write-Host "📖 Lecture de la configuration de la base de données..." -ForegroundColor Cyan

# Exécuter la migration via PHP
$phpScript = @"
<?php
require_once 'db.php';

try {
    `$pdo = get_db();
    `$sql = file_get_contents('$migrationFile');
    
    // Séparer les requêtes
    `$statements = array_filter(
        array_map('trim', explode(';', `$sql)),
        function(`$stmt) { 
            return !empty(`$stmt) && !preg_match('/^--/', `$stmt); 
        }
    );
    
    foreach (`$statements as `$statement) {
        if (empty(`$statement)) continue;
        `$pdo->exec(`$statement);
        echo "✅ Requête exécutée avec succès\n";
    }
    
    echo "\n✅ Migration appliquée avec succès !\n";
    
    // Vérifier la structure de la table
    `$stmt = `$pdo->query("DESCRIBE candidates");
    `$columns = `$stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\n📋 Structure de la table 'candidates' :\n";
    foreach (`$columns as `$column) {
        echo "  - {`$column['Field']} ({`$column['Type']})\n";
    }
    
} catch (PDOException `$e) {
    echo "❌ Erreur lors de la migration : " . `$e->getMessage() . "\n";
    exit(1);
}
"@

# Créer un fichier temporaire pour le script PHP
$tempFile = "temp_migration_" + (Get-Date -Format "yyyyMMddHHmmss") + ".php"
Set-Content -Path $tempFile -Value $phpScript

try {
    Write-Host "🐘 Exécution de la migration..." -ForegroundColor Blue
    php $tempFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Migration terminée avec succès !" -ForegroundColor Green
        Write-Host "Le champ 'type' (miss/awards) a été ajouté à la table candidates." -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Erreur lors de la migration" -ForegroundColor Red
        exit 1
    }
} finally {
    # Nettoyer le fichier temporaire
    if (Test-Path $tempFile) {
        Remove-Item $tempFile
    }
}

Write-Host "`n📝 Vous pouvez maintenant gérer les candidats Miss et Awards séparément !" -ForegroundColor Green
