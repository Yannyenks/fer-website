import React from "react";
import { motion } from "framer-motion";
import { AwardCategory } from "../types";

interface Props {
  award: AwardCategory;
}

const NomineeCard: React.FC<Props> = ({ award }) => {
  return (
    <motion.div
      className="p-8 rounded-xl shadow-xl bg-[#111] border border-[#d4af37]/30 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-bold text-[#d4af37]">{award.title}</h3>
      {award.nominees.map((n) => (
        <p key={n.id} className="text-gray-300 mt-2">{n.name}</p>
      ))}
    </motion.div>
  );
};

export default NomineeCard;
