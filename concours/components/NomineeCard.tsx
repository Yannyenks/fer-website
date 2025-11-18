import React, { useState } from "react";
import { motion } from "framer-motion";
import { AwardCategory } from "../types";
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ToastProvider';

interface Props {
  award: AwardCategory;
}

const NomineeCard: React.FC<Props> = ({ award }) => {
  const [open, setOpen] = useState<null | { id: number; name: string; photo: string }>(null);
  const navigate = useNavigate();
  const toast = useToast();

  const openPreview = (id: number, name: string, photo: string) => {
    setOpen({ id, name, photo: encodeURI(photo) });
  };

  const close = () => setOpen(null);

  const handleVote = (slug: string) => {
    navigate(`/concours/candidate/${slug}`);
    close();
  };

  const handleShare = (name: string) => {
    const text = `Je soutiens ${name} aux FER Awards 2025!`;
    if (navigator.share) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      navigator.share({ title: 'FER Awards 2025', text });
    } else {
      navigator.clipboard?.writeText(text);
      toast.show('Texte de partage copié dans le presse-papiers', 'info');
    }
  };

  return (
    <>
      <motion.div
        className="p-6 rounded-xl shadow-xl bg-white border cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="text-lg font-bold text-slate-800 mb-3">{award.title}</h3>
        <div className="grid grid-cols-2 gap-4">
          {award.nominees.map((n) => (
            <div key={n.id} className="flex items-center gap-3 bg-slate-50 p-2 rounded">
              <img
                src={encodeURI(n.photo)}
                alt={n.name}
                className="w-16 h-16 object-cover rounded-md border"
                onClick={() => openPreview(n.id, n.name, n.photo)}
                style={{ cursor: 'pointer' }}
              />
              <div className="flex-1">
                <div className="font-semibold">{n.name}</div>
                <div className="text-sm text-gray-500">{n.domain} • {n.origin}</div>
              </div>
              <div>
                <button onClick={() => handleVote(n.slug)} className="px-3 py-1 bg-green-600 text-white rounded">Voter</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={close}>
          <div className="bg-white rounded shadow-lg max-w-2xl w-full mx-4 p-4" onClick={(e)=>e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <h4 className="text-xl font-bold">{open.name}</h4>
              <div className="flex gap-2">
                <button onClick={() => handleShare(open.name)} className="px-3 py-1 text-sm border rounded">Partager</button>
                <button onClick={close} className="px-3 py-1 text-sm border rounded">Fermer</button>
              </div>
            </div>
            <div className="mt-4">
              <img src={open.photo} alt={open.name} className="w-full h-96 object-contain rounded" />
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => handleVote(award.nominees.find(n=>n.id===open.id)!.slug)} className="px-4 py-2 bg-indigo-600 text-white rounded">Voter pour {open.name}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NomineeCard;
