/**
 * Constantes de typographie pour utilisation en TypeScript/React
 * 
 * Ces constantes correspondent aux variables CSS définies dans typography.css
 * Utilisez-les pour du styling programmatique ou des composants styled
 */

import React from 'react';

export const FontSize = {
  // Base
  base: 'var(--font-size-base)',
  
  // Titres
  h1: 'var(--font-size-h1)',
  h2: 'var(--font-size-h2)',
  h3: 'var(--font-size-h3)',
  h4: 'var(--font-size-h4)',
  h5: 'var(--font-size-h5)',
  h6: 'var(--font-size-h6)',
  
  // Corps de texte
  body: 'var(--font-size-body)',
  bodyLarge: 'var(--font-size-body-large)',
  bodySmall: 'var(--font-size-body-small)',
  
  // Éléments spéciaux
  caption: 'var(--font-size-caption)',
  button: 'var(--font-size-button)',
  buttonLarge: 'var(--font-size-button-large)',
  lead: 'var(--font-size-lead)',
  display: 'var(--font-size-display)',
} as const;

export const LineHeight = {
  tight: 'var(--line-height-tight)',
  normal: 'var(--line-height-normal)',
  relaxed: 'var(--line-height-relaxed)',
} as const;

export const LetterSpacing = {
  tight: 'var(--letter-spacing-tight)',
  normal: 'var(--letter-spacing-normal)',
  wide: 'var(--letter-spacing-wide)',
  wider: 'var(--letter-spacing-wider)',
} as const;

export const FontWeight = {
  light: 'var(--font-weight-light)',
  normal: 'var(--font-weight-normal)',
  medium: 'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
  bold: 'var(--font-weight-bold)',
  extrabold: 'var(--font-weight-extrabold)',
} as const;

// Types pour TypeScript
export type FontSizeValue = typeof FontSize[keyof typeof FontSize];
export type LineHeightValue = typeof LineHeight[keyof typeof LineHeight];
export type LetterSpacingValue = typeof LetterSpacing[keyof typeof LetterSpacing];
export type FontWeightValue = typeof FontWeight[keyof typeof FontWeight];

/**
 * Interface pour les propriétés de typographie
 */
export interface TypographyProps {
  fontSize?: FontSizeValue | string;
  lineHeight?: LineHeightValue | string;
  letterSpacing?: LetterSpacingValue | string;
  fontWeight?: FontWeightValue | string | number;
}

/**
 * Utilitaire pour créer des styles de typographie
 * 
 * @example
 * ```tsx
 * const styles = createTypographyStyles({
 *   fontSize: FontSize.h2,
 *   fontWeight: FontWeight.bold,
 *   lineHeight: LineHeight.tight
 * });
 * 
 * <div style={styles}>Mon texte</div>
 * ```
 */
export function createTypographyStyles(props: TypographyProps): React.CSSProperties {
  return {
    fontSize: props.fontSize,
    lineHeight: props.lineHeight,
    letterSpacing: props.letterSpacing,
    fontWeight: props.fontWeight,
  };
}

/**
 * Presets de styles courants
 */
export const TypographyPresets = {
  h1: createTypographyStyles({
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    lineHeight: LineHeight.tight,
  }),
  
  h2: createTypographyStyles({
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    lineHeight: LineHeight.tight,
  }),
  
  h3: createTypographyStyles({
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semibold,
    lineHeight: LineHeight.normal,
  }),
  
  h4: createTypographyStyles({
    fontSize: FontSize.h4,
    fontWeight: FontWeight.semibold,
    lineHeight: LineHeight.normal,
  }),
  
  body: createTypographyStyles({
    fontSize: FontSize.body,
    lineHeight: LineHeight.relaxed,
  }),
  
  bodyLarge: createTypographyStyles({
    fontSize: FontSize.bodyLarge,
    lineHeight: LineHeight.relaxed,
  }),
  
  bodySmall: createTypographyStyles({
    fontSize: FontSize.bodySmall,
    lineHeight: LineHeight.normal,
  }),
  
  lead: createTypographyStyles({
    fontSize: FontSize.lead,
    lineHeight: LineHeight.relaxed,
  }),
  
  display: createTypographyStyles({
    fontSize: FontSize.display,
    fontWeight: FontWeight.extrabold,
    lineHeight: LineHeight.tight,
  }),
  
  button: createTypographyStyles({
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  }),
  
  caption: createTypographyStyles({
    fontSize: FontSize.caption,
    lineHeight: LineHeight.normal,
  }),
} as const;

/**
 * Classes CSS utilitaires pour une utilisation directe
 */
export const TypographyClasses = {
  // Tailles
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  h4: 'text-h4',
  h5: 'text-h5',
  h6: 'text-h6',
  body: 'text-body',
  bodyLarge: 'text-body-large',
  bodySmall: 'text-body-small',
  caption: 'text-caption',
  lead: 'text-lead',
  display: 'text-display',
  
  // Poids
  fontLight: 'font-light',
  fontNormal: 'font-normal',
  fontMedium: 'font-medium',
  fontSemibold: 'font-semibold',
  fontBold: 'font-bold',
  fontExtrabold: 'font-extrabold',
  
  // Interligne
  leadingTight: 'leading-tight',
  leadingNormal: 'leading-normal',
  leadingRelaxed: 'leading-relaxed',
  
  // Espacement
  trackingTight: 'tracking-tight',
  trackingNormal: 'tracking-normal',
  trackingWide: 'tracking-wide',
  trackingWider: 'tracking-wider',
} as const;

// Export par défaut de tous les utilitaires
export default {
  FontSize,
  LineHeight,
  LetterSpacing,
  FontWeight,
  TypographyPresets,
  TypographyClasses,
  createTypographyStyles,
};
