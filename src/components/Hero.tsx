import React from "react";
import { HeartLogo } from "./icons/HeartLogo";
import AppImage from "./AppImage";

const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center text-center text-white bg-cover bg-center"
      style={{
        backgroundImage: `url('${AppImage.GALLERY.IMAGE_3}')`,
      }}
    >
      <div className="absolute inset-0 bg-custom-green opacity-80"></div>
      <div className="relative z-10 p-6 flex flex-col items-center animate-fade-in-up">
        <AppImage.LOGO className="h-[15em] w-1=[15em] object-contain cursor-pointer m-10" />
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-4">
          LA MAISON
        </h1>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-wide">
          DES FILS ET FILLES DE NGAMBÈ
        </h2>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          ></path>
        </svg>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
