import React from "react";
import { Routes, Route } from "react-router-dom";

import AwardsHome from "./components/pages/awards/AwardsHome";
import Candidates from "./components/pages/awards/Candidates";
import Vote from "./components/pages/awards/Vote";

import App from "./App";

export default function RouterFile() {
  return (
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="/awards" element={<AwardsHome />} />
      <Route path="/awards/candidates" element={<Candidates />} />
      <Route path="/awards/vote/:id" element={<Vote />} />
    </Routes>
  );
}
