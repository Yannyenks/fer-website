import React from 'react';

const Mission: React.FC = () => {
  return (
    <section className="mission p-8 bg-white rounded-lg shadow-md max-w-5xl mx-auto my-8">
      <h2 className="text-2xl font-bold" style={{color:'#276749'}}>Maison des Fils et Filles de Ngambé — Mission</h2>
      <p className="mt-3 text-gray-700">La Maison des Fils et Filles de Ngambé soutient le développement local en accompagnant
        les jeunes ruraux vers l'emploi, l'entrepreneuriat et la valorisation des savoir-faire locaux. Nous organisons
        des formations, des espaces d'exposition, et facilitons les rencontres multi-acteurs pour créer des opportunités durables.</p>

      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#f6faf2] rounded">
          <h4 className="font-semibold">Mission</h4>
          <p className="text-sm">Renforcer l'employabilité et l'entrepreneuriat rural.</p>
        </div>
        <div className="p-4 bg-[#fdf6ec] rounded">
          <h4 className="font-semibold">Valeurs</h4>
          <p className="text-sm">Solidarité, innovation, ancrage local.</p>
        </div>
        <div className="p-4 bg-[#f7f9f6] rounded">
          <h4 className="font-semibold">Actions</h4>
          <p className="text-sm">Formations, événements, accompagnement de projets.</p>
        </div>
      </div>
    </section>
  );
};

export default Mission;
