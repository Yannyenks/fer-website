import { Candidate } from "../types";
import api from '../../services/api';

// Candidate service using backend API. Falls back to localStorage when API unavailable.
const STORAGE_KEY = 'fer_candidates_v1_fallback';

// Helper to normalize image URLs to use the correct backend server
function normalizeImageUrl(imageUrl: string | null): string {
  if (!imageUrl) return '';
  
  // If it's already a data URL, return as is
  if (imageUrl.startsWith('data:')) return imageUrl;
  
  // If it's a relative path starting with /storage/, return as-is
  if (imageUrl.startsWith('/storage/')) {
    return imageUrl; // .htaccess gère le routing
  }
  
  // If it's already a full URL, extract the /storage/ part
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    const match = imageUrl.match(/\/storage\/.+$/);
    if (match) {
      return match[0]; // Juste le chemin relatif
    }
    return imageUrl;
  }
  
  // Si c'est juste un nom de fichier, ajouter /storage/
  return `/storage/${imageUrl}`;
}

async function fallbackSeed() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // keep empty if not present; frontend mock may still work
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

export async function getAllCandidates(): Promise<Candidate[]> {
  try {
    const res = await api.get('/candidates');
    const candidates = res.data.candidates || [];
    
    // Transform backend data to frontend format
    return candidates.map((c: any) => {
      let extra: any = {};
      if (c.extra) {
        try {
          extra = typeof c.extra === 'string' ? JSON.parse(c.extra) : c.extra;
        } catch (e) {
          console.error('Error parsing extra:', e);
        }
      }
      
      return {
        id: c.id,
        name: c.name,
        slug: extra.slug || `candidate-${c.id}`,
        age: extra.age || 20,
        origin: extra.origin || '',
        domain: extra.domain || '',
        bio: c.bio || '',
        photo: normalizeImageUrl(c.image),
        votes: c.votes || 0,
        gallery: extra.gallery || []
      } as Candidate;
    });
  } catch (e) {
    console.error('Get all candidates error:', e);
    await fallbackSeed();
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Candidate[]; } catch { return []; }
  }
}

export async function getCandidateBySlug(slug: string): Promise<Candidate | undefined> {
  try {
    const list = await getAllCandidates();
    return list.find(c => c.slug === slug);
  } catch (e) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Candidate[];
    return list.find(c => c.slug === slug);
  }
}

export async function addCandidate(payload: Omit<Candidate, 'id'|'votes'> & Partial<Pick<Candidate,'votes'>>): Promise<Candidate | null> {
  try {
    // Prepare data for backend
    const backendPayload = {
      name: payload.name,
      bio: payload.bio || '',
      image: payload.photo || '',
      category_id: 1, // Default category
      extra: JSON.stringify({
        slug: payload.slug,
        age: payload.age,
        origin: payload.origin,
        domain: payload.domain,
        gallery: payload.gallery || []
      })
    };
    
    const res = await api.post('/candidate', backendPayload);
    
    // PHP backend returns {id: number, image_url?: string}
    const newCandidate: Candidate = {
      id: res.data.id,
      name: payload.name,
      slug: payload.slug,
      age: payload.age,
      origin: payload.origin,
      domain: payload.domain,
      bio: payload.bio || '',
      photo: normalizeImageUrl(res.data.image_url || payload.photo),
      votes: payload.votes ?? 0,
      gallery: payload.gallery || []
    };
    return newCandidate;
  } catch (e) {
    console.error('Add candidate error:', e);
    // fallback to local
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Candidate[];
    const nextId = list.length ? Math.max(...list.map(c => c.id)) + 1 : 1;
    const candidate: Candidate = { id: nextId, votes: payload.votes ?? 0, gallery: payload.gallery || [], ...(payload as any) } as Candidate;
    list.push(candidate);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return candidate;
  }
}

export async function updateCandidate(id: number, changes: Partial<Candidate>): Promise<Candidate | null> {
  try {
    // First get current candidate to preserve all data
    const currentRes = await api.get(`/candidate/${id}`);
    const current = currentRes.data.candidate;
    
    // Parse current extra data
    let currentExtra: any = {};
    if (current.extra) {
      try {
        currentExtra = typeof current.extra === 'string' ? JSON.parse(current.extra) : current.extra;
      } catch (e) {
        console.error('Error parsing current extra:', e);
      }
    }
    
    // Prepare data for backend - merge with existing data
    const backendPayload: any = {};
    
    if (changes.name !== undefined) backendPayload.name = changes.name;
    if (changes.bio !== undefined) backendPayload.bio = changes.bio;
    if (changes.photo !== undefined) backendPayload.image = changes.photo;
    
    // Merge extra fields (preserve existing values if not provided in changes)
    const updatedExtra = {
      slug: changes.slug !== undefined ? changes.slug : currentExtra.slug,
      age: changes.age !== undefined ? changes.age : currentExtra.age,
      origin: changes.origin !== undefined ? changes.origin : currentExtra.origin,
      domain: changes.domain !== undefined ? changes.domain : currentExtra.domain,
      gallery: changes.gallery !== undefined ? changes.gallery : (currentExtra.gallery || [])
    };
    
    backendPayload.extra = updatedExtra;
    
    const updateRes = await api.put(`/candidate/${id}`, backendPayload);
    
    // The backend now returns the updated candidate
    const updatedCandidate = updateRes.data.candidate;
    
    // Parse extra data
    let extra: any = {};
    if (updatedCandidate.extra) {
      try {
        extra = typeof updatedCandidate.extra === 'string' ? JSON.parse(updatedCandidate.extra) : updatedCandidate.extra;
      } catch (e) {
        console.error('Error parsing extra:', e);
      }
    }
    
    return {
      id: updatedCandidate.id,
      name: updatedCandidate.name,
      slug: extra.slug || '',
      age: extra.age || 20,
      origin: extra.origin || '',
      domain: extra.domain || '',
      bio: updatedCandidate.bio || '',
      photo: normalizeImageUrl(updatedCandidate.image),
      votes: updatedCandidate.votes || 0,
      gallery: extra.gallery || []
    } as Candidate;
  } catch (e) {
    console.error('Update candidate error:', e);
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Candidate[];
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...changes };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list[idx];
  }
}

export async function deleteCandidate(id: number): Promise<boolean> {
  try {
    await api.delete(`/candidate/${id}`);
    return true;
  } catch (e) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Candidate[];
    const newList = list.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    return true;
  }
}
