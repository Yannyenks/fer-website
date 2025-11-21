import React from 'react';
import { Link } from 'react-router-dom';
import EventsSlider from './EventsSlider';

const HeroSlider: React.FC = () => {
  return (
    <section className="hero-slider w-full" role="banner" aria-label="Bannière principale">
      {/* Section Hero principale */}
      <div className="w-full relative group">
        <div 
          className="overflow-hidden shadow-lg md:shadow-2xl transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: "url('/assets/hero-1.jpg')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundAttachment: 'fixed',
            minHeight: 'clamp(250px, 50vh, 400px)'
          }}
          role="img"
          aria-label="Bienvenue à la Maison des Fils et Filles de Ngambé - Espace de promotion des talents ruraux"
        >
          {/* Overlay avec dégradé */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
          
          {/* Contenu */}
          <div className="relative p-6 sm:p-8 md:p-12 lg:p-16 max-w-7xl mx-auto h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                Bienvenue à la Maison des Fils et Filles de Ngambé
              </h1>
              <p className="mt-3 md:mt-4 text-base sm:text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed">
                Espace de promotion des talents ruraux, d'échanges et d'opportunités.
              </p>
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link 
                  to="/events" 
                  className="px-8 py-3 md:py-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Voir les événements</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  to="/concours" 
                  className="px-8 py-3 md:py-4 border-2 border-white hover:bg-white/10 rounded-lg text-white font-semibold text-center transition-all duration-300 backdrop-blur-sm hover:border-green-300 hover:scale-105 active:scale-95"
                >
                  Découvrir les concours
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Indicateur de défilement */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden md:block">
          <div className="animate-bounce w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </div>
      </div>

      {/* Section Slider des événements */}
      <div className="w-full mt-8 md:mt-12 lg:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Événements à venir
            </h2>
            <p className="mt-2 text-gray-600">
              Découvrez nos prochaines activités et rencontres
            </p>
          </div>
          <EventsSlider />
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;