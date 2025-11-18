import { testImage } from './assetLoader';

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/g, '');
}

async function loadManifest(): Promise<string[] | null> {
  try {
    const res = await fetch('/assets/manifest.json');
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data)) return data as string[];
    return null;
  } catch (e) {
    return null;
  }
}

export async function resolveCandidateImage(options: { photo?: string; slug?: string; name?: string; }): Promise<string> {
  const { photo, slug, name } = options;

  // Prefer data URLs or explicit asset paths if they already work
  if (photo) {
    if (photo.startsWith('data:')) return photo;
    try {
      const ok = await testImage(encodeURI(photo));
      if (ok) return encodeURI(photo);
    } catch (e) {
      // continue
    }
  }

  const manifest = await loadManifest();
  if (!manifest || manifest.length === 0) return photo || '/assets/placeholder.jpg';

  const tokens: string[] = [];
  if (slug) tokens.push(normalize(slug));
  if (name) tokens.push(...name.split(' ').map(t => normalize(t)).filter(Boolean));
  // also try to use basename of provided photo
  if (photo) {
    const parts = photo.split('/');
    const base = parts[parts.length - 1].split('.').slice(0, -1).join('.');
    if (base) tokens.push(normalize(base));
  }

  let best: { path: string; score: number } | null = null;
  for (const p of manifest) {
    try {
      const u = p.toString();
      const nameOnly = u.split('/').pop() || u;
      const base = nameOnly.split('.').slice(0, -1).join('.');
      const n = normalize(base);
      let score = 0;
      for (const t of tokens) {
        if (!t) continue;
        if (n.includes(t)) score += 2;
        // partial token match
        if (t.length >= 3 && n.includes(t.slice(0, 3))) score += 1;
      }
      if (score > 0 && (!best || score > best.score)) best = { path: u, score };
    } catch (e) {
      // ignore
    }
  }

  if (best) {
    const encoded = encodeURI(best.path);
    try {
      const ok = await testImage(encoded);
      if (ok) return encoded;
    } catch (e) {
      // fallthrough
    }
  }

  // fallback: try any asset and pick first that loads
  for (const p of manifest) {
    try {
      const enc = encodeURI(p);
      // eslint-disable-next-line no-await-in-loop
      if (await testImage(enc)) return enc;
    } catch (e) {
      // continue
    }
  }

  return photo || '/assets/placeholder.jpg';
}
