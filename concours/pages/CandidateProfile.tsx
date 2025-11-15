import React from "react";
import { useParams } from "react-router-dom";
import { mockCandidates } from "../data/mock";

const CandidateProfile = () => {
  const { slug } = useParams();
  const candidate = mockCandidates.find((c) => c.slug === slug);

  if (!candidate) return <p className="text-white p-10">Profil introuvable.</p>;

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

          <button
            className="mt-6 px-10 py-4 rounded-full text-black font-bold"
            style={{
              background: "linear-gradient(90deg,#b68d2e,#e4c766)"
            }}
          >
            Voter Maintenant
          </button>
        </div>
      </div>

    </div>
  );
};

export default CandidateProfile;
