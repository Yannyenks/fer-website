
import React from 'react';
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

const App: React.FC = () => {
  const navLinks = [
    { title: 'Présentation', id: 'presentation' },
    { title: 'Actions', id: 'actions' },
    { title: 'Réalisations', id: 'realisations' },
    { title: 'Contact', id: 'contact' },
  ];

  return (
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
  );
};

export default App;
