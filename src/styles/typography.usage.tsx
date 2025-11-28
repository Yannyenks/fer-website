/**
 * Tests et démonstrations d'utilisation du système de typographie
 * 
 * Ce fichier sert de référence pour l'utilisation correcte du système
 */

import React from 'react';

// ============================================
// 1. IMPORT DES UTILITAIRES
// ============================================

// Import individuel
import { FontSize, FontWeight, LineHeight } from '../styles/typography';

// Import de tout
import Typography from '../styles/typography';

// Import via index
import { TypographyPresets, TypographyClasses } from '../styles/index';


// ============================================
// 2. UTILISATION EN REACT (JSX/TSX)
// ============================================

// Exemple 1 : Classes CSS (le plus simple)
const Example1 = () => (
  <div>
    <h1 className="text-h1 font-bold">Titre principal</h1>
    <p className="text-body leading-relaxed">Paragraphe normal</p>
  </div>
);

// Exemple 2 : Styles inline avec variables
const Example2 = () => (
  <div>
    <h1 style={{ fontSize: 'var(--font-size-h1)' }}>Titre</h1>
    <p style={{ fontSize: 'var(--font-size-body)' }}>Texte</p>
  </div>
);

// Exemple 3 : Constantes TypeScript
const Example3 = () => (
  <div>
    <h1 style={{ fontSize: FontSize.h1, fontWeight: FontWeight.bold }}>
      Titre
    </h1>
    <p style={{ fontSize: FontSize.body, lineHeight: LineHeight.relaxed }}>
      Texte
    </p>
  </div>
);

// Exemple 4 : Presets
const Example4 = () => (
  <div>
    <h1 style={TypographyPresets.h1}>Titre avec preset</h1>
    <p style={TypographyPresets.body}>Texte avec preset</p>
  </div>
);

// Exemple 5 : Combinaison de classes
const Example5 = () => (
  <div>
    <h1 className={`${TypographyClasses.h1} ${TypographyClasses.fontBold} ${TypographyClasses.trackingTight}`}>
      Titre avec classes
    </h1>
    <p className={`${TypographyClasses.body} ${TypographyClasses.leadingRelaxed}`}>
      Texte avec classes
    </p>
  </div>
);


// ============================================
// 3. COMPOSANT RÉUTILISABLE
// ============================================

interface TextComponentProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'lead';
  children: React.ReactNode;
  className?: string;
}

const TextComponent = ({ 
  variant = 'body', 
  children, 
  className = '' 
}: TextComponentProps) => {
  const variantClass = `text-${variant}`;
  return <div className={`${variantClass} ${className}`}>{children}</div>;
};

// Utilisation
const Example6 = () => (
  <div>
    <TextComponent variant="h1" className="font-bold">
      Titre
    </TextComponent>
    <TextComponent variant="body" className="leading-relaxed">
      Paragraphe
    </TextComponent>
  </div>
);


// ============================================
// 4. STYLED COMPONENTS (si utilisé)
// ============================================

// Si vous utilisez styled-components
/*
import styled from 'styled-components';

const Title = styled.h1`
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
`;

const Body = styled.p`
  font-size: ${FontSize.body};
  line-height: ${LineHeight.relaxed};
`;
*/


// ============================================
// 5. CSS MODULES
// ============================================

// Dans votre fichier .module.css
/*
.title {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
}

.body {
  font-size: var(--font-size-body);
  line-height: var(--line-height-relaxed);
}
*/

// Utilisation
/*
import styles from './styles.module.css';

const Example7 = () => (
  <div>
    <h1 className={styles.title}>Titre</h1>
    <p className={styles.body}>Texte</p>
  </div>
);
*/


// ============================================
// 6. UTILISATION DYNAMIQUE
// ============================================

const DynamicExample = ({ size }: { size: 'small' | 'medium' | 'large' }) => {
  const sizeMap = {
    small: FontSize.bodySmall,
    medium: FontSize.body,
    large: FontSize.bodyLarge,
  };

  return (
    <div style={{ fontSize: sizeMap[size] }}>
      Texte de taille {size}
    </div>
  );
};


// ============================================
// 7. COMBINAISON AVEC TAILWIND (si utilisé)
// ============================================

const TailwindExample = () => (
  <div className="text-h1 font-bold text-center mb-4">
    Combinaison de classes typographie et Tailwind
  </div>
);


// ============================================
// 8. RESPONSIVE PERSONNALISÉ
// ============================================

const ResponsiveExample = () => (
  <div style={{
    fontSize: 'clamp(1rem, 2vw, 1.5rem)', // Personnalisé
    fontWeight: FontWeight.semibold,
    lineHeight: LineHeight.normal,
  }}>
    Texte avec taille responsive personnalisée
  </div>
);


// ============================================
// 9. HELPER FUNCTIONS
// ============================================

// Créer des styles conditionnels
const getTextStyle = (variant: string) => {
  switch (variant) {
    case 'title':
      return {
        fontSize: FontSize.h1,
        fontWeight: FontWeight.bold,
        lineHeight: LineHeight.tight,
      };
    case 'subtitle':
      return {
        fontSize: FontSize.h3,
        fontWeight: FontWeight.semibold,
        lineHeight: LineHeight.normal,
      };
    default:
      return {
        fontSize: FontSize.body,
        lineHeight: LineHeight.relaxed,
      };
  }
};

const ConditionalExample = ({ type }: { type: string }) => (
  <div style={getTextStyle(type)}>
    Texte avec style conditionnel
  </div>
);


// ============================================
// 10. BONNES PRATIQUES
// ============================================

// ✅ BON : Utiliser les classes pour du contenu statique
const GoodExample1 = () => (
  <h1 className="text-h1 font-bold">Mon titre</h1>
);

// ✅ BON : Utiliser les constantes pour du styling dynamique
const GoodExample2 = ({ isBold }: { isBold: boolean }) => (
  <p style={{ 
    fontSize: FontSize.body, 
    fontWeight: isBold ? FontWeight.bold : FontWeight.normal 
  }}>
    Mon texte
  </p>
);

// ❌ MAUVAIS : Mélanger tailles fixes avec le système
const BadExample1 = () => (
  <h1 style={{ fontSize: '24px' }}>Ne pas faire</h1>
);

// ✅ BON : Utiliser le système
const GoodExample3 = () => (
  <h1 style={{ fontSize: FontSize.h2 }}>À faire</h1>
);


// ============================================
// EXPORTS POUR TESTS
// ============================================

export {
  Example1,
  Example2,
  Example3,
  Example4,
  Example5,
  Example6,
  TextComponent,
  DynamicExample,
  TailwindExample,
  ResponsiveExample,
  ConditionalExample,
};
