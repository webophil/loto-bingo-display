

## Corrections finales affichage externe

### 1. Fond du rack de boules — contraste insuffisant

`bg-white/5` (5% d'opacité blanc) est quasi invisible sur un fond sombre. Passer à `bg-white/10` et renforcer la bordure avec `border-white/20` au lieu de `border-border/50` (qui est aussi très sombre). Cela crée un contraste subtil mais visible entre le rack et le fond.

**Fichier** : `src/components/LotoGrid.tsx` (lignes 27 et 66)
- Remplacer `bg-white/5` par `bg-white/10`
- Remplacer `border border-border/50` par `border border-white/20`

### 2. Header trop collé au haut

Le `paddingTop: clamp(0.75rem, 2vmin, 2rem)` est encore trop serré pour les TV HD. Augmenter le minimum et la valeur relative.

**Fichier** : `src/pages/LotoDisplay.tsx` (ligne 301)
- Passer `paddingTop` de `clamp(0.75rem, 2vmin, 2rem)` à `clamp(1rem, 3vmin, 3rem)`

