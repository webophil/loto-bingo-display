

## Refonte du layout de l'ecran externe (mode jeu)

Le layout actuel est un empilement vertical (header centre en haut, grille en dessous, dernier numero dans le header). L'image de reference montre un layout completement different qu'il faut reproduire.

### Layout cible (d'apres l'image)

```text
+------------------------------------------------------------------+
| [QUINE]  [⚠ SANS DEMARQUER ⚠]                                   |
|                                                                   |
| +----------------------------------------------+  Dernier        |
| |  1   2   3   4   5  ...  14  15              |  sorti          |
| | 16  17  18  19  20  ...  29  30              |                  |
| | 31  32  33  ...             45              |   (68)           |
| | 46  47  ...                 60              |   gros           |
| | 61  62  ...                 75              |   cercle         |
| | 76  77  ...                 90              |                  |
| +----------------------------------------------+                  |
|                                                                   |
| 🎁 Un voyage dans les Iles pour 2 personnes                      |
+------------------------------------------------------------------+
```

### Changements

**Fichier : `src/pages/LotoDisplay.tsx`** -- refonte du JSX du mode jeu

1. **Fond blanc** au lieu du degrade sombre : `bg-white` sur le conteneur principal
2. **Layout en grille CSS** : le corps principal utilise un grid `grid-cols-[1fr_auto]` avec la grille a gauche et le bloc "Dernier sorti" a droite
3. **Header aligne a gauche** : les badges QUINE et SANS DEMARQUER sont en `flex justify-start` en haut, pas centres
4. **Bloc "Dernier sorti"** deplace du header vers la colonne droite du grid, centree verticalement. Le texte "Dernier sorti" au-dessus, le gros cercle en dessous
5. **Banniere du lot en bas** : `currentPrize` affiche en bas, pleine largeur, avec un fond colore (similaire au bleu/violet de l'image), texte blanc, aligne a gauche
6. **Padding/marges** : un padding genereux sur le conteneur principal (environ `3vmin`) pour creer la marge de securite visible dans l'image
7. Tous les textes passent en sombre (`text-gray-900`) sauf dans la banniere du lot (texte blanc)
8. Le fond du rack de la grille reste sombre (gris fonce comme dans l'image) -- la grille garde son `bg-gray-700` ou similaire avec les boules colorees dessus

**Fichier : `src/components/LotoGrid.tsx`**

9. Remplacer `bg-white/10 border-white/20` par `bg-gray-700 border-gray-600` pour le fond sombre du rack visible dans l'image (s'applique aux deux modes loto et bingo, meme taille de rack)
10. Retirer `backdrop-blur-sm` (inutile sur fond opaque)

### Ce qui ne change PAS

- Le mode image (fond noir) reste identique
- Le mode bingo garde la meme taille de rack que le loto
- L'animation de sortie du numero est conservee
- Le banner "C'EST GAGNE" reste identique
- Le mecanisme fullscreen automatique reste identique
- Toute la logique de synchronisation localStorage/BroadcastChannel reste identique

