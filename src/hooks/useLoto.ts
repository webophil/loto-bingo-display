import { useState, useCallback, useEffect } from 'react';

export type GameType = 'quine' | 'double-quine' | 'carton-plein';

export interface LotoState {
  drawnNumbers: number[];
  currentGame: GameType | null;
  isDrawing: boolean;
  gameHistory: { type: GameType; numbers: number[] }[];
  isManualMode: boolean;
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
  wheelWinningNumber: number | null;
  isWheelSpinning: boolean;
}

export const useLoto = () => {
  const [state, setState] = useState<LotoState>({
    drawnNumbers: [],
    currentGame: null,
    isDrawing: false,
    gameHistory: [],
    isManualMode: false,
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
    wheelWinningNumber: null,
    isWheelSpinning: false,
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
      if (prev.isDrawing || prev.drawnNumbers.length >= 90) return prev;
      
      const availableNumbers = Array.from({ length: 90 }, (_, i) => i + 1)
        .filter(num => !prev.drawnNumbers.includes(num));
      
      if (availableNumbers.length === 0) return prev;
      
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
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

  const drawManualNumber = useCallback((number: number) => {
    setState(prev => {
      if (prev.drawnNumbers.includes(number)) return prev;
      
      return {
        ...prev,
        drawnNumbers: [...prev.drawnNumbers, number],
        isDrawing: true,
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
      isManualMode: false,
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
      wheelWinningNumber: null,
      isWheelSpinning: false,
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
      wheelNumberCount: Math.max(10, Math.min(50, count)),
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
      
      const winningNumber = Math.floor(Math.random() * prev.wheelNumberCount) + 1;
      
      return {
        ...prev,
        isWheelSpinning: true,
        wheelWinningNumber: winningNumber,
      };
    });

    // Stop spinning after animation (3 seconds)
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isWheelSpinning: false,
      }));
    }, 3000);
  }, []);

  return {
    ...state,
    startGame,
    drawNumber,
    drawManualNumber,
    endGame,
    resetAll,
    toggleMode,
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
  };
};