import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import HeroSlider from './components/HeroSlider';
import About from './components/About';
import Mission from './components/Mission';
import Actions from './components/Actions';
import Achievements from './components/Achievements';
import Clubs from './components/Clubs';
import Gallery from './components/Gallery';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FER2025 from './components/FER2025';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AuthProvider from './components/AuthProvider';
import ToastProvider from './components/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute';
import VoteLoginButton from './components/VoteLoginButton';

// === Import des pages concours ===
import AwardsPage from './concours/pages/AwardsPage';
import CandidatesPage from './concours/pages/CandidatesPage';
import CandidateProfile from './concours/pages/CandidateProfile';
import MissMasterHome from './concours/pages/MissMasterHome';
import Inscription from './pages/Inscription';
import CandidatesAdmin from './pages/admin/CandidatesAdmin';
import SectionImagesAdmin from './pages/admin/SectionImagesAdmin';
import VotesAdmin from './pages/admin/VotesAdmin';
import ActionsIndex from './pages/actions/ActionsIndex';
import ActionDetail from './pages/actions/ActionDetail';

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
      <AuthProvider>
      <ToastProvider>
      {/* Global header shown on all pages */}
      <Header navLinks={navLinks} />
      <Routes>

        {/* === PAGE VITRINE PRINCIPALE === */}
        <Route
          path="/"
          element={
            <div className="bg-slate-50 text-gray-800 antialiased">
              <main>
                <Hero />
                <HeroSlider />
                <Mission />
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
                <FER2025 />
                <Partners />
                <div id="contact">
                  <Contact />
                </div>
              </main>
              <Footer />
            </div>
          }
        />

        {/* Events */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetail />} />

        {/* Auth & Profile */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/admin/candidates" element={<ProtectedRoute requiredRole="admin"><CandidatesAdmin /></ProtectedRoute>} />
        <Route path="/admin/section-images" element={<ProtectedRoute requiredRole="admin"><SectionImagesAdmin /></ProtectedRoute>} />
        <Route path="/admin/votes" element={<ProtectedRoute requiredRole="admin"><VotesAdmin /></ProtectedRoute>} />

        {/* === PAGES DU CONCOURS === */}
        <Route path="/concours" element={<MissMasterHome />} />
        <Route path="/concours/candidates" element={<CandidatesPage />} />
        <Route path="/concours/candidate/:slug" element={<CandidateProfile />} />
        <Route path="/concours/awards" element={<AwardsPage />} />
        <Route path="/inscription" element={<Inscription />} />
        {/* Developer: actions pages for each button / action discovered */}
        <Route path="/actions" element={<ProtectedRoute requiredRole="admin"><ActionsIndex /></ProtectedRoute>} />
        <Route path="/actions/:action" element={<ProtectedRoute requiredRole="admin"><ActionDetail /></ProtectedRoute>} />

      </Routes>
      </ToastProvider>
      <VoteLoginButton />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
