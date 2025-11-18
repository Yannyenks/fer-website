
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import AppImage from './src/components/AppImage';

// Met à jour dynamiquement le favicon pour toujours utiliser AppImage.GALLERY.LOGO
function setFavicon(href: string) {
  if (!href) return;
  let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = href;
}

setFavicon(AppImage.GALLERY.LOGO);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
