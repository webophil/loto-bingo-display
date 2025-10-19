import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { GameType } from "@/hooks/useLoto";
import { Play, Gift, Plus, Edit, HelpCircle } from "lucide-react";
import { ManualGrid } from "./ManualGrid";
import { useState, useEffect } from "react";
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
  const [prizeList, setPrizeList] = useState<string[]>([]);
  const [prizeListText, setPrizeListText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);

  // Load prize list from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("loto-prize-list");
    if (saved) {
      try {
        const list = JSON.parse(saved);
        setPrizeList(list);
        setPrizeListText(list.join("\n"));
      } catch (e) {
        console.error("Error loading prize list", e);
      }
    }
  }, []);

  const handleSavePrizeList = () => {
    const list = prizeListText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    setPrizeList(list);
    localStorage.setItem("loto-prize-list", JSON.stringify(list));
    setIsDialogOpen(false);
  };

  const handleOpenDialog = () => {
    setPrizeListText(prizeList.join("\n"));
    setIsDialogOpen(true);
  };

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
                value={isQuinesDuSudMode ? "non" : withDemarque ? "oui" : "non"}
                onValueChange={(value) => !isQuinesDuSudMode && onToggleDemarque()}
                className="flex gap-6"
                disabled={isQuinesDuSudMode}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="oui"
                    id="demarque-oui"
                    className="border-white text-white"
                    disabled={isQuinesDuSudMode}
                  />
                  <Label
                    htmlFor="demarque-oui"
                    className={`cursor-pointer font-bold text-base ${isQuinesDuSudMode ? "text-gray-600 cursor-not-allowed" : "text-gray-900"}`}
                  >
                    Oui
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="non"
                    id="demarque-non"
                    className="border-white text-white"
                    disabled={isQuinesDuSudMode}
                  />
                  <Label
                    htmlFor="demarque-non"
                    className={`cursor-pointer font-bold text-base ${isQuinesDuSudMode ? "text-gray-600 cursor-not-allowed" : "text-gray-900"}`}
                  >
                    Non
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Mode Rapide */}
          <div className="p-3 bg-loto-orange rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="font-extrabold text-white text-base">Mode Rapide</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsHelpDialogOpen(true)}
                  className="h-6 w-6 p-0 hover:bg-white/20"
                >
                  <HelpCircle className="w-6 h-6 text-black" />
                </Button>
              </div>
              <RadioGroup
                value={isQuinesDuSudMode ? "oui" : "non"}
                onValueChange={(value) => onToggleQuinesDuSud()}
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

          {/* Help Dialog for Mode Rapide */}
          <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
            <DialogContent className="bg-card border-border max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-foreground text-xl">Le Mode Rapide, c'est quoi ?</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-foreground">
                <p>Le mode rapide vous permet d'enchainer plusieurs Quine (1 ligne) de suite, sans démarquer.</p>
                <p>
                  Lorsque c'est gagné, ne cliquez pas automatiquement sur le bouton correspondant, en cas d'ex-aequos.
                  Si vous départagez les gagnants en tirant de nouveaux numéros qui sont à marquer, vous pouvez
                  continuer à les cocher normalement, et seulement après détermination du gagnant, cliquez sur "C'est
                  gagné", puis reprise du jeu.
                </p>
                <p>
                  Si les numéros sortis pour départager ont faits un (ou des) nouveau(x) gagnant(s), répétez la même
                  procédure.
                </p>
                <p>Vous modifiez le lot Quine au fur et à mesure des tirages et des gagnants.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {/* Prize Descriptions - Always visible */}
          <div className="space-y-3">
            {!currentGame && (
              <div className="flex items-center justify-between mb-2">
                <Label className="text-white font-bold text-lg">LOTS</Label>
                <div className="flex gap-2">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleOpenDialog}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        créer liste lots
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">Entrez un lot par ligne</DialogTitle>
                      </DialogHeader>
                      <Textarea
                        value={prizeListText}
                        onChange={(e) => setPrizeListText(e.target.value)}
                        placeholder="Exemple:&#10;Panier garni&#10;Bon d'achat 50€&#10;Voyage week-end"
                        className="min-h-[200px] bg-background text-foreground"
                      />
                      <Button onClick={handleSavePrizeList} className="w-full">
                        Valider
                      </Button>
                    </DialogContent>
                  </Dialog>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleOpenDialog}
                    disabled={prizeList.length === 0}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    modifier
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="prize-quine" className="text-white/80 text-xs mb-1 block">
                  🎯 Quine
                </Label>
                <Input
                  id="prize-quine"
                  list={prizeList.length > 0 ? "prize-list-quine" : undefined}
                  value={prizeDescriptions.quine}
                  onChange={(e) =>
                    onSetPrizeDescriptions({
                      ...prizeDescriptions,
                      quine: e.target.value,
                    })
                  }
                  onFocus={() =>
                    onSetPrizeDescriptions({
                      ...prizeDescriptions,
                      quine: "",
                    })
                  }
                  placeholder="Ex: Panier..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                />
                {prizeList.length > 0 && (
                  <datalist id="prize-list-quine">
                    {prizeList.map((prize, idx) => (
                      <option key={idx} value={prize} />
                    ))}
                  </datalist>
                )}
              </div>

              <div>
                <Label htmlFor="prize-double-quine" className="text-white/80 text-xs mb-1 block">
                  🎯🎯 Double Quine
                </Label>
                <Input
                  id="prize-double-quine"
                  list={prizeList.length > 0 ? "prize-list-double" : undefined}
                  value={prizeDescriptions["double-quine"]}
                  onChange={(e) =>
                    onSetPrizeDescriptions({
                      ...prizeDescriptions,
                      "double-quine": e.target.value,
                    })
                  }
                  onFocus={() =>
                    onSetPrizeDescriptions({
                      ...prizeDescriptions,
                      "double-quine": "",
                    })
                  }
                  placeholder="Ex: Voyage..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                />
                {prizeList.length > 0 && (
                  <datalist id="prize-list-double">
                    {prizeList.map((prize, idx) => (
                      <option key={idx} value={prize} />
                    ))}
                  </datalist>
                )}
              </div>

              <div>
                <Label htmlFor="prize-carton-plein" className="text-white/80 text-xs mb-1 block">
                  🏆 Carton Plein
                </Label>
                <Input
                  id="prize-carton-plein"
                  list={prizeList.length > 0 ? "prize-list-carton" : undefined}
                  value={prizeDescriptions["carton-plein"]}
                  onChange={(e) =>
                    onSetPrizeDescriptions({
                      ...prizeDescriptions,
                      "carton-plein": e.target.value,
                    })
                  }
                  onFocus={() =>
                    onSetPrizeDescriptions({
                      ...prizeDescriptions,
                      "carton-plein": "",
                    })
                  }
                  placeholder="Ex: Gros lot..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                />
                {prizeList.length > 0 && (
                  <datalist id="prize-list-carton">
                    {prizeList.map((prize, idx) => (
                      <option key={idx} value={prize} />
                    ))}
                  </datalist>
                )}
              </div>
            </div>
          </div>

          {/* Game Type Selection */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => onStartGame("quine")}
              className="bg-gradient-to-b from-blue-900 to-blue-500 hover:from-blue-800 hover:to-blue-400 text-white font-semibold text-lg h-24 flex items-center justify-center"
            >
              Quine
            </Button>
            <Button
              onClick={() => onStartGame("double-quine")}
              className="bg-gradient-to-b from-blue-900 to-blue-500 hover:from-blue-800 hover:to-blue-400 text-white font-semibold text-lg h-24 flex items-center justify-center"
            >
              <span className="text-center leading-tight">
                Double
                <br />
                Quine
              </span>
            </Button>
            <Button
              onClick={() => onStartGame("carton-plein")}
              className="bg-gradient-to-b from-blue-900 to-blue-500 hover:from-blue-800 hover:to-blue-400 text-white font-semibold text-lg h-24 flex items-center justify-center"
            >
              <span className="text-center leading-tight">
                Carton
                <br />
                Plein
              </span>
            </Button>
          </div>

          {currentGame && (
            <div className="space-y-4">
              <div className="text-center">
                <Badge className="gradient-accent text-gray-900 text-lg px-4 py-2 font-bold">
                  {gameLabels[currentGame]}
                </Badge>
                <p className="text-white/80 mt-2">
                  {drawnNumbers.length} numéro{drawnNumbers.length > 1 ? "s" : ""} tiré
                  {drawnNumbers.length > 1 ? "s" : ""} • {isBingoMode ? "Bingo" : "Loto"} •{" "}
                  {withDemarque ? "Avec" : "Sans"} démarque
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
        </div>
      </CardContent>
    </Card>
  );
};
