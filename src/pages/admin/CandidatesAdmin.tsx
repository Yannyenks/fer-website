import React, { useEffect, useState } from 'react';
import { getAllCandidates, addCandidate, deleteCandidate, updateCandidate } from '../../concours/services/candidateService';
import { Candidate } from '../../concours/types';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const CandidatesAdmin: React.FC = () => {
  const [list, setList] = useState<Candidate[]>([]);
  const [form, setForm] = useState({ name: '', slug: '', type: 'miss' as 'miss' | 'awards', age: 0, origin: '', domain: '', bio: '', photo: '', votes: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'miss' | 'awards'>('all');

  const refresh = () => setList(getAllCandidates());

  useEffect(() => {
    // initial load
    (async () => { setList(await getAllCandidates()); })();
    // listen for storage changes from other tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'fer_candidates_v1') refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const [message, setMessage] = useState<{type:'success'|'error', text:string}|null>(null);

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('prefix', 'candidate');
      
      const adminKey = localStorage.getItem('jvepi_user');
      if (!adminKey) throw new Error('Non authentifié');
      
      const userData = JSON.parse(adminKey);
      
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-ADMIN-KEY': userData.api_key || ''
        }
      });
      
      return response.data.url || null;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!form.name || !form.slug) return setMessage({ type: 'error', text: 'Nom et identifiant URL requis' });

    setUploading(true);
    
    // Upload image if a file is selected
    let photoUrl = form.photo;
    if (selectedFile) {
      const uploadedUrl = await uploadImageToStorage(selectedFile);
      if (uploadedUrl) {
        photoUrl = uploadedUrl;
      } else {
        setUploading(false);
        return setMessage({ type: 'error', text: 'Erreur lors de l\'upload de l\'image' });
      }
    }

    // slug uniqueness check (unless editing same candidate)
    const allCandidates = await getAllCandidates();
    const existing = allCandidates.find(c => c.slug === form.slug);
    if (existing && existing.id !== editingId) {
      setUploading(false);
      return setMessage({ type: 'error', text: 'Cet identifiant URL existe déjà. Choisissez-en un autre.' });
    }

    if (editingId) {
      const updated = await updateCandidate(editingId, { ...form, photo: photoUrl });
      setUploading(false);
      if (!updated) return setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
      setEditingId(null);
      setForm({ name: '', slug: '', type: 'miss', age: 0, origin: '', domain: '', bio: '', photo: '', votes: 0 });
      setSelectedFile(null);
      setList(await getAllCandidates());
      setMessage({ type: 'success', text: 'Candidat mis à jour.' });
      return;
    }

    await addCandidate({ ...form, photo: photoUrl, votes: 0, gallery: [] });
    setUploading(false);
    setForm({ name: '', slug: '', type: 'miss', age: 0, origin: '', domain: '', bio: '', photo: '', votes: 0 });
    setSelectedFile(null);
    setList(await getAllCandidates());
    setMessage({ type: 'success', text: 'Candidat ajouté.' });
  };

  const handleDelete = (id: number) => {
    if (!confirm('Supprimer ce candidat ?')) return;
    (async () => {
      await deleteCandidate(id);
      setList(await getAllCandidates());
      setMessage({ type: 'success', text: 'Candidat supprimé.' });
    })();
  };

  const handleEdit = (c: Candidate) => {
    setEditingId(c.id);
    setForm({ name: c.name, slug: c.slug, type: c.type || 'miss', age: c.age, origin: c.origin, domain: c.domain, bio: c.bio, photo: c.photo, votes: c.votes || 0 });
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFile = async (f?: File) => {
    if (!f) return;
    setSelectedFile(f);
    // Preview with object URL
    const preview = URL.createObjectURL(f);
    setForm((s) => ({ ...s, photo: preview }));
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Gestion des candidats</h1>

        {/* Filtre par type */}
        <div className="mb-6 backdrop-blur-lg bg-white/70 p-4 rounded-2xl shadow-xl border border-white/50">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par catégorie :</label>
          <div className="flex gap-3">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              📋 Tous ({list.length})
            </button>
            <button
              onClick={() => setFilterType('miss')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === 'miss'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              👑 Miss ({list.filter(c => (c.type || 'miss') === 'miss').length})
            </button>
            <button
              onClick={() => setFilterType('awards')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === 'awards'
                  ? 'bg-gradient-to-r from-yellow-600 to-amber-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏆 Awards ({list.filter(c => c.type === 'awards').length})
            </button>
          </div>
        </div>

        <form onSubmit={handleAdd} className="mb-8 backdrop-blur-lg bg-white/70 p-6 rounded-2xl shadow-xl border border-white/50">
          {message && (
            <div className={`p-3 mb-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
              <input 
                value={form.name} 
                onChange={(e)=>setForm({...form, name:e.target.value})} 
                placeholder="Ex: Jean Dupont" 
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant URL *</label>
              <input 
                value={form.slug} 
                onChange={(e)=>setForm({...form, slug:e.target.value})} 
                placeholder="Ex: jean-dupont" 
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-xs text-gray-500 mt-1">Utilisé dans l'URL (lettres, chiffres, tirets)</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de candidat *</label>
              <select 
                value={form.type} 
                onChange={(e)=>setForm({...form, type: e.target.value as 'miss' | 'awards'})} 
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="miss">👑 Miss</option>
                <option value="awards">🏆 Awards</option>
              </select>
              <div className="text-xs text-gray-500 mt-1">Miss ou Awards (non visible publiquement)</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
              <input 
                type="number" 
                value={form.age} 
                onChange={(e)=>setForm({...form, age: Number(e.target.value)})} 
                placeholder="Ex: 25" 
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origine</label>
              <input 
                value={form.origin} 
                onChange={(e)=>setForm({...form, origin:e.target.value})} 
                placeholder="Ex: Paris, France" 
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domaine d'activité</label>
              <input 
                value={form.domain} 
                onChange={(e)=>setForm({...form, domain:e.target.value})} 
                placeholder="Ex: Musique, Art, Sport..." 
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {editingId && (
              <div className="p-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm">
                <span className="text-sm text-gray-600">Votes actuels: </span>
                <span className="font-semibold text-green-600">{form.votes}</span>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Image du candidat</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e)=>handleFile(e.target.files?.[0])}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm"
              />
              <div className="text-sm text-gray-500">Ou collez une URL dans le champ ci-dessous</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de la photo</label>
              <input 
                value={form.photo} 
                onChange={(e)=>setForm({...form, photo:e.target.value})} 
                placeholder="https://..." 
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
            <textarea 
              value={form.bio} 
              onChange={(e)=>setForm({...form, bio:e.target.value})} 
              placeholder="Décrivez le parcours et les réalisations du candidat..." 
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button 
              type="submit" 
              disabled={uploading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '📤 Upload en cours...' : (editingId ? '💾 Sauvegarder' : '➕ Ajouter le candidat')}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={()=>{ 
                  setEditingId(null); 
                  setForm({ name: '', slug: '', type: 'miss', age: 0, origin: '', domain: '', bio: '', photo: '', votes: 0 }); 
                  setSelectedFile(null); 
                }} 
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all"
              >
                ✖ Annuler
              </button>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list
            .filter(c => filterType === 'all' || (c.type || 'miss') === filterType)
            .map(c => (
            <div key={c.id} className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl overflow-hidden border border-white/50 transition-transform hover:scale-105">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={c.photo} 
                  alt={c.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
                  }}
                />
                {/* Badge type */}
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-white text-xs font-semibold shadow-lg ${
                  (c.type || 'miss') === 'miss' 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600' 
                    : 'bg-gradient-to-r from-yellow-500 to-amber-600'
                }`}>
                  {(c.type || 'miss') === 'miss' ? '👑 Miss' : '🏆 Awards'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{c.name}</h3>
                <p className="text-sm text-gray-600 mt-1 truncate">{c.domain} • {c.origin}</p>
                <p className="text-sm font-semibold text-green-600 mt-2">
                  {c.votes || 0} vote{c.votes !== 1 ? 's' : ''}
                </p>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={()=>handleDelete(c.id)} 
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all text-sm"
                  >
                    🗑 Supprimer
                  </button>
                  <button 
                    onClick={()=>handleEdit(c)} 
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all text-sm"
                  >
                    ✏ Modifier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidatesAdmin;