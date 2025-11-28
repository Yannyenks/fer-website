import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCandidates } from '../concours/services/candidateService';

const Profile: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<Array<{id:number,name:string,slug:string}>>([]);
  const [isParticipant, setIsParticipant] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(()=>{
    if (!user) return;
    const loadHistory = async () => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(`vote_${user.id}_`));
      const ids = keys.map(k => Number(k.split('_').pop()));
      const candidates = await getAllCandidates();
      const hist = ids.map(id => candidates.find(c => c.id === id)).filter(Boolean) as any;
      setHistory(hist.map((c:{id:number,name:string,slug:string})=>({id:c.id,name:c.name,slug:c.slug})));
      setIsParticipant(!!localStorage.getItem(`fer_participant_${user.id}`));
    };
    loadHistory();
  }, [user]);

  useEffect(()=>{
    if (!user) return;
    const av = localStorage.getItem(`user_avatar_${user.id}`) || localStorage.getItem(`fer_participant_photo_${user.id}`) || null;
    setAvatar(av);
  }, [user]);

  // Attendre le chargement avant de rediriger
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès restreint</h2>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à votre profil.</p>
          <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const unregister = () => {
    if (!confirm('Annuler votre inscription à la FER ?')) return;
    localStorage.removeItem(`fer_participant_${user.id}`);
    setIsParticipant(false);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header avec distinction Admin/User */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className={`${isAdmin ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} px-6 py-8 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="relative">
                  {avatar ? (
                    <img src={avatar} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" alt="Avatar" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-3xl font-bold">{user.username?.charAt(0).toUpperCase() || 'U'}</span>
                    </div>
                  )}
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${isAdmin ? 'bg-yellow-400' : 'bg-green-400'} border-2 border-white flex items-center justify-center`}>
                    {isAdmin ? '👑' : '✓'}
                  </div>
                </div>

                {/* Info User */}
                <div>
                  <h1 className="text-3xl font-bold">{user.username || user.name}</h1>
                  <p className="text-white/90 mt-1">{user.email}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${isAdmin ? 'bg-yellow-400 text-purple-900' : 'bg-white/20 backdrop-blur-sm'}`}>
                    {isAdmin ? '🔐 Administrateur' : '👤 Utilisateur'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Changement de photo */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-blue-600 transition">Changer la photo de profil</span>
              <input type="file" accept="image/*" onChange={(e)=>handleAvatar(e.target.files?.[0])} className="hidden" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="md:col-span-2 space-y-6">
            {/* Informations du compte */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informations du compte
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 font-medium">Nom d'utilisateur</span>
                  <span className="text-gray-800">{user.username || user.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 font-medium">Email</span>
                  <span className="text-gray-800">{user.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 font-medium">ID</span>
                  <span className="text-gray-800">#{user.id}</span>
                </div>
                {isAdmin && user.api_key && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600 font-medium">API Key</span>
                    <span className="text-gray-800 font-mono text-xs truncate max-w-xs" title={user.api_key}>
                      {user.api_key.substring(0, 20)}...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Historique de votes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Historique de votes ({history.length})
              </h2>
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm">Aucun vote enregistré pour le moment</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {history.map(h => (
                    <li key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <Link to={`/concours/candidate/${h.slug}`} className="text-blue-600 hover:text-blue-800 font-medium flex-1">
                        {h.name}
                      </Link>
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Colonne latérale - Actions */}
          <div className="space-y-6">
            {/* Actions Admin */}
            {isAdmin && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-md p-6 border-2 border-purple-200">
                <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                  <span className="mr-2">👑</span>
                  Actions Admin
                </h3>
                <div className="space-y-2">
                  <Link to="/admin" className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center font-medium">
                    Dashboard Admin
                  </Link>
                  <Link to="/admin/invitations" className="block w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-center font-medium">
                    Gérer les invitations
                  </Link>
                  <Link to="/admin/candidates" className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium">
                    Gérer les candidats
                  </Link>
                </div>
              </div>
            )}

            {/* Actions FER */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                FER Awards
              </h3>
              {isParticipant ? (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                    ✓ Vous êtes inscrit à la FER
                  </div>
                  <button onClick={unregister} className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium">
                    Annuler l'inscription
                  </button>
                </div>
              ) : (
                <Link to="/inscription" className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center font-medium">
                  S'inscrire à la FER
                </Link>
              )}
            </div>

            {/* Déconnexion */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Compte</h3>
              <button onClick={handleLogout} className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
