import { useLoto } from "@/hooks/useLoto";
import { LotoGrid } from "@/components/LotoGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, useCallback } from "react";
import { Maximize } from "lucide-react";
import { GameType } from "@/hooks/useLoto";

import logoImage from "@/assets/logo.png";
import { AnimatedBall } from "@/components/AnimatedBall";

interface DisplayState {
  drawnNumbers: number[];
  currentGame: GameType | null;
  isDrawing: boolean;
  isBingoMode: boolean;
  withDemarque: boolean;
  prizeDescription: string;
  isQuinesDuSudMode: boolean;
  prizeDescriptions: {
    quine: string;
    "double-quine": string;
    "carton-plein": string;
  };
  isWinning: boolean;
  animationDuration: number;
  isImageDisplayMode: boolean;
  selectedImageDataUrl: string | null;
}

// Function to get the same color system as NumberBall component
const getNumberDisplayColor = (number: number) => {
  if (number <= 15) return "bg-blue-700 border-blue-700";
  if (number <= 30) return "bg-red-600 border-red-600";
  if (number <= 45) return "bg-gray-600 border-gray-600";
  if (number <= 60) return "bg-green-600 border-green-600";
  if (number <= 75) return "bg-yellow-400 border-yellow-400 text-black";
  return "bg-pink-600 border-pink-600";
};

const LotoDisplay = () => {
  const [displayState, setDisplayState] = useState<DisplayState>({
    drawnNumbers: [],
    currentGame: null,
    isDrawing: false,
    isBingoMode: false,
    withDemarque: true,
    prizeDescription: "",
    isQuinesDuSudMode: false,
    prizeDescriptions: {
      quine: "",
      "double-quine": "",
      "carton-plein": "",
    },
    isWinning: false,
    animationDuration: 4,
    isImageDisplayMode: false,
    selectedImageDataUrl: null,
  });

  const latestNumber = displayState.drawnNumbers[displayState.drawnNumbers.length - 1];
  const [animatingNumber, setAnimatingNumber] = useState<number | null>(null);
  const [animationPositions, setAnimationPositions] = useState<{ start: { x: number; y: number }, end: { x: number; y: number } } | null>(null);
  const previousDrawnCountRef = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const lastNumberRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showFullscreenButton, setShowFullscreenButton] = useState(false);

  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setShowFullscreenButton(false);
      }
    } catch {
      setShowFullscreenButton(true);
    }
  };

  // Auto-fullscreen on mount
  useEffect(() => {
    enterFullscreen();
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setAnimatingNumber(null);
    setAnimationPositions(null);
  }, []);

  // Detect when a new number is drawn to trigger animation
  useEffect(() => {
    if (displayState.drawnNumbers.length > previousDrawnCountRef.current && displayState.drawnNumbers.length > 0) {
      const newNumber = displayState.drawnNumbers[displayState.drawnNumbers.length - 1];
      
      // Clear any existing animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
      
      // Reset animation state immediately
      setAnimatingNumber(null);
      setAnimationPositions(null);
      
      // Calculate positions and start animation
      const startAnimation = () => {
        const gridElement = document.querySelector(`[data-ball-number="${newNumber}"]`);
        const lastNumberElement = lastNumberRef.current;
        
        if (gridElement && lastNumberElement) {
          const gridRect = gridElement.getBoundingClientRect();
          const lastRect = lastNumberElement.getBoundingClientRect();
          
          const positions = {
            start: {
              x: gridRect.left + gridRect.width / 2,
              y: gridRect.top + gridRect.height / 2,
            },
            end: {
              x: lastRect.left + lastRect.width / 2,
              y: lastRect.top + lastRect.height / 2,
            }
          };
          
          setAnimationPositions(positions);
          // Start animation after positions are set
          requestAnimationFrame(() => {
            setAnimatingNumber(newNumber);
          });
        } else {
          console.warn(`Animation elements not found: gridElement=${!!gridElement}, lastNumberElement=${!!lastNumberElement}`);
        }
      };
      
      // Start with a small delay to ensure DOM is updated
      animationTimeoutRef.current = setTimeout(() => {
        startAnimation();
        animationTimeoutRef.current = null;
      }, 100);
    }
    
    previousDrawnCountRef.current = displayState.drawnNumbers.length;
    
    // Cleanup function to clear any pending timeouts
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, [displayState.drawnNumbers]);

  // Listen for real-time updates from dashboard
  useEffect(() => {
    let lastTimestamp = 0;

    const loadStateFromStorage = () => {
      const savedState = localStorage.getItem("loto-state");
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);

          // Only update if this is newer data
          if (parsedState.timestamp && parsedState.timestamp > lastTimestamp) {
            lastTimestamp = parsedState.timestamp;

            // Load images from localStorage
            let localImages = [];
            try {
              const savedImages = localStorage.getItem("loto-images");
              if (savedImages) {
                localImages = JSON.parse(savedImages);
              }
            } catch (imgError) {
              console.error("❌ Error loading images from localStorage:", imgError);
            }

            // Get selected image data URL
            const selectedImageDataUrl =
              parsedState.isImageDisplayMode && parsedState.selectedImageId
                ? localImages.find((img: any) => img.id === parsedState.selectedImageId)?.dataUrl || null
                : null;

            setDisplayState({
              drawnNumbers: parsedState.drawnNumbers || [],
              currentGame: parsedState.currentGame || null,
              isDrawing: parsedState.isDrawing || false,
              isBingoMode: parsedState.isBingoMode || false,
              withDemarque: parsedState.withDemarque ?? true,
              prizeDescription: parsedState.prizeDescription || "",
              isQuinesDuSudMode: parsedState.isQuinesDuSudMode || false,
              prizeDescriptions: parsedState.prizeDescriptions || { quine: "", "double-quine": "", "carton-plein": "" },
              isWinning: parsedState.isWinning || false,
              animationDuration: parsedState.animationDuration || 4,
              isImageDisplayMode: parsedState.isImageDisplayMode || false,
              selectedImageDataUrl,
            });
            console.log("📺 Display updated from localStorage:", parsedState);
          }
        } catch (error) {
          console.error("❌ Error loading state:", error);
        }
      }
    };

    // Load initial state
    loadStateFromStorage();
    console.log("📺 Display window initialized and listening...");

    // Method 1: BroadcastChannel
    const channel = new BroadcastChannel("loto-updates");
    const handleBroadcast = (event: MessageEvent) => {
      console.log("📺 BroadcastChannel received:", event.data);
      const newState = event.data;
      if (newState.timestamp && newState.timestamp > lastTimestamp) {
        lastTimestamp = newState.timestamp;

        // Get selected image data URL
        const selectedImageDataUrl =
          newState.isImageDisplayMode && newState.selectedImageId
            ? (newState.localImages || []).find((img: any) => img.id === newState.selectedImageId)?.dataUrl || null
            : null;

        setDisplayState({
          drawnNumbers: newState.drawnNumbers || [],
          currentGame: newState.currentGame || null,
          isDrawing: newState.isDrawing || false,
          isBingoMode: newState.isBingoMode || false,
          withDemarque: newState.withDemarque ?? true,
          prizeDescription: newState.prizeDescription || "",
          isQuinesDuSudMode: newState.isQuinesDuSudMode || false,
          prizeDescriptions: newState.prizeDescriptions || { quine: "", "double-quine": "", "carton-plein": "" },
          isWinning: newState.isWinning || false,
          animationDuration: newState.animationDuration || 4,
          isImageDisplayMode: newState.isImageDisplayMode || false,
          selectedImageDataUrl,
        });
      }
    };
    channel.addEventListener("message", handleBroadcast);

    // Method 2: Storage event listener
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "loto-state" || event.key === "loto-sync-trigger") {
        console.log("📺 Storage event detected");
        loadStateFromStorage();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Method 3: Custom event listener
    const handleCustomEvent = (event: any) => {
      console.log("📺 Custom event received:", event.detail);
      const newState = event.detail;
      if (newState.timestamp && newState.timestamp > lastTimestamp) {
        lastTimestamp = newState.timestamp;

        // Get selected image data URL
        const selectedImageDataUrl =
          newState.isImageDisplayMode && newState.selectedImageId
            ? (newState.localImages || []).find((img: any) => img.id === newState.selectedImageId)?.dataUrl || null
            : null;

        setDisplayState({
          drawnNumbers: newState.drawnNumbers || [],
          currentGame: newState.currentGame || null,
          isDrawing: newState.isDrawing || false,
          isBingoMode: newState.isBingoMode || false,
          withDemarque: newState.withDemarque ?? true,
          prizeDescription: newState.prizeDescription || "",
          isQuinesDuSudMode: newState.isQuinesDuSudMode || false,
          prizeDescriptions: newState.prizeDescriptions || { quine: "", "double-quine": "", "carton-plein": "" },
          isWinning: newState.isWinning || false,
          animationDuration: newState.animationDuration || 4,
          isImageDisplayMode: newState.isImageDisplayMode || false,
          selectedImageDataUrl,
        });
      }
    };
    window.addEventListener("loto-update", handleCustomEvent);

    // Method 4: Polling fallback (every 500ms)
    const pollingInterval = setInterval(() => {
      loadStateFromStorage();
    }, 500);

    return () => {
      channel.close();
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loto-update", handleCustomEvent);
      clearInterval(pollingInterval);
    };
  }, []);

  const currentPrize = displayState.currentGame ? displayState.prizeDescriptions[displayState.currentGame] : "";

  // Render Image Display mode
  if (displayState.isImageDisplayMode && displayState.selectedImageDataUrl) {
    return (
      <div className="h-screen w-screen bg-green flex items-center justify-center overflow-hidden">
        <img
          src={displayState.selectedImageDataUrl}
          alt="Image affichée"
          className="max-w-[90%] max-h-[90%] object-contain"
        />
      </div>
    );
  }

  // Render normal Loto mode
  return (
    <div className="h-dvh w-dvw flex flex-col relative overflow-hidden bg-white" style={{ padding: 'clamp(1rem, 3vmin, 3rem)' }}>
      {/* Fullscreen fallback button */}
      {showFullscreenButton && (
        <button
          onClick={enterFullscreen}
          className="absolute top-2 right-2 z-50 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Maximize className="w-4 h-4" />
          Plein écran
        </button>
      )}
      {/* Animated Ball Overlay */}
      {animatingNumber && animationPositions && (
        <AnimatedBall 
          number={animatingNumber} 
          duration={displayState.animationDuration}
          onAnimationComplete={handleAnimationComplete}
          startPosition={animationPositions.start}
          endPosition={animationPositions.end}
        />
      )}
      {/* Winning Banner */}
      {displayState.isWinning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl text-center animate-bounce-soft animate-pulse-glow border-loto-blue" style={{ padding: 'clamp(1rem, 4vh, 6rem)', borderWidth: 'clamp(4px, 1vmin, 12px)' }}>
            <div style={{ fontSize: 'clamp(3rem, 12vmin, 10rem)', marginBottom: 'clamp(1rem, 3vh, 3rem)' }} className="text-loto-blue">🏆</div>
            <h2 className="font-bold text-loto-red animate-blink" style={{ fontSize: 'clamp(2rem, 8vmin, 8rem)', marginBottom: 'clamp(0.5rem, 2vh, 2rem)' }}>C'EST GAGNÉ !!!</h2>
            <p className="text-gray-700 font-semibold" style={{ fontSize: 'clamp(1rem, 4vmin, 3rem)' }}>
              {displayState.currentGame === "quine" && "🎯 QUINE"}
              {displayState.currentGame === "double-quine" && "🎯🎯 DOUBLE QUINE"}
              {displayState.currentGame === "carton-plein" && "🏆 CARTON PLEIN"}
            </p>
            {currentPrize && (
              <p className="text-gray-700 font-bold max-w-full break-words" style={{ fontSize: 'clamp(1.25rem, 5vmin, 4rem)', marginTop: 'clamp(0.5rem, 2vh, 2rem)', paddingInline: 'clamp(0.5rem, 2vw, 2rem)' }}>
                🎁 {currentPrize}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Header: badges aligned left */}
      {displayState.currentGame && (
        <header className="flex items-center justify-start flex-wrap gap-3 flex-shrink-0" style={{ marginBottom: 'clamp(0.5rem, 1.5vmin, 1.5rem)' }}>
          <Badge className="gradient-secondary text-white font-bold animate-pulse-glow text-lg sm:text-xl md:text-2xl lg:text-3xl px-4 py-2 sm:px-5 sm:py-2.5">
            {displayState.currentGame === "quine" && "🎯 QUINE"}
            {displayState.currentGame === "double-quine" && "🎯🎯 DOUBLE QUINE"}
            {displayState.currentGame === "carton-plein" && "🏆 CARTON PLEIN"}
            {displayState.isQuinesDuSudMode && " (QUINES DU SUD)"}
          </Badge>

          {!displayState.withDemarque && displayState.currentGame !== "carton-plein" && (
            <div className="text-red-600 font-bold animate-pulse bg-red-50 border border-red-200 rounded-full text-lg sm:text-xl md:text-2xl lg:text-3xl px-4 py-2 sm:px-5 sm:py-2.5">
              ⚠️ SANS DEMARQUER ⚠️
            </div>
          )}
        </header>
      )}

      {/* Main content: grid left + dernier sorti right */}
      {!displayState.isWinning && (
        <div className="flex-1 min-h-0 flex flex-col">
          <div ref={gridRef} className="flex-1 min-h-0 grid items-center overflow-hidden" style={{ gridTemplateColumns: '1fr auto', gap: 'clamp(1rem, 3vmin, 3rem)' }}>
            {/* Left: number grid */}
            <div className="flex items-center justify-center min-h-0 overflow-hidden">
              <LotoGrid
                drawnNumbers={displayState.drawnNumbers}
                isDrawing={displayState.isDrawing}
                isBingoMode={displayState.isBingoMode}
                disableLatestAnimation={true}
              />
            </div>

            {/* Right: dernier sorti */}
            {latestNumber && (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="text-gray-900 font-semibold text-center leading-tight" style={{ fontSize: 'clamp(1.5rem, 4vmin, 4rem)' }}>
                  <p>Dernier</p>
                  <p>sorti</p>
                </div>
                <div
                  ref={lastNumberRef}
                  className={`rounded-full flex items-center justify-center font-bold text-white leading-none animate-bounce-soft animate-blink ${getNumberDisplayColor(latestNumber)}`}
                  style={{ 
                    width: 'clamp(5rem, 15vmin, 20rem)', 
                    height: 'clamp(5rem, 15vmin, 20rem)', 
                    fontSize: 'clamp(2.5rem, 10vmin, 12rem)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                  }}
                >
                  {latestNumber}
                </div>
              </div>
            )}
          </div>

          {/* Bottom banner: prize */}
          {currentPrize && (
            <div
              className="flex-shrink-0 rounded-xl text-white font-bold flex items-center"
              style={{
                background: 'linear-gradient(135deg, hsl(230 60% 45%), hsl(260 50% 50%))',
                padding: 'clamp(0.75rem, 2vmin, 2rem) clamp(1rem, 3vmin, 3rem)',
                fontSize: 'clamp(1.25rem, 4vmin, 3.5rem)',
                marginTop: 'clamp(0.5rem, 1.5vmin, 1.5rem)',
              }}
            >
              🎁 {currentPrize}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LotoDisplay;
