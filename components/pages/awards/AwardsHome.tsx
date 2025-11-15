import React from "react";
import { Link } from "react-router-dom";

const AwardsHome = () => {
  return (
    <section className="min-h-screen bg-slate-50 pt-32 pb-20 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#4A3B2A] mb-4">
        FER Awards 2025
      </h1>

      <p className="max-w-2xl mx-auto text-gray-700 text-lg">
        Découvrez les nominés et votez pour votre candidat préféré.
      </p>

      <div className="mt-10 flex justify-center gap-6">
        <Link
          to="/awards/candidates"
          className="bg-[#4A7C2A] hover:bg-[#3E6A24] text-white px-8 py-3 rounded-full text-lg"
        >
          Voir les nominés
        </Link>
      </div>
    </section>
  );
};

export default AwardsHome;
