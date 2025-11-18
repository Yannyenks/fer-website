import React, { useState, useEffect } from 'react';
import Section, { SectionTitle } from '../../components/Section';
import { setSectionImage, getSectionImage, listSectionImages } from '../../components/sectionImageService';
import { useToast } from '../../components/ToastProvider';

const SECTIONS = [
  { id: 'about-1', label: 'About - Objectif global' },
  { id: 'about-2', label: 'About - Notre mission' },
  { id: 'fer-hero', label: 'FER - Hero / bannière' },
  { id: 'gallery-1', label: 'Gallery - image 1' },
  { id: 'clubs', label: 'Clubs - image principale' },
];

// List of project assets available under public/assets (served at /assets/...)
const PROJECT_ASSETS = [
  '/assets/about-objective.jpg',
  '/assets/about-mission.jpg',
  '/assets/fer-hero.jpg',
  '/assets/gallery-1.jpg',
  '/assets/clubs.jpg',
];

const SectionImagesAdmin: React.FC = () => {
  const [images, setImages] = useState<Record<string,string>>({});
  const [selected, setSelected] = useState(SECTIONS[0].id);
  const [preview, setPreview] = useState<string | null>(null);
  const [useProjectAsset, setUseProjectAsset] = useState<string | null>(null);
  const [projectAssets, setProjectAssets] = useState<string[] | null>(null);
  const toast = useToast();

  useEffect(() => {
    setImages(listSectionImages());
  }, []);

  useEffect(() => {
    // attempt to load /assets/manifest.json generated in the project
    const loadManifest = async () => {
      try {
        const res = await fetch('/assets/manifest.json');
        if (!res.ok) throw new Error('no manifest');
        const data = await res.json();
        if (Array.isArray(data)) setProjectAssets((data as string[]).map((p) => encodeURI(p)));
      } catch (e) {
        setProjectAssets(null);
      }
    };
    loadManifest();
  }, []);

  useEffect(() => {
    setPreview(getSectionImage(selected));
    setUseProjectAsset(null);
  }, [selected]);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (useProjectAsset) {
      // store a path to project asset
      setSectionImage(selected, useProjectAsset);
      setImages(listSectionImages());
      toast.show('Image (projet) enregistrée pour la section ' + selected, 'success');
      return;
    }
    if (!preview) return toast.show('Aucune image sélectionnée', 'error');
    setSectionImage(selected, preview);
    setImages(listSectionImages());
    toast.show('Image enregistrée pour la section ' + selected, 'success');
  };

  const remove = () => {
    setSectionImage(selected, null);
    setPreview(null);
    setImages(listSectionImages());
    toast.show('Image supprimée pour la section ' + selected, 'info');
  };

  return (
    <Section>
      <SectionTitle>Gestion des images par section (dev)</SectionTitle>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <label className="block text-sm font-medium mb-2">Section</label>
        <select value={selected} onChange={(e)=>setSelected(e.target.value)} className="mb-4 p-2 border rounded w-full">
          {SECTIONS.map(s=> <option key={s.id} value={s.id}>{s.label} ({s.id})</option>)}
        </select>

        <label className="block text-sm font-medium mb-2">Téléverser une nouvelle image</label>
        <input type="file" accept="image/*" onChange={(e)=>handleFile(e.target.files?.[0])} />

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Ou utiliser une image du projet (dossier <code>/public/assets</code>)</label>
          <div className="flex gap-2">
            <select className="p-2 border rounded w-full" value={useProjectAsset || ''} onChange={(e)=>{
              const v = e.target.value || null;
              const enc = v ? encodeURI(v) : null;
              setUseProjectAsset(enc);
              if (enc) {
                setPreview(enc);
              }
            }}>
            <option value="">-- Aucune --</option>
              {(projectAssets || PROJECT_ASSETS).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button type="button" className="px-3 py-2 border rounded" onClick={async () => {
              // re-fetch manifest
              try {
                const res = await fetch('/assets/manifest.json');
                if (!res.ok) throw new Error('no manifest');
                const data = await res.json();
                if (Array.isArray(data)) setProjectAssets((data as string[]).map((p) => encodeURI(p)));
                toast.show('Liste d\'assets rafraîchie', 'success');
              } catch (e) {
                setProjectAssets(null);
                toast.show('Manifest non trouvé — utilisation de la liste par défaut', 'error');
              }
            }}>Rafraîchir</button>
          </div>
          <div className="text-xs text-gray-500 mt-2">Pour ajouter un fichier, déposez-le dans <code>public/assets</code> (ex: <code>public/assets/fer-hero.jpg</code>) puis sélectionnez-le ici.</div>
        </div>

        {preview ? (
          <div className="mt-4">
            <div className="mb-2 text-sm text-gray-600">Aperçu :</div>
            <img src={preview} alt="preview" className="w-full max-h-64 object-cover rounded" />
          </div>
        ) : (
          <div className="mt-4 text-sm text-gray-500">Aucune image sélectionnée. Si une image existe déjà, elle est affichée ci-dessous.</div>
        )}

        {images[selected] && !preview && (
          <div className="mt-4">
            <div className="mb-2 text-sm text-gray-600">Image actuelle :</div>
            <img src={images[selected]} alt="actuelle" className="w-full max-h-64 object-cover rounded" />
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button onClick={save} className="px-4 py-2 bg-green-700 text-white rounded">Enregistrer</button>
          <button onClick={remove} className="px-4 py-2 border rounded">Supprimer</button>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>Les images sont stockées localement dans le navigateur via <code>localStorage</code>. Ce mécanisme est destiné au prototypage.</p>
        </div>
      </div>
    </Section>
  );
};

export default SectionImagesAdmin;
