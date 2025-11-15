import React from "react";
import { Candidate } from "../types";

interface Props {
  candidate: Candidate;
  onClick: () => void;
}

const CandidateCard: React.FC<Props> = ({ candidate, onClick }) => {
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

        <p className="mt-4 text-[#d4af37] font-bold">
          Votes : {candidate.votes}
        </p>
      </div>
    </div>
  );
};

export default CandidateCard;
