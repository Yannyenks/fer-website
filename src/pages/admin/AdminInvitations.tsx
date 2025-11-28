import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useToast } from '../../components/ToastProvider';
import api from '../../services/api';

type Invitation = {
  id: number;
  token: string;
  email: string | null;
  expires_at: string;
  used_at: string | null;
  used_by_username: string | null;
  created_at: string;
};

const AdminInvitations: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [expiresIn, setExpiresIn] = useState(48);

  // Debug: vérifier l'état de l'utilisateur
  useEffect(() => {
    console.log('🔐 User state:', user);
    console.log('🔑 API Key présente:', !!user?.api_key);
    console.log('👤 Role:', user?.role);
  }, [user]);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    setLoading(true);
    try {
      if (!user?.api_key) {
        toast.show('Vous devez être connecté en tant qu\'admin avec une API key valide', 'error');
        setLoading(false);
        return;
      }
      
      console.log('📡 Sending request to /admin/invitations with API key:', user.api_key.substring(0, 20) + '...');
      
      const response = await api.get('/admin/invitations', {
        headers: {
          'X-ADMIN-KEY': user.api_key
        }
      });
      
      console.log('✅ Response received:', response.data);
      setInvitations(response.data.invitations || []);
    } catch (error: any) {
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        fullError: error
      });
      
      const errorMsg = error.response?.data?.error || 'Erreur lors du chargement des invitations';
      toast.show(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const createInvitation = async () => {
    if (expiresIn < 1 || expiresIn > 168) {
      toast.show('La durée doit être entre 1 et 168 heures', 'error');
      return;
    }

    setCreating(true);
    try {
      const response = await api.post('/admin/invitations', {
        email: newEmail || null,
        expires_in_hours: expiresIn
      }, {
        headers: {
          'X-ADMIN-KEY': user?.api_key || ''
        }
      });

      if (response.data.ok) {
        toast.show('Invitation créée avec succès !', 'success');
        setNewEmail('');
        setExpiresIn(48);
        setShowCreateForm(false);
        loadInvitations();
        
        // Copier le lien dans le presse-papier
        const fullLink = `${window.location.origin}/admin-register?token=${response.data.token}`;
        navigator.clipboard.writeText(fullLink);
        toast.show('Lien copié dans le presse-papier !', 'success');
      }
    } catch (error: any) {
      toast.show(error.response?.data?.error || 'Erreur lors de la création', 'error');
    } finally {
      setCreating(false);
    }
  };

  const deleteInvitation = async (id: number) => {
    if (!confirm('Supprimer cette invitation ?')) return;

    try {
      await api.delete(`/admin/invitations/${id}`, {
        headers: {
          'X-ADMIN-KEY': user?.api_key || ''
        }
      });
      toast.show('Invitation supprimée', 'success');
      loadInvitations();
    } catch (error) {
      toast.show('Erreur lors de la suppression', 'error');
    }
  };

  const copyInvitationLink = (token: string) => {
    const fullLink = `${window.location.origin}/admin-register?token=${token}`;
    navigator.clipboard.writeText(fullLink);
    toast.show('Lien copié dans le presse-papier !', 'success');
  };

  const getStatusBadge = (invitation: Invitation) => {
    if (invitation.used_at) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">✅ Utilisée</span>;
    }
    if (new Date(invitation.expires_at) < new Date()) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">⏰ Expirée</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">⏳ Active</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Invitations Administrateurs</h1>
          <p className="text-gray-600 mt-1">Gérez les invitations pour créer de nouveaux comptes admin</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {showCreateForm ? '❌ Annuler' : '➕ Nouvelle invitation'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md border-2 border-blue-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Créer une invitation</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (optionnel)
              </label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="admin@fer2025.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Si spécifié, seul cet email pourra utiliser l'invitation
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validité (heures)
              </label>
              <input
                type="number"
                min="1"
                max="168"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={expiresIn}
                onChange={(e) => setExpiresIn(parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Entre 1 et 168 heures (7 jours maximum)
              </p>
            </div>

            <button
              onClick={createInvitation}
              disabled={creating}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {creating ? '⏳ Création...' : '🎫 Générer l\'invitation'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement...</p>
        </div>
      ) : invitations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📬</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune invitation</h3>
          <p className="text-gray-600 mb-6">Créez une invitation pour permettre à un nouvel administrateur de s'inscrire</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            ➕ Créer ma première invitation
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créée le
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expire le
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisée par
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invitations.map((invitation) => (
                  <tr key={invitation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invitation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invitation.email || <span className="text-gray-400 italic">Non spécifié</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invitation.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invitation.expires_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invitation.used_by_username ? (
                        <span className="text-green-700 font-medium">{invitation.used_by_username}</span>
                      ) : (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {!invitation.used_at && new Date(invitation.expires_at) > new Date() && (
                        <button
                          onClick={() => copyInvitationLink(invitation.token)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Copier le lien"
                        >
                          📋
                        </button>
                      )}
                      <button
                        onClick={() => deleteInvitation(invitation.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Comment ça marche ?</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Créez une invitation en spécifiant optionnellement un email et une durée de validité</li>
          <li>Copiez le lien généré et envoyez-le au futur administrateur</li>
          <li>Le destinataire pourra créer son compte admin via ce lien unique</li>
          <li>Chaque invitation ne peut être utilisée qu'une seule fois</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminInvitations;
