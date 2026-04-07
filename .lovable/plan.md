

## Ajuster les proportions grille / dernier sorti

### Changement unique dans `src/pages/LotoDisplay.tsx` (ligne 376)

Remplacer `gridTemplateColumns: '1fr auto'` par une répartition explicite qui réduit la grille de 20% et augmente la colonne "Dernier sorti" :

```
gridTemplateColumns: '3fr 2fr'
```

Cela passe d'un ratio ~100%/auto à un ratio 60/40 (au lieu de ~70/30), ce qui réduit la grille d'environ 20% relatif et donne plus d'espace au bloc "Dernier sorti".

Le cercle du dernier numéro sera aussi agrandi proportionnellement :
- `width`/`height` de `clamp(5rem, 15vmin, 20rem)` → `clamp(6rem, 18vmin, 24rem)`
- `fontSize` de `clamp(2.5rem, 10vmin, 12rem)` → `clamp(3rem, 12vmin, 14rem)`

**Un seul fichier modifié** : `src/pages/LotoDisplay.tsx`

