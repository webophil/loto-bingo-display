import { useState, useCallback, useEffect } from 'react';

export type GameType = 'quine' | 'double-quine' | 'carton-plein';

// Secure random number generator using crypto.getRandomValues()
const getSecureRandomInt = (max: number): number => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
};

// Secure random float between -0.5 and 0.5
const getSecureRandomFloat = (): number => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] / 0xFFFFFFFF) - 0.5;
};

export interface LotoState {
  drawnNumbers: number[];
  currentGame: GameType | null;
  isDrawing: boolean;
  gameHistory: { type: GameType; numbers: number[] }[];
  isManualMode: boolean;
  isBingoMode: boolean;
  withDemarque: boolean;
  prizeDescription: string;
  isQuinesDuSudMode: boolean;
  prizeDescriptions: {
    quine: string;
    'double-quine': string;
    'carton-plein': string;
  };
  isWinning: boolean;
  animationDuration: number;
  // Local image display mode
  localImages: Array<{ id: string; name: string; dataUrl: string }>;
  selectedImageId: string | null;
  isImageDisplayMode: boolean;
}

export const useLoto = () => {
  const [state, setState] = useState<LotoState>(() => {
    try {
      const savedState = localStorage.getItem('loto-state');
      const savedImages = localStorage.getItem('loto-images');
      
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        const parsedImages = savedImages ? JSON.parse(savedImages) : [];
        
        console.log('✅ Loading initial state from localStorage');
        
        return {
          drawnNumbers: Array.isArray(parsedState.drawnNumbers) ? parsedState.drawnNumbers : [],
          currentGame: parsedState.currentGame || null,
          isDrawing: false,
          gameHistory: Array.isArray(parsedState.gameHistory) ? parsedState.gameHistory : [],
          isManualMode: parsedState.isManualMode ?? true,
          isBingoMode: parsedState.isBingoMode ?? false,
          withDemarque: parsedState.withDemarque ?? true,
          prizeDescription: parsedState.prizeDescription || '',
          isQuinesDuSudMode: parsedState.isQuinesDuSudMode ?? false,
          prizeDescriptions: parsedState.prizeDescriptions || {
            quine: '',
            'double-quine': '',
            'carton-plein': '',
          },
          isWinning: parsedState.isWinning ?? false,
          animationDuration: parsedState.animationDuration ?? 4,
          localImages: Array.isArray(parsedImages) ? parsedImages : [],
          selectedImageId: parsedState.selectedImageId || null,
          isImageDisplayMode: parsedState.isImageDisplayMode ?? false,
        };
      }
    } catch (error) {
      console.error('❌ Error loading initial state:', error);
      localStorage.removeItem('loto-state');
      localStorage.removeItem('loto-images');
    }
    
    // Default state if nothing saved or error occurred
    return {
      drawnNumbers: [],
      currentGame: null,
      isDrawing: false,
      gameHistory: [],
      isManualMode: true,
      isBingoMode: false,
      withDemarque: true,
      prizeDescription: '',
      isQuinesDuSudMode: false,
      prizeDescriptions: {
        quine: '',
        'double-quine': '',
        'carton-plein': '',
      },
      isWinning: false,
      animationDuration: 4,
      localImages: [],
      selectedImageId: null,
      isImageDisplayMode: false,
    };
  });

  // Create a persistent BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel('loto-updates');
    
    // Store channel reference for broadcasting updates
    (window as any).lotoBroadcastChannel = channel;
    
    return () => {
      channel.close();
      delete (window as any).lotoBroadcastChannel;
    };
  }, []);

  // Save state to localStorage and broadcast changes
  useEffect(() => {
    // Exclude localImages from localStorage to avoid quota errors with base64 data
    const { localImages, ...stateWithoutImages } = state;
    const stateData = {
      ...stateWithoutImages,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('loto-state', JSON.stringify(stateData));
      
      // Save images separately in localStorage for persistence across sessions
      localStorage.setItem('loto-images', JSON.stringify(localImages));
    } catch (error) {
      console.error('❌ localStorage quota exceeded:', error);
      // Fallback: save without history to reduce size
      try {
        const minimalState = {
          ...stateWithoutImages,
          gameHistory: [],
          timestamp: Date.now()
        };
        localStorage.setItem('loto-state', JSON.stringify(minimalState));
        localStorage.setItem('loto-images', JSON.stringify(localImages));
      } catch (fallbackError) {
        console.error('❌ Even minimal state failed:', fallbackError);
      }
    }
    
    // Multiple broadcasting methods for reliability
    try {
      // For broadcasting, include localImages so display window can show them
      const broadcastData = {
        ...state,
        timestamp: Date.now()
      };
      
      // Method 1: BroadcastChannel
      const channel = (window as any).lotoBroadcastChannel;
      if (channel) {
        console.log('📡 Broadcasting via BroadcastChannel:', broadcastData);
        channel.postMessage(broadcastData);
      }
      
      // Method 2: Storage event trigger
      localStorage.setItem('loto-sync-trigger', Date.now().toString());
      
      // Method 3: Custom event
      window.dispatchEvent(new CustomEvent('loto-update', { 
        detail: broadcastData 
      }));
      
    } catch (error) {
      console.error('❌ Broadcasting error:', error);
    }
  }, [state]);


  const startGame = useCallback((gameType: GameType) => {
    setState(prev => ({
      ...prev,
      currentGame: gameType,
      drawnNumbers: [],
      isDrawing: false,
    }));
  }, []);

  const drawNumber = useCallback(() => {
    setState(prev => {
      const maxNumbers = prev.isBingoMode ? 75 : 90;
      if (prev.isDrawing || prev.drawnNumbers.length >= maxNumbers) return prev;
      
      const availableNumbers = Array.from({ length: maxNumbers }, (_, i) => i + 1)
        .filter(num => !prev.drawnNumbers.includes(num));
      
      if (availableNumbers.length === 0) return prev;
      
      const randomIndex = getSecureRandomInt(availableNumbers.length);
      const newNumber = availableNumbers[randomIndex];
      
      return {
        ...prev,
        drawnNumbers: [...prev.drawnNumbers, newNumber],
        isDrawing: true,
      };
    });

    // Reset drawing state after animation
    setTimeout(() => {
      setState(prev => ({ ...prev, isDrawing: false }));
    }, 1000);
  }, []);

  const endGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      gameHistory: prev.currentGame 
        ? [...prev.gameHistory, { type: prev.currentGame, numbers: [...prev.drawnNumbers] }]
        : prev.gameHistory,
      currentGame: null,
      drawnNumbers: [],
      isDrawing: false,
      isWinning: false,
      prizeDescription: '',
      // Préserver les paramètres de configuration et les images
    }));
  }, []);

  const toggleMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isManualMode: !prev.isManualMode,
    }));
  }, []);

  const toggleBingoMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isBingoMode: !prev.isBingoMode,
    }));
  }, []);

  const drawManualNumber = useCallback((number: number) => {
    setState(prev => {
      const isAlreadyDrawn = prev.drawnNumbers.includes(number);
      
      return {
        ...prev,
        drawnNumbers: isAlreadyDrawn
          ? prev.drawnNumbers.filter(n => n !== number)
          : [...prev.drawnNumbers, number],
        isDrawing: !isAlreadyDrawn,
      };
    });

    // Reset drawing state after animation
    setTimeout(() => {
      setState(prev => ({ ...prev, isDrawing: false }));
    }, 1000);
  }, []);

  const toggleDemarque = useCallback(() => {
    setState(prev => ({
      ...prev,
      withDemarque: !prev.withDemarque,
    }));
  }, []);

  const setPrizeDescription = useCallback((description: string) => {
    setState(prev => ({
      ...prev,
      prizeDescription: description,
    }));
  }, []);

  const toggleQuinesDuSud = useCallback(() => {
    setState(prev => ({
      ...prev,
      isQuinesDuSudMode: !prev.isQuinesDuSudMode,
    }));
  }, []);

  const setPrizeDescriptions = useCallback((prizes: { quine: string; 'double-quine': string; 'carton-plein': string }) => {
    setState(prev => ({
      ...prev,
      prizeDescriptions: prizes,
    }));
  }, []);

  const setWinning = useCallback((isWinning: boolean) => {
    setState(prev => ({
      ...prev,
      isWinning,
    }));
  }, []);

  const resumeGame = useCallback(() => {
    setState(prev => {
      let nextGame: GameType | null;
      
      if (prev.isQuinesDuSudMode) {
        // En mode Quines du Sud, on repart toujours sur une Quine
        nextGame = 'quine';
      } else {
        // Progression automatique : Quine → Double Quine → Carton plein → fin
        switch (prev.currentGame) {
          case 'quine':
            nextGame = 'double-quine';
            break;
          case 'double-quine':
            nextGame = 'carton-plein';
            break;
          case 'carton-plein':
          default:
            nextGame = null; // Fin de partie
            break;
        }
      }
      
      return {
        ...prev,
        isWinning: false,
        currentGame: nextGame,
        // En mode sans démarque, on garde toujours les numéros tirés
        // En mode avec démarque, on les reset sauf en Quines du Sud
        drawnNumbers: !prev.withDemarque || prev.isQuinesDuSudMode ? prev.drawnNumbers : [],
      };
    });
  }, []);

  const resetAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      drawnNumbers: [],
      currentGame: null,
      isDrawing: false,
      gameHistory: [],
      isManualMode: true,
      prizeDescription: '',
      isWinning: false,
      // Préserver les paramètres de configuration et les images
      // isBingoMode: conservé
      // withDemarque: conservé
      // isQuinesDuSudMode: conservé
      // prizeDescriptions: conservé
      // localImages: conservé
      // selectedImageId: conservé
      // isImageDisplayMode: conservé
    }));
  }, []);

  const addLocalImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setState(prev => ({
        ...prev,
        localImages: [
          ...prev.localImages,
          {
            id: `img-${Date.now()}-${Math.random()}`,
            name: file.name,
            dataUrl,
          }
        ],
      }));
    };
    reader.onerror = (error) => {
      console.error('❌ Error reading image file:', error);
    };
    reader.readAsDataURL(file);
  }, []);

  const selectImage = useCallback((id: string | null) => {
    setState(prev => ({
      ...prev,
      selectedImageId: id,
    }));
  }, []);

  const deleteAllImages = useCallback(() => {
    // Clear images from localStorage
    localStorage.removeItem('loto-images');
    
    setState(prev => ({
      ...prev,
      localImages: [],
      selectedImageId: null,
      isImageDisplayMode: false,
    }));
  }, []);

  const toggleImageDisplay = useCallback(() => {
    setState(prev => ({
      ...prev,
      isImageDisplayMode: !prev.isImageDisplayMode,
    }));
  }, []);

  const setAnimationDuration = useCallback((duration: number) => {
    setState(prev => ({
      ...prev,
      animationDuration: duration,
    }));
  }, []);

  return {
    ...state,
    startGame,
    drawNumber,
    drawManualNumber,
    endGame,
    resetAll,
    toggleMode,
    toggleBingoMode,
    toggleDemarque,
    setPrizeDescription,
    toggleQuinesDuSud,
    setPrizeDescriptions,
    setWinning,
    resumeGame,
    addLocalImage,
    selectImage,
    deleteAllImages,
    toggleImageDisplay,
    setAnimationDuration,
  };
};