import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockEvents } from '../data/events';
import { useAuth } from '../components/AuthProvider';
import { useToast } from '../components/ToastProvider';

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === id);

  if (!event) return <div className="p-6">Événement introuvable.</div>;
  const { user } = useAuth();
  const toast = useToast();
  const [registered, setRegistered] = useState(!!(user && localStorage.getItem(`event_reg_${user.id}_${event.id}`)));

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {event.image && <img src={event.image} className="w-full h-64 object-cover" />}
        <div className="p-6">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()} • {event.location}</p>
          <p className="mt-4 text-gray-800">{event.description}</p>

          <div className="mt-6 flex gap-3">
            <button onClick={() => {
              if (!user) { toast.show('Connectez-vous pour vous inscrire.', 'info'); return; }
              localStorage.setItem(`event_reg_${user.id}_${event.id}`, '1');
              setRegistered(true);
              toast.show('Inscription enregistrée pour cet événement.', 'success');
            }} className={`px-4 py-2 ${registered? 'bg-gray-500 text-white':'bg-green-700 text-white'} rounded`} disabled={registered}>{registered ? 'Inscrit' : 'S\'inscrire'}</button>

            <button onClick={() => {
              const url = `${window.location.origin}/events/${event.id}`;
              navigator.clipboard?.writeText(url).then(()=>toast.show('Lien d\'événement copié', 'success')).catch(()=>toast.show('Impossible de copier le lien', 'error'))
            }} className="px-4 py-2 border rounded">Partager</button>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold">Galerie</h3>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {/* Placeholder images */}
              <div className="bg-gray-100 h-28 rounded"></div>
              <div className="bg-gray-100 h-28 rounded"></div>
              <div className="bg-gray-100 h-28 rounded"></div>
              <div className="bg-gray-100 h-28 rounded"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetail;
