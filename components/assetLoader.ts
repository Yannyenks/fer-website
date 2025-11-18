export function testImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
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

export async function findProjectAsset(sectionId: string, exts: string[] = ['jpg', 'png', 'webp']): Promise<string | null> {
  // First, try manifest-based lookup with flexible matching
  const manifest = await loadManifest();
  if (manifest && manifest.length) {
    const normalize = (s: string) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();
    const sid = normalize(sectionId);

    // Try direct inclusion as before
    let match = manifest.find(p => p.includes(sectionId));
    if (match) return encodeURI(match);

    // Try normalized filename matching
    match = manifest.find(p => {
      try {
        const parts = p.split('/');
        const name = parts[parts.length - 1] || p;
        const base = name.replace(/\.[^/.]+$/, '');
        return normalize(base).includes(sid) || sid.includes(normalize(base));
      } catch (e) {
        return false;
      }
    });
    if (match) return encodeURI(match);

    // Token match: any token from sectionId appears in filename
    const tokens = sectionId.split(/[^a-z0-9]+/i).map(t => t.toLowerCase()).filter(Boolean);
    match = manifest.find(p => {
      const parts = p.split('/');
      const name = parts[parts.length - 1] || p;
      const base = name.replace(/\.[^/.]+$/, '').toLowerCase();
      return tokens.some(t => base.includes(t));
    });
    if (match) return encodeURI(match);

    // As a last resort, pick the first image file in the manifest (skip README or non-image files)
    match = manifest.find(p => exts.some(ext => p.toLowerCase().endsWith('.' + ext)));
    if (match) return encodeURI(match);
  }

  // Fallback: try common extensions with exact name
  for (const ext of exts) {
    const url = `/assets/${sectionId}.${ext}`;
    // eslint-disable-next-line no-await-in-loop
    const ok = await testImage(encodeURI(url));
    if (ok) return encodeURI(url);
  }
  return null;
}
