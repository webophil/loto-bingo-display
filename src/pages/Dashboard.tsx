import { useLoto } from '@/hooks/useLoto';
import { GameControls } from '@/components/GameControls';
import { DrawnHistory } from '@/components/DrawnHistory';
import { LotoGrid } from '@/components/LotoGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const loto = useLoto();
  return <div className="min-h-screen p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
            Dashboard Animateur
          </h1>
          
        </div>
        <div className="flex gap-3">
          <Link to="/display">
            <Button className="gradient-secondary text-white">
              <Monitor className="w-4 h-4 mr-2" />
              Affichage Grand Écran
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
          <GameControls currentGame={loto.currentGame} drawnNumbers={loto.drawnNumbers} isDrawing={loto.isDrawing} onStartGame={loto.startGame} onDrawNumber={loto.drawNumber} onEndGame={loto.endGame} onReset={loto.resetAll} />
          
          <DrawnHistory drawnNumbers={loto.drawnNumbers} />
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-card/20 backdrop-blur-sm border-border/50">
            
            <CardContent>
              <LotoGrid drawnNumbers={loto.drawnNumbers} isDrawing={loto.isDrawing} />
            </CardContent>
          </Card>
        </div>
      </div>

      {loto.gameHistory.length > 0 && <Card className="bg-card/20 backdrop-blur-sm border-border/50">
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