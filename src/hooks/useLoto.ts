import { useState, useCallback, useEffect } from 'react';

export type GameType = 'quine' | 'double-quine' | 'carton-plein';

export interface LotoState {
  drawnNumbers: number[];
  currentGame: GameType | null;
  isDrawing: boolean;
  gameHistory: { type: GameType; numbers: number[] }[];
}

export const useLoto = () => {
  const [state, setState] = useState<LotoState>({
    drawnNumbers: [],
    currentGame: null,
    isDrawing: false,
    gameHistory: [],
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('loto-state', JSON.stringify(state));
    // Dispatch custom event to notify other tabs/windows
    window.dispatchEvent(new CustomEvent('loto-state-changed', { detail: state }));
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

  const resetAll = useCallback(() => {
    setState({
      drawnNumbers: [],
      currentGame: null,
      isDrawing: false,
      gameHistory: [],
    });
  }, []);

  return {
    ...state,
    startGame,
    drawNumber,
    endGame,
    resetAll,
  };
};