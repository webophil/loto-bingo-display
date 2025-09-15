import { useLoto } from '@/hooks/useLoto';
import { LotoGrid } from '@/components/LotoGrid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Maximize } from 'lucide-react';

const LotoDisplay = () => {
  const [displayState, setDisplayState] = useState({
    drawnNumbers: [] as number[],
    currentGame: null as any,
    isDrawing: false,
  });
  
  const latestNumber = displayState.drawnNumbers[displayState.drawnNumbers.length - 1];
  
  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };
  
  // Listen for real-time updates from dashboard
  useEffect(() => {
    const loadInitialState = () => {
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
    loadInitialState();

    // Use BroadcastChannel for real-time updates between windows
    const channel = new BroadcastChannel('loto-updates');
    
    const handleMessage = (event: MessageEvent) => {
      console.log('📺 Display received update:', event.data);
      const newState = event.data;
      setDisplayState({
        drawnNumbers: newState.drawnNumbers,
        currentGame: newState.currentGame,
        isDrawing: newState.isDrawing,
      });
    };
    
    channel.addEventListener('message', handleMessage);
    console.log('📺 Display window listening for updates...');

    return () => {
      channel.close();
    };
  }, []);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center space-y-8 relative">
      <Button 
        onClick={enterFullscreen}
        className="absolute top-4 right-4 gradient-primary"
        size="sm"
      >
        <Maximize className="w-4 h-4 mr-2" />
        Plein écran
      </Button>
      <header className="text-center space-y-6">
        <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
          🎯 LOTO CORAIL'S REMOISES 🎯
        </h1>
        
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {displayState.currentGame && (
            <Badge className="gradient-secondary text-white text-2xl px-8 py-3 font-bold animate-pulse-glow">
              {displayState.currentGame === 'quine' && '🎯 QUINE'}
              {displayState.currentGame === 'double-quine' && '🎯🎯 DOUBLE QUINE'}
              {displayState.currentGame === 'carton-plein' && '🏆 CARTON PLEIN'}
            </Badge>
          )}
          
          {latestNumber && (
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold text-foreground">Dernier numéro :</p>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white animate-bounce-soft animate-blink ${
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
        </div>
      </header>

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