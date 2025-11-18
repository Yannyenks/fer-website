import React from "react";

const AwardsPage = () => {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white px-6 py-16">

      <h1 className="text-center text-5xl font-bold mb-10"
          style={{ color: "#d4af37" }}>
        Awards FER 2025
      </h1>

      <p className="text-gray-300 max-w-3xl mx-auto text-center mb-16">
        Découvrez les acteurs les plus brillants des chaînes de valeur rurales,
        de l’artisanat à l’innovation agricole.
      </p>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="p-8 rounded-xl shadow-xl bg-[#111] border border-[#d4af37]/30">
          <h3 className="text-xl font-bold text-[#d4af37]">Artisan de l’année</h3>
        </div>
        <div className="p-8 rounded-xl shadow-xl bg-[#111] border border-[#d4af37]/30">
          <h3 className="text-xl font-bold text-[#d4af37]">Agriculture & élevage</h3>
        </div>
        <div className="p-8 rounded-xl shadow-xl bg-[#111] border border-[#d4af37]/30">
          <h3 className="text-xl font-bold text-[#d4af37]">Innovation TIC</h3>
        </div>
      </div>

    </div>
  );
};

export default AwardsPage;
