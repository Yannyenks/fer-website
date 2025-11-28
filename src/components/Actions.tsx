import React from "react";
import Section, { SectionTitle } from "./Section";

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  delay?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  delay = "0s",
}) => (
  <div
    className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 ease-in-out text-center group"
    style={{ transitionDelay: delay }}
  >
    <div className="mx-auto mb-3 sm:mb-4 bg-custom-green text-white h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center transform group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 leading-tight">
      {title}
    </h3>
  </div>
);

const Actions: React.FC = () => {
  const actions = [
    { icon: <IconSupport />, title: "Accompagnement" },
    { icon: <IconAwareness />, title: "Sensibilisation" },
    { icon: <IconTraining />, title: "Formation" },
    { icon: <IconNetworking />, title: "Réseautage" },
    { icon: <IconFacilitation />, title: "Facilitation" },
  ];

  return (
    <Section className="bg-slate-100">
      <SectionTitle withHeart>ACTIONS PRINCIPALES</SectionTitle>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto px-4 sm:px-6">
        {actions.map((action, index) => (
          <ActionCard
            key={action.title}
            icon={action.icon}
            title={action.title}
            delay={`${index * 100}ms`}
          />
        ))}
      </div>
    </Section>
  );
};

// Icons avec tailles responsives
const IconSupport = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const IconAwareness = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.584C18.354 1.86 19.17 1 20.24 1h.016c.91.01 1.686.723 1.74 1.637l.084 1.151C22.091 8.236 20.06 12 16.5 12H11"
    />
  </svg>
);
const IconTraining = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
    />
  </svg>
);
const IconNetworking = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);
const IconFacilitation = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.93L5 10m7 0a2 2 0 00-2 2v5a2 2 0 002 2h4.764a2 2 0 001.789-2.894l-3.5-7A2 2 0 0014 10z"
    />
  </svg>
);

export default Actions;
