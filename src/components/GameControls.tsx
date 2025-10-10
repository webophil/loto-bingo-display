import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GameType } from '@/hooks/useLoto';
import { Play, Square, RotateCcw, Dice1, Gift, Trophy, RefreshCw } from 'lucide-react';
import { ManualGrid } from './ManualGrid';
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
    'double-quine': string;
    'carton-plein': string;
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
  onSetPrizeDescriptions: (prizes: {
    quine: string;
    'double-quine': string;
    'carton-plein': string;
  }) => void;
  onSetWinning: (isWinning: boolean) => void;
  onResumeGame: () => void;
}
const gameLabels: Record<GameType, string> = {
  'quine': 'Quine',
  'double-quine': 'Double Quine',
  'carton-plein': 'Carton Plein'
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
  onResumeGame
}: GameControlsProps) => {
  return <Card className="gradient-secondary border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">
          🎯 Contrôles Loto-Bingo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Première ligne: Tirage et Jeu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tirage */}
          <div className="p-4 bg-white/10 rounded-lg space-y-3">
            <Label className="text-lg text-center text-slate-800 font-extrabold">TIRAGE</Label>
            <RadioGroup value={isManualMode ? "manuel" : "auto"} onValueChange={value => onToggleMode()} disabled={!!currentGame} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manuel" id="manuel" className="border-white text-white" />
                <Label htmlFor="manuel" className="text-white/90 cursor-pointer font-normal">
                  Manuel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto" id="auto" className="border-white text-white" />
                <Label htmlFor="auto" className="text-white/90 cursor-pointer font-normal">
                  Auto
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Jeu (Loto/Bingo) */}
          <div className="p-4 bg-white/10 rounded-lg space-y-3">
            <Label className="font-extrabold text-lg text-slate-800 text-center">JEU</Label>
            <RadioGroup value={isBingoMode ? "bingo" : "loto"} onValueChange={value => onToggleBingoMode()} disabled={!!currentGame} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="loto" id="loto" className="border-white text-white" />
                <Label htmlFor="loto" className="text-white/90 cursor-pointer font-normal">
                  Loto
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bingo" id="bingo" className="border-white text-white" />
                <Label htmlFor="bingo" className="text-white/90 cursor-pointer font-normal">
                  Bingo
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Deuxième ligne: Démarque et Quines du Sud */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Démarque */}
          <div className="p-4 bg-white/10 rounded-lg space-y-3">
            <Label className="font-extrabold text-slate-800 text-lg">Démarque</Label>
            <RadioGroup value={withDemarque ? "oui" : "non"} onValueChange={value => onToggleDemarque()} disabled={!!currentGame} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oui" id="demarque-oui" className="border-white text-white" />
                <Label htmlFor="demarque-oui" className="text-white/90 cursor-pointer font-normal">
                  Oui
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non" id="demarque-non" className="border-white text-white" />
                <Label htmlFor="demarque-non" className="text-white/90 cursor-pointer font-normal">
                  Non
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Quines du Sud */}
          <div className="p-4 bg-white/10 rounded-lg space-y-3">
            <Label className="text-slate-800 text-center font-extrabold text-lg">RAPIDE</Label>
            <RadioGroup value={isQuinesDuSudMode ? "oui" : "non"} onValueChange={value => onToggleQuinesDuSud()} disabled={!!currentGame} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oui" id="quines-sud-oui" className="border-white text-white" />
                <Label htmlFor="quines-sud-oui" className="text-white/90 cursor-pointer font-normal">
                  Oui
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non" id="quines-sud-non" className="border-white text-white" />
                <Label htmlFor="quines-sud-non" className="text-white/90 cursor-pointer font-normal">
                  Non
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Prize Descriptions by Game Type */}
        <div className="space-y-3">
          <Label className="text-white font-medium">
            <Gift className="w-4 h-4 inline mr-2" />
            Lots à gagner par étape
          </Label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="prize-quine" className="text-white/80 text-xs mb-1 block">
                🎯 Quine
              </Label>
              <Input id="prize-quine" value={prizeDescriptions.quine} onChange={e => onSetPrizeDescriptions({
              ...prizeDescriptions,
              quine: e.target.value
            })} placeholder="Ex: Panier..." className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm" />
            </div>
            
            <div>
              <Label htmlFor="prize-double-quine" className="text-white/80 text-xs mb-1 block">
                🎯🎯 Double Quine
              </Label>
              <Input id="prize-double-quine" value={prizeDescriptions['double-quine']} onChange={e => onSetPrizeDescriptions({
              ...prizeDescriptions,
              'double-quine': e.target.value
            })} placeholder="Ex: Voyage..." className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm" />
            </div>
            
            <div>
              <Label htmlFor="prize-carton-plein" className="text-white/80 text-xs mb-1 block">
                🏆 Carton Plein
              </Label>
              <Input id="prize-carton-plein" value={prizeDescriptions['carton-plein']} onChange={e => onSetPrizeDescriptions({
              ...prizeDescriptions,
              'carton-plein': e.target.value
            })} placeholder="Ex: Gros lot..." className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm" />
            </div>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {!currentGame ? <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white/90">Choisir le type de jeu :</h3>
            <div className="grid gap-3">
              {Object.entries(gameLabels).map(([type, label]) => <Button key={type} onClick={() => onStartGame(type as GameType)} className="gradient-primary text-white font-semibold py-6 text-lg" size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  {label}
                </Button>)}
            </div>
          </div> : <div className="space-y-6">
            <div className="text-center">
              <Badge className="gradient-accent text-gray-900 text-lg px-4 py-2 font-bold">
                {gameLabels[currentGame]}
              </Badge>
              <p className="text-white/80 mt-2">
                {drawnNumbers.length} numéro{drawnNumbers.length > 1 ? 's' : ''} tiré{drawnNumbers.length > 1 ? 's' : ''} • {isBingoMode ? 'Bingo' : 'Loto'} • Mode {isManualMode ? 'Manuel' : 'Auto'} • {withDemarque ? 'Avec' : 'Sans'} démarque
                {isQuinesDuSudMode && ' • Quines du Sud'}
              </p>
              {currentGame && prizeDescriptions[currentGame] && <p className="text-loto-yellow mt-1 font-medium">
                  🎁 {prizeDescriptions[currentGame]}
                </p>}
            </div>

        {isManualMode ? (
              <div className="text-center text-white/80 py-4">
                La grille de tirage manuel s'affiche dans la colonne de droite →
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  <Button onClick={onDrawNumber} disabled={isDrawing || drawnNumbers.length >= (isBingoMode ? 75 : 90)} className="gradient-primary text-white font-bold text-xl py-8" size="lg">
                    <Dice1 className="w-6 h-6 mr-3" />
                    {isDrawing ? 'Tirage en cours...' : 'Tirer un numéro'}
                  </Button>
                </div>

                <div className="space-y-3">
                  {/* Winning Control Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={() => onSetWinning(true)} className="bg-loto-blue text-white font-bold py-3" disabled={isWinning}>
                      <Trophy className="w-4 h-4 mr-2" />
                      C'est gagné !
                    </Button>
                    <Button onClick={onResumeGame} variant="outline" className="border-loto-green text-loto-green hover:bg-loto-green hover:text-white" disabled={!isWinning}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reprise du jeu
                    </Button>
                  </div>

                  {/* Game Control Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={onEndGame} variant="outline" className="border-loto-yellow text-loto-yellow hover:bg-loto-yellow hover:text-gray-900">
                      <Square className="w-4 h-4 mr-2" />
                      Terminer
                    </Button>
                    <Button onClick={onReset} variant="outline" className="border-loto-red text-loto-red hover:bg-loto-red hover:text-white">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>}
      </CardContent>
    </Card>;
};