
import React, { ReactNode } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = '' }) => {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`py-16 md:py-24 transition-all duration-1000 ease-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="container mx-auto px-6">
        {children}
      </div>
    </div>
  );
};

export const SectionTitle: React.FC<{ children: ReactNode, withHeart?: boolean }> = ({ children, withHeart = false }) => (
  <div className="text-center mb-12 md:mb-16">
      {withHeart && <div className="text-custom-green text-5xl mb-4 inline-block">♡</div>}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">{children}</h2>
      <div className="mt-4 w-24 h-1 bg-custom-green mx-auto rounded-full"></div>
  </div>
);

export default Section;
