import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { useToast } from '../components/ToastProvider';
import api from '../services/api';

type CandidateRegistration = {
  name: string;
  bio: string;
  age: number;
  origin: string;
  domain: string;
  category_id: number;
  image?: File;
};

const Inscription: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/concours';
  
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isCandidate, setIsCandidate] = useState(false);
  const [candidateData, setCandidateData] = useState<CandidateRegistration>({
    name: '',
    bio: '',
    age: 18,
    origin: '',
    domain: '',
    category_id: 1
  });
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Charger les catégories disponibles
    const loadCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    };
    loadCategories();
  }, []);

  const handleFile = (f?: File) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { setFilePreview(String(reader.result)); };
    reader.readAsDataURL(f);
    setCandidateData(prev => ({ ...prev, image: f }));
  };

  const enroll = () => {
    if (!user) return navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
    localStorage.setItem(`fer_participant_${user.id}`, '1');
    navigate(redirect);
  };

  const enrollWithPhoto = () => {
    if (!user) return navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
    localStorage.setItem(`fer_participant_${user.id}`, '1');
    if (filePreview) localStorage.setItem(`user_avatar_${user.id}`, filePreview);
    toast.show('Inscription enregistrée. Bienvenue !', 'success');
    navigate(redirect);
  };

  const registerAsCandidate = async () => {
    if (!user) return navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
    
    if (!candidateData.name.trim() || !candidateData.bio.trim()) {
      toast.show('Nom et biographie sont requis pour les candidats', 'error');
      return;
    }
    
    if (!candidateData.image) {
      toast.show('Une photo est requise pour les candidats', 'error');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', candidateData.name);
      formData.append('bio', candidateData.bio);
      formData.append('age', candidateData.age.toString());
      formData.append('origin', candidateData.origin);
      formData.append('domain', candidateData.domain);
      formData.append('category_id', candidateData.category_id.toString());
      formData.append('image', candidateData.image);
      
      // Note: Nécessite une clé admin pour créer un candidat
      // En production, créer un endpoint séparé /api/candidate/register
      const response = await api.post('/candidate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-ADMIN-KEY': user.api_key || '' // Fallback si pas admin
        }
      });
      
      if (response.data.id) {
        // Marquer comme participant ET candidat
        localStorage.setItem(`fer_participant_${user.id}`, '1');
        localStorage.setItem(`fer_candidate_${user.id}`, response.data.id.toString());
        
        toast.show(`Candidature enregistrée avec succès ! ID: ${response.data.id}`, 'success');
        navigate('/concours');
      }
    } catch (error: any) {
      console.error('Erreur candidature:', error);
      if (error.response?.status === 401) {
        toast.show('Vous devez être administrateur pour créer un candidat via cette méthode', 'error');
      } else {
        toast.show('Erreur lors de l\'enregistrement de la candidature', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Inscription FER 2025</h1>
            <p className="text-blue-100 mt-2">Foire de l'Employabilité Rurale • Ngambé, 11-13 décembre</p>
          </div>

          <div className="p-8">
            {user ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Bienvenue {user.name} ! 👋</h2>
                  <p className="text-gray-600">Choisissez votre type de participation :</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Participation simple */}
                  <div className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    !isCandidate ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`} onClick={() => setIsCandidate(false)}>
                    <div className="flex items-center mb-3">
                      <input 
                        type="radio" 
                        name="participationType" 
                        checked={!isCandidate} 
                        onChange={() => setIsCandidate(false)}
                        className="mr-3"
                      />
                      <h3 className="font-semibold text-lg">🎫 Participant</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Participez aux activités, votez pour vos candidats préférés, accédez aux événements.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Accès complet aux événements</li>
                      <li>• Droit de vote</li>
                      <li>• Networking et activités</li>
                    </ul>
                  </div>

                  {/* Candidature */}
                  <div className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    isCandidate ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`} onClick={() => setIsCandidate(true)}>
                    <div className="flex items-center mb-3">
                      <input 
                        type="radio" 
                        name="participationType" 
                        checked={isCandidate} 
                        onChange={() => setIsCandidate(true)}
                        className="mr-3"
                      />
                      <h3 className="font-semibold text-lg">🏆 Candidat</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Participez au concours, présentez votre profil, concourez pour les prix.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Profil public visible</li>
                      <li>• Éligible aux prix</li>
                      <li>• Tous les avantages participant</li>
                    </ul>
                  </div>
                </div>

                {!isCandidate ? (
                  // Formulaire participation simple
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Photo de profil (optionnelle)
                      </label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFile(e.target.files?.[0])}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                      {filePreview && (
                        <img 
                          src={filePreview} 
                          alt="Aperçu" 
                          className="mt-3 w-24 h-24 object-cover rounded-full border-2 border-gray-200"
                        />
                      )}
                    </div>
                    
                    <div className="flex gap-4">
                      <button 
                        onClick={enrollWithPhoto}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        ✅ Confirmer ma participation
                      </button>
                      <Link 
                        to="/concours" 
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                      >
                        Accéder sans s'inscrire
                      </Link>
                    </div>
                  </div>
                ) : (
                  // Note importante pour les candidats
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-2xl mr-3">⚠️</div>
                      <h3 className="text-lg font-semibold text-yellow-800">Candidature en développement</h3>
                    </div>
                    <p className="text-yellow-700 mb-4">
                      La fonctionnalité de candidature complète est en cours d'implémentation avec le backend. 
                      Pour l'instant, vous pouvez :
                    </p>
                    <ul className="text-yellow-700 space-y-2 mb-6">
                      <li>• Vous inscrire comme participant (accès complet aux événements + votes)</li>
                      <li>• Contacter les administrateurs pour une candidature manuelle</li>
                      <li>• Revenir bientôt quand l'interface sera complète</li>
                    </ul>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setIsCandidate(false)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Devenir participant
                      </button>
                      <Link 
                        to="/contact" 
                        className="px-6 py-3 border border-yellow-400 text-yellow-700 rounded-lg hover:bg-yellow-100 transition duration-200"
                      >
                        Contacter les admins
                      </Link>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Non connecté
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="text-6xl mb-4">🎪</div>
                  <h2 className="text-2xl font-bold mb-2">Rejoignez FER 2025</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Créez un compte pour participer au concours, voter et accéder à tous les événements.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to={`/register?redirect=${encodeURIComponent(redirect)}`}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 font-semibold"
                  >
                    ✨ Créer un compte
                  </Link>
                  <Link 
                    to={`/login?redirect=${encodeURIComponent(redirect)}`}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-semibold"
                  >
                    🔐 Se connecter
                  </Link>
                </div>
                
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Nouveau ?</strong> L'inscription ne prend qu'une minute et vous donne accès à toutes les fonctionnalités de l'événement.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {user && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Informations importantes</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Participants</strong> : Accès complet aux événements + droit de vote</li>
              <li>• <strong>Candidats</strong> : Tout ce qui précède + participation au concours avec prix</li>
              <li>• Vous pourrez modifier vos informations plus tard dans votre profil</li>
              <li>• Les candidatures sont soumises à validation avant publication</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inscription;
