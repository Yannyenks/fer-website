import React from 'react';
import { useAuth } from '../../components/AuthProvider';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useToast } from '../../components/ToastProvider';

const AdminDashboardInner: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Tableau de bord — Administrateur</h1>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">Créer / modifier événements</div>
          <div className="p-4 bg-white rounded shadow">Gérer concours & candidats</div>
          <div className="p-4 bg-white rounded shadow">Modération des inscriptions</div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  // Protect this route for admin only
  return (
    <ProtectedRoute requiredRole="admin">
      <div>
        <AdminDashboardInner />
        <AdminControls />
      </div>
    </ProtectedRoute>
  );
};

const AdminControls: React.FC = () => {
  const { user, logout } = useAuth();
  const toast = useToast();

  const revokeAdmin = () => {
    if (!user) return;
    const u = { ...user, role: 'member' };
    localStorage.setItem('jvepi_user', JSON.stringify(u));
    toast.show("Rôle admin retiré pour l'utilisateur courant", 'info');
    // reload to update ProtectedRoute redirect if needed
    window.location.reload();
  };

  return (
    <div className="mt-6 max-w-6xl mx-auto">
      <div className="bg-white p-4 rounded shadow flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">Utilisateur connecté :</div>
          <div className="font-medium">{user?.name} — <span className="text-xs text-gray-500">{user?.email}</span></div>
          <div className="mt-2 space-x-2">
            <a className="px-4 py-2 bg-blue-600 text-white rounded" href="/admin/candidates">Gérer les candidats</a>
            <a className="px-4 py-2 bg-green-700 text-white rounded ml-3" href="/admin/section-images">Gérer images sections</a>
            <a className="px-4 py-2 bg-purple-600 text-white rounded ml-3" href="/admin/votes">Statistiques des votes</a>
          </div>
        </div>
        <div>
          <button onClick={revokeAdmin} className="px-3 py-2 border rounded mr-2">Retirer admin</button>
          <button onClick={() => { logout(); toast.show('Déconnecté', 'info'); }} className="px-3 py-2 bg-red-600 text-white rounded">Se déconnecter</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
