

## Refonte de l'affichage ecran externe

### Problemes identifies

1. **Fond noir plat** : pas de profondeur, les boules ne ressortent pas
2. **Boules surdimensionnees** : `clamp(4.8rem, 11.2vmin, 19.2rem)` -- bien trop gros pour tenir dans un ecran sans debordement
3. **Grille non contrainte** : `width: 100%` / `height: 100%` sans veritable adaptation a l'espace disponible ; deborde sur beaucoup de resolutions
4. **Aucun mecanisme de containment** : le grid ne se reduit pas pour s'adapter a l'espace restant apres le header

### Approche proposee

**Fichiers modifies** : `src/index.css`, `src/components/LotoGrid.tsx`, `src/pages/LotoDisplay.tsx`
Aucune modification au dashboard, hooks, AnimatedBall, NumberBall (structure), ni a la logique metier.

#### 1. Fond enrichi (index.css + LotoDisplay.tsx)

Remplacer le fond noir uni par un degrade radial sombre type "vert de table de jeu fonce" ou bleu nuit profond, avec un tres leger vignettage. Cela donne de la profondeur et met les couleurs vives des boules en valeur.

```text
background: radial-gradient(ellipse at center, 
  hsl(220 30% 12%) 0%, 
  hsl(220 20% 6%) 100%);
```

#### 2. Taille des boules adaptative (index.css)

Reduire et rendre la taille des boules relative aux deux axes du viewport pour ne jamais deborder :

- Loto (90 numeros, grille 15x6) : taille basee sur `min(5.5vw, 13vh)` -- garantit que 15 colonnes x 6 lignes tiennent toujours
- Bingo (75 numeros, grille 16x5 avec lettres) : taille basee sur `min(5vw, 15vh)`
- Le disque blanc interieur et la taille de police s'adaptent proportionnellement

Concretement, `.number-ball` passe de `clamp(4.8rem, 11.2vmin, 19.2rem)` a `clamp(1.8rem, min(5.5vw, 13vh), 6rem)` et la police de facon proportionnelle.

#### 3. Grille containee (LotoGrid.tsx)

- Ajouter `max-width: fit-content` et `margin: auto` pour centrer sans etirer
- Remplacer `width/height: 100%` par des contraintes `max-height` et `max-width` en unites viewport
- Ajouter un leger `gap` entre les boules (actuellement quasi-nul) pour aerer : `gap: clamp(0.15rem, 0.4vmin, 0.5rem)`

#### 4. Layout display (LotoDisplay.tsx)

- Wrapper principal : `h-dvh w-dvh` (dynamic viewport height) au lieu de `h-screen` pour mieux gerer les barres de navigateur mobile
- Header en `flex-shrink-0` (deja le cas), grille dans un conteneur `flex-1 min-h-0` avec `overflow: hidden` et centrage flex
- Padding general un peu augmente pour aerer : `p-[clamp(0.5rem,1.5vmin,1.5rem)]`

### Resultat attendu

```text
┌─────────────────────────────────────────┐
│  [QUINE]  [🎁 Lot]  [Dernier sorti: 42]│  <- header compact
│                                         │
│     ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○     │
│     ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○     │
│     ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○     │  <- grille centree,
│     ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○     │     jamais de debordement
│     ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○     │
│     ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○     │
│                                         │  <- fond degrade sombre
└─────────────────────────────────────────┘
```

Les boules restent lisibles de loin grace au contraste fort sur fond sombre non-noir, et ne debordent plus quelle que soit la resolution.

