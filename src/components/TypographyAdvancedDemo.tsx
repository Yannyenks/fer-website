/**
 * Exemple d'utilisation avancée du système de typographie
 * avec des composants React réutilisables
 */

import React from 'react';
import { FontSize, FontWeight, LineHeight, TypographyPresets, TypographyClasses } from '../styles/typography';

// === Composant de texte générique ===
interface TextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'bodyLarge' | 'bodySmall' | 'lead' | 'display' | 'caption';
  className?: string;
  style?: React.CSSProperties;
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  as: Component = 'p', 
  variant = 'body',
  className = '',
  style = {}
}) => {
  const variantClass = `text-${variant}`;
  
  return (
    <Component className={`${variantClass} ${className}`} style={style}>
      {children}
    </Component>
  );
};

// === Composant de titre avec preset automatique ===
interface HeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  style?: React.CSSProperties;
}

export const Heading: React.FC<HeadingProps> = ({ 
  children, 
  level, 
  className = '',
  style = {}
}) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const variant = `h${level}` as keyof typeof TypographyClasses;
  
  return (
    <Tag className={`${TypographyClasses[variant]} ${className}`} style={style}>
      {children}
    </Tag>
  );
};

// === Composant de bouton avec typographie ===
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick,
  className = ''
}) => {
  const sizeClass = size === 'large' ? 'text-button-large' : 'text-button';
  
  const baseStyle: React.CSSProperties = {
    padding: size === 'large' ? '0.75rem 1.5rem' : '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 'var(--font-weight-semibold)',
    transition: 'all 0.2s',
  };
  
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--fer-olive)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--fer-earth)',
      color: 'white',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--fer-green)',
      border: '2px solid var(--fer-green)',
    },
  };
  
  return (
    <button 
      className={`${sizeClass} ${className}`}
      style={{ ...baseStyle, ...variantStyles[variant] }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// === Composant de carte avec typographie ===
interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  children,
  className = ''
}) => {
  return (
    <div 
      className={className}
      style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <Heading level={3} className="font-semibold" style={{ 
        color: 'var(--fer-green)', 
        marginBottom: '0.5rem' 
      }}>
        {title}
      </Heading>
      
      <Text variant="body" className="leading-relaxed" style={{ marginBottom: '1rem' }}>
        {description}
      </Text>
      
      {children}
    </div>
  );
};

// === Page de démonstration ===
export const TypographyAdvancedDemo: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Hero avec composants */}
      <section style={{ 
        textAlign: 'center', 
        padding: '3rem 2rem',
        background: 'linear-gradient(180deg, var(--fer-beige), transparent)',
        borderRadius: '0.5rem',
        marginBottom: '3rem'
      }}>
        <Heading level={1} className="font-extrabold tracking-tight" style={{ 
          marginBottom: '1rem',
          color: 'var(--fer-green)'
        }}>
          Composants avec Typographie Responsive
        </Heading>
        
        <Text variant="lead" className="leading-relaxed" style={{ 
          maxWidth: '800px',
          margin: '0 auto 2rem auto'
        }}>
          Utilisation des composants React avec le système de typographie intégré
        </Text>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" size="large">
            Bouton principal
          </Button>
          <Button variant="outline" size="large">
            Bouton secondaire
          </Button>
        </div>
      </section>

      {/* Grille de cartes */}
      <section style={{ marginBottom: '3rem' }}>
        <Heading level={2} className="font-bold" style={{ marginBottom: '1.5rem' }}>
          Exemples de cartes
        </Heading>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          <Card
            title="Carte avec typographie"
            description="Cette carte utilise les composants Text et Heading avec le système de typographie responsive."
          >
            <Button variant="primary">En savoir plus</Button>
          </Card>
          
          <Card
            title="Adaptation automatique"
            description="Les tailles de texte s'adaptent automatiquement à la résolution de l'écran grâce à clamp()."
          >
            <Button variant="secondary">Découvrir</Button>
          </Card>
          
          <Card
            title="Facile à utiliser"
            description="Utilisez simplement les composants ou les classes CSS selon vos besoins."
          >
            <Button variant="outline">Documentation</Button>
          </Card>
        </div>
      </section>

      {/* Exemples de texte */}
      <section style={{ marginBottom: '3rem' }}>
        <Heading level={2} className="font-bold" style={{ marginBottom: '1.5rem' }}>
          Variantes de texte
        </Heading>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem'
        }}>
          <Text variant="display" className="font-extrabold" style={{ color: 'var(--fer-green)' }}>
            Texte Display
          </Text>
          
          <Text variant="lead" className="leading-relaxed">
            Texte d'introduction (Lead). Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
          
          <Text variant="bodyLarge" className="leading-relaxed">
            Texte corps large. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
          
          <Text variant="body" className="leading-relaxed">
            Texte corps normal. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
          
          <Text variant="bodySmall">
            Texte corps petit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
          
          <Text variant="caption">
            Texte légende (Caption)
          </Text>
        </div>
      </section>

      {/* Exemple avec inline styles */}
      <section style={{ marginBottom: '3rem' }}>
        <Heading level={2} className="font-bold" style={{ marginBottom: '1.5rem' }}>
          Utilisation avec presets
        </Heading>
        
        <div style={{ 
          backgroundColor: 'var(--fer-beige)',
          padding: '1.5rem',
          borderRadius: '0.5rem'
        }}>
          <div style={{
            ...TypographyPresets.h3,
            color: 'var(--fer-green)',
            marginBottom: '0.5rem'
          }}>
            Titre avec preset H3
          </div>
          
          <div style={{
            ...TypographyPresets.body,
            marginBottom: '1rem'
          }}>
            Paragraphe avec preset body. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
          
          <div style={{
            fontSize: FontSize.button,
            fontWeight: FontWeight.semibold,
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--fer-olive)',
            color: 'white',
            borderRadius: '0.5rem',
            display: 'inline-block',
            cursor: 'pointer'
          }}>
            Bouton personnalisé
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        border: '2px solid var(--fer-green)'
      }}>
        <Heading level={3} className="font-semibold" style={{ 
          color: 'var(--fer-green)',
          marginBottom: '1rem'
        }}>
          Comment utiliser
        </Heading>
        
        <Text variant="body" className="leading-relaxed" style={{ marginBottom: '1rem' }}>
          Trois façons d'utiliser le système de typographie :
        </Text>
        
        <ol style={{ 
          paddingLeft: '1.5rem',
          fontSize: FontSize.body,
          lineHeight: LineHeight.relaxed
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Classes CSS</strong> : Utilisez les classes comme <code>text-h1</code>, <code>font-bold</code>, etc.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Variables CSS</strong> : Utilisez les variables comme <code>var(--font-size-h2)</code> dans vos styles
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Constantes TypeScript</strong> : Importez depuis <code>typography.ts</code> pour utiliser <code>FontSize.h2</code>, etc.
          </li>
        </ol>
      </section>
      
    </div>
  );
};

export default TypographyAdvancedDemo;
