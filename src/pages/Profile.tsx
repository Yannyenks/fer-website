import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { Link } from 'react-router-dom';
import { getAllCandidates } from '../concours/services/candidateService';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [history, setHistory] = useState<Array<{id:number,name:string,slug:string}>>([]);
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(()=>{
    if (!user) return;
    const keys = Object.keys(localStorage).filter(k => k.startsWith(`vote_${user.id}_`));
    const ids = keys.map(k => Number(k.split('_').pop()));
    const candidates = getAllCandidates();
    const hist = ids.map(id => candidates.find(c => c.id === id)).filter(Boolean) as any;
    setHistory(hist.map((c:{id:number,name:string,slug:string})=>({id:c.id,name:c.name,slug:c.slug})));
    setIsParticipant(!!localStorage.getItem(`fer_participant_${user.id}`));
  }, [user]);

  if (!user) return <div className="p-6">Vous devez être connecté.</div>;

  const unregister = () => {
    if (!confirm('Annuler votre inscription à la FER ?')) return;
    localStorage.removeItem(`fer_participant_${user.id}`);
    setIsParticipant(false);
  };

  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(()=>{
    if (!user) return;
    const av = localStorage.getItem(`user_avatar_${user.id}`) || localStorage.getItem(`fer_participant_photo_${user.id}`) || null;
    setAvatar(av);
  }, [user]);

  const handleAvatar = (f?: File) => {
    if (!user || !f) return;
    const r = new FileReader();
    r.onload = () => {
      const v = String(r.result);
      localStorage.setItem(`user_avatar_${user.id}`, v);
      setAvatar(v);
      alert('Photo de profil mise à jour');
    };
    r.readAsDataURL(f);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold">Mon profil</h2>
        <p className="mt-2">Nom : {user.name}</p>
        <p>Email : {user.email}</p>
        <p>Rôle : {user.role}</p>

        <div className="mt-4 flex gap-3">
          <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded">Se déconnecter</button>
          {isParticipant ? <button onClick={unregister} className="px-4 py-2 border rounded">Annuler inscription FER</button>
            : <Link to="/inscription" className="px-4 py-2 bg-green-700 text-white rounded">S'inscrire à la FER</Link>}
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Photo de profil</h3>
          {avatar ? <img src={avatar} className="w-24 h-24 rounded-full mt-2 object-cover" /> : <div className="w-24 h-24 bg-gray-100 mt-2 rounded-full" />}
          <div className="mt-2">
            <input type="file" accept="image/*" onChange={(e)=>handleAvatar(e.target.files?.[0])} />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Historique de votes</h3>
          {history.length === 0 ? <p className="text-sm text-gray-600">Aucun vote enregistré.</p> : (
            <ul className="mt-2">
              {history.map(h => (
                <li key={h.id} className="py-2 border-b"><Link to={`/concours/candidate/${h.slug}`} className="text-blue-600">{h.name}</Link></li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
