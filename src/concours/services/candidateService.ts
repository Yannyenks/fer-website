import { Candidate } from "../types";
import api from '../../services/api';

// Candidate service using backend API. Falls back to localStorage when API unavailable.
const STORAGE_KEY = 'fer_candidates_v1_fallback';

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
    return res.data.candidates as Candidate[];
  } catch (e) {
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
    const res = await api.post('/candidate', payload);
    // PHP backend returns {id: number, image_url?: string}
    const newCandidate: Candidate = {
      ...payload as any,
      id: res.data.id,
      votes: payload.votes ?? 0,
      gallery: payload.gallery || []
    };
    return newCandidate;
  } catch (e) {
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
    await api.put(`/candidate/${id}`, changes);
    // Get updated candidate
    const res = await api.get(`/candidate/${id}`);
    return res.data.candidate as Candidate;
  } catch (e) {
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
