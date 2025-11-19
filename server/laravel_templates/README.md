FR

But : fournir des templates et instructions pour mettre en place un backend Laravel robuste qui gère :
- candidats (CRUD, votes)
- images / sections (CRUD)
- authentification admin (Laravel Sanctum / JWT)

Ce dossier contient des fichiers à copier dans un projet Laravel réel. Je ne peux pas exécuter Composer/PHP ici ; suivez les instructions ci-dessous pour créer et démarrer le backend.

Étapes recommandées (Windows)
1) Installer PHP (>=8.1) et Composer sur Windows.
   - https://www.php.net/downloads
   - https://getcomposer.org/download/

2) Créer un nouveau projet Laravel (dans le dossier `server/laravel` ou ailleurs) :
```powershell
cd "C:\Users\Lenovo 24\Downloads\jvepi-centre-showcase\server"
composer create-project laravel/laravel laravel-backend
cd laravel-backend
```

3) Installer Sanctum (recommandé pour SPA auth) :
```powershell
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

4) Copier les fichiers de `laravel_templates` dans votre projet Laravel:
- `app/Models/Candidate.php`
- `app/Models/ImageSection.php`
- `database/migrations/XXXX_create_candidates_table.php`
- `database/migrations/XXXX_create_images_table.php`
- `app/Http/Controllers/Api/CandidateController.php`
- `app/Http/Controllers/Api/ImageController.php`
- `routes/api.php` (append les routes API fournies)

5) Ajuster `.env` : config DB (sqlite/mysql) et `SANCTUM_STATEFUL_DOMAINS` si nécessaire.

6) Lancer les migrations et serveur :
```powershell
# depuis laravel-backend
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```
API disponible sur `http://127.0.0.1:8000/api/...`.

Notes d'intégration front-end
- Mettre à jour vos services front (`candidateService`, `sectionImageService`) pour appeler `http://127.0.0.1:8000/api/...`.
- Activer CORS/headers dans `app/Http/Middleware/` si nécessaire.

Fichiers inclus dans ce dossier : modèles, migrations, controllers et exemples de routes.
