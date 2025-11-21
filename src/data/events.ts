import App from "../App";
import AppImage from "../components/AppImage";

export interface EventItem {
  id: string;
  title: string;
  date: string; // ISO or human
  type: 'Festivité' | 'Action sociale' | 'Formation' | 'Atelier' | 'Autre';
  image?: string;
  short: string;
  description?: string;
  location?: string;
}

export const mockEvents: EventItem[] = [
  {
    id: 'fer-opening',
    title: 'Ouverture officielle - FER 2025',
    date: '2025-12-11T09:00:00',
    type: 'Festivité',
    image: AppImage.GALLERY.IMAGE_15,
    short: "Cérémonie d'ouverture, discours et présentation du programme.",
    description: 'Cérémonie d’ouverture avec les partenaires, allocutions et présentation des objectifs de la foire.',
    location: 'Ngambé - Place centrale'
  },
  {
    id: 'agri-workshop',
    title: 'Atelier : Chaînes de valeur agricoles',
    date: '2025-12-12T10:00:00',
    type: 'Atelier',
    image: AppImage.GALLERY.IMAGE_16,
    short: 'Atelier pratique sur la structuration des chaînes de valeur.',
    description: 'Atelier animé par experts pour renforcer la production, transformation et commercialisation.',
    location: 'Salle A, Centre communautaire'
  },
  {
    id: 'youth-hack',
    title: 'Hackathon jeunes - Innovations rurales',
    date: '2025-12-12T14:00:00',
    type: 'Formation',
    image: AppImage.GALLERY.IMAGE_17,
    short: 'Compétition pour prototyper solutions rurales.',
    description: 'Equipes de jeunes travaillent 24h pour proposer solutions numériques ou productives.',
    location: 'Espace Tech'
  }
];
