import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Actions from './components/Actions';
import Achievements from './components/Achievements';
import Clubs from './components/Clubs';
import Gallery from './components/Gallery';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';

// === Import des pages concours ===
import AwardsPage from './concours/pages/AwardsPage';
import CandidatesPage from './concours/pages/CandidatesPage';
import CandidateProfile from './concours/pages/CandidateProfile';
import MissMasterHome from './concours/pages/MissMasterHome';

const App: React.FC = () => {
  const navLinks = [
    { title: 'Présentation', id: 'presentation' },
    { title: 'Actions', id: 'actions' },
    { title: 'Réalisations', id: 'realisations' },
    { title: 'Contact', id: 'contact' },
    { title: 'FER Awards 2025', href: '/concours', isButton: true },
  ];

  return (
    <BrowserRouter>
      <Routes>

        {/* === PAGE VITRINE PRINCIPALE === */}
        <Route
          path="/"
          element={
            <div className="bg-slate-50 text-gray-800 antialiased">
              <Header navLinks={navLinks} />
              <main>
                <Hero />
                <div id="presentation">
                  <About />
                </div>
                <div id="actions">
                  <Actions />
                </div>
                <div id="realisations">
                  <Achievements />
                </div>
                <Clubs />
                <Gallery />
                <Partners />
                <div id="contact">
                  <Contact />
                </div>
              </main>
              <Footer />
            </div>
          }
        />

        {/* === PAGES DU CONCOURS === */}
        <Route path="/concours" element={<MissMasterHome />} />
        <Route path="/concours/candidates" element={<CandidatesPage />} />
        <Route path="/concours/candidate/:slug" element={<CandidateProfile />} />
        <Route path="/concours/awards" element={<AwardsPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
