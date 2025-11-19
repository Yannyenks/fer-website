# Minimal PHP API for FER website

This folder contains a minimal PHP backend (no framework) to support the React frontend.

Features:
- Admin login (simple, via `X-ADMIN-KEY` or env)
- Events CRUD (basic)
- Candidates CRUD
- Voting without account: cookie `visitor_id` + hashed IP
- Share links for candidates (token)
- Categories

Quick setup

1. Configure `server/.env` (DB credentials, `FRONTEND_URL`, `APP_SECRET`, admin credentials).

2. Create database and import schema:

```pwsh
# from project root (Windows PowerShell)
mysql -u root -p
CREATE DATABASE fer_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fer_website;
SOURCE server/schema.sql;
```

3. Run the PHP built-in server for development:

```pwsh
php -S localhost:8000 -t server server/index.php
```

4. Frontend compatibility
- All endpoints return JSON and accept/return UTF-8.
- CORS is enabled and origin is controlled by `FRONTEND_URL` in `server/.env`.
- For admin actions (creating events/candidates, creating share tokens), send header `X-ADMIN-KEY: <ADMIN_PASS>`.

API examples

- GET `/api/events` — liste événements
- POST `/api/events` — créer événement (admin)
- GET `/api/candidates` — liste candidats
- POST `/api/candidate` — créer candidat (admin)
- POST `/api/vote` — voter, body `{ "candidate_id": 1 }` (no auth)
- POST `/api/share/create` — créer token (admin)
- GET `/api/share/{token}` — obtenir candidat via token

Notes & sécurité
- This is intentionally minimal. For production, add proper auth, rate-limiting, input validation, uploads handling, HTTPS, and stronger admin auth (not plain header).
- Change `APP_SECRET` to a secure random string in `.env`.
