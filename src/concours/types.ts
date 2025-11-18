export interface Candidate {
  id: number;
  slug: string;
  name: string;
  age: number;
  origin: string;
  domain: string;
  bio: string;
  photo: string;
  gallery: string[];
  votes?: number;
}
