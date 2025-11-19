# Storage Directory

Ce dossier contient toutes les images uploadées par les administrateurs.

## Structure

Les images sont sauvegardées avec le format suivant : `{prefix}_{uniqid}_{timestamp}.{extension}`

Exemple : `img_63f8a2b4c5d1e_1677123456.jpg`

## Accès

Les images sont accessibles via l'URL : `/storage/{filename}`

Exemple : `http://votre-domaine.com/storage/img_63f8a2b4c5d1e_1677123456.jpg`

## Upload

Pour uploader une image, utilisez l'endpoint `/api/upload` avec :
- Méthode : POST
- Header : `X-ADMIN-KEY: votre_clé_admin`
- Body : multipart/form-data avec un champ `image` contenant le fichier
- Paramètre optionnel : `prefix` (par défaut : "img")

### Exemple avec curl :

```bash
curl -X POST http://localhost/api/upload \
  -H "X-ADMIN-KEY: votre_clé" \
  -F "image=@/chemin/vers/image.jpg" \
  -F "prefix=candidate"
```

### Réponse :

```json
{
  "success": true,
  "url": "http://localhost/storage/candidate_63f8a2b4c5d1e_1677123456.jpg",
  "path": "/storage/candidate_63f8a2b4c5d1e_1677123456.jpg",
  "filename": "candidate_63f8a2b4c5d1e_1677123456.jpg"
}
```

## Types de fichiers autorisés

- JPEG / JPG
- PNG
- GIF
- WebP

## Taille maximale

10 MB par fichier
