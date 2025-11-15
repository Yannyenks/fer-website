
import React from 'react';
import Section, { SectionTitle } from './Section';

const PartnerLogo: React.FC<{ name: string, delay?: string }> = ({ name, delay = '0s' }) => (
  <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105" style={{transitionDelay: delay}}>
    <p className="text-center font-semibold text-gray-600">{name}</p>
  </div>
);

const Partners: React.FC = () => {
  const partners = [
    "Mairie de Ngambe",
    "Nohans & Partners Sarl",
    "Leonardo Cameroun Sarl",
    "JVEPI Centre",
    "Ministère des Arts et de la Culture",
    "The Okwelians",
    "Fondation Mackenzie",
    "E-Intellect",
    "Minyao For Children"
  ];
  return (
    <Section className="bg-slate-100">
      <SectionTitle>ILS NOUS ONT FAIT CONFIANCE</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {partners.map((partner, index) => (
          <PartnerLogo key={partner} name={partner} delay={`${index*50}ms`}/>
        ))}
      </div>
    </Section>
  );
};

export default Partners;
