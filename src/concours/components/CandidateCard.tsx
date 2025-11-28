import React, { useEffect, useState } from "react";
import { Candidate } from "../types";
import { useAuth } from '../../components/AuthProvider';
import { useToast } from '../../components/ToastProvider';
import api from '../../services/api';

interface Props {
  candidate: Candidate;
  onClick: () => void;
}

const CandidateCard: React.FC<Props> = ({ candidate, onClick }) => {
  const { user } = useAuth();
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(candidate.votes || 0);

  useEffect(() => {
    if (!user) { setVoted(false); return; }
    // Check if user has voted for this CATEGORY (miss or awards)
    const categoryType = candidate.type || 'miss';
    const hasVoted = !!localStorage.getItem(`user_voted_${categoryType}_${user.id}`);
    setVoted(hasVoted);
  }, [user, candidate.id, candidate.type]);

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
    
    const categoryType = candidate.type || 'miss';
    const categoryVoteKey = `user_voted_${categoryType}_${user.id}`;
    
    if (localStorage.getItem(categoryVoteKey)) {
      const categoryLabel = categoryType === 'miss' ? 'Miss' : 'Awards';
      toast.show(`Vous avez déjà voté dans la catégorie ${categoryLabel}. Un seul vote par catégorie est autorisé.`, 'info');
      return;
    }
    
    // Vote via API backend
    (async () => {
      try {
        const response = await api.post('/vote', { candidate_id: candidate.id });
        if (response.data.ok) {
          localStorage.setItem(categoryVoteKey, candidate.id.toString());
          setVoted(true);
          setVotes(votes + 1);
          toast.show('Vote enregistré !', 'success');
        }
      } catch (error: any) {
        if (error.response?.status === 409) {
          const votedFor = error.response?.data?.voted_for;
          const votedForName = error.response?.data?.voted_for_name;
          const category = error.response?.data?.category;
          const categoryLabel = category === 'miss' ? 'Miss' : 'Awards';
          
          if (votedForName) {
            toast.show(`Vous avez déjà voté pour ${votedForName} dans la catégorie ${categoryLabel}`, 'error');
          } else {
            toast.show(`Vous avez déjà voté dans la catégorie ${categoryLabel}`, 'error');
          }
          
          if (votedFor) {
            localStorage.setItem(categoryVoteKey, votedFor.toString());
          }
          setVoted(true);
        } else {
          toast.show('Erreur lors du vote', 'error');
        }
      }
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
        src={candidate.photo}
        alt={candidate.name}
        className="w-full h-80 object-cover"
      />

      <div className="px-6 py-4">
        <h3 className="text-2xl font-semibold">{candidate.name}</h3>
        <p className="text-gray-400">{candidate.domain} • {candidate.origin}</p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[#d4af37] font-bold">{votes || 0} vote{votes !== 1 ? 's' : ''}</p>
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
