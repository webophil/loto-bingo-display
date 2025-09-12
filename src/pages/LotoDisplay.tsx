import { useLoto } from '@/hooks/useLoto';
import { LotoGrid } from '@/components/LotoGrid';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';

const LotoDisplay = () => {
  const { drawnNumbers, currentGame, isDrawing } = useLoto();
  const latestNumber = drawnNumbers[drawnNumbers.length - 1];
  
  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('loto-state');
    if (savedState) {
      // In a real app, you'd want to sync this state properly
      console.log('State should be synced from localStorage');
    }
  }, []);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-6xl font-bold gradient-primary bg-clip-text text-transparent">
          🎯 LOTO ASSOCIATIF 🎯
        </h1>
        {currentGame && (
          <Badge className="gradient-secondary text-white text-2xl px-8 py-3 font-bold animate-pulse-glow">
            {currentGame === 'quine' && 'QUINE'}
            {currentGame === 'double-quine' && 'DOUBLE QUINE'}
            {currentGame === 'carton-plein' && 'CARTON PLEIN'}
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

      <LotoGrid drawnNumbers={drawnNumbers} isDrawing={isDrawing} />
      
      <footer className="text-center space-y-2">
        <p className="text-xl text-muted-foreground">
          {drawnNumbers.length} / 90 numéros tirés
        </p>
        {!currentGame && drawnNumbers.length === 0 && (
          <p className="text-lg text-muted-foreground italic">
            En attente du prochain tirage...
          </p>
        )}
      </footer>
    </div>
  );
};

export default LotoDisplay;