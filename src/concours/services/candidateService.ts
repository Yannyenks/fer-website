import { Candidate } from "../types";
import { mockCandidates } from "../data/mock";

const STORAGE_KEY = 'fer_candidates_v1';

function seedIfEmpty() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCandidates));
  }
}

export function getAllCandidates(): Candidate[] {
  seedIfEmpty();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Candidate[];
  } catch (e) {
    return [];
  }
}

export function getCandidateBySlug(slug: string): Candidate | undefined {
  return getAllCandidates().find(c => c.slug === slug);
}

export function addCandidate(payload: Omit<Candidate, 'id'|'votes'> & Partial<Pick<Candidate,'votes'>>): Candidate {
  const list = getAllCandidates();
  const nextId = list.length ? Math.max(...list.map(c => c.id)) + 1 : 1;
  const candidate: Candidate = {
    id: nextId,
    slug: payload.slug,
    name: payload.name,
    age: payload.age,
    origin: payload.origin,
    domain: payload.domain,
    bio: payload.bio,
    photo: payload.photo,
    gallery: payload.gallery || [],
    votes: payload.votes ?? 0,
  };
  list.push(candidate);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return candidate;
}

export function updateCandidate(id: number, changes: Partial<Candidate>): Candidate | undefined {
  const list = getAllCandidates();
  const idx = list.findIndex(c => c.id === id);
  if (idx === -1) return undefined;
  const updated = { ...list[idx], ...changes };
  list[idx] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return updated;
}

export function deleteCandidate(id: number) {
  const list = getAllCandidates().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
