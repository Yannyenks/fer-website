
import React, { useEffect, useState } from 'react';
import { getSectionImage } from './sectionImageService';
import { findProjectAsset } from './assetLoader';
import Section, { SectionTitle } from './Section';
import { HeartLogo } from './icons/HeartLogo';

const InfoBlock: React.FC<{ title: string; children: React.ReactNode; imageSrc: string; reverse?: boolean; sectionId?: string }> = ({ title, children, imageSrc, reverse = false, sectionId }) => {
  const [src, setSrc] = useState<string>(imageSrc);

  useEffect(() => {
    let mounted = true;
    // Always use project asset only
    if (sectionId) {
      findProjectAsset(sectionId).then((asset) => {
        if (mounted && asset) setSrc(asset);
      });
    }
    return () => { mounted = false; };
  }, [imageSrc, sectionId]);

  return (
    <div className={`flex flex-col md:flex-row items-center gap-12 lg:gap-16 ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className="md:w-1/2">
        <div className="flex items-center gap-4 mb-4">
            <HeartLogo className="h-8 w-8 text-custom-green" />
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">
          {children}
        </p>
      </div>
      <div className="md:w-1/2">
        <img src={src} alt={title} className="rounded-2xl shadow-2xl w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500" />
      </div>
    </div>
  );
};

const About: React.FC = () => {
  return (
    <Section>
      <SectionTitle>PRÉSENTATION</SectionTitle>
      <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
        <p className="text-lg text-gray-600 leading-relaxed">
          Le <span className="font-bold text-custom-green">Centre Jeunes JVEPI - FOMACK</span>, la maison des Fils et Filles de Ngambè, est un espace dédié aux adolescents et aux jeunes adultes, visant à favoriser leur épanouissement personnel, académique et socio-professionnel. Ce lieu convivial offre une variété d'activités et de services adaptés aux besoins et aux intérêts des jeunes.
        </p>
      </div>

      <div className="space-y-20">
        <InfoBlock title="OBJECTIF GLOBAL" imageSrc="https://picsum.photos/800/600?random=1" sectionId="about-1">
          Promouvoir le bien-être des jeunes au sein du Centre, identifier et mettre en place des actions adaptées pour accompagner leur réussite.
        </InfoBlock>
        <InfoBlock title="NOTRE MISSION" imageSrc="https://picsum.photos/800/600?random=2" reverse sectionId="about-2">
          Créer un environnement sain et dynamique pour les jeunes, leur permettant de s'épanouir et de devenir des acteurs de leur propre vie.
        </InfoBlock>
      </div>
    </Section>
  );
};

export default About;
