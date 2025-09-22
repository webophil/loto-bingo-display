import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { GameType } from '@/hooks/useLoto';
import { Play, Square, RotateCcw, Dice1 } from 'lucide-react';
import { ManualGrid } from './ManualGrid';

interface GameControlsProps {
  currentGame: GameType | null;
  drawnNumbers: number[];
  isDrawing: boolean;
  isManualMode: boolean;
  onStartGame: (type: GameType) => void;
  onDrawNumber: () => void;
  onDrawManualNumber: (number: number) => void;
  onEndGame: () => void;
  onReset: () => void;
  onToggleMode: () => void;
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
  onStartGame,
  onDrawNumber,
  onDrawManualNumber,
  onEndGame,
  onReset,
  onToggleMode,
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
                {drawnNumbers.length} numéro{drawnNumbers.length > 1 ? 's' : ''} tiré{drawnNumbers.length > 1 ? 's' : ''} • Mode {isManualMode ? 'Manuel' : 'Auto'}
              </p>
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
        )}
      </CardContent>
    </Card>
  );
};