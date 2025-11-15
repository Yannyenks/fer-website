import React, { useState } from "react";
import { motion } from "framer-motion";
import { Candidate } from "../types";

interface Props {
  candidate: Candidate;
  onClose: () => void;
}

const VoteModal: React.FC<Props> = ({ candidate, onClose }) => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const sendOtp = () => setOtpSent(true);
  const validateOtp = () => alert(`Vote confirmé pour ${candidate.name}!`);

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#0c0c0c] p-10 rounded-2xl w-96 shadow-xl flex flex-col gap-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-[#d4af37]">Votez pour {candidate.name}</h2>

        {!otpSent ? (
          <>
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-lg w-full text-black"
            />
            <button
              onClick={sendOtp}
              className="px-6 py-3 rounded-full text-black font-bold"
              style={{ background: "linear-gradient(90deg,#b68d2e,#e4c766)" }}
            >
              Envoyer OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Entrez l'OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="px-4 py-3 rounded-lg w-full text-black"
            />
            <button
              onClick={validateOtp}
              className="px-6 py-3 rounded-full text-black font-bold"
              style={{ background: "linear-gradient(90deg,#b68d2e,#e4c766)" }}
            >
              Confirmer Vote
            </button>
          </>
        )}

        <button onClick={onClose} className="mt-2 text-gray-400 underline">Annuler</button>
      </motion.div>
    </motion.div>
  );
};

export default VoteModal;
