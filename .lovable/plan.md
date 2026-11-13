# Écran externe (mode jeu) : appliquer la disposition de « écran-désiré »

Proportions identiques sur tous les écrans / vidéoprojecteurs, calculées à partir de la taille de l'écran (pas de tailles fixes). Le fond reste blanc, l'écran « image » (fond noir) ne change pas, l'animation de la boule tirée et le rendu 3D sont conservés. Le mode Bingo garde la même taille de rack que le Loto.

## Disposition cible (en % de l'écran)

```text
+--------------------------------------------------------------+
| marge ~2%                                                    |
| [QUINE] [SANS DEMARQUER]          (hauteur ~11%)             |
| +------------------------------------+   Dernier             |
| |  rack 15 x 6                        |   sorti  (texte ~8%)  |
| |  largeur ~79%, hauteur ~58%         |   ( 48 ) boule ~25%   |
| +------------------------------------+   de la hauteur       |
| [ lot surprise ]   bandeau pleine largeur, hauteur ~16%      |
| marge ~2%                                                    |
+--------------------------------------------------------------+
```

## Changements
1. **Marges** : marge uniforme ~2% en haut, bas, gauche, droite (comme sur la capture).
2. **En-tête** (Quine, Sans démarquer) : moins d'espace au-dessus et en dessous ; taille des badges légèrement réduite et proportionnelle à l'écran.
3. **Rack** : boules un peu plus petites avec plus d'air entre elles, rack occupant ~79% de la largeur ; les boules déjà sorties restent agrandies comme aujourd'hui.
4. **Dernier sorti** : texte nettement plus grand, boule environ 1,2x plus grande qu'aujourd'hui, centrée verticalement à côté du rack.
5. **Bandeau du lot** : plus haut (~16% de l'écran), texte plus grand, plus proche du rack (écart réduit).

## Détails techniques
- `src/pages/LotoDisplay.tsx` : padding `2vmin`/`2vw`, lignes en `vh` (header ~11vh, zone centrale flex-1, bandeau ~16vh), colonne droite ~18vw, boule « Dernier sorti » `min(25vh, 14vw)`, polices en `vmin`.
- `src/components/LotoGrid.tsx` : taille de boule `min(4.6vw, 8.4vh)`, gaps proportionnels, même calcul pour Bingo (colonne lettres incluse).
- Vérification par captures Playwright en 1920x1080, 1280x720, 1366x768, 1024x768 (aucun débordement).
