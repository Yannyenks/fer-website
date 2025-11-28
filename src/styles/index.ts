/**
 * Index des exports du système de typographie
 * 
 * Import centralisé de tous les utilitaires de typographie
 */

// Export des constantes et types
export {
  FontSize,
  LineHeight,
  LetterSpacing,
  FontWeight,
  TypographyPresets,
  TypographyClasses,
  createTypographyStyles,
} from './typography';

export type {
  FontSizeValue,
  LineHeightValue,
  LetterSpacingValue,
  FontWeightValue,
  TypographyProps,
} from './typography';

// Export par défaut
export { default as Typography } from './typography';
