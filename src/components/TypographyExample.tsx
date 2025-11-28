/**
 * Exemple d'utilisation du système de typographie responsive
 * 
 * Ce fichier démontre comment utiliser les variables CSS et classes
 * utilitaires dans vos composants React
 */

import React from 'react';

export const TypographyExample: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* === MÉTHODE 1 : Utilisation des classes utilitaires === */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="text-h2 font-bold" style={{ marginBottom: '1rem' }}>
          Méthode 1 : Classes utilitaires
        </h2>
        
        <h1 className="text-h1 font-bold tracking-tight">
          Titre H1 - S'adapte de 28px à 48px
        </h1>
        
        <h2 className="text-h2 font-semibold">
          Titre H2 - S'adapte de 24px à 40px
        </h2>
        
        <h3 className="text-h3 font-semibold">
          Titre H3 - S'adapte de 20px à 32px
        </h3>
        
        <p className="text-body leading-relaxed">
          Paragraphe normal qui s'adapte de 14px à 16px avec un interligne relâché.
        </p>
        
        <p className="text-body-large leading-relaxed">
          Paragraphe large qui s'adapte de 16px à 18px.
        </p>
        
        <p className="text-body-small">
          Texte petit qui s'adapte de 12px à 14px.
        </p>
        
        <button className="text-button font-semibold" style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--fer-olive)',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer'
        }}>
          Bouton avec texte responsive
        </button>
      </section>

      {/* === MÉTHODE 2 : Utilisation des variables CSS === */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="text-h2 font-bold" style={{ marginBottom: '1rem' }}>
          Méthode 2 : Variables CSS (inline ou dans styles)
        </h2>
        
        <div style={{
          fontSize: 'var(--font-size-h3)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--fer-green)',
          marginBottom: '1rem'
        }}>
          Titre utilisant les variables CSS
        </div>
        
        <div style={{
          fontSize: 'var(--font-size-body)',
          lineHeight: 'var(--line-height-relaxed)',
          marginBottom: '1rem'
        }}>
          Texte utilisant les variables pour la taille et l'interligne.
        </div>
      </section>

      {/* === MÉTHODE 3 : Balises HTML standards === */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="text-h2 font-bold" style={{ marginBottom: '1rem' }}>
          Méthode 3 : Balises HTML (stylées automatiquement)
        </h2>
        
        <h1>Balise H1 native (stylée par défaut)</h1>
        <h2>Balise H2 native (stylée par défaut)</h2>
        <h3>Balise H3 native (stylée par défaut)</h3>
        <p>Balise P native (stylée par défaut)</p>
        <small>Balise small native (stylée par défaut)</small>
      </section>

      {/* === EXEMPLES PRATIQUES === */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="text-h2 font-bold" style={{ marginBottom: '1rem' }}>
          Exemples pratiques
        </h2>
        
        {/* Card exemple */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '1rem'
        }}>
          <h3 className="text-h4 font-semibold" style={{ marginBottom: '0.5rem', color: 'var(--fer-green)' }}>
            Titre de la carte
          </h3>
          <p className="text-body leading-relaxed" style={{ marginBottom: '1rem' }}>
            Description de la carte avec du texte qui s'adapte automatiquement à la résolution.
          </p>
          <button className="text-button font-medium" style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--fer-olive)',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}>
            En savoir plus
          </button>
        </div>

        {/* Hero section exemple */}
        <div style={{
          backgroundColor: 'var(--fer-beige)',
          padding: '3rem 2rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h1 className="text-display font-extrabold tracking-tight" style={{ 
            marginBottom: '1rem',
            color: 'var(--fer-green)'
          }}>
            Texte d'affichage géant
          </h1>
          <p className="text-lead leading-relaxed" style={{
            maxWidth: '800px',
            margin: '0 auto 2rem auto'
          }}>
            Sous-titre d'introduction qui s'adapte de 18px à 24px selon la résolution.
          </p>
          <button className="text-button-large font-semibold" style={{
            padding: '0.75rem 2rem',
            backgroundColor: 'var(--fer-olive)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}>
            Commencer maintenant
          </button>
        </div>
      </section>

      {/* === COMBINAISONS === */}
      <section>
        <h2 className="text-h2 font-bold" style={{ marginBottom: '1rem' }}>
          Combinaisons de classes
        </h2>
        
        <p className="text-h4 font-light tracking-wide leading-relaxed">
          Titre léger avec lettres espacées
        </p>
        
        <p className="text-body font-bold tracking-tight">
          Texte gras avec lettres serrées
        </p>
        
        <p className="text-body-large font-medium leading-relaxed tracking-wide">
          Grand texte moyen avec interligne relâché et lettres espacées
        </p>
      </section>
    </div>
  );
};

export default TypographyExample;
