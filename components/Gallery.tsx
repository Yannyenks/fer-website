
import React, { useEffect, useState } from 'react';
import Section, { SectionTitle } from './Section';
import { getSectionImage } from './sectionImageService';
import { findProjectAsset } from './assetLoader';

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
        <GalleryImage src={useGalleryImage()} alt="Gallery image 1" className="md:col-span-2 md:row-span-2" />
        <GalleryImage src="https://picsum.photos/500/500?random=11" alt="Gallery image 2" />
        <GalleryImage src="https://picsum.photos/500/500?random=12" alt="Gallery image 3" />
        <GalleryImage src="https://picsum.photos/500/500?random=13" alt="Gallery image 4" />
        <GalleryImage src="https://picsum.photos/500/500?random=14" alt="Gallery image 5" />
        <GalleryImage src="https://picsum.photos/500/800?random=15" alt="Gallery image 6" className="md:col-span-2 md:row-span-2" />
        <GalleryImage src="https://picsum.photos/500/500?random=16" alt="Gallery image 7" />
        <GalleryImage src="https://picsum.photos/500/500?random=17" alt="Gallery image 8" />
      </div>
    </Section>
  );
};

function useGalleryImage() {
  const [src, setSrc] = useState<string>('');
  useEffect(() => {
    let mounted = true;
    // Always use project asset only
    findProjectAsset('gallery-1').then(a => { if (mounted && a) setSrc(a); });
    return () => { mounted = false; };
  }, []);
  return src;
}

export default Gallery;
