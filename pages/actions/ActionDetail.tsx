import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ActionDetail: React.FC = () => {
  const { action } = useParams<{ action: string }>();

  const renderContent = (key?: string) => {
    switch (key) {
      case 'vote':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-3">Voter pour une candidate</h2>
            <p className="mb-4">Sur la fiche ou la carte d'une candidate, le bouton "Voter" permet d'exprimer votre soutien. Dans l'application actuelle le vote est protégé par l'inscription FER et enregistré en localStorage (prototype).</p>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded">Simuler un vote</button>
          </div>
        );
      case 'share':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-3">Partager la candidate</h2>
            <p className="mb-4">Le bouton "Partager" copie l'URL vers le profil de la candidate dans le presse-papiers. Vous pouvez utiliser cette page pour tester et documenter le comportement.</p>
            <button className="px-4 py-2 border rounded">Simuler partage</button>
          </div>
        );
      case 'vote-modal-confirm':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-3">Confirmation du vote (modal)</h2>
            <p className="mb-4">Le modal de confirmation contient un bouton pour confirmer et un bouton pour annuler. Ils déclenchent la logique d'enregistrement de vote et ferment le modal.</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded mr-2">Confirmer</button>
            <button className="px-4 py-2 border rounded">Annuler</button>
          </div>
        );
      case 'fer-enroll':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-3">S'inscrire / Participer (FER)</h2>
            <p className="mb-4">Le CTA de la section FER redirige vers la page d'inscription. Après inscription, l'utilisateur est marqué participant et peut accéder au concours.</p>
            <Link to="/inscription" className="px-4 py-2 bg-green-700 text-white rounded">Aller à l'inscription</Link>
          </div>
        );
      case 'event-signup':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-3">S'inscrire à un événement</h2>
            <p className="mb-4">Sur la page détail d'un événement, le bouton d'inscription enregistre la participation (local) et affiche un message de confirmation.</p>
          </div>
        );
      case 'login':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-3">Se connecter</h2>
            <p className="mb-4">Bouton de soumission du formulaire de connexion. Utilisez la page de login pour tester le flux d'authentification front-end (localStorage).</p>
            <Link to="/login" className="px-4 py-2 bg-green-700 text-white rounded">Aller au login</Link>
          </div>
        );
      case 'register':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-3">Créer un compte</h2>
            <p className="mb-4">Bouton de soumission du formulaire d'inscription. Permet de créer un utilisateur de test (stocké localement).</p>
            <Link to="/register" className="px-4 py-2 bg-green-700 text-white rounded">Aller à l'inscription</Link>
          </div>
        );
      case 'logout':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-3">Se déconnecter</h2>
            <p className="mb-4">Bouton de déconnexion disponible dans la page profil. Il efface l'utilisateur courant dans le contexte d'auth.</p>
          </div>
        );
      case 'cancel-fer':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-3">Annuler inscription FER</h2>
            <p className="mb-4">Bouton pour annuler la participation FER; il supprime le flag local et met à jour le profil.</p>
          </div>
        );
      case 'inscription-submit':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-3">Je m'inscris et participe</h2>
            <p className="mb-4">Bouton de la page d'inscription qui soumet les informations (et la photo) et marque la participation FER.</p>
            <Link to="/inscription" className="px-4 py-2 bg-green-700 text-white rounded">Aller à l'inscription</Link>
          </div>
        );
      case 'events-filter':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-3">Filtres d'événements</h2>
            <p className="mb-4">Boutons permettant de filtrer la liste d'événements par type. Ils déclenchent un re-render local avec le filtre appliqué.</p>
          </div>
        );
      case 'rejoignez-nous':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-3">Rejoignez-nous (header)</h2>
            <p className="mb-4">Bouton du header qui effectue un scroll vers la section contact de la page d'accueil.</p>
            <Link to="/" className="px-4 py-2 bg-green-700 text-white rounded">Retour à l'accueil</Link>
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-3">Action inconnue</h2>
            <p className="mb-4">Cette action n'a pas de page dédiée. Vérifiez l'identifiant dans l'index des actions.</p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <Link to="/actions" className="text-sm text-gray-600 underline">← Retour à la liste des actions</Link>
      <div className="mt-6">
        {renderContent(action)}
      </div>
    </div>
  );
};

export default ActionDetail;
