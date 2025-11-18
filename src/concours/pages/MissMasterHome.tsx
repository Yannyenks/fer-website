import React from "react";
import { Link } from "react-router-dom";

const MissMasterHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">

      {/* HERO */}
      <div
        className="h-[80vh] flex flex-col justify-center items-center text-center px-6"
        style={{
          backgroundImage: "url('/assets/hero-miss.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0,0,0,0.6)"
        }}
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-wider"
            style={{ color: "#d4af37" }}>
          Miss • Master FER 2025
        </h1>

        <p className="max-w-2xl mt-6 text-lg text-gray-200">
          L’élégance. Le leadership. L’excellence rurale.  
          Découvrez les talents qui incarnent l’avenir.
        </p>

        <div className="flex gap-6 mt-10">
          <Link
            to="/concours/candidates"
            className="px-8 py-4 rounded-full font-semibold text-black"
            style={{
              background: "linear-gradient(90deg,#b68d2e,#e4c766)"
            }}
          >
            Voir les candidates & candidats
          </Link>

          <Link
            to="/concours/awards"
            className="px-8 py-4 rounded-full border border-[#d4af37] text-[#d4af37]"
          >
            Awards FER 2025
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MissMasterHome;
