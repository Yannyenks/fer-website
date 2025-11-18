# public/assets

Drop your image files here to make them available to the app via `/assets/<filename>`.

Usage:
- Add files (jpg, png, webp, etc.) to this folder.
- Start the dev server `npm run dev` and the files will be served at `http://localhost:5173/assets/<filename>`.
- Open the admin page `/admin/section-images` and choose the asset from the list to assign it to a section.

Naming convention (recommended):
- `fer-hero.jpg` → banner for FER section
- `about-1.jpg` → About block "OBJECTIF GLOBAL"
- `about-2.jpg` → About block "NOTRE MISSION"
- `gallery-1.jpg` → First gallery image
- `clubs.jpg` → Clubs main image

If you follow these names the site will automatically detect and display them without needing to assign them in the admin UI.

Notes:
- This is a static-file approach: files in `public/assets` are served by Vite as-is.
- For production, include your assets in `public` before building or publish them to a CDN and use absolute URLs.
