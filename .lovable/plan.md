

## Corrections affichage ecran externe

Deux problemes restants a corriger dans **2 fichiers** (sans toucher au reste de l'app) :

### 1. Fond du rack toujours noir

Le `bg-card/20` sur la grille dans `LotoGrid.tsx` applique un fond semi-transparent sur `--card` qui est noir (`240 10% 3.9%`). Remplacer par `bg-white/5` pour un fond subtil qui laisse transparaitre le degrade bleu nuit du display, ou simplement retirer le fond et ne garder que le `backdrop-blur-sm` avec une bordure legere.

**Fichier** : `src/components/LotoGrid.tsx` (lignes 27 et 66)
- Remplacer `bg-card/20` par `bg-white/5` sur les deux grilles (loto et bingo)

### 2. Header colle au bord superieur

Le padding du conteneur principal (`clamp(0.5rem, 1.5vmin, 1.5rem)`) est insuffisant en haut. Ajouter un `padding-top` specifique plus genereux et une petite marge basse au header.

**Fichier** : `src/pages/LotoDisplay.tsx` (ligne 301)
- Ajouter `paddingTop: 'clamp(0.75rem, 2vmin, 2rem)'` au style du conteneur principal pour garantir un espace en haut quelle que soit la resolution
- Le `mb-2` du header (ligne 332) est en `rem` fixe ; le passer en `mb-[clamp(0.25rem,1vmin,1rem)]` pour un espacement proportionnel

