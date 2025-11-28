import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthProvider';
import { Link, useLocation } from 'react-router-dom';
import { HeartLogo } from './icons/HeartLogo';
import AppImage from './AppImage';
import UserMenu from './UserMenu';

interface NavLink {
  title: string;
  id?: string;        // Pour scroll interne
  href?: string;      // Pour pages externes (ex: /awards)
  isButton?: boolean; // Pour bouton type "FER Awards"
}

interface HeaderProps {
  navLinks: NavLink[];
}

const Header: React.FC<HeaderProps> = ({ navLinks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isHomeSectionsOpen, setIsHomeSectionsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isHomePage = location.pathname === '/';
  const showAdminLinks = user && user.role === 'admin';

  // Sections d'accueil qui seront regroupées
  const homeSections = [
    { title: 'Présentation', id: 'presentation' },
    { title: 'Actions', id: 'actions' },
    { title: 'Réalisations', id: 'realisations' },
    { title: 'Contact', id: 'contact' }
  ];

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsHomeSectionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Mise à jour de la section active pour les effets
      if (isHomePage) {
        const sections = ['presentation', 'actions', 'realisations', 'contact'];
        const currentSection = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        
        if (currentSection) {
          setActiveSection(currentSection);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const scrollToSection = (id: string | undefined) => {
    if (!id) return;
    
    // Si nous ne sommes pas sur la page d'accueil, naviguer d'abord vers l'accueil
    if (!isHomePage) {
      window.location.href = `/#${id}`;
      return;
    }
    
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
    setIsHomeSectionsOpen(false);
  };

  const handleHomeSectionsClick = () => {
    // NE REDIRIGE PLUS VERS L'ACCUEIL - juste toggle le dropdown
    setIsHomeSectionsOpen(!isHomeSectionsOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 shadow-lg backdrop-blur-sm'
          : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 group"
          onClick={() => {
            setIsOpen(false);
            setIsHomeSectionsOpen(false);
          }}
        >
          <AppImage.LOGO className="h-8 w-8 sm:h-10 sm:w-10 object-contain cursor-pointer transition-transform duration-300 group-hover:scale-110" />
          <span className="text-lg sm:text-xl font-bold text-gray-800 cursor-pointer h-8 sm:h-10 flex items-center transition-colors duration-300 group-hover:text-[#4A7C2A]">
            JVEPI Centre
          </span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
          <Link 
            to="/" 
            className={`text-gray-700 hover:text-[#4A7C2A] font-semibold transition-all duration-300 text-sm xl:text-base ${
              isHomePage && !showAdminLinks ? 'text-[#4A7C2A] font-bold scale-105' : ''
            }`}
            onClick={() => setIsHomeSectionsOpen(false)}
          >
            Accueil
          </Link>
          
          {showAdminLinks && (
            <>
              <Link 
                to="/admin" 
                className={`text-gray-700 hover:text-[#4A7C2A] font-semibold transition-all duration-300 text-sm xl:text-base ${
                  location.pathname === '/admin' ? 'text-[#4A7C2A] font-bold scale-105' : ''
                }`}
              >
                Admin
              </Link>
              <Link 
                to="/actions" 
                className={`text-gray-700 hover:text-[#4A7C2A] font-semibold transition-all duration-300 text-sm xl:text-base ${
                  location.pathname === '/actions' ? 'text-[#4A7C2A] font-bold scale-105' : ''
                }`}
              >
                Actions
              </Link>

              {/* MENU DÉROULANT FLOU POUR LES SECTIONS D'ACCUEIL */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleHomeSectionsClick}
                  className="text-gray-700 hover:text-[#4A7C2A] font-semibold transition-all duration-300 text-sm xl:text-base flex items-center space-x-1 backdrop-blur-sm bg-white/50 px-3 py-2 rounded-lg border border-gray-200/50 hover:bg-white/70 hover:shadow-md"
                >
                  <span>Navigation</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${isHomeSectionsOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isHomeSectionsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 backdrop-blur-lg bg-white/80 border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50">
                    {homeSections.map((section, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-4 py-3 transition-all duration-300 hover:bg-white/50 border-b border-white/20 last:border-b-0 ${
                          activeSection === section.id ? 'text-[#4A7C2A] font-bold bg-white/30' : 'text-gray-700'
                        }`}
                      >
                        {section.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* AFFICHAGE NORMAL DES SECTIONS QUAND ON EST SUR L'ACCUEIL SANS ADMIN */}
          {isHomePage && !showAdminLinks && homeSections.map((section, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(section.id)}
              className={`text-gray-700 hover:text-[#4A7C2A] font-semibold transition-all duration-300 text-sm xl:text-base ${
                activeSection === section.id 
                  ? 'text-[#4A7C2A] font-bold scale-105 border-b-2 border-[#4A7C2A]' 
                  : 'hover:scale-105'
              }`}
            >
              {section.title}
            </button>
          ))}
          
          {navLinks.map((link, index) =>
            link.isButton ? (
              // --- BOUTON "FER AWARDS" AVEC TAILLE ADAPTATIVE ---
              <a
                key={index}
                href={link.href}
                className="bg-[#4A7C2A] hover:bg-[#3E6A24] text-white font-bold py-2 px-4 xl:px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm xl:text-base min-w-0 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] xl:max-w-none"
                style={{ 
                  fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                  padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 2vw, 1.5rem)'
                }}
              >
                {link.title}
              </a>
            ) : link.href ? (
              // --- LIEN EXTERNE ---
              <a
                key={index}
                href={link.href}
                className="text-gray-700 hover:text-[#4A7C2A] font-semibold transition-all duration-300 hover:scale-105 text-sm xl:text-base"
              >
                {link.title}
              </a>
            ) : null
          )}

          {/* AUTH SECTION DESKTOP */}
          <div className="flex items-center space-x-2 xl:space-x-4 relative">
            <UserMenu />
          </div>

          {/* BOUTON "Rejoignez-nous" - AFFICHÉ UNIQUEMENT SUR L'ACCUEIL OU DANS LE MENU DÉROULANT */}
          {isHomePage && !showAdminLinks && (
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-[#4A7C2A] text-white font-bold py-2 px-4 xl:px-6 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm xl:text-base"
            >
              Rejoignez-nous
            </button>
          )}
        </nav>

        {/* BURGER MENU AVEC ANIMATION */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 focus:outline-none p-2 transition-all duration-300 hover:bg-gray-100 rounded-lg"
            aria-label="Menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute left-0 w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                isOpen ? 'rotate-45 top-3' : 'top-1'
              }`} />
              <span className={`absolute left-0 w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'top-3 opacity-100'
              }`} />
              <span className={`absolute left-0 w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                isOpen ? '-rotate-45 top-3' : 'top-5'
              }`} />
            </div>
          </button>
        </div>
      </div>

      {/* MENU MOBILE - AVEC TAILLE AUTOMATIQUE */}
      <div 
        ref={mobileMenuRef}
        className={`lg:hidden bg-white shadow-lg border-t transition-all duration-300 ${
          isOpen 
            ? 'max-h-screen opacity-100 overflow-visible' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <nav className="flex flex-col px-4 py-4">
          <Link 
            to="/" 
            onClick={() => {
              setIsOpen(false);
              setIsHomeSectionsOpen(false);
            }}
            className="py-3 text-gray-700 hover:text-[#4A7C2A] font-semibold border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 hover:pl-2 rounded-lg"
          >
            Accueil
          </Link>
          
          {showAdminLinks && (
            <>
              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)}
                className="py-3 text-gray-700 hover:text-[#4A7C2A] font-semibold border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 hover:pl-2 rounded-lg"
              >
                Admin
              </Link>
              <Link 
                to="/actions" 
                onClick={() => setIsOpen(false)}
                className="py-3 text-gray-700 hover:text-[#4A7C2A] font-semibold border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 hover:pl-2 rounded-lg"
              >
                Actions
              </Link>

              {/* MENU DÉROULANT MOBILE POUR LES SECTIONS D'ACCUEIL */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setIsHomeSectionsOpen(!isHomeSectionsOpen)}
                  className="w-full py-3 text-gray-700 hover:text-[#4A7C2A] font-semibold text-left flex justify-between items-center transition-all duration-300 hover:bg-gray-50 hover:pl-2 rounded-lg"
                >
                  <span>Navigation</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${isHomeSectionsOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isHomeSectionsOpen && (
                  <div className="ml-4 mt-2 mb-2 bg-gray-50/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-200/50">
                    {homeSections.map((section, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-4 py-3 transition-all duration-300 hover:bg-white/50 border-b border-gray-200/30 last:border-b-0 ${
                          activeSection === section.id ? 'text-[#4A7C2A] font-bold bg-white/30' : 'text-gray-700'
                        }`}
                      >
                        {section.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* AFFICHAGE NORMAL DES SECTIONS SUR MOBILE QUAND ON EST SUR L'ACCUEIL SANS ADMIN */}
          {isHomePage && !showAdminLinks && homeSections.map((section, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(section.id)}
              className={`py-3 text-gray-700 hover:text-[#4A7C2A] font-semibold text-left border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 hover:pl-2 rounded-lg ${
                activeSection === section.id ? 'text-[#4A7C2A] font-bold bg-gray-50 pl-2' : ''
              }`}
            >
              {section.title}
            </button>
          ))}
          
          {navLinks.map((link, index) =>
            link.isButton ? (
              <a
                key={index}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="bg-[#4A7C2A] hover:bg-[#3E6A24] text-white font-bold py-3 px-6 rounded-full shadow-md my-3 text-center transition-all duration-300 transform hover:scale-105"
                style={{ 
                  fontSize: 'clamp(0.75rem, 4vw, 1rem)',
                }}
              >
                {link.title}
              </a>
            ) : link.href ? (
              <a
                key={index}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-3 text-gray-700 hover:text-[#4A7C2A] font-semibold border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 hover:pl-2 rounded-lg"
              >
                {link.title}
              </a>
            ) : null
          )}

          {/* USERMENU EN MOBILE - AVEC TAILLE AUTOMATIQUE */}
          <div className="mt-4 pb-4 border-b border-gray-100">
            <div className="w-full">
              <UserMenu />
            </div>
          </div>
          
          {/* BOUTON "Rejoignez-nous" MOBILE - AFFICHÉ UNIQUEMENT SUR L'ACCUEIL */}
          {isHomePage && !showAdminLinks && (
            <button
              onClick={() => scrollToSection('contact')}
              className="mt-4 bg-[#4A7C2A] text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 text-center"
            >
              Rejoignez-nous
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;