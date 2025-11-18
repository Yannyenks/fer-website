import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { useToast } from '../components/ToastProvider';

const Login: React.FC = () => {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const u = await login(email, password, adminSecret || undefined);
      if (u) {
        toast.show(`Connecté en tant que ${u.name} (${u.role})`, 'success');
      }
      navigate(redirect);
    } catch (err) {
      toast.show('Erreur lors de la connexion', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Connexion</h2>
        <label className="block">Email</label>
        <input className="w-full p-2 border rounded mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block">Mot de passe</label>
        <input type="password" className="w-full p-2 border rounded mb-3" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label className="block text-sm text-gray-600">Secret admin (optionnel)</label>
        <input type="password" className="w-full p-2 border rounded mb-3" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} placeholder="(laisser vide pour login normal)" />
        <div className="flex justify-between items-center">
          <button className="px-4 py-2 bg-green-700 text-white rounded">Se connecter</button>
          <a href="/register" className="text-sm text-gray-600">Créer un compte</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
