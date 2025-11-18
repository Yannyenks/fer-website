import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

const Register: React.FC = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name, email, password);
    navigate(redirect);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Inscription</h2>
        <label className="block">Nom</label>
        <input className="w-full p-2 border rounded mb-3" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="block">Email</label>
        <input className="w-full p-2 border rounded mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block">Mot de passe</label>
        <input type="password" className="w-full p-2 border rounded mb-3" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex justify-between items-center">
          <button className="px-4 py-2 bg-green-700 text-white rounded">Créer</button>
          <a href="/login" className="text-sm text-gray-600">Se connecter</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
