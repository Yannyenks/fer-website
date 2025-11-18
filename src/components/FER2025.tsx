import React, { useEffect, useState } from 'react';
import './fer2025.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { getSectionImage } from './sectionImageService';
import { findProjectAsset } from './assetLoader';

const FER2025: React.FC = () => {
  return (
    <section className="fer root" aria-labelledby="fer-title">
      <div className="fer__container">
        <header className="fer__hero">
          <h2 id="fer-title" className="fer__title">FER 2025 – Ngambé, 11–13 décembre 2025</h2>
          <p className="fer__subtitle">Foire de l’Employabilité Rurale organisée par JVEPI & CJJF en partenariat avec FOMACK — réponse concertée au chômage des jeunes en milieu rural.</p>
          {/* optional background/hero image override */}
              <FERHeroImage />
          {/* CTA: if user registered for FER -> link to concours; if logged in but not registered -> enroll; if not logged in -> send to inscription/login */}
          {(() => {
            const { user } = useAuth();
            const navigate = useNavigate();
            const isParticipant = user ? !!localStorage.getItem(`fer_participant_${user.id}`) : false;

            const enroll = () => {
              if (!user) return navigate('/inscription?redirect=/concours');
              localStorage.setItem(`fer_participant_${user.id}`, '1');
              navigate('/concours');
            };

            if (user && isParticipant) {
              return <Link className="fer__cta" to="/concours">Accéder au concours</Link>;
            }

            if (user && !isParticipant) {
              return <button onClick={enroll} className="fer__cta">S'inscrire / Participer</button>;
            }

            return <Link className="fer__cta" to="/inscription?redirect=/concours">S'inscrire / Participer</Link>;
          })()}
        </header>

        <section className="fer__context">
          <h3 className="fer__section-title">Contexte</h3>
          <p>
            Initiée par <strong>JVEPI</strong> et <strong>CJJF</strong> avec le soutien de <strong>FOMACK</strong>, la FER 2025 répond
            aux enjeux critiques du chômage des jeunes en zones rurales en renforçant l'employabilité, l'entrepreneuriat et
            les chaînes de valeur locales.
          </p>
        </section>

        <section className="fer__grid">
          <div className="fer__card">
            <h4>Vision &amp; Objectifs</h4>
            <ul>
              <li>Promouvoir l'entrepreneuriat rural et l'innovation agricole</li>
              <li>Renforcer les chaînes de valeur locales</li>
              <li>Créer des emplois durables pour les jeunes</li>
              <li>Favoriser la coopération multi-acteurs (secteur public, privé, ONG)</li>
            </ul>
          </div>

          <div className="fer__card">
            <h4>Résultats attendus</h4>
            <ul>
              <li><strong>240</strong> jeunes formés</li>
              <li><strong>70</strong> projets mentorés</li>
              <li>Appui financier et accès aux marchés pour les porteurs</li>
              <li><strong>5</strong> chaînes de valeur ciblées</li>
              <li><strong>150</strong> emplois directs et indirects créés</li>
            </ul>
          </div>

          <div className="fer__card">
            <h4>Les 4 espaces</h4>
            <ul>
              <li>Conférences — experts, politiques publiques et retours d'expérience</li>
              <li>Exposition — produits locaux, start-ups rurales</li>
              <li>Gastronomie &amp; Loisirs — valorisation des produits locaux</li>
              <li>Ateliers — formation pratique et mentorat</li>
            </ul>
          </div>

          <div className="fer__card fer__figs">
            <h4>Chiffres clés — édition 2024</h4>
            <div className="fer__fig-list">
              <div className="fer__fig"><span className="num">180</span><span className="label">Jeunes formés</span></div>
              <div className="fer__fig"><span className="num">45</span><span className="label">Projets mentorés</span></div>
              <div className="fer__fig"><span className="num">3</span><span className="label">Chaînes de valeur</span></div>
              <div className="fer__fig"><span className="num">90</span><span className="label">Emplois créés</span></div>
            </div>
          </div>
        </section>

        <section className="fer__timeline">
          <h3 className="fer__section-title">Timeline — 11–13 décembre</h3>
          <ol className="fer__timeline-list">
            <li>
              <strong>Jour 1 — 11 déc.</strong>
              <p>Ouverture, conférences d'orientation, sessions networking.</p>
            </li>
            <li>
              <strong>Jour 2 — 12 déc.</strong>
              <p>Ateliers pratiques, mentoring, exposition des initiatives locales.</p>
            </li>
            <li>
              <strong>Jour 3 — 13 déc.</strong>
              <p>Compétitions de projets, cérémonies de financement et clôture.</p>
            </li>
          </ol>
        </section>

        <footer className="fer__footer">
          <p>Pour participer ou réserver un stand, cliquez sur <Link to="/inscription">S'inscrire / Participer</Link> ou contactez-nous via les canaux officiels.</p>
        </footer>
      </div>
    </section>
  );
};

export default FER2025;

const FERHeroImage: React.FC = () => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const override = getSectionImage('fer-hero');
    if (override) {
      if (mounted) setSrc(override);
      return () => { mounted = false; };
    }
    findProjectAsset('fer-hero').then(asset => {
      if (mounted && asset) setSrc(asset);
    });
    return () => { mounted = false; };
  }, []);

  if (!src) return null;
  return (
    <div className="fer__hero-image mt-6">
      <img src={src} alt="FER hero" className="w-full h-48 object-cover rounded-lg" />
    </div>
  );
};
