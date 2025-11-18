import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { useToast } from '../components/ToastProvider';

const Inscription: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/concours';

  const enroll = () => {
    if (!user) return navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
    localStorage.setItem(`fer_participant_${user.id}`, '1');
    navigate(redirect);
  };

  const toast = useToast();
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFile = (f?: File) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { setFilePreview(String(reader.result)); };
    reader.readAsDataURL(f);
  };

  const enrollWithPhoto = () => {
    if (!user) return navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
    localStorage.setItem(`fer_participant_${user.id}`, '1');
    if (filePreview) localStorage.setItem(`user_avatar_${user.id}`, filePreview);
    toast.show('Inscription enregistrée. Bienvenue !', 'success');
    navigate(redirect);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Inscription / Participation — FER 2025</h1>

        {user ? (
          <>
            <p className="mb-4">Bonjour <strong>{user.name}</strong> — pour participer au jeu concours et accéder aux fonctionnalités, confirmez votre inscription :</p>
            <div className="mb-3">
              <label className="block text-sm">Photo de profil (optionnel)</label>
              <input type="file" accept="image/*" onChange={(e)=>handleFile(e.target.files?.[0])} />
              {filePreview && <img src={filePreview} alt="aperçu" className="mt-2 w-28 h-28 object-cover rounded-full" />}
            </div>
            <div className="flex gap-3">
              <button onClick={enrollWithPhoto} className="px-4 py-2 bg-green-700 text-white rounded">Je m'inscris et participe</button>
              <Link to="/concours" className="px-4 py-2 border rounded">Accéder au concours (sans inscription)</Link>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4">Pour participer au jeu concours veuillez vous connecter ou créer un compte.</p>
            <div className="flex gap-3">
              <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="px-4 py-2 bg-blue-600 text-white rounded">Se connecter</Link>
              <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="px-4 py-2 bg-olive-600 text-white rounded">Créer un compte</Link>
            </div>
          </>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p>Après inscription vous pourrez voter, soumettre un projet, et participer aux activités réservées aux participants.</p>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
