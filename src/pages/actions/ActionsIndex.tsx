import React from 'react';
import { Link } from 'react-router-dom';

const ActionsIndex: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto max-w-4xl">
        {/* En-tête avec effet glass */}
        <div className="mb-8 sm:mb-10 lg:mb-12 backdrop-blur-xl bg-white/40 rounded-3xl shadow-sm border border-white/50 p-6 sm:p-8 lg:p-10">
          <div className="flex items-center mb-4">
            <div className="w-3 h-12 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full mr-4"></div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
              Admin — Tableau de bord
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 ml-7">
            Gérez votre plateforme FER Awards en toute simplicité.
          </p>
        </div>

        {/* Grille des raccourcis avec effet glass */}
        <div className="backdrop-blur-xl bg-white/30 rounded-3xl shadow-sm border border-white/50 p-6 sm:p-8 lg:p-10">
          <div className="flex items-center mb-6 sm:mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full mr-4"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Raccourcis administrateur</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Dashboard principal */}
            <Link 
              to="/admin" 
              className="group backdrop-blur-lg bg-gradient-to-br from-emerald-100/60 to-green-100/60 hover:from-emerald-200/70 hover:to-green-200/70 rounded-2xl shadow-sm border border-white/60 p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">
                    Tableau de bord
                  </h3>
                  <p className="text-sm text-gray-600">
                    Vue d'ensemble et statistiques
                  </p>
                </div>
              </div>
            </Link>

            {/* Gestion des candidats */}
            <Link 
              to="/admin/candidates" 
              className="group backdrop-blur-lg bg-gradient-to-br from-emerald-100/60 to-green-100/60 hover:from-emerald-200/70 hover:to-green-200/70 rounded-2xl shadow-sm border border-white/60 p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">
                    Candidats
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gérer Miss & Awards
                  </p>
                </div>
              </div>
            </Link>

            {/* Statistiques de votes */}
            <Link 
              to="/admin/votes" 
              className="group backdrop-blur-lg bg-gradient-to-br from-emerald-100/60 to-green-100/60 hover:from-emerald-200/70 hover:to-green-200/70 rounded-2xl shadow-sm border border-white/60 p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">
                    Votes
                  </h3>
                  <p className="text-sm text-gray-600">
                    Statistiques et analyses
                  </p>
                </div>
              </div>
            </Link>

            {/* Images des sections */}
            <Link 
              to="/admin/section-images" 
              className="group backdrop-blur-lg bg-gradient-to-br from-emerald-100/60 to-green-100/60 hover:from-emerald-200/70 hover:to-green-200/70 rounded-2xl shadow-sm border border-white/60 p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">
                    Images
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gérer les visuels des sections
                  </p>
                </div>
              </div>
            </Link>

            {/* Invitations admin */}
            <Link 
              to="/admin/invitations" 
              className="group backdrop-blur-lg bg-gradient-to-br from-emerald-100/60 to-green-100/60 hover:from-emerald-200/70 hover:to-green-200/70 rounded-2xl shadow-sm border border-white/60 p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">
                    Invitations
                  </h3>
                  <p className="text-sm text-gray-600">
                    Créer des administrateurs
                  </p>
                </div>
              </div>
            </Link>

            {/* Événements */}
            <Link 
              to="/events" 
              className="group backdrop-blur-lg bg-gradient-to-br from-emerald-100/60 to-green-100/60 hover:from-emerald-200/70 hover:to-green-200/70 rounded-2xl shadow-sm border border-white/60 p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">
                    Événements
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gérer les événements FER
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionsIndex;