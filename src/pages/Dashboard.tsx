import { useLoto } from '@/hooks/useLoto';
import { GameControls } from '@/components/GameControls';
import { DrawnHistory } from '@/components/DrawnHistory';
import { LotoGrid } from '@/components/LotoGrid';
import { WheelOfFortune } from '@/components/WheelOfFortune';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Monitor, Home, CircleDot } from 'lucide-react';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const loto = useLoto();
  return <div className="min-h-screen p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">Espace Animation</h1>
          
        </div>
        <div className="flex gap-3">
          <Link to="/display">
            <Button className="gradient-secondary text-white">
              <Monitor className="w-4 h-4 mr-2" />
              Affichage Écran Externe
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Wheel Mode Toggle Button */}
          <Card className="bg-card/20 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <Button
                onClick={loto.toggleWheelMode}
                className={loto.isWheelMode ? "gradient-secondary text-white w-full" : "gradient-primary w-full"}
                size="lg"
              >
                <CircleDot className="w-5 h-5 mr-2" />
                {loto.isWheelMode ? "Retour Loto" : "Roue de la Chance"}
              </Button>
            </CardContent>
          </Card>

          {loto.isWheelMode ? (
            /* Wheel of Fortune Controls */
            <Card className="bg-card/20 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>🎯 Config de la Roue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="wheelNumbers">Nombre de numéros</Label>
                  <Input
  id="wheelNumbers"
  type="number"
  placeholder="Ex: 36"
  value={loto.wheelNumberCount}
  onChange={(e) => {
    loto.setWheelNumberCount(parseInt(e.target.value) || 0);
  }}
  className="mt-2"
/>
                </div>
                
                <div>
                  <Label htmlFor="wheelPrize">Lot à gagner</Label>
                  <Input
                    id="wheelPrize"
                    type="text"
                    placeholder="Ex: Bon d'achat 50€"
                    value={loto.wheelPrize}
                    onChange={(e) => loto.setWheelPrize(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={loto.spinWheel}
                    disabled={loto.isWheelSpinning}
                    className="gradient-primary w-full"
                    size="lg"
                  >
                    {loto.isWheelSpinning ? "🎯 Tirage en cours..." : "🎯 Tourner la roue"}
                  </Button>
                  
                  <Button
                    onClick={loto.clearWheelHistory}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    🗑️ Remise à zéro
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <GameControls currentGame={loto.currentGame} drawnNumbers={loto.drawnNumbers} isDrawing={loto.isDrawing} isManualMode={loto.isManualMode} withDemarque={loto.withDemarque} prizeDescription={loto.prizeDescription} isQuinesDuSudMode={loto.isQuinesDuSudMode} prizeDescriptions={loto.prizeDescriptions} isWinning={loto.isWinning} onStartGame={loto.startGame} onDrawNumber={loto.drawNumber} onDrawManualNumber={loto.drawManualNumber} onEndGame={loto.endGame} onReset={loto.resetAll} onToggleMode={loto.toggleMode} onToggleDemarque={loto.toggleDemarque} onSetPrizeDescription={loto.setPrizeDescription} onToggleQuinesDuSud={loto.toggleQuinesDuSud} onSetPrizeDescriptions={loto.setPrizeDescriptions} onSetWinning={loto.setWinning} onResumeGame={loto.resumeGame} />
              
              <DrawnHistory drawnNumbers={loto.drawnNumbers} />
            </>
          )}
        </div>

        {loto.isWheelMode ? (
          <div className="lg:col-span-2">
            <Card className="bg-card/20 backdrop-blur-sm border-border/50">
              <CardContent className="p-2">
                <WheelOfFortune 
                  numberOfSegments={loto.wheelNumberCount}
                  winningNumber={loto.wheelWinningNumber}
                  isSpinning={loto.isWheelSpinning}
                  prize={loto.wheelPrize}
                  drawHistory={loto.wheelDrawHistory}
                  targetRotation={loto.wheelTargetRotation}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="lg:col-span-2">
            <Card className="bg-card/20 backdrop-blur-sm border-border/50">
              <CardContent>
                <LotoGrid drawnNumbers={loto.drawnNumbers} isDrawing={loto.isDrawing} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {!loto.isWheelMode && loto.gameHistory.length > 0 && <Card className="bg-card/20 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>📊 Historique des Parties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loto.gameHistory.map((game, index) => <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {game.type === 'quine' && '🎯 Quine'}
                      {game.type === 'double-quine' && '🎯🎯 Double Quine'}  
                      {game.type === 'carton-plein' && '🏆 Carton Plein'}
                    </span>
                    <span className="text-muted-foreground">
                      {game.numbers.length} numéros tirés
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {game.numbers.slice(-5).map((num, i) => <span key={i} className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        {num}
                      </span>)}
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>}
    </div>;
};
export default Dashboard;
