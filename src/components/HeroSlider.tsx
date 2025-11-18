import React from 'react';
import { Link } from 'react-router-dom';
import EventsSlider from './EventsSlider';

const HeroSlider: React.FC = () => {
  return (
    <section className="hero-slider mb-8">
      <div className="max-w-6xl mx-auto p-4">
        <div className="rounded-lg overflow-hidden shadow-lg" style={{backgroundImage:"url('/assets/hero-1.jpg')", backgroundSize:'cover', backgroundPosition:'center', minHeight:220}}>
          <div style={{background:'rgba(0,0,0,0.35)', padding:24, color:'white'}}>
            <h2 className="text-2xl md:text-3xl font-bold">Bienvenue à la Maison des Fils et Filles de Ngambé</h2>
            <p className="mt-2">Espace de promotion des talents ruraux, d'échanges et d'opportunités.</p>
            <div className="mt-4">
              <Link to="/events" className="px-4 py-2 bg-green-600 rounded text-white">Voir les événements</Link>
              <Link to="/concours" className="ml-3 px-4 py-2 border rounded text-white">Concours</Link>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <EventsSlider />
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
