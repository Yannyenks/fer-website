
import React from 'react';
import Section, { SectionTitle } from './Section';

const AchievementCard: React.FC<{ title: string; children: React.ReactNode; delay?: string; }> = ({ title, children, delay = '0s' }) => (
  <div className="bg-custom-green text-white p-6 rounded-2xl shadow-lg transform transition-all duration-500" style={{ transitionDelay: delay }}>
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="opacity-90">{children}</p>
      </div>
    </div>
  </div>
);

const Achievements: React.FC = () => {
    const achievements = [
        {
            title: "Boutique sociale",
            description: "Offre des produits alimentaires à des prix cadeaux à toute la population.",
        },
        {
            title: "Salle Informatique",
            description: "Espace de recherche et d'innovation avec 10 ordinateurs.",
        },
        {
            title: "Bibliothèque",
            description: "Plus de 350 ouvrages disponibles pour tous les âges.",
        },
        {
            title: "Journée de la réussite",
            description: "Programme d'accompagnement scolaire intensif et gratuit pour lycéens et collégiens.",
        },
        {
            title: "Rentrée pour tous",
            description: "Sensibiliser et offrir un sourire à plus de 700 élèves chaque rentrée depuis 2020.",
        },
    ];

  return (
    <Section>
      <SectionTitle>NOS RÉALISATIONS</SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {achievements.map((item, index) => (
          <AchievementCard key={item.title} title={item.title} delay={`${index * 100}ms`}>
            {item.description}
          </AchievementCard>
        ))}
      </div>
    </Section>
  );
};

export default Achievements;
