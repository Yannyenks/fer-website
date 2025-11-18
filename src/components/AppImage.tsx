import React from 'react';

/**
 * Classe abstraite AppImage
 * Fournit un accès centralisé à toutes les images situées dans src/assets/
 * Expose aussi `LOGO` comme composant React utilisable en JSX.
 */
abstract class AppImage {
  static readonly GALLERY = {
    IMAGE_1: '/assets/images/image 1.jpeg',
    IMAGE_2: '/assets/images/image 2.jpeg',
    IMAGE_3: '/assets/images/image 3.jpeg',
    IMAGE_4: '/assets/images/image 4.jpeg',
    IMAGE_5: '/assets/images/image 5.jpeg',
    IMAGE_6: '/assets/images/image 6.jpeg',
    IMAGE_7: '/assets/images/image 7.jpeg',
    IMAGE_8: '/assets/images/image 8.jpeg',
    IMAGE_9: '/assets/images/image 9.jpeg',
    IMAGE_10: '/assets/images/image 10.jpeg',
    IMAGE_11: '/assets/images/image 11.jpeg',
    IMAGE_12: '/assets/images/image 12.jpeg',
    IMAGE_13: '/assets/images/image 13.jpeg',
    IMAGE_14: '/assets/images/image 14.jpeg',
    LOGO: '/assets/logo/logo.png',
  } as const;

  static getAll(): string[] {
    return Object.values(this.GALLERY);
  }

  static getRandomImage(): string {
    const images = this.getAll();
    return images[Math.floor(Math.random() * images.length)];
  }

  static getImageByNumber(number: number): string | null {
    const key = `IMAGE_${number}` as keyof typeof this.GALLERY;
    return (this.GALLERY as any)[key] || null;
  }

  /**
   * Composant React pour le logo. Peut recevoir les props classiques d'un <img>.
   * Exemple d'utilisation: <AppImage.LOGO className="h-10 w-10" />
   */
  static LOGO: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
    <img src={AppImage.GALLERY.LOGO} alt={props.alt ?? 'Logo'} {...props} />
  );

  /**
   * Composant utilitaire pour rendre une image à partir d'un chemin.
   * Usage: <AppImage.Image src={AppImage.GALLERY.IMAGE_1} alt="..." />
   */
  static Image: React.FC<{
    src: string;
    alt?: string;
  } & React.ImgHTMLAttributes<HTMLImageElement>> = ({ src, alt, ...props }) => (
    <img src={src} alt={alt ?? ''} {...props} />
  );
}

export default AppImage;
