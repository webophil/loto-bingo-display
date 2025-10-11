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
  // Wheel of Fortune mode
  isWheelMode: boolean;
  wheelNumberCount: number;
  wheelPrize: string;
  wheelActivePrize: string; // Le lot actuellement affiché (fixé au moment du tirage)
  wheelWinningNumber: number | null;
  isWheelSpinning: boolean;
  wheelDrawHistory: Array<{ number: number; prize: string }>;
  wheelTargetRotation: number;
  wheelCurrentRotation: number;
  // Local image display mode
  localImages: Array<{ id: string; name: string; dataUrl: string }>;
  selectedImageId: string | null;
  isImageDisplayMode: boolean;
}

export const useLoto = () => {
  const [state, setState] = useState<LotoState>({
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
    isWheelMode: false,
    wheelNumberCount: 20,
    wheelPrize: '',
    wheelActivePrize: '',
    wheelWinningNumber: null,
    isWheelSpinning: false,
    wheelDrawHistory: [],
    wheelTargetRotation: 0,
    wheelCurrentRotation: 0,
    localImages: [],
    selectedImageId: null,
    isImageDisplayMode: false,
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
    const stateData = {
      ...state,
      timestamp: Date.now()
    };
    
    localStorage.setItem('loto-state', JSON.stringify(stateData));
    
    // Multiple broadcasting methods for reliability
    try {
      // Method 1: BroadcastChannel
      const channel = (window as any).lotoBroadcastChannel;
      if (channel) {
        console.log('📡 Broadcasting via BroadcastChannel:', stateData);
        channel.postMessage(stateData);
      }
      
      // Method 2: Storage event trigger
      localStorage.setItem('loto-sync-trigger', Date.now().toString());
      
      // Method 3: Custom event
      window.dispatchEvent(new CustomEvent('loto-update', { 
        detail: stateData 
      }));
      
    } catch (error) {
      console.error('❌ Broadcasting error:', error);
    }
  }, [state]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('loto-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setState(parsedState);
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

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
    setState({
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
      isWheelMode: false,
      wheelNumberCount: 20,
      wheelPrize: '',
      wheelActivePrize: '',
      wheelWinningNumber: null,
      isWheelSpinning: false,
      wheelDrawHistory: [],
      wheelTargetRotation: 0,
      wheelCurrentRotation: 0,
      localImages: [],
      selectedImageId: null,
      isImageDisplayMode: false,
    });
  }, []);

  const toggleWheelMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isWheelMode: !prev.isWheelMode,
      wheelWinningNumber: null,
      isWheelSpinning: false,
    }));
  }, []);

  const setWheelNumberCount = useCallback((count: number) => {
    setState(prev => ({
      ...prev,
      wheelNumberCount: count || 1,
      wheelWinningNumber: null,
    }));
  }, []);

  const setWheelPrize = useCallback((prize: string) => {
    setState(prev => ({
      ...prev,
      wheelPrize: prize,
    }));
  }, []);

  const spinWheel = useCallback(() => {
    setState(prev => {
      if (prev.isWheelSpinning) return prev;
      
      const winningNumber = getSecureRandomInt(prev.wheelNumberCount) + 1;
      
      // Calculate rotation ONCE here to share between all views
      const segmentAngle = 360 / prev.wheelNumberCount;
      const winningSegmentCenter = (winningNumber - 1) * segmentAngle + (segmentAngle / 2);
      
      // Add random offset within segment (with margins to avoid edges)
      const margin = segmentAngle * 0.15;
      const randomOffset = getSecureRandomFloat() * (segmentAngle - 2 * margin);
      
      // Calculate the final angle where the wheel should stop (modulo 360)
      const finalAngle = 360 - winningSegmentCenter + randomOffset;
      
      // Random number of complete rotations (5 to 7)
      const fullRotations = getSecureRandomInt(3) + 5;
      
      // Calculate target rotation taking into account current cumulative rotation
      // Find the next occurrence of finalAngle that is at least fullRotations * 360 away
      const baseRotation = Math.floor(prev.wheelCurrentRotation / 360) * 360;
      let targetRotation = baseRotation + finalAngle;
      
      // Ensure we make at least fullRotations complete turns
      while (targetRotation < prev.wheelCurrentRotation + fullRotations * 360) {
        targetRotation += 360;
      }
      
      // Add previous result to history if exists
      const newHistory = prev.wheelWinningNumber ? 
        [...prev.wheelDrawHistory, { number: prev.wheelWinningNumber, prize: prev.wheelActivePrize }] : 
        prev.wheelDrawHistory;
      
      return {
        ...prev,
        isWheelSpinning: true,
        wheelWinningNumber: winningNumber,
        wheelActivePrize: prev.wheelPrize, // Fixer le lot au moment du lancement
        wheelDrawHistory: newHistory,
        wheelTargetRotation: targetRotation,
      };
    });

    // Stop spinning and update current rotation after animation (5 seconds)
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isWheelSpinning: false,
        wheelCurrentRotation: prev.wheelTargetRotation,
      }));
    }, 5000);
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
    reader.readAsDataURL(file);
  }, []);

  const selectImage = useCallback((id: string | null) => {
    setState(prev => ({
      ...prev,
      selectedImageId: id,
    }));
  }, []);

  const deleteAllImages = useCallback(() => {
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
    toggleWheelMode,
    setWheelNumberCount,
    setWheelPrize,
    spinWheel,
    addLocalImage,
    selectImage,
    deleteAllImages,
    toggleImageDisplay,
  };
};