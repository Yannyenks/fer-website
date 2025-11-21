
import React, { useEffect, useState } from 'react';
import Section, { SectionTitle } from './Section';
import { getSectionImage } from './sectionImageService';
import { findProjectAsset } from './assetLoader';
import AppImage from './AppImage';

const GalleryImage: React.FC<{ src: string; alt: string; className?: string; }> = ({ src, alt, className = '' }) => (
  <div className={`overflow-hidden rounded-2xl shadow-lg ${className}`}>
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500 ease-in-out"
    />
  </div>
);

const Gallery: React.FC = () => {
  return (
    <Section>
      <SectionTitle>QUELQUES PHOTOS</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GalleryImage src={AppImage.GALLERY.IMAGE_2} alt="Gallery image 1" className="md:col-span-2 md:row-span-2" />
        <GalleryImage src={AppImage.GALLERY.IMAGE_8} alt="https://picsum.photos/500/500?random=11" />
        <GalleryImage src={AppImage.GALLERY.IMAGE_9} alt="https://picsum.photos/500/500?random=12" />
        <GalleryImage src={AppImage.GALLERY.IMAGE_10} alt="https://picsum.photos/500/500?random=13" />
        <GalleryImage src={AppImage.GALLERY.IMAGE_11} alt="https://picsum.photos/500/500?random=14" />
        <GalleryImage src={AppImage.GALLERY.IMAGE_12} alt="https://picsum.photos/500/800?random=15" className="md:col-span-2 md:row-span-2" />
        <GalleryImage src={AppImage.GALLERY.IMAGE_13} alt="https://picsum.photos/500/500?random=16" />
        <GalleryImage src={AppImage.GALLERY.IMAGE_14} alt="https://picsum.photos/500/500?random=17" />
      </div>
    </Section>  
  );
};

function useGalleryImage() {
  const [src, setSrc] = useState<string>(getSectionImage('gallery-1') || 'https://picsum.photos/500/800?random=10');
  useEffect(() => {
    let mounted = true;
    const override = getSectionImage('gallery-1');
    if (override) {
      setSrc(override);
      return () => { mounted = false; };
    }
    findProjectAsset('gallery-1').then(a => { if (mounted && a) setSrc(a); });
    return () => { mounted = false; };
  }, []);
  return src;
}

export default Gallery;
