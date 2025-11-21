#!/bin/bash
# Script d'initialisation automatique pour serveur de production LWS
# Ce script détecte automatiquement l'environnement et configure le projet

set -e

echo "🚀 Initialisation du serveur JVEPI..."

# Détection de l'environnement
if [ -f "/etc/lsb-release" ] || [ -f "/usr/local/lsws" ] || [ -d "/home" ]; then
    ENV="production"
    echo "✅ Environnement de production détecté (LWS)"
else
    ENV="development"
    echo "✅ Environnement de développement détecté"
fi

# Répertoires
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVER_DIR="$SCRIPT_DIR/server"

# 1. Configuration de l'environnement
echo "📝 Configuration de l'environnement: $ENV"
if [ "$ENV" = "production" ]; then
    cp "$SERVER_DIR/.env.production" "$SERVER_DIR/.env"
    export APP_ENV=production
    echo "export APP_ENV=production" >> ~/.bashrc
else
    cp "$SERVER_DIR/.env.development" "$SERVER_DIR/.env"
    export APP_ENV=development
fi

# 2. Vérification de PHP
if ! command -v php &> /dev/null; then
    echo "❌ PHP n'est pas installé"
    exit 1
fi

PHP_VERSION=$(php -r "echo PHP_VERSION;")
echo "✅ PHP version: $PHP_VERSION"

# 3. Vérification et initialisation de la base de données
echo "🗄️  Initialisation de la base de données..."

# Charger les variables d'environnement
source "$SERVER_DIR/.env" 2>/dev/null || true

# Test de connexion à la base de données
php -r "
require_once '$SERVER_DIR/db.php';
try {
    \$pdo = db_connect();
    echo '✅ Connexion à la base de données réussie' . PHP_EOL;
} catch (Exception \$e) {
    echo '❌ Erreur de connexion: ' . \$e->getMessage() . PHP_EOL;
    exit(1);
}
"

# 4. Exécution du schéma si nécessaire
echo "📊 Vérification du schéma de base de données..."
php -r "
require_once '$SERVER_DIR/db.php';
try {
    \$pdo = db_connect();
    // Vérifier si la table candidates existe
    \$result = \$pdo->query(\"SHOW TABLES LIKE 'candidates'\");
    if (\$result->rowCount() === 0) {
        echo '⚙️  Création du schéma de base de données...' . PHP_EOL;
        \$schema = file_get_contents('$SERVER_DIR/schema.sql');
        \$pdo->exec(\$schema);
        echo '✅ Schéma créé avec succès' . PHP_EOL;
    } else {
        echo '✅ Schéma déjà existant' . PHP_EOL;
    }
} catch (Exception \$e) {
    echo '❌ Erreur lors de la création du schéma: ' . \$e->getMessage() . PHP_EOL;
    exit(1);
}
"

# 5. Vérification du dossier storage
if [ ! -d "$SCRIPT_DIR/storage" ]; then
    echo "📁 Création du dossier storage..."
    mkdir -p "$SCRIPT_DIR/storage"
    chmod 755 "$SCRIPT_DIR/storage"
fi

# 6. Configuration des permissions
echo "🔐 Configuration des permissions..."
chmod 644 "$SERVER_DIR/.env"
chmod 755 "$SCRIPT_DIR/storage"

# 7. Instructions finales
echo ""
echo "✨ Initialisation terminée avec succès!"
echo ""
echo "📋 Configuration actuelle:"
echo "   - Environnement: $ENV"
echo "   - PHP: $PHP_VERSION"
echo "   - Base de données: Connectée"
echo "   - Storage: Configuré"
echo ""

if [ "$ENV" = "production" ]; then
    echo "🔒 IMPORTANT - Sécurité Production:"
    echo "   1. Changez APP_SECRET dans server/.env"
    echo "   2. Changez ADMIN_USER et ADMIN_PASS dans server/.env"
    echo "   3. Vérifiez que APP_DEBUG=false"
    echo ""
    echo "🌐 Votre site est prêt à être servi par le serveur web LWS"
    echo "   - Pointez le DocumentRoot vers: $SCRIPT_DIR/dist"
    echo "   - API disponible via: /api/*"
else
    echo "🛠️  Pour démarrer en développement:"
    echo "   Backend:  php -S localhost:8000 -t server server/index.php"
    echo "   Frontend: npm run dev"
fi

echo ""
