# 📸 Guide d'Upload d'Images - FER API

## 🎯 Comment ça marche ?

Vous avez maintenant **2 méthodes** pour ajouter des candidats avec photos :

### Méthode 1: Upload direct avec le candidat (Recommandé)
Envoyez tout en une seule requête avec `multipart/form-data`

### Méthode 2: Upload séparé puis création
1. Upload l'image via `/api/upload`
2. Récupérez l'URL
3. Créez le candidat avec l'URL

---

## 🚀 Utilisation

### Route POST `/api/candidate` avec upload direct

**Format**: `multipart/form-data`

**Headers**:
```
X-ADMIN-KEY: votre_cle_admin
```

**Champs du formulaire**:
- `name` (requis): Nom du candidat
- `bio` (optionnel): Biographie
- `category_id` (optionnel): ID de la catégorie
- `image` (requis): Fichier image
- `extra` (optionnel): Données JSON supplémentaires

**Réponse**:
```json
{
  "id": 42,
  "image_url": "http://localhost/storage/candidate_abc123_1234567890.jpg"
}
```

---

## 🧪 Comment tester ?

### Option 1: Interface Web (Plus facile)

1. Ouvrez `server/test-upload.html` dans votre navigateur
2. Entrez votre clé admin
3. Remplissez le formulaire
4. Sélectionnez une image
5. Cliquez sur "Créer Candidat"

**URL**: `http://localhost/test-upload.html` ou ouvrez directement le fichier

---

### Option 2: Script PowerShell

```powershell
cd server
.\test-upload.ps1
```

Le script vous guidera interactivement pour :
- Upload simple d'images
- Créer des candidats avec photos
- Vérifier l'accès aux images

---

### Option 3: Commandes curl (Bash/Git Bash)

```bash
# Upload simple
curl -X POST "http://localhost/api/upload" \
  -H "X-ADMIN-KEY: votre_cle" \
  -F "image=@./photo.jpg" \
  -F "prefix=candidate"

# Créer candidat avec photo
curl -X POST "http://localhost/api/candidate" \
  -H "X-ADMIN-KEY: votre_cle" \
  -F "name=Jean Dupont" \
  -F "bio=Étudiant en informatique" \
  -F "category_id=1" \
  -F "image=@./photo-jean.jpg"
```

---

### Option 4: Code JavaScript/TypeScript

```typescript
// Fonction helper
async function createCandidateWithImage(
  name: string,
  bio: string,
  imageFile: File,
  adminKey: string,
  categoryId?: number
) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('bio', bio);
  formData.append('image', imageFile);
  
  if (categoryId) {
    formData.append('category_id', categoryId.toString());
  }
  
  const response = await fetch('http://localhost/api/candidate', {
    method: 'POST',
    headers: {
      'X-ADMIN-KEY': adminKey
    },
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }
  
  return await response.json();
}

// Utilisation dans un composant React
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const result = await createCandidateWithImage(
      'Marie Dupont',
      'Étudiante en médecine',
      imageFile, // File object from input
      'votre_cle_admin',
      1
    );
    
    console.log('Candidat créé:', result.id);
    console.log('Image URL:', result.image_url);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};
```

---

## 📁 Structure des fichiers uploadés

Les images sont sauvegardées dans :
```
fer-website/
└── storage/
    ├── candidate_abc123_1234567890.jpg
    ├── candidate_def456_1234567891.jpg
    └── test_ghi789_1234567892.png
```

**Format du nom**: `{prefix}_{uniqid}_{timestamp}.{extension}`

---

## 🔗 Accès aux images

Les images sont accessibles via :
- URL complète : `http://localhost/storage/candidate_xxx.jpg`
- Chemin relatif : `/storage/candidate_xxx.jpg`

**Propriétés** :
- ✅ Cache HTTP (1 an)
- ✅ MIME type automatique
- ✅ Protection contre directory traversal

---

## ✅ Validation

**Types acceptés** :
- JPEG / JPG
- PNG
- GIF
- WebP

**Taille max** : 10 MB par fichier

---

## 🔐 Sécurité

- ✅ Authentification admin requise (`X-ADMIN-KEY`)
- ✅ Validation du type MIME
- ✅ Limitation de taille
- ✅ Nom de fichier sécurisé (unique)
- ✅ Protection directory traversal

---

## 🐛 Débogage

### L'upload ne fonctionne pas ?

1. **Vérifiez les permissions du dossier storage/**
   ```powershell
   # Windows PowerShell
   icacls "storage" /grant Everyone:(OI)(CI)F
   ```

2. **Vérifiez la configuration PHP**
   ```php
   // Dans php.ini
   upload_max_filesize = 10M
   post_max_size = 10M
   file_uploads = On
   ```

3. **Vérifiez les logs d'erreur**
   ```powershell
   # Regardez les logs PHP
   tail -f /path/to/php/error.log
   ```

4. **Testez avec curl pour isoler le problème**
   ```bash
   curl -v -X POST "http://localhost/api/upload" \
     -H "X-ADMIN-KEY: votre_cle" \
     -F "image=@test.jpg"
   ```

---

## 📝 Exemples complets

### Exemple 1: Créer un candidat Miss

```bash
curl -X POST "http://localhost/api/candidate" \
  -H "X-ADMIN-KEY: ma_cle_secrete" \
  -F "name=Sophie Beauté" \
  -F "bio=Étudiante en commerce, passionnée de mode" \
  -F "category_id=1" \
  -F "image=@./photos/sophie.jpg"
```

### Exemple 2: Créer un candidat Master

```bash
curl -X POST "http://localhost/api/candidate" \
  -H "X-ADMIN-KEY: ma_cle_secrete" \
  -F "name=Thomas Champion" \
  -F "bio=Sportif et entrepreneur" \
  -F "category_id=2" \
  -F "image=@./photos/thomas.jpg"
```

---

## 🎨 Intégration Frontend React

```tsx
import { useState } from 'react';

function CreateCandidateForm() {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      alert('Veuillez sélectionner une image');
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    formData.append('image', image);
    formData.append('category_id', '1');

    try {
      const response = await fetch('http://localhost/api/candidate', {
        method: 'POST',
        headers: {
          'X-ADMIN-KEY': localStorage.getItem('adminKey') || ''
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création');
      }

      const result = await response.json();
      alert(`Candidat créé avec succès! ID: ${result.id}`);
      console.log('Image URL:', result.image_url);
      
      // Reset form
      setName('');
      setBio('');
      setImage(null);
      
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du candidat"
        required
      />
      
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Biographie"
      />
      
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        required
      />
      
      {image && <p>Fichier sélectionné: {image.name}</p>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Création...' : 'Créer le candidat'}
      </button>
    </form>
  );
}
```

---

## 🎯 Résumé rapide

1. **Pour créer un candidat avec photo** : 
   - Utilisez POST `/api/candidate` avec `multipart/form-data`
   - Incluez le champ `image` avec le fichier

2. **Pour tester** :
   - Ouvrez `test-upload.html` dans votre navigateur
   - OU utilisez le script PowerShell `test-upload.ps1`
   - OU utilisez curl

3. **L'image sera** :
   - Sauvegardée dans `storage/`
   - Accessible via `/storage/{filename}`
   - Retournée dans la réponse comme `image_url`

---

## 📞 Support

En cas de problème, vérifiez :
1. Permissions du dossier `storage/`
2. Configuration PHP (`upload_max_filesize`, `post_max_size`)
3. Clé admin valide
4. Format de fichier supporté (JPEG, PNG, GIF, WebP)
5. Taille < 10 MB
