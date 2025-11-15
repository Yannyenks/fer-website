import React from "react";
import { Link } from "react-router-dom";

const Candidates = () => {
  const candidates = [
    {
      id: 1,
      name: "Nkelly Diane",
      project: "Transformation agricole et chaîne de valeur manioc",
      img: "/candidates/diane.jpg",
    },
  ];

  return (
    <section className="pt-32 pb-20 bg-white">
      <h2 className="text-3xl font-bold text-center text-[#4A3B2A] mb-10">
        Nominés FER 2025
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="bg-slate-50 rounded-xl shadow-md p-5 hover:shadow-xl transition"
          >
            <img src={c.img} className="w-full h-64 object-cover rounded-lg" />

            <h3 className="text-xl font-bold mt-4 text-[#4A3B2A]">{c.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{c.project}</p>

            <Link
              to={`/awards/vote/${c.id}`}
              className="block text-center bg-[#4A7C2A] hover:bg-[#3E6A24] text-white py-2 rounded-full transition"
            >
              Voter
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Candidates;
