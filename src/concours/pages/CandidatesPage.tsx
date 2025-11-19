import React, { useEffect, useState } from "react";
import CandidateCard from "../components/CandidateCard";
import { getAllCandidates } from "../services/candidateService";
import { useNavigate } from "react-router-dom";
import { Candidate } from "../types";

const CandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const list = await getAllCandidates();
      if (mounted) setCandidates(list);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white px-6 py-16">

      <h1 className="text-center text-5xl font-bold mb-10"
          style={{ color: "#d4af37" }}>
        Les Candidates & Candidats
      </h1>

      <div className="grid md:grid-cols-3 gap-10">
        {candidates.map((c) => (
          <CandidateCard
            key={c.id}
            candidate={c}
            onClick={() => navigate(`/concours/candidate/${c.slug}`)}
          />
        ))}
      </div>

    </div>
  );
};

export default CandidatesPage;
