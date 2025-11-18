import React, { useState } from 'react';
import EventCard from '../components/EventCard';
import { mockEvents, EventItem } from '../data/events';

const EventsPage: React.FC = () => {
  const [filter, setFilter] = useState<'All' | EventItem['type']>('All');

  const types = Array.from(new Set(mockEvents.map((m) => m.type)));

  const items = mockEvents.filter((e) => filter === 'All' ? true : e.type === filter);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Événements & Actions</h1>

      <div className="mb-4 flex gap-3 items-center">
        <label className="font-semibold">Filtrer :</label>
        <button onClick={() => setFilter('All')} className={`px-3 py-1 rounded ${filter==='All' ? 'bg-green-700 text-white':''}`}>Tous</button>
        {types.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1 rounded ${filter===t ? 'bg-green-700 text-white':''}`}>{t}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {items.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
