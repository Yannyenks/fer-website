import { Candidate } from "../types";

export const mockCandidates: Candidate[] = [
  {
    id: 1,
    slug: "marie-ngassa",
    name: "Marie Ngassa",
    age: 22,
    origin: "Ngambé",
    domain: "Agriculture",
    bio: "Jeune entrepreneure rurale passionnée par l'agriculture durable.",
    photo: "/assets/candidates/marie.jpg",
    gallery: [],
    votes: 1280,
  },
  {
    id: 2,
    slug: "jordan-mbappe",
    name: "Jordan Mbappé",
    age: 24,
    origin: "Nkongsamba",
    domain: "Innovation TIC",
    bio: "Développeur passionné créant des solutions rurales intelligentes.",
    photo: "/assets/candidates/jordan.jpg",
    gallery: [],
    votes: 980,
  }
];
