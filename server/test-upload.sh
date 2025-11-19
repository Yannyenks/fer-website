# Tests API Upload - FER Website
# Exemples de commandes curl

# Variables
API_URL="http://localhost/api"
ADMIN_KEY="votre_cle_admin_ici"

echo "=================================="
echo "Tests API Upload - FER Website"
echo "=================================="
echo ""

## Test 1: Upload simple d'image
echo "Test 1: Upload simple d'image"
echo "------------------------------"
curl -X POST "$API_URL/upload" \
  -H "X-ADMIN-KEY: $ADMIN_KEY" \
  -F "image=@/chemin/vers/image.jpg" \
  -F "prefix=test"

echo ""
echo ""

## Test 2: Créer un candidat avec photo
echo "Test 2: Créer un candidat avec photo"
echo "-------------------------------------"
curl -X POST "$API_URL/candidate" \
  -H "X-ADMIN-KEY: $ADMIN_KEY" \
  -F "name=Jean Dupont" \
  -F "bio=Candidat pour Miss/Master 2025" \
  -F "category_id=1" \
  -F "image=@/chemin/vers/photo-candidat.jpg"

echo ""
echo ""

## Test 3: Créer un candidat (méthode JSON - sans upload)
echo "Test 3: Créer un candidat (JSON - URL existante)"
echo "-------------------------------------------------"
curl -X POST "$API_URL/candidate" \
  -H "X-ADMIN-KEY: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marie Martin",
    "bio": "Étudiante en droit",
    "category_id": 1,
    "image": "http://localhost/storage/candidate_xxx.jpg"
  }'

echo ""
echo ""

## Test 4: Vérifier qu'une image est accessible
echo "Test 4: Vérifier l'accès à une image"
echo "-------------------------------------"
curl -I "http://localhost/storage/test_xxx.jpg"

echo ""
echo ""

## Test 5: Lister les candidats
echo "Test 5: Lister tous les candidats"
echo "----------------------------------"
curl -X GET "$API_URL/candidates"

echo ""
echo ""

## Test 6: Obtenir un candidat spécifique
echo "Test 6: Obtenir un candidat (ID=1)"
echo "-----------------------------------"
curl -X GET "$API_URL/candidate/1"

echo ""
echo ""

echo "=================================="
echo "Tests terminés!"
echo "=================================="
