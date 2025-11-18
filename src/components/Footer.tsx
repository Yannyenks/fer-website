
import React from 'react';
import { HeartLogo } from './icons/HeartLogo';
import AppImage from './AppImage';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center items-center mb-4x  ">
            <AppImage.LOGO className="h-10 w-10 object-contain cursor-pointer" />
            <span className="ml-2 text-lg font-bold text-white">JVEPI Centre</span>
        </div>
        <p>&copy; {new Date().getFullYear()} JVEPI Centre. Tous droits réservés.</p>
        <p className="text-sm text-gray-500 mt-2">Créé avec passion pour un avenir meilleur.</p>
      </div>
    </footer>
  );
};

export default Footer;
