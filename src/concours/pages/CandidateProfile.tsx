import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCandidateBySlug } from "../services/candidateService";
import { useAuth } from '../../components/AuthProvider';
import { useToast } from '../../components/ToastProvider';
import api from '../../services/api';

const CandidateProfile = () => {
  const { slug } = useParams();
  const [candidate, setCandidate] = useState<any | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const c = await getCandidateBySlug(slug || '');
      if (mounted && c) {
        setCandidate(c);
        setVotes(c.votes || 0);
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  useEffect(() => {
    if (!user || !candidate) { setVoted(false); return; }
    // Check if user has voted for this CATEGORY (miss or awards)
    const categoryType = candidate.type || 'miss';
    const hasVoted = !!localStorage.getItem(`user_voted_${categoryType}_${user.id}`);
    setVoted(hasVoted);
  }, [user, candidate]);

  const toast = useToast();

  const handleVote = () => {
    if (!candidate) return;
    if (!user) return navigate(`/login?redirect=/concours/candidate/${candidate.slug}`);
    const participantKey = `fer_participant_${user.id}`;
    if (!localStorage.getItem(participantKey)) {
      const go = window.confirm('Vous devez être inscrit à la FER pour voter. Voulez-vous vous inscrire maintenant ?');
      if (go) return navigate(`/inscription?redirect=/concours/candidate/${candidate.slug}`);
      return;
    }
    
    const categoryType = candidate.type || 'miss';
    const categoryVoteKey = `user_voted_${categoryType}_${user.id}`;
    
    if (localStorage.getItem(categoryVoteKey)) { 
      const categoryLabel = categoryType === 'miss' ? 'Miss' : 'Awards';
      toast.show(`Vous avez déjà voté dans la catégorie ${categoryLabel}. Un seul vote par catégorie est autorisé.`, 'info'); 
      return; 
    }
    
    (async () => {
      try {
        const response = await api.post('/vote', { candidate_id: candidate.id });
        if (response.data.ok) {
          localStorage.setItem(categoryVoteKey, candidate.id.toString());
          setVotes(votes + 1);
          setVoted(true);
          toast.show('Merci pour votre vote !', 'success');
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

  if (!candidate) return <p className="text-white p-10">Profil introuvable.</p>;

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row gap-10 items-start">
          
          {/* Photo du candidat avec forme fixe */}
          <div className="w-full md:w-[420px] flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#d4af37]">
              <div className="aspect-[3/4] bg-gray-900">
                <img
                  src={candidate.photo}
                  alt={candidate.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Statistiques de votes */}
            <div className="mt-6 bg-gradient-to-r from-[#1a1a1a] to-[#0c0c0c] p-6 rounded-xl border border-[#d4af37]/30">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#d4af37] mb-2">{votes || 0}</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Vote{votes !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>

          {/* Informations du candidat */}
          <div className="flex-1 flex flex-col gap-6">
            <div>
              <h1 className="text-5xl font-bold mb-3" style={{ color: "#d4af37" }}>
                {candidate.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-lg">
                <span className="px-4 py-2 bg-[#1a1a1a] rounded-lg border border-[#d4af37]/20">
                  {candidate.domain}
                </span>
                <span className="px-4 py-2 bg-[#1a1a1a] rounded-lg border border-[#d4af37]/20">
                  📍 {candidate.origin}
                </span>
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#d4af37]/20">
              <h2 className="text-xl font-semibold text-[#d4af37] mb-3">Biographie</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {candidate.bio}
              </p>
            </div>

            {/* Bouton de vote */}
            <div className="mt-4">
              <button 
                onClick={handleVote} 
                disabled={voted} 
                className={`w-full md:w-auto px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 ${voted ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'text-black shadow-xl hover:shadow-2xl'}`} 
                style={{background: voted ? undefined : 'linear-gradient(90deg,#b68d2e,#e4c766)'}}
              >
                {voted ? '✓ Vous avez voté' : '⭐ Voter pour ce candidat'}
              </button>
              {voted && (
                <p className="text-sm text-gray-500 mt-3">Vous ne pouvez voter qu'une seule fois pour un seul candidat.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CandidateProfile;
