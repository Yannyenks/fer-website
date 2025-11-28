import React from "react";
import { Link } from "react-router-dom";
import EventsSlider from "./EventsSlider";

const HeroSlider: React.FC = () => {
  return (
    <section
      className="hero-slider w-full"
      role="banner"
      aria-label="Bannière principale"
    >
      {/* Section Hero principale */}

      <div className="w-full relative group">
        <div
          className="overflow-hidden shadow-lg md:shadow-2xl transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: "url('/assets/hero-1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            minHeight: "clamp(250px, 50vh, 400px)",
          }}
          role="img"
          aria-label="Bienvenue à la Maison des Fils et Filles de Ngambé - Espace de promotion des talents ruraux"
        >
          {/* Overlay avec dégradé */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />

          {/* Contenu */}
          <div className="relative p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 max-w-7xl mx-auto h-full flex items-center">
            <div className="max-w-2xl w-full">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
                Bienvenue à la Maison des Fils et Filles de Ngambé
              </h1>
              <p className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-white/95 max-w-2xl leading-relaxed">
                Espace de promotion des talents ruraux, d'échanges et
                d'opportunités.
              </p>
              <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <Link
                  to="/events"
                  className="px-6 sm:px-8 py-2 sm:py-3 md:py-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span>Voir les événements</span>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  to="/concours"
                  className="px-6 sm:px-8 py-2 sm:py-3 md:py-4 border-2 border-white hover:bg-white/10 rounded-lg text-white font-semibold text-center transition-all duration-300 backdrop-blur-sm hover:border-green-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
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
      <div className="w-full mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Événements à venir
            </h2>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
              Découvrez nos prochaines activités et rencontres
            </p>
          </div>

          {/* Conteneur du slider sans padding latéral */}
          <div className="w-full overflow-x-visible">
            <EventsSlider />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
