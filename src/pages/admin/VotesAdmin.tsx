import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface VoteStats {
  total_votes: number;
  candidates: Array<{
    id: number;
    name: string;
    votes: number;
    actual_votes: number;
  }>;
}

const VotesAdmin: React.FC = () => {
  const [stats, setStats] = useState<VoteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/votes/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des statistiques' });
    } finally {
      setLoading(false);
    }
  };

  const syncVotes = async () => {
    if (!confirm('Synchroniser les votes ? Cela recalculera tous les compteurs depuis la table votes.')) return;
    
    try {
      setSyncing(true);
      await api.post('/votes/sync');
      setMessage({ type: 'success', text: 'Votes synchronisés avec succès' });
      await loadStats();
    } catch (error) {
      console.error('Error syncing votes:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la synchronisation' });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Statistiques des votes</h1>
          <button
            onClick={syncVotes}
            disabled={syncing}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncing ? 'Synchronisation...' : 'Synchroniser les votes'}
          </button>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {stats && (
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">Résumé</h2>
            <p className="text-lg">
              Total des votes: <span className="font-bold text-green-600">{stats.total_votes}</span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Nombre de candidats: {stats.candidates.length}
            </p>
          </div>
        )}

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Candidat</th>
                <th className="px-4 py-3 text-center">Votes (DB)</th>
                <th className="px-4 py-3 text-center">Votes (Réels)</th>
                <th className="px-4 py-3 text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              {stats?.candidates.map((candidate, index) => {
                const isSync = candidate.votes === candidate.actual_votes;
                return (
                  <tr key={candidate.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-4 py-3">{candidate.id}</td>
                    <td className="px-4 py-3 font-semibold">{candidate.name}</td>
                    <td className="px-4 py-3 text-center">{candidate.votes}</td>
                    <td className="px-4 py-3 text-center">{candidate.actual_votes}</td>
                    <td className="px-4 py-3 text-center">
                      {isSync ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">✓ Sync</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">⚠ Désync</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ À propos</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Votes (DB)</strong>: Nombre stocké dans la colonne <code>votes</code> de la table <code>candidates</code></li>
            <li>• <strong>Votes (Réels)</strong>: Nombre réel compté depuis la table <code>votes</code></li>
            <li>• Si les deux colonnes ne correspondent pas, cliquez sur "Synchroniser les votes"</li>
            <li>• La synchronisation recalcule tous les compteurs depuis la table votes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VotesAdmin;
