import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Link } from 'react-router-dom';
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
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string | undefined) => {
    if (!id) return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 shadow-md backdrop-blur-sm'
          : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <AppImage.LOGO className="h-8 w-8 sm:h-10 sm:w-10 object-contain cursor-pointer" />
          <span className="text-lg sm:text-xl font-bold text-gray-800 cursor-pointer h-8 sm:h-10 flex items-center">JVEPI Centre</span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
          <Link to="/" className="text-gray-700 hover:text-[#4A7C2A] font-semibold transition-colors text-sm xl:text-base">Accueil</Link>
          {user && user.role === 'admin' && (
            <>
              <Link to="/admin" className="text-gray-700 hover:text-[#4A7C2A] font-semibold transition-colors text-sm xl:text-base">Admin</Link>
              <Link to="/actions" className="text-gray-700 hover:text-[#4A7C2A] font-semibold transition-colors text-sm xl:text-base">Actions</Link>
            </>
          )}
          {navLinks.map((link, index) =>
            link.isButton ? (
              // --- BOUTON PREMIUM ---
              <a
                key={index}
                href={link.href}
                className="bg-[#4A7C2A] hover:bg-[#3E6A24] text-white font-bold py-2 px-4 xl:px-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-sm xl:text-base"
              >
                {link.title}
              </a>
            ) : link.href ? (
              // --- LIEN EXTERNE ---
              <a
                key={index}
                href={link.href}
                className="text-gray-700 hover:text-[#4A7C2A] font-semibold transition-colors text-sm xl:text-base"
              >
                {link.title}
              </a>
            ) : (
              // --- SCROLL INTERNE ---
              <button
                key={index}
                onClick={() => scrollToSection(link.id)}
                className="text-gray-700 hover:text-custom-green font-semibold transition-colors text-sm xl:text-base"
              >
                {link.title}
              </button>
            )
          )}

          {/* AUTH SECTION DESKTOP */}
          <div className="flex items-center space-x-2 xl:space-x-4">
            <UserMenu />
          </div>

          {/* BOUTON "Rejoignez-nous" */}
          <button
            onClick={() => scrollToSection('contact')}
            className="bg-custom-green text-white font-bold py-2 px-4 xl:px-6 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105 text-sm xl:text-base"
          >
            Rejoignez-nous
          </button>
        </nav>

        {/* BURGER MENU */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 focus:outline-none p-2"
            aria-label="Menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-lg border-t">
          <nav className="flex flex-col px-4 py-4 max-h-[calc(100vh-70px)] overflow-y-auto">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="py-3 text-gray-700 hover:text-[#4A7C2A] font-semibold border-b border-gray-100"
            >
              Accueil
            </Link>
            
            {user && user.role === 'admin' && (
              <>
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="py-3 text-gray-700 hover:text-[#4A7C2A] font-semibold border-b border-gray-100"
                >
                  Admin
                </Link>
                <Link 
                  to="/actions" 
                  onClick={() => setIsOpen(false)}
                  className="py-3 text-gray-700 hover:text-[#4A7C2A] font-semibold border-b border-gray-100"
                >
                  Actions
                </Link>
              </>
            )}
            
            {navLinks.map((link, index) =>
              link.isButton ? (
                <a
                  key={index}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="bg-[#4A7C2A] hover:bg-[#3E6A24] text-white font-bold py-3 px-6 rounded-full shadow-md my-3 text-center"
                >
                  {link.title}
                </a>
              ) : link.href ? (
                <a
                  key={index}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="py-3 text-gray-700 hover:text-[#4A7C2A] font-semibold border-b border-gray-100"
                >
                  {link.title}
                </a>
              ) : (
                <button
                  key={index}
                  onClick={() => scrollToSection(link.id)}
                  className="py-3 text-gray-700 hover:text-custom-green font-semibold text-left border-b border-gray-100"
                >
                  {link.title}
                </button>
              )
            )}

            {/* Auth Buttons Mobile */}
            <div className="mt-4 pb-4 border-b border-gray-100">
              <UserMenu />
            </div>
            
            <button
              onClick={() => scrollToSection('contact')}
              className="mt-4 bg-custom-green text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all"
            >
              Rejoignez-nous
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
