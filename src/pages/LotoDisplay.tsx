import { useLoto } from '@/hooks/useLoto';
import { LotoGrid } from '@/components/LotoGrid';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

const LotoDisplay = () => {
  const [displayState, setDisplayState] = useState({
    drawnNumbers: [] as number[],
    currentGame: null as any,
    isDrawing: false,
  });
  
  const latestNumber = displayState.drawnNumbers[displayState.drawnNumbers.length - 1];
  
  // Listen for real-time updates from dashboard
  useEffect(() => {
    const handleStateChange = (event: any) => {
      setDisplayState({
        drawnNumbers: event.detail.drawnNumbers,
        currentGame: event.detail.currentGame,
        isDrawing: event.detail.isDrawing,
      });
    };

    const handleStorageChange = () => {
      const savedState = localStorage.getItem('loto-state');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          setDisplayState({
            drawnNumbers: parsedState.drawnNumbers,
            currentGame: parsedState.currentGame,
            isDrawing: parsedState.isDrawing,
          });
        } catch (error) {
          console.error('Error loading state:', error);
        }
      }
    };

    // Load initial state
    handleStorageChange();

    // Listen for changes
    window.addEventListener('loto-state-changed', handleStateChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('loto-state-changed', handleStateChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-6xl font-bold gradient-primary bg-clip-text text-transparent">
          🎯 LOTO ASSOCIATIF 🎯
        </h1>
        {displayState.currentGame && (
          <Badge className="gradient-secondary text-white text-2xl px-8 py-3 font-bold animate-pulse-glow">
            {displayState.currentGame === 'quine' && '🎯 QUINE'}
            {displayState.currentGame === 'double-quine' && '🎯🎯 DOUBLE QUINE'}
            {displayState.currentGame === 'carton-plein' && '🏆 CARTON PLEIN'}
          </Badge>
        )}
      </header>

      {latestNumber && (
        <div className="text-center space-y-4">
          <p className="text-3xl font-semibold text-foreground">Dernier numéro tiré :</p>
          <div className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl font-bold text-white mx-auto animate-bounce-soft ${
            latestNumber <= 15 ? 'bg-loto-red' :
            latestNumber <= 30 ? 'bg-loto-blue' :
            latestNumber <= 45 ? 'bg-loto-yellow text-gray-900' :
            latestNumber <= 60 ? 'bg-loto-green' :
            latestNumber <= 75 ? 'bg-loto-purple' : 'bg-loto-orange'
          }`} style={{ boxShadow: 'var(--shadow-glow)' }}>
            {latestNumber}
          </div>
        </div>
      )}

      <LotoGrid drawnNumbers={displayState.drawnNumbers} isDrawing={displayState.isDrawing} />
      
      <footer className="text-center space-y-2">
        <p className="text-xl text-muted-foreground">
          {displayState.drawnNumbers.length} / 90 numéros tirés
        </p>
        {!displayState.currentGame && displayState.drawnNumbers.length === 0 && (
          <p className="text-lg text-muted-foreground italic">
            En attente du prochain tirage...
          </p>
        )}
      </footer>
    </div>
  );
};

export default LotoDisplay;