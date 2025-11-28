import React, { useEffect, useState } from "react";
import CandidateCard from "../components/CandidateCard";
import { getAllCandidates } from "../services/candidateService";
import { useNavigate } from "react-router-dom";
import { Candidate } from "../types";

const AwardsPage: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getAllCandidates();
        // Filtrer uniquement les candidats de type "awards"
        const awardsCandidates = list.filter(c => c.type === 'awards');
        if (mounted) {
          setCandidates(awardsCandidates);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des candidats Awards:", error);
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white px-6 py-16">

      <h1 className="text-center text-5xl font-bold mb-10"
          style={{ color: "#d4af37" }}>
        🏆 Awards FER 2025
      </h1>

      <p className="text-gray-300 max-w-3xl mx-auto text-center mb-16">
        Découvrez les acteurs les plus brillants des chaînes de valeur rurales,
        de l'artisanat à l'innovation agricole.
      </p>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#d4af37] border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Chargement des nominés...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-20">
          <div className="mb-6">
            <svg className="mx-auto h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-300">Aucun nominé pour le moment</h2>
          <p className="text-gray-500">Les nominés aux Awards seront bientôt disponibles. Revenez plus tard !</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          {candidates.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              onClick={() => navigate(`/concours/candidate/${c.slug}`)}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default AwardsPage;
