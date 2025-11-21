#!/bin/bash
# Script bash pour switcher entre environnements (Linux/Mac)

set -e

if [ $# -eq 0 ]; then
    echo "Usage: ./switch-env.sh [development|production]"
    exit 1
fi

ENVIRONMENT=$1

if [[ "$ENVIRONMENT" != "development" && "$ENVIRONMENT" != "production" ]]; then
    echo "❌ Error: Environment must be 'development' or 'production'"
    exit 1
fi

echo "🔄 Switching to $ENVIRONMENT environment..."

# Chemins
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVER_DIR="$SCRIPT_DIR/server"
ENV_FILE="$SERVER_DIR/.env"
SOURCE_FILE="$SERVER_DIR/.env.$ENVIRONMENT"

# Vérifier que le fichier source existe
if [ ! -f "$SOURCE_FILE" ]; then
    echo "❌ Error: $SOURCE_FILE not found!"
    exit 1
fi

# Backup de l'ancien .env si existe
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$SERVER_DIR/.env.backup"
    echo "📦 Backed up current .env to .env.backup"
fi

# Copier le fichier d'environnement
cp "$SOURCE_FILE" "$ENV_FILE"
echo "✅ Copied .env.$ENVIRONMENT to .env"

# Définir la variable d'environnement APP_ENV
export APP_ENV=$ENVIRONMENT
echo "✅ Set APP_ENV=$ENVIRONMENT"

# Afficher les configurations actuelles
echo ""
echo "📋 Current configuration:"
grep -E "^(APP_ENV|DB_HOST|DB_NAME|APP_URL|API_URL)=" "$ENV_FILE" || true

echo ""
echo "🎉 Environment switched to $ENVIRONMENT successfully!"
echo "⚠️  Remember to restart your PHP server and frontend dev server!"
echo "   To persist APP_ENV, add 'export APP_ENV=$ENVIRONMENT' to your ~/.bashrc or ~/.zshrc"
