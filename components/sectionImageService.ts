// Simple service to store and retrieve section images (data URLs) in localStorage
export const SECTION_IMAGE_KEY = (sectionId: string) => `section_image_${sectionId}`;

export function setSectionImage(sectionId: string, dataUrl: string | null) {
  const key = SECTION_IMAGE_KEY(sectionId);
  if (dataUrl === null) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, dataUrl);
}

export function getSectionImage(sectionId: string): string | null {
  const v = localStorage.getItem(SECTION_IMAGE_KEY(sectionId));
  if (!v) return null;
  // If the value is a project asset path, ensure it's an encoded URL so browsers can load it
  if (v.startsWith('/assets/')) return encodeURI(v);
  return v;
}

export function listSectionImages() {
  const res: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (k.startsWith('section_image_')) {
      const raw = localStorage.getItem(k) as string;
      res[k.replace('section_image_', '')] = raw && raw.startsWith('/assets/') ? encodeURI(raw) : raw;
    }
  }
  return res;
}
