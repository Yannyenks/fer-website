import React from 'react';
import { Link } from 'react-router-dom';

const actions = [
  { id: 'vote', title: 'Voter (candidate)', description: "Vote pour une candidate depuis la liste ou la fiche candidate." , files: ['concours/components/CandidateCard.tsx','concours/pages/CandidateProfile.tsx']},
  { id: 'share', title: 'Partager (candidate)', description: "Partager le profil / la fiche d'une candidate via le presse-papiers." , files: ['concours/components/CandidateCard.tsx']},
  { id: 'vote-modal-confirm', title: 'Confirmation du vote (modal)', description: "Boutons dans le modal de vote (confirmer/annuler)." , files: ['concours/components/VoteModal.tsx']},
  { id: 'fer-enroll', title: "S'inscrire / Participer (FER CTA)", description: "CTA principal sur la section FER2025 qui renvoie à l'inscription/participation.", files: ['components/FER2025.tsx','pages/Inscription.tsx']},
  { id: 'event-signup', title: 'Inscription à un événement', description: "Bouton sur la page détail d'un événement pour s'inscrire/participer.", files: ['pages/EventDetail.tsx']},
  { id: 'login', title: 'Se connecter', description: "Bouton de soumission du formulaire de connexion.", files: ['pages/Login.tsx']},
  { id: 'register', title: 'Créer (inscription)', description: "Bouton de soumission du formulaire d'inscription.", files: ['pages/Register.tsx','pages/Inscription.tsx']},
  { id: 'logout', title: 'Se déconnecter', description: "Bouton pour se déconnecter du profil.", files: ['pages/Profile.tsx','components/AuthProvider.tsx']},
  { id: 'cancel-fer', title: 'Annuler inscription FER', description: "Bouton qui annule la participation FER de l'utilisateur.", files: ['pages/Profile.tsx']},
  { id: 'inscription-submit', title: "Je m'inscris et participe", description: "Bouton d'inscription avec photo sur la page d'inscription.", files: ['pages/Inscription.tsx']},
  { id: 'events-filter', title: 'Filtres d\'événements', description: "Boutons de filtre ('Tous' + types) sur la page Events.", files: ['pages/EventsPage.tsx']},
  { id: 'rejoignez-nous', title: 'Rejoignez-nous (header)', description: "Bouton du header qui scroll vers le contact.", files: ['components/Header.tsx']},
];

const ActionsIndex: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Admin — Actions & Outils</h1>
      <p className="mb-6">Tableau de bord d'administration pour gérer les actions, assets et outils du site. Accessible uniquement aux administrateurs.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Raccourcis administrateur</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/admin" className="text-green-700 underline">Tableau de bord admin principal</Link></li>
            <li><Link to="/admin/candidates" className="text-green-700 underline">Gérer les candidats (CRUD)</Link></li>
            <li><Link to="/admin/section-images" className="text-green-700 underline">Gérer les images des sections</Link></li>
            <li><Link to="/events" className="text-green-700 underline">Gérer / voir les événements</Link></li>
          </ul>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Actions détectées sur le site</h3>
          <p className="text-sm text-gray-600 mb-3">Référence rapide des boutons et actions présents dans l'application.</p>
          <ul className="text-sm space-y-2">
            {actions.map(a => (
              <li key={a.id} className="border-l-2 pl-3 py-2">
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-gray-500">{a.description}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ActionsIndex;
