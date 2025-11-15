import React from "react";
import { useParams } from "react-router-dom";

const Vote = () => {
  const { id } = useParams();

  return (
    <section className="min-h-screen flex justify-center items-center pt-20 bg-slate-100">
      <div className="bg-white shadow-lg p-10 rounded-xl text-center">
        <h2 className="text-3xl font-bold text-[#4A3B2A] mb-4">
          Vote pour le candidat #{id}
        </h2>

        <button className="bg-[#4A7C2A] hover:bg-[#3E6A24] text-white px-10 py-3 rounded-full text-lg">
          Voter maintenant
        </button>
      </div>
    </section>
  );
};

export default Vote;
