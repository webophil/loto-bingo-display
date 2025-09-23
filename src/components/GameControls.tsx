import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { GameType } from '@/hooks/useLoto';
import { Play, Square, RotateCcw, Dice1, Gift, Trophy, RefreshCw } from 'lucide-react';
import { ManualGrid } from './ManualGrid';

interface GameControlsProps {
  currentGame: GameType | null;
  drawnNumbers: number[];
  isDrawing: boolean;
  isManualMode: boolean;
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
  onToggleDemarque: () => void;
  onSetPrizeDescription: (description: string) => void;
  onToggleQuinesDuSud: () => void;
  onSetPrizeDescriptions: (prizes: { quine: string; 'double-quine': string; 'carton-plein': string }) => void;
  onSetWinning: (isWinning: boolean) => void;
  onResumeGame: () => void;
}

const gameLabels: Record<GameType, string> = {
  'quine': 'Quine',
  'double-quine': 'Double Quine',
  'carton-plein': 'Carton Plein',
};

export const GameControls = ({
  currentGame,
  drawnNumbers,
  isDrawing,
  isManualMode,
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
        <CardTitle className="text-2xl font-bold text-center text-white">
          🎯 Contrôles du Loto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="mode-toggle" className="text-white font-medium">
              Mode de tirage
            </Label>
            <p className="text-xs text-white/70">
              {isManualMode ? 'Manuel (tirage physique)' : 'Automatique (par l\'application)'}
            </p>
          </div>
          <Switch
            id="mode-toggle"
            checked={isManualMode}
            onCheckedChange={onToggleMode}
            disabled={!!currentGame}
          />
        </div>

        {/* Démarque Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="demarque-toggle" className="text-white font-medium">
              Démarque des grilles
            </Label>
            <p className="text-xs text-white/70">
              {withDemarque ? 'Les joueurs démarquent leurs grilles' : 'Les joueurs ne démarquent pas'}
            </p>
          </div>
          <Switch
            id="demarque-toggle"
            checked={withDemarque}
            onCheckedChange={onToggleDemarque}
            disabled={!!currentGame}
          />
        </div>

        {/* Quines du Sud Mode */}
        <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="quines-sud-toggle" className="text-white font-medium">
              Mode Quines du Sud
            </Label>
            <p className="text-xs text-white/70">
              {isQuinesDuSudMode ? 'Après chaque victoire, reprise automatique sur Quine' : 'Mode classique'}
            </p>
          </div>
          <Switch
            id="quines-sud-toggle"
            checked={isQuinesDuSudMode}
            onCheckedChange={onToggleQuinesDuSud}
            disabled={!!currentGame}
          />
        </div>

        {/* Prize Descriptions by Game Type */}
        <div className="space-y-4">
          <Label className="text-white font-medium">
            <Gift className="w-4 h-4 inline mr-2" />
            Lots à gagner par étape
          </Label>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="prize-quine" className="text-white/80 text-sm">
                🎯 Quine (1 ligne)
              </Label>
              <Input
                id="prize-quine"
                value={prizeDescriptions.quine}
                onChange={(e) => onSetPrizeDescriptions({
                  ...prizeDescriptions,
                  quine: e.target.value
                })}
                placeholder="Ex: Panier garni..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            
            <div>
              <Label htmlFor="prize-double-quine" className="text-white/80 text-sm">
                🎯🎯 Double Quine (2 lignes)
              </Label>
              <Input
                id="prize-double-quine"
                value={prizeDescriptions['double-quine']}
                onChange={(e) => onSetPrizeDescriptions({
                  ...prizeDescriptions,
                  'double-quine': e.target.value
                })}
                placeholder="Ex: Voyage..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            
            <div>
              <Label htmlFor="prize-carton-plein" className="text-white/80 text-sm">
                🏆 Carton Plein
              </Label>
              <Input
                id="prize-carton-plein"
                value={prizeDescriptions['carton-plein']}
                onChange={(e) => onSetPrizeDescriptions({
                  ...prizeDescriptions,
                  'carton-plein': e.target.value
                })}
                placeholder="Ex: Gros lot..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>
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
                {drawnNumbers.length} numéro{drawnNumbers.length > 1 ? 's' : ''} tiré{drawnNumbers.length > 1 ? 's' : ''} • Mode {isManualMode ? 'Manuel' : 'Auto'} • {withDemarque ? 'Avec' : 'Sans'} démarque
                {isQuinesDuSudMode && ' • Quines du Sud'}
              </p>
              {currentGame && prizeDescriptions[currentGame] && (
                <p className="text-loto-yellow mt-1 font-medium">
                  🎁 {prizeDescriptions[currentGame]}
                </p>
              )}
            </div>

            {isManualMode ? (
              <ManualGrid
                drawnNumbers={drawnNumbers}
                onNumberClick={onDrawManualNumber}
                isDrawing={isDrawing}
              />
            ) : (
              <div className="grid gap-4">
                <Button
                  onClick={onDrawNumber}
                  disabled={isDrawing || drawnNumbers.length >= 90}
                  className="gradient-primary text-white font-bold text-xl py-8"
                  size="lg"
                >
                  <Dice1 className="w-6 h-6 mr-3" />
                  {isDrawing ? 'Tirage en cours...' : 'Tirer un numéro'}
                </Button>
              </div>
            )}

            <div className="space-y-3">
              {/* Winning Control Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => onSetWinning(true)}
                  className="bg-loto-blue text-white font-bold py-3"
                  disabled={isWinning}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  C'est gagné !
                </Button>
                <Button
                  onClick={onResumeGame}
                  variant="outline"
                  className="border-loto-green text-loto-green hover:bg-loto-green hover:text-white"
                  disabled={!isWinning}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reprise du jeu
                </Button>
              </div>

              {/* Game Control Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={onEndGame}
                  variant="outline"
                  className="border-loto-yellow text-loto-yellow hover:bg-loto-yellow hover:text-gray-900"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Terminer
                </Button>
                <Button
                  onClick={onReset}
                  variant="outline"
                  className="border-loto-red text-loto-red hover:bg-loto-red hover:text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};