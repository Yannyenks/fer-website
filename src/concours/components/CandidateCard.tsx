import React, { useEffect, useState } from "react";
import { Candidate } from "../types";
import { useAuth } from '../../components/AuthProvider';
import { useToast } from '../../components/ToastProvider';
import { updateCandidate } from '../services/candidateService';
import { useNavigate } from 'react-router-dom';
import { resolveCandidateImage } from '../../components/assetResolver';

interface Props {
  candidate: Candidate;
  onClick: () => void;
}

const CandidateCard: React.FC<Props> = ({ candidate, onClick }) => {
  const { user } = useAuth();
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(candidate.votes || 0);
  const [src, setSrc] = useState<string>(candidate.photo);

  useEffect(() => {
    if (!user) { setVoted(false); return; }
    const key = `vote_${user.id}_${candidate.id}`;
    setVoted(!!localStorage.getItem(key));
  }, [user, candidate.id]);

  useEffect(() => {
    let mounted = true;
    // Always use asset manifest for candidate photo
    (async () => {
      const resolved = await resolveCandidateImage({ slug: candidate.slug, name: candidate.name });
      if (mounted) setSrc(resolved);
    })();
    return () => { mounted = false; };
  }, [candidate.slug, candidate.name]);

  const toast = useToast();

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.show('Connectez-vous pour voter.', 'info');
      return;
    }
    // Ensure user is registered/inscribed for FER before voting
    const participantKey = `fer_participant_${user.id}`;
    if (!localStorage.getItem(participantKey)) {
      const go = window.confirm('Vous devez être inscrit à la FER pour voter. Voulez-vous vous inscrire maintenant ?');
      if (go) {
        // redirect to inscription with return to this candidate
        const url = `/inscription?redirect=${encodeURIComponent(`/concours/candidate/${candidate.slug}`)}`;
        window.location.href = url;
      }
      return;
    }
    const key = `vote_${user.id}_${candidate.id}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    setVoted(true);
    // Persist vote count via API
    (async () => {
      const updated = await updateCandidate(candidate.id, { votes: (candidate.votes || 0) + 1 });
      setVotes(updated?.votes ?? (votes + 1));
    })();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/concours/candidate/${candidate.slug}`;
    navigator.clipboard?.writeText(url).then(() => {
      toast.show('Lien copié dans le presse-papiers', 'success');
    }).catch(() => {
      toast.show('Impossible de copier automatiquement. Le lien est affiché.', 'error');
      prompt('Copiez le lien', url);
    });
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl overflow-hidden 
                 shadow-xl transform hover:scale-105 transition-all duration-300"
      style={{
        background: "linear-gradient(180deg, #1a1a1a, #0c0c0c)"
      }}
    >
      <img
        src={src}
        alt={candidate.name}
        className="w-full h-80 object-cover"
      />

      <div className="px-6 py-4">
        <h3 className="text-2xl font-semibold">{candidate.name}</h3>
        <p className="text-gray-400">{candidate.domain} • {candidate.origin}</p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[#d4af37] font-bold">Votes : {votes}</p>
          <div className="flex gap-2">
            <button onClick={handleVote} disabled={voted} className={`px-3 py-2 rounded ${voted ? 'bg-gray-500 text-white':'bg-yellow-600 text-white'}`}>
              {voted ? 'Voté' : 'Voter'}
            </button>
            <button onClick={handleShare} className="px-3 py-2 rounded border text-white">Partager</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
