import React from "react";
import CandidateCard from "../components/CandidateCard";
import { mockCandidates } from "../data/mock";
import { useNavigate } from "react-router-dom";

const CandidatesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white px-6 py-16">

      <h1 className="text-center text-5xl font-bold mb-10"
          style={{ color: "#d4af37" }}>
        Les Candidates & Candidats
      </h1>

      <div className="grid md:grid-cols-3 gap-10">
        {mockCandidates.map((c) => (
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
