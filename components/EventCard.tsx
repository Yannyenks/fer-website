import React from 'react';
import { EventItem } from '../data/events';
import { Link } from 'react-router-dom';

interface Props {
  event: EventItem;
}

const EventCard: React.FC<Props> = ({ event }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-white">
      {event.image && (
        <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()}</p>
        <p className="mt-2 text-gray-700">{event.short}</p>

        <div className="mt-4 flex items-center justify-between">
          <Link to={`/events/${event.id}`} className="px-3 py-2 bg-green-700 text-white rounded">Détails</Link>
          <span className="text-sm text-gray-500">{event.type}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
