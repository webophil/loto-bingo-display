import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GameType } from "@/hooks/useLoto";
import { Play, Gift } from "lucide-react";
import { ManualGrid } from "./ManualGrid";
interface GameControlsProps {
  currentGame: GameType | null;
  drawnNumbers: number[];
  isDrawing: boolean;
  isManualMode: boolean;
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
  onStartGame: (type: GameType) => void;
  onDrawNumber: () => void;
  onDrawManualNumber: (number: number) => void;
  onEndGame: () => void;
  onReset: () => void;
  onToggleMode: () => void;
  onToggleBingoMode: () => void;
  onToggleDemarque: () => void;
  onSetPrizeDescription: (description: string) => void;
  onToggleQuinesDuSud: () => void;
  onSetPrizeDescriptions: (prizes: { quine: string; "double-quine": string; "carton-plein": string }) => void;
  onSetWinning: (isWinning: boolean) => void;
  onResumeGame: () => void;
}
const gameLabels: Record<GameType, string> = {
  quine: "Quine",
  "double-quine": "Double Quine",
  "carton-plein": "Carton Plein",
};
export const GameControls = ({
  currentGame,
  drawnNumbers,
  isDrawing,
  isManualMode,
  isBingoMode,
  withDemarque,
  prizeDescription,
  isQuinesDuSudMode,
  prizeDescriptions,
  isWinning,
  onStartGame,
  onDrawNumber,
  onDrawManualNumber,
  onEndGame,
  onReset,
  onToggleMode,
  onToggleBingoMode,
  onToggleDemarque,
  onSetPrizeDescription,
  onToggleQuinesDuSud,
  onSetPrizeDescriptions,
  onSetWinning,
  onResumeGame,
}: GameControlsProps) => {
  return (
    <Card className="gradient-secondary border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">🎯 Contrôles Loto-Bingo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cartes Jeu, Démarque et Mode Rapide */}
        <div className="space-y-3">
          {/* Jeu (Loto/Bingo) */}
          <div className="p-3 bg-loto-orange rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="font-extrabold text-base text-white">JEU</Label>
              <RadioGroup
                value={isBingoMode ? "bingo" : "loto"}
                onValueChange={(value) => onToggleBingoMode()}
                disabled={!!currentGame}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="loto" id="loto" className="border-white text-white" />
                  <Label htmlFor="loto" className="text-gray-900 cursor-pointer font-bold text-base">
                    Loto
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bingo" id="bingo" className="border-white text-white" />
                  <Label htmlFor="bingo" className="text-gray-900 cursor-pointer font-bold text-base">
                    Bingo
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Démarque */}
          <div className="p-3 bg-loto-orange rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="font-extrabold text-white text-base">Démarque</Label>
              <RadioGroup
                value={withDemarque ? "oui" : "non"}
                onValueChange={(value) => onToggleDemarque()}
                disabled={!!currentGame}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oui" id="demarque-oui" className="border-white text-white" />
                  <Label htmlFor="demarque-oui" className="text-gray-900 cursor-pointer font-bold text-base">
                    Oui
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non" id="demarque-non" className="border-white text-white" />
                  <Label htmlFor="demarque-non" className="text-gray-900 cursor-pointer font-bold text-base">
                    Non
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Mode Rapide */}
          <div className="p-3 bg-loto-orange rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="font-extrabold text-white text-base">Mode Rapide</Label>
              <RadioGroup
                value={isQuinesDuSudMode ? "oui" : "non"}
                onValueChange={(value) => onToggleQuinesDuSud()}
                disabled={!!currentGame}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oui" id="quines-sud-oui" className="border-white text-white" />
                  <Label htmlFor="quines-sud-oui" className="text-gray-900 cursor-pointer font-bold text-base">
                    Oui
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non" id="quines-sud-non" className="border-white text-white" />
                  <Label htmlFor="quines-sud-non" className="text-gray-900 cursor-pointer font-bold text-base">
                    Non
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Prize Descriptions by Game Type */}
        <div className="space-y-3 p-4 rounded-lg bg-gradient-to-b from-blue-900 to-white">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Label htmlFor="prize-quine" className="text-white font-bold text-sm block text-center mb-2">
                🎯 Quine
              </Label>
              <Input
                id="prize-quine"
                value={prizeDescriptions.quine}
                onChange={(e) =>
                  onSetPrizeDescriptions({
                    ...prizeDescriptions,
                    quine: e.target.value,
                  })
                }
                placeholder="Ex: Panier..."
                className="bg-white/30 border-white/40 text-gray-900 placeholder:text-gray-600 text-sm font-medium"
              />
            </div>

            <div className="p-3 bg-white/20 rounded-lg">
              <Label htmlFor="prize-double-quine" className="text-white font-bold text-sm block text-center mb-2">
                🎯🎯 Double<br/>Quine
              </Label>
              <Input
                id="prize-double-quine"
                value={prizeDescriptions["double-quine"]}
                onChange={(e) =>
                  onSetPrizeDescriptions({
                    ...prizeDescriptions,
                    "double-quine": e.target.value,
                  })
                }
                placeholder="Ex: Voyage..."
                className="bg-white/30 border-white/40 text-gray-900 placeholder:text-gray-600 text-sm font-medium"
              />
            </div>

            <div className="p-3 bg-white/20 rounded-lg">
              <Label htmlFor="prize-carton-plein" className="text-white font-bold text-sm block text-center mb-2">
                🏆 Carton<br/>Plein
              </Label>
              <Input
                id="prize-carton-plein"
                value={prizeDescriptions["carton-plein"]}
                onChange={(e) =>
                  onSetPrizeDescriptions({
                    ...prizeDescriptions,
                    "carton-plein": e.target.value,
                  })
                }
                placeholder="Ex: Gros lot..."
                className="bg-white/30 border-white/40 text-gray-900 placeholder:text-gray-600 text-sm font-medium"
              />
            </div>
          </div>

          <Label className="text-gray-900 font-bold text-base block text-center">
            <Gift className="w-4 h-4 inline mr-2" />
            Lots à gagner par étape
          </Label>
        </div>

        <Separator className="bg-white/20" />

        {!currentGame ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white/90">Choisir le type de jeu :</h3>
            <div className="grid gap-3">
              {Object.entries(gameLabels).map(([type, label]) => (
                <Button
                  key={type}
                  onClick={() => onStartGame(type as GameType)}
                  className="gradient-primary text-white font-semibold py-6 text-lg"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <Badge className="gradient-accent text-gray-900 text-lg px-4 py-2 font-bold">
                {gameLabels[currentGame]}
              </Badge>
              <p className="text-white/80 mt-2">
                {drawnNumbers.length} numéro{drawnNumbers.length > 1 ? "s" : ""} tiré
                {drawnNumbers.length > 1 ? "s" : ""} • {isBingoMode ? "Bingo" : "Loto"} • {withDemarque ? "Avec" : "Sans"} démarque
                {isQuinesDuSudMode && " • Rapide"}
              </p>
              {currentGame && prizeDescriptions[currentGame] && (
                <p className="text-loto-yellow mt-1 font-medium">🎁 {prizeDescriptions[currentGame]}</p>
              )}
            </div>

            <div className="text-center text-white/80 py-4">
              La grille de tirage s'affiche dans la colonne de droite →
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
