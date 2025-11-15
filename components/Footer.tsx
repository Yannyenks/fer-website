
import React from 'react';
import { HeartLogo } from './icons/HeartLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center items-center mb-4">
            <HeartLogo className="h-8 w-8 text-custom-green" />
            <span className="ml-2 text-lg font-bold text-white">JVEPI Centre</span>
        </div>
        <p>&copy; {new Date().getFullYear()} JVEPI Centre. Tous droits réservés.</p>
        <p className="text-sm text-gray-500 mt-2">Créé avec passion pour un avenir meilleur.</p>
      </div>
    </footer>
  );
};

export default Footer;
