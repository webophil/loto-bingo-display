import { useLoto } from "@/hooks/useLoto";
import { LotoGrid } from "@/components/LotoGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Maximize } from "lucide-react";
import { GameType } from "@/hooks/useLoto";
import logoImage from "@/assets/logo.png";

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
    isImageDisplayMode: false,
    selectedImageDataUrl: null,
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
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ padding: '0.25vh 0.5vw', gap: 'clamp(0.1rem, 0.2vh, 0.3rem)' }}>
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

      <header className="text-center flex-shrink-0" style={{ marginBottom: 'clamp(0.1rem, 0.2vh, 0.3rem)' }}>
        {displayState.currentGame && (
          <div className="flex items-center justify-center flex-wrap" style={{ gap: 'clamp(0.3rem, 0.8vw, 1rem)' }}>
            <Badge className="gradient-secondary text-white font-bold animate-pulse-glow" style={{ fontSize: 'clamp(0.75rem, calc(0.8vw + 0.8vh), 1.5rem)', padding: 'clamp(0.3rem, 1vh, 0.75rem) clamp(0.75rem, 2vw, 2rem)' }}>
              {displayState.currentGame === "quine" && "🎯 QUINE"}
              {displayState.currentGame === "double-quine" && "🎯🎯 DOUBLE QUINE"}
              {displayState.currentGame === "carton-plein" && "🏆 CARTON PLEIN"}
              {displayState.isQuinesDuSudMode && " (QUINES DU SUD)"}
            </Badge>

            {currentPrize && (
              <div className="text-white font-semibold bg-white/8 rounded-full" style={{ fontSize: 'clamp(0.75rem, calc(0.8vw + 0.8vh), 1.5rem)', padding: 'clamp(0.25rem, 0.8vh, 0.6rem) clamp(0.6rem, 1.5vw, 1.5rem)' }}>
                🎁 {currentPrize}
              </div>
            )}

            {!displayState.withDemarque && displayState.currentGame !== "carton-plein" && (
              <div className="text-loto-red font-bold animate-pulse bg-white/10 rounded-full" style={{ fontSize: 'clamp(0.75rem, calc(0.8vw + 0.8vh), 1.5rem)', padding: 'clamp(0.25rem, 0.8vh, 0.6rem) clamp(0.6rem, 1.5vw, 1.5rem)' }}>
                ⚠️ SANS DEMARQUER ⚠️
              </div>
            )}

            {latestNumber && !displayState.isWinning && (
              <div className="flex items-center" style={{ gap: 'clamp(0.4rem, 1vw, 1.5rem)' }}>
                <div className="flex flex-col items-end font-semibold text-foreground leading-tight" style={{ fontSize: 'clamp(0.65rem, calc(0.7vw + 0.7vh), 1.25rem)' }}>
                  <p>Dernier</p>
                  <p>sorti</p>
                </div>
                <div
                  className={`rounded-full flex items-center justify-center font-bold text-white leading-none animate-bounce-soft animate-blink ${getNumberDisplayColor(
                    latestNumber,
                  )}`}
                  style={{ 
                    width: 'clamp(3.5rem, 10vmin, 10rem)', 
                    height: 'clamp(3.5rem, 10vmin, 10rem)', 
                    fontSize: 'clamp(1.75rem, 6vmin, 6rem)',
                    boxShadow: "var(--shadow-glow)" 
                  }}
                >
                  {latestNumber}
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {!displayState.isWinning && (
        <div className="flex items-center justify-center" style={{ width: '100%', height: '100%', maxHeight: '95vh' }}>
          <LotoGrid
            drawnNumbers={displayState.drawnNumbers}
            isDrawing={displayState.isDrawing}
            isBingoMode={displayState.isBingoMode}
          />
        </div>
      )}

      {!displayState.isWinning && (
        <footer className="text-center">
          <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.875rem, calc(1vw + 1vh), 1.5rem)', marginBottom: 'clamp(0.25rem, 0.5vh, 0.75rem)' }}>
            {displayState.drawnNumbers.length} / {displayState.isBingoMode ? 75 : 90} numéros tirés
          </p>
          {!displayState.currentGame && displayState.drawnNumbers.length === 0 && (
            <p className="text-muted-foreground italic" style={{ fontSize: 'clamp(0.75rem, calc(0.8vw + 0.8vh), 1.25rem)' }}>En attente du prochain tirage...</p>
          )}
        </footer>
      )}
    </div>
  );
};

export default LotoDisplay;
