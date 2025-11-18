import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCandidateBySlug, updateCandidate } from "../services/candidateService";
import { useAuth } from '../../components/AuthProvider';
import { useToast } from '../../components/ToastProvider';

const CandidateProfile = () => {
  const { slug } = useParams();
  const candidate = getCandidateBySlug(slug || '');

  if (!candidate) return <p className="text-white p-10">Profil introuvable.</p>;

  const { user } = useAuth();
  const navigate = useNavigate();
  const [votes, setVotes] = useState(candidate.votes || 0);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (!user) { setVoted(false); return; }
    setVoted(!!localStorage.getItem(`vote_${user.id}_${candidate.id}`));
  }, [user, candidate.id]);

  const toast = useToast();

  const handleVote = () => {
    if (!user) return navigate(`/login?redirect=/concours/candidate/${candidate.slug}`);
    const participantKey = `fer_participant_${user.id}`;
    if (!localStorage.getItem(participantKey)) {
      const go = window.confirm('Vous devez être inscrit à la FER pour voter. Voulez-vous vous inscrire maintenant ?');
      if (go) return navigate(`/inscription?redirect=/concours/candidate/${candidate.slug}`);
      return;
    }
    const key = `vote_${user.id}_${candidate.id}`;
    if (localStorage.getItem(key)) { toast.show('Vous avez déjà voté pour ce candidat.', 'info'); return; }
    localStorage.setItem(key, '1');
    const updated = updateCandidate(candidate.id, { votes: (candidate.votes || 0) + 1 });
    setVotes(updated?.votes ?? (votes + 1));
    setVoted(true);
    toast.show('Merci pour votre vote !', 'success');
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white p-10">

      <div className="flex flex-col md:flex-row gap-14">

        <img
          src={candidate.photo}
          className="rounded-xl shadow-2xl w-full md:w-[400px]"
        />

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold" style={{ color: "#d4af37" }}>
            {candidate.name}
          </h1>

          <p className="text-gray-300">{candidate.domain}</p>
          <p className="text-gray-300">Origine : {candidate.origin}</p>

          <p className="text-gray-400 leading-relaxed mt-4">
            {candidate.bio}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="text-[#d4af37] font-bold">Votes : {votes}</div>
            <button onClick={handleVote} disabled={voted} className={`px-6 py-3 rounded-full text-black font-bold ${voted ? 'bg-gray-600':'bg-yellow-500'}`} style={{background: voted ? undefined : 'linear-gradient(90deg,#b68d2e,#e4c766)'}}>
              {voted ? 'Voté' : 'Voter Maintenant'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CandidateProfile;
