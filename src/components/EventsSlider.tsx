import React from 'react';
import { mockEvents } from '../data/events';
import { Link } from 'react-router-dom';

const EventsSlider: React.FC = () => {
  // Simple horizontal scroll list (no dependency)
  return (
    <div className="events-slider" style={{ overflowX: 'auto', display: 'flex', gap: 12, padding: '12px 4px' }}>
      {mockEvents.map((e) => (
        <div key={e.id} style={{ minWidth: 320, flex: '0 0 auto' }}>
          <div className="rounded-lg overflow-hidden shadow-md bg-white">
            {e.image && <img src={e.image} alt={e.title} className="w-full h-40 object-cover" />}
            <div style={{ padding: 12 }}>
              <h4 style={{ margin: 0 }}>{e.title}</h4>
              <p style={{ margin: '6px 0', color: '#666' }}>{e.short}</p>
              <Link to={`/events/${e.id}`} className="px-3 py-2 bg-olive-600 text-white rounded">Voir</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsSlider;
