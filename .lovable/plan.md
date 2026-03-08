

## Ouverture plein écran automatique de l'affichage externe

### Contexte

L'application sera empaquetée (Electron/Tauri). Les fenêtres ouvertes via `window.open` ne supportent pas le vrai plein écran directement depuis l'appelant. Mais la page `/display` elle-même peut demander le plein écran via l'API Fullscreen du navigateur au chargement.

### Approche

**3 fichiers modifiés** : `src/pages/LotoDisplay.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Index.tsx`

#### 1. Auto-fullscreen au chargement de `/display` (LotoDisplay.tsx)

Ajouter un `useEffect` qui appelle `document.documentElement.requestFullscreen()` au montage du composant. L'API Fullscreen nécessite une interaction utilisateur dans un navigateur classique, mais dans une app empaquetée (Electron/Tauri) elle fonctionne directement. En fallback navigateur, on ajoute un bouton discret "Plein écran" en overlay qui disparaît après clic.

```ts
useEffect(() => {
  const goFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Browser may block without user gesture — show button fallback
      setShowFullscreenButton(true);
    }
  };
  goFullscreen();
}, []);
```

Retirer le bouton Fullscreen existant (icône Maximize) et le remplacer par ce mécanisme automatique avec fallback.

#### 2. Fenêtre popup sans chrome (Dashboard.tsx + Index.tsx)

Mettre à jour `openDisplayOnExternalScreen` dans les deux fichiers pour ouvrir en mode `fullscreen=yes` (supporté par certains runtime) et ajouter un appel `requestFullscreen` sur la fenêtre ouverte :

```ts
const newWindow = window.open(displayUrl, "LotoDisplay", features);
if (newWindow) {
  newWindow.focus();
  newWindow.addEventListener('load', () => {
    newWindow.document.documentElement.requestFullscreen?.().catch(() => {});
  });
}
```

#### 3. Supprimer l'aide F11

Mettre à jour le texte d'aide dans `Index.tsx` pour retirer la mention de F11 et expliquer que le plein écran est automatique.

### Résultat

L'écran externe passe en plein écran automatiquement au chargement, sans barre de titre ni besoin d'appuyer sur F11. En cas de fallback navigateur, un bouton discret permet de basculer manuellement.

