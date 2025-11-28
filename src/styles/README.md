# Système de Typographie Responsive

Ce projet utilise un système de typographie responsive basé sur des variables CSS et la fonction `clamp()` pour une adaptation fluide aux différentes résolutions d'écran.

## 📋 Table des matières

- [Variables disponibles](#variables-disponibles)
- [Classes utilitaires](#classes-utilitaires)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Personnalisation](#personnalisation)

## 🎯 Variables disponibles

### Tailles de police

Toutes les tailles utilisent `clamp()` pour une adaptation fluide :

```css
--font-size-base: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);        /* 14px → 16px */

/* Titres */
--font-size-h1: clamp(1.75rem, 1.5rem + 1.25vw, 3rem);           /* 28px → 48px */
--font-size-h2: clamp(1.5rem, 1.25rem + 1.25vw, 2.5rem);         /* 24px → 40px */
--font-size-h3: clamp(1.25rem, 1.125rem + 0.625vw, 2rem);        /* 20px → 32px */
--font-size-h4: clamp(1.125rem, 1rem + 0.625vw, 1.5rem);         /* 18px → 24px */
--font-size-h5: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);          /* 16px → 20px */
--font-size-h6: clamp(0.875rem, 0.85rem + 0.125vw, 1rem);        /* 14px → 16px */

/* Corps de texte */
--font-size-body: var(--font-size-base);                          /* 14px → 16px */
--font-size-body-large: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); /* 16px → 18px */
--font-size-body-small: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem); /* 12px → 14px */

/* Éléments spéciaux */
--font-size-caption: clamp(0.625rem, 0.6rem + 0.125vw, 0.75rem); /* 10px → 12px */
--font-size-button: clamp(0.875rem, 0.85rem + 0.125vw, 1rem);    /* 14px → 16px */
--font-size-button-large: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); /* 16px → 18px */
--font-size-lead: clamp(1.125rem, 1rem + 0.625vw, 1.5rem);       /* 18px → 24px */
--font-size-display: clamp(2.5rem, 2rem + 2.5vw, 4rem);          /* 40px → 64px */
```

### Hauteurs de ligne

```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### Espacements de lettres

```css
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
```

### Poids de police

```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

## 🎨 Classes utilitaires

### Titres

```html
<h1 class="text-h1">Titre principal</h1>
<h2 class="text-h2">Titre secondaire</h2>
<h3 class="text-h3">Titre tertiaire</h3>
<h4 class="text-h4">Titre niveau 4</h4>
<h5 class="text-h5">Titre niveau 5</h5>
<h6 class="text-h6">Titre niveau 6</h6>
```

### Corps de texte

```html
<p class="text-body">Texte normal</p>
<p class="text-body-large">Texte plus grand</p>
<p class="text-body-small">Texte plus petit</p>
<p class="text-lead">Texte d'introduction</p>
<span class="text-caption">Légende</span>
<h1 class="text-display">Texte d'affichage</h1>
```

### Poids de police

```html
<p class="font-light">Texte léger</p>
<p class="font-normal">Texte normal</p>
<p class="font-medium">Texte moyen</p>
<p class="font-semibold">Texte semi-gras</p>
<p class="font-bold">Texte gras</p>
<p class="font-extrabold">Texte extra-gras</p>
```

### Hauteur de ligne

```html
<p class="leading-tight">Interligne serré</p>
<p class="leading-normal">Interligne normal</p>
<p class="leading-relaxed">Interligne relâché</p>
```

### Espacement des lettres

```html
<p class="tracking-tight">Lettres serrées</p>
<p class="tracking-normal">Lettres normales</p>
<p class="tracking-wide">Lettres espacées</p>
<p class="tracking-wider">Lettres très espacées</p>
```

## 💡 Exemples d'utilisation

### En CSS/SCSS

```css
.mon-titre {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.mon-texte {
  font-size: var(--font-size-body);
  line-height: var(--line-height-relaxed);
}

.mon-bouton {
  font-size: var(--font-size-button-large);
  font-weight: var(--font-weight-semibold);
}
```

### En React/TSX avec inline styles

```tsx
const MyComponent = () => {
  return (
    <div style={{ fontSize: 'var(--font-size-h3)' }}>
      Mon contenu
    </div>
  );
};
```

### Avec Tailwind-like classes

```tsx
const MyComponent = () => {
  return (
    <>
      <h1 className="text-h1 font-bold tracking-tight">
        Titre principal
      </h1>
      <p className="text-body-large leading-relaxed">
        Paragraphe d'introduction
      </p>
      <button className="text-button font-semibold">
        Cliquez ici
      </button>
    </>
  );
};
```

## 🔧 Personnalisation

### Modifier une taille existante

Éditez le fichier `src/styles/typography.css` :

```css
:root {
  /* Modifier la taille du H1 */
  --font-size-h1: clamp(2rem, 1.75rem + 1.5vw, 3.5rem); /* 32px → 56px */
}
```

### Ajouter une nouvelle taille

```css
:root {
  /* Nouvelle taille personnalisée */
  --font-size-custom: clamp(1.375rem, 1.25rem + 0.625vw, 1.875rem); /* 22px → 30px */
}

/* Classe utilitaire */
.text-custom {
  font-size: var(--font-size-custom);
  line-height: var(--line-height-normal);
}
```

### Calculer une valeur clamp()

Utilisez cette formule :

```
clamp(MIN, PREFERRED, MAX)

PREFERRED = BASE + (MAX - BASE) / VIEWPORT_WIDTH * 100vw

Exemple pour 16px → 24px sur 1440px de viewport :
PREFERRED = 1rem + (1.5rem - 1rem) / 1440 * 100vw
          = 1rem + 0.5rem / 1440 * 100vw
          = 1rem + 0.03472vw
          ≈ 1rem + 0.035vw
```

## 📱 Breakpoints de référence

- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : 1024px - 1440px
- **Large Desktop** : > 1440px

Les tailles sont fluides grâce à `clamp()`, donc pas besoin de media queries pour les ajustements de base.

## 🎯 Avantages du système

1. **Responsive automatique** : Les tailles s'adaptent fluidement à toutes les résolutions
2. **Maintenabilité** : Modification centralisée des tailles
3. **Cohérence** : Toutes les tailles suivent le même système
4. **Performance** : Pas de JavaScript nécessaire
5. **Accessibilité** : Respect des préférences utilisateur pour la taille de police

## 📦 Fichiers du système

- `src/styles/typography.css` : Variables et classes de typographie
- `src/styles/global.css` : Import de typography.css + styles globaux
- `src/App.tsx` : Import de global.css

## 🚀 Pour commencer

Le système est déjà activé ! Il suffit d'utiliser les variables CSS ou les classes utilitaires dans vos composants.

```tsx
// Exemple simple
<h1 className="text-h1 font-bold">Mon titre</h1>
<p className="text-body leading-relaxed">Mon paragraphe</p>
```

Ou en CSS :

```css
.ma-classe {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-semibold);
}
```
