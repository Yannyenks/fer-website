import React, { useEffect, useState } from 'react';
import { getAllCandidates, addCandidate, deleteCandidate, updateCandidate } from '../../concours/services/candidateService';
import { Candidate } from '../../concours/types';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const CandidatesAdmin: React.FC = () => {
  const [list, setList] = useState<Candidate[]>([]);
  const [form, setForm] = useState({ name: '', slug: '', age: 20, origin: '', domain: '', bio: '', photo: '', votes: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
    if (!form.name || !form.slug) return setMessage({ type: 'error', text: 'Nom et slug requis' });

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
      return setMessage({ type: 'error', text: 'Le slug existe déjà. Choisissez-en un autre.' });
    }

    if (editingId) {
      const updated = await updateCandidate(editingId, { ...form, photo: photoUrl });
      setUploading(false);
      if (!updated) return setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
      setEditingId(null);
      setForm({ name: '', slug: '', age: 20, origin: '', domain: '', bio: '', photo: '', votes: 0 });
      setSelectedFile(null);
      setList(await getAllCandidates());
      setMessage({ type: 'success', text: 'Candidat mis à jour.' });
      return;
    }

    await addCandidate({ ...form, photo: photoUrl, votes: 0, gallery: [] });
    setUploading(false);
    setForm({ name: '', slug: '', age: 20, origin: '', domain: '', bio: '', photo: '', votes: 0 });
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
    setForm({ name: c.name, slug: c.slug, age: c.age, origin: c.origin, domain: c.domain, bio: c.bio, photo: c.photo, votes: c.votes || 0 });
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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Gestion des candidats</h1>

        <form onSubmit={handleAdd} className="mb-6 bg-white p-4 rounded shadow">
          {message && (
            <div className={`p-2 mb-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{message.text}</div>
          )}
          <div className="grid md:grid-cols-3 gap-3">
            <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} placeholder="Nom" className="p-2 border rounded" />
            <input value={form.slug} onChange={(e)=>setForm({...form, slug:e.target.value})} placeholder="slug (url-friendly)" className="p-2 border rounded" />
            <input type="number" value={form.age} onChange={(e)=>setForm({...form, age: Number(e.target.value)})} placeholder="Age" className="p-2 border rounded" />
            <input value={form.origin} onChange={(e)=>setForm({...form, origin:e.target.value})} placeholder="Origine" className="p-2 border rounded" />
            <input value={form.domain} onChange={(e)=>setForm({...form, domain:e.target.value})} placeholder="Domaine" className="p-2 border rounded" />
            {editingId && (
              <div className="p-2 border rounded bg-gray-50">
                <span className="text-sm text-gray-600">Votes: </span>
                <span className="font-semibold text-green-600">{form.votes}</span>
              </div>
            )}
            <div className={editingId ? 'md:col-span-3' : ''}>
              <input type="file" accept="image/*" onChange={(e)=>handleFile(e.target.files?.[0])} />
              <div className="text-sm text-gray-500 mt-1">Ou collez une URL dans le champ photo</div>
              <input value={form.photo} onChange={(e)=>setForm({...form, photo:e.target.value})} placeholder="URL ou image" className="p-2 border rounded mt-2 w-full" />
            </div>
            <textarea value={form.bio} onChange={(e)=>setForm({...form, bio:e.target.value})} placeholder="Bio" className="p-2 border rounded md:col-span-3" />
          </div>
          <div className="mt-3">
            <button 
              type="submit" 
              disabled={uploading}
              className="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Upload en cours...' : (editingId ? 'Sauvegarder les modifications' : 'Ajouter')}
            </button>
            {editingId && <button type="button" onClick={()=>{ setEditingId(null); setForm({ name: '', slug: '', age: 20, origin: '', domain: '', bio: '', photo: '', votes: 0 }); setSelectedFile(null); }} className="ml-2 px-4 py-2 border rounded">Annuler</button>}
          </div>
        </form>

        <div className="grid md:grid-cols-3 gap-4">
          {list.map(c => (
            <div key={c.id} className="bg-white p-3 rounded shadow">
              <img src={c.photo} alt={c.name} className="w-full h-40 object-cover rounded" />
              <h3 className="mt-2 font-semibold">{c.name}</h3>
              <p className="text-sm text-gray-600">{c.domain} • {c.origin}</p>
              <p className="text-sm font-semibold text-green-600 mt-1">{c.votes || 0} vote{c.votes !== 1 ? 's' : ''}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={()=>handleDelete(c.id)} className="px-3 py-1 bg-red-600 text-white rounded">Supprimer</button>
                <button onClick={()=>handleEdit(c)} className="px-3 py-1 bg-blue-600 text-white rounded">Modifier</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidatesAdmin;
