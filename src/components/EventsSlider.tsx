import React from 'react';
import { mockEvents } from '../data/events';
import { Link } from 'react-router-dom';

const EventsSlider: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* Conteneur avec padding seulement sur les côtés pour l'espacement */}
      <div 
        className="events-slider overflow-x-auto flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 py-3 sm:py-4 scrollbar-hide"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          scrollPadding: '0 16px'
        }}
      >
        {/* Premier élément avec marge gauche */}
        <div className="flex-shrink-0 w-4 sm:w-6 md:w-8 lg:w-12" />
        
        {mockEvents.map((e) => (
          <div 
            key={e.id} 
            className="flex-shrink-0 w-64 sm:w-72 md:w-80 lg:w-96 transform transition-transform duration-200 hover:scale-105"
          >
            <div className="rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300 h-full mx-1 sm:mx-2">
              {e.image && (
                <img 
                  src={e.image} 
                  alt={e.title} 
                  className="w-full h-40 sm:h-44 md:h-48 lg:h-52 object-cover"
                />
              )}
              <div className="p-3 sm:p-4 md:p-5">
                <h4 className="text-base sm:text-lg md:text-xl font-semibold mb-2 line-clamp-2">
                  {e.title}
                </h4>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                  {e.short}
                </p>
                <Link 
                  to={`/events/${e.id}`} 
                  className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-all duration-200 text-sm sm:text-base hover:scale-105"
                >
                  Voir
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Dernier élément avec marge droite */}
        <div className="flex-shrink-0 w-4 sm:w-6 md:w-8 lg:w-12" />
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .events-slider {
          -webkit-overflow-scrolling: touch;
        }
        /* Style pour le scroll snap optionnel */
        /* .events-slider {
          scroll-snap-type: x mandatory;
        }
        .events-slider > div:not(:first-child):not(:last-child) {
          scroll-snap-align: start;
        } */
      `}</style>
    </div>
  );
};

export default EventsSlider;