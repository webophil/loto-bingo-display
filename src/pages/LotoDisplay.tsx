import { useLoto } from '@/hooks/useLoto';
import { LotoGrid } from '@/components/LotoGrid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Maximize } from 'lucide-react';
import { GameType } from '@/hooks/useLoto';

interface DisplayState {
  drawnNumbers: number[];
  currentGame: GameType | null;
  isDrawing: boolean;
  withDemarque: boolean;
  prizeDescription: string;
  isQuinesDuSudMode: boolean;
  prizeDescriptions: {
    quine: string;
    'double-quine': string;
    'carton-plein': string;
  };
  isWinning: boolean;
}

const LotoDisplay = () => {
  const [displayState, setDisplayState] = useState<DisplayState>({
    drawnNumbers: [],
    currentGame: null,
    isDrawing: false,
    withDemarque: true,
    prizeDescription: '',
    isQuinesDuSudMode: false,
    prizeDescriptions: {
      quine: '',
      'double-quine': '',
      'carton-plein': '',
    },
    isWinning: false,
  });
  
  const latestNumber = displayState.drawnNumbers[displayState.drawnNumbers.length - 1];
  
  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };
  
  // Listen for real-time updates from dashboard
  useEffect(() => {
    let lastTimestamp = 0;
    
    const loadStateFromStorage = () => {
      const savedState = localStorage.getItem('loto-state');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          
          // Only update if this is newer data
          if (parsedState.timestamp && parsedState.timestamp > lastTimestamp) {
            lastTimestamp = parsedState.timestamp;
            setDisplayState({
              drawnNumbers: parsedState.drawnNumbers || [],
              currentGame: parsedState.currentGame || null,
              isDrawing: parsedState.isDrawing || false,
              withDemarque: parsedState.withDemarque ?? true,
              prizeDescription: parsedState.prizeDescription || '',
              isQuinesDuSudMode: parsedState.isQuinesDuSudMode || false,
              prizeDescriptions: parsedState.prizeDescriptions || { quine: '', 'double-quine': '', 'carton-plein': '' },
              isWinning: parsedState.isWinning || false,
            });
            console.log('📺 Display updated from localStorage:', parsedState);
          }
        } catch (error) {
          console.error('❌ Error loading state:', error);
        }
      }
    };

    // Load initial state
    loadStateFromStorage();
    console.log('📺 Display window initialized and listening...');

    // Method 1: BroadcastChannel
    const channel = new BroadcastChannel('loto-updates');
    const handleBroadcast = (event: MessageEvent) => {
      console.log('📺 BroadcastChannel received:', event.data);
      const newState = event.data;
      if (newState.timestamp && newState.timestamp > lastTimestamp) {
        lastTimestamp = newState.timestamp;
        setDisplayState({
          drawnNumbers: newState.drawnNumbers || [],
          currentGame: newState.currentGame || null,
          isDrawing: newState.isDrawing || false,
          withDemarque: newState.withDemarque ?? true,
          prizeDescription: newState.prizeDescription || '',
          isQuinesDuSudMode: newState.isQuinesDuSudMode || false,
          prizeDescriptions: newState.prizeDescriptions || { quine: '', 'double-quine': '', 'carton-plein': '' },
          isWinning: newState.isWinning || false,
        });
      }
    };
    channel.addEventListener('message', handleBroadcast);

    // Method 2: Storage event listener
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'loto-state' || event.key === 'loto-sync-trigger') {
        console.log('📺 Storage event detected');
        loadStateFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Method 3: Custom event listener
    const handleCustomEvent = (event: any) => {
      console.log('📺 Custom event received:', event.detail);
      const newState = event.detail;
      if (newState.timestamp && newState.timestamp > lastTimestamp) {
        lastTimestamp = newState.timestamp;
        setDisplayState({
          drawnNumbers: newState.drawnNumbers || [],
          currentGame: newState.currentGame || null,
          isDrawing: newState.isDrawing || false,
          withDemarque: newState.withDemarque ?? true,
          prizeDescription: newState.prizeDescription || '',
          isQuinesDuSudMode: newState.isQuinesDuSudMode || false,
          prizeDescriptions: newState.prizeDescriptions || { quine: '', 'double-quine': '', 'carton-plein': '' },
          isWinning: newState.isWinning || false,
        });
      }
    };
    window.addEventListener('loto-update', handleCustomEvent);

    // Method 4: Polling fallback (every 500ms)
    const pollingInterval = setInterval(() => {
      loadStateFromStorage();
    }, 500);

    return () => {
      channel.close();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loto-update', handleCustomEvent);
      clearInterval(pollingInterval);
    };
  }, []);

  const currentPrize = displayState.currentGame ? displayState.prizeDescriptions[displayState.currentGame] : '';

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

      {/* Winning Banner */}
      {displayState.isWinning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-12 rounded-3xl shadow-2xl text-center animate-bounce-soft animate-pulse-glow border-8 border-loto-blue">
            <div className="text-8xl mb-6 text-loto-blue">🏆</div>
            <h2 className="text-6xl font-bold text-loto-red animate-blink mb-4">
              C'EST GAGNÉ !!!
            </h2>
            <p className="text-2xl text-gray-700 font-semibold">
              {displayState.currentGame === 'quine' && '🎯 QUINE'}
              {displayState.currentGame === 'double-quine' && '🎯🎯 DOUBLE QUINE'}
              {displayState.currentGame === 'carton-plein' && '🏆 CARTON PLEIN'}
            </p>
            {currentPrize && (
              <p className="text-xl text-gray-600 mt-2">
                🎁 {currentPrize}
              </p>
            )}
          </div>
        </div>
      )}

      <header className="text-center space-y-6">
        <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
          🎯 LOTO CORAIL'S REMOISES 🎯
        </h1>
        
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {displayState.currentGame && (
            <div className="text-center space-y-4">
              <Badge className="gradient-secondary text-white text-2xl px-8 py-3 font-bold animate-pulse-glow">
                {displayState.currentGame === 'quine' && '🎯 QUINE'}
                {displayState.currentGame === 'double-quine' && '🎯🎯 DOUBLE QUINE'}
                {displayState.currentGame === 'carton-plein' && '🏆 CARTON PLEIN'}
                {displayState.isQuinesDuSudMode && ' (QUINES DU SUD)'}
              </Badge>
              
              <div className="text-center">
                {!displayState.withDemarque && (
                  <p className="text-loto-red text-2xl font-bold animate-pulse mb-2">
                    ⚠️ ON NE DEMARQUE PAS ⚠️
                  </p>
                )}
                {currentPrize && (
                  <p className="text-2xl text-white font-semibold">
                    🎁 Lot : {currentPrize}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {latestNumber && !displayState.isWinning && (
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

      {!displayState.isWinning && (
        <LotoGrid drawnNumbers={displayState.drawnNumbers} isDrawing={displayState.isDrawing} />
      )}
      
      {!displayState.isWinning && (
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
      )}
    </div>
  );
};

export default LotoDisplay;