import React from "react";
import { Routes, Route } from "react-router-dom";

import AwardsHome from "./concours/pages/AwardsPage";
import Candidates from "./concours/pages/CandidatesPage";
import CandidateProfile from "./concours/pages/CandidateProfile";

import App from "./App";

export default function RouterFile() {
  return (
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="/awards" element={<AwardsHome />} />
      <Route path="/awards/candidates" element={<Candidates />} />
      <Route path="/awards/candidate/:id" element={<CandidateProfile />} />
    </Routes>
  );
}
