import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { useToast } from '../components/ToastProvider';
import api from '../services/api';

const AdminRegister: React.FC = () => {
  const { registerAdmin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [invitationEmail, setInvitationEmail] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [token, setToken] = useState<string>('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    const urlToken = params.get('token');
    if (!urlToken) {
      setVerifying(false);
      toast.show('Aucun token d\'invitation fourni', 'error');
      return;
    }

    setToken(urlToken);
    verifyToken(urlToken);
  }, [location.search]);

  const verifyToken = async (tokenToVerify: string) => {
    setVerifying(true);
    try {
      const response = await api.get(`/admin/invitations/verify/${tokenToVerify}`);
      if (response.data.valid) {
        setTokenValid(true);
        if (response.data.email) {
          setInvitationEmail(response.data.email);
          setEmail(response.data.email);
        }
        toast.show('Invitation valide ! Vous pouvez créer votre compte admin', 'success');
      } else {
        setTokenValid(false);
        toast.show(response.data.error || 'Token d\'invitation invalide', 'error');
      }
    } catch (error: any) {
      setTokenValid(false);
      const errorMsg = error.response?.data?.error || 'Impossible de vérifier le token';
      toast.show(errorMsg, 'error');
    } finally {
      setVerifying(false);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) newErrors.name = 'Nom d\'utilisateur requis';
    if (!email.trim()) newErrors.email = 'Email requis';
    else if (!email.includes('@')) newErrors.email = 'Email invalide';
    if (invitationEmail && email !== invitationEmail) {
      newErrors.email = `L'email doit correspondre à l'invitation: ${invitationEmail}`;
    }
    if (!password) newErrors.password = 'Mot de passe requis';
    else if (password.length < 6) newErrors.password = 'Minimum 6 caractères';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Mots de passe différents';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!tokenValid) {
      toast.show('Token d\'invitation invalide', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // Utiliser la nouvelle fonction registerAdmin avec token
      const user = await registerAdmin(name, email, password, token);
      
      if (user) {
        toast.show('Compte administrateur créé avec succès !', 'success');
        navigate('/admin');
      }
    } catch (error: any) {
      toast.show(error.message || 'Erreur lors de l\'inscription', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Vérification de l'invitation...</h2>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⛔</div>
            <h2 className="text-2xl font-bold text-red-600">Invitation Invalide</h2>
            <p className="text-gray-600 mt-2">
              Ce lien d'invitation n'est pas valide ou a expiré.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-2">Raisons possibles :</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Le lien a déjà été utilisé</li>
              <li>• Le lien a expiré (validité limitée)</li>
              <li>• Le token est incorrect ou incomplet</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link 
              to="/login"
              className="block w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            >
              Se connecter
            </Link>
            <p className="text-center text-sm text-gray-600">
              Contactez un administrateur pour obtenir une nouvelle invitation
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800">Inscription Administrateur</h2>
          <p className="text-gray-600 mt-2">Créez votre compte administrateur FER 2025</p>
        </div>

        {invitationEmail && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Invitation valide pour : <strong>{invitationEmail}</strong>
            </p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="admin_username"
              disabled={loading}
              autoComplete="username"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input 
              type="email"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fer2025.com"
              disabled={loading || !!invitationEmail}
              autoComplete="email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            {invitationEmail && (
              <p className="text-xs text-gray-500 mt-1">
                Email fixé par l'invitation
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <input 
              type="password"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              disabled={loading}
              autoComplete="new-password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe <span className="text-red-500">*</span>
            </label>
            <input 
              type="password"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répétez le mot de passe"
              disabled={loading}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading || !tokenValid}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Création du compte...
              </div>
            ) : (
              '🔐 Créer mon compte administrateur'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Se connecter
            </Link>
          </p>
        </div>

        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <h3 className="text-xs font-semibold text-purple-800 mb-2">⚡ Privilèges Administrateur</h3>
          <ul className="text-xs text-purple-700 space-y-1">
            <li>• Accès complet au backend et aux API</li>
            <li>• Gestion des candidats et votes</li>
            <li>• Création d'invitations pour d'autres admins</li>
            <li>• Configuration des événements et catégories</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
