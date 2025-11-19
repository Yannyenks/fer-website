
import React, { useEffect, useState } from 'react';
import Section, { SectionTitle } from './Section';
import { getSectionImage } from './sectionImageService';
import { findProjectAsset } from './assetLoader';

const ClubTag: React.FC<{ children: React.ReactNode, delay?: string }> = ({ children, delay='0ms' }) => (
    <span className="inline-block bg-white text-gray-700 font-semibold px-4 py-2 rounded-full shadow-md transform hover:scale-110 hover:bg-custom-green hover:text-white transition-all duration-300" style={{ transitionDelay: delay }}>
        {children}
    </span>
);


const Clubs: React.FC = () => {
  const clubsList = [
    "Sport & Découvertes", "Art", "Culture & Tradition", "Journal",
    "Danse & ICC", "Culinaire", "Couture", "TIC", "Agriculture & Agropastorale"
  ];

  return (
    <Section className="bg-slate-100">
      <SectionTitle withHeart>CLUBS EXISTANTS</SectionTitle>
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <img src={useClubsImage()} alt="Club Activities" className="rounded-2xl shadow-2xl w-full h-auto object-cover"/>
        </div>
        <div className="lg:w-1/2 flex flex-wrap gap-4 justify-center">
            {clubsList.map((club, index) => (
                <ClubTag key={club} delay={`${index * 50}ms`}>{club}</ClubTag>
            ))}
        </div>
      </div>
    </Section>
  );
};

export default Clubs;

function useClubsImage() {
  const [src, setSrc] = useState<string>('');
  useEffect(() => {
    let mounted = true;
    // Always use project asset only
    findProjectAsset('clubs').then(a => { if (mounted && a) setSrc(a); });
    return () => { mounted = false; };
  }, []);
  return src;
}
