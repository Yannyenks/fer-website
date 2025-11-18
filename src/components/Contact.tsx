
import React from 'react';

const Contact: React.FC = () => {
  return (
    <section className="bg-gray-800 text-white py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-4 text-custom-green">REJOIGNEZ LE CJ</h2>
        <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto mb-10">
          Construisons un avenir prospère pour nos communautés
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-lg mb-12">
            <span>Ngambè, Cameroun</span>
            <span className="hidden md:inline">|</span>
            <a href="mailto:contact@jvepi.org" className="hover:text-custom-green transition-colors">contact@jvepi.org</a>
            <span className="hidden md:inline">|</span>
            <span>+237 689 11 52 08</span>
        </div>
         <a href="mailto:contact@jvepi.org" className="bg-custom-green text-white font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105 inline-block text-xl">
            Devenir Volontaire
          </a>
      </div>
    </section>
  );
};

export default Contact;
