export type CandidateType = 'miss' | 'awards';

export interface Candidate {
  id: number;
  slug: string;
  name: string;
  type?: CandidateType;
  age: number;
  origin: string;
  domain: string;
  bio: string;
  photo: string;
  gallery: string[];
  votes?: number;
}
