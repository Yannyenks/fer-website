import React from 'react';
import { mockEvents } from '../data/events';
import { Link } from 'react-router-dom';

const EventsSlider: React.FC = () => {
  // Simple horizontal scroll list (no dependency)
  return (
    <div className="w-full overflow-hidden">
      <div className="events-slider overflow-x-auto flex gap-4 md:gap-6 px-4 md:px-8 py-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {mockEvents.map((e) => (
          <div key={e.id} className="flex-shrink-0 w-72 sm:w-80 md:w-96">
            <div className="rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 h-full">
              {e.image && <img src={e.image} alt={e.title} className="w-full h-48 md:h-56 object-cover" />}
              <div className="p-4 md:p-5">
                <h4 className="text-lg md:text-xl font-semibold mb-2 line-clamp-2">{e.title}</h4>
                <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3">{e.short}</p>
                <Link to={`/events/${e.id}`} className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors duration-200">
                  Voir
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default EventsSlider;
