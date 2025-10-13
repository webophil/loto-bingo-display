import { useLoto } from '@/hooks/useLoto';
import { GameControls } from '@/components/GameControls';
import { ManualGrid } from '@/components/ManualGrid';
import { WheelOfFortune } from '@/components/WheelOfFortune';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Monitor, Home, CircleDot, Trophy, RefreshCw, Square, RotateCcw, Dice1, ImagePlus, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRef } from 'react';
const Dashboard = () => {
  const loto = useLoto();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      loto.addLocalImage(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageSelect = (value: string) => {
    if (value === 'delete-all') {
      loto.deleteAllImages();
    } else {
      loto.selectImage(value);
    }
  };

  const selectedImage = loto.localImages.find(img => img.id === loto.selectedImageId);

  return <div className="min-h-screen p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">Espace Animation</h1>
        
        <div className="flex items-center gap-3">
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
            <ImagePlus className="w-4 h-4 mr-2" />
            Ajouter image
          </Button>

          {loto.localImages.length > 0 && (
            <>
              <Select value={loto.selectedImageId || undefined} onValueChange={handleImageSelect}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Choisir une image" />
                </SelectTrigger>
                <SelectContent>
                  {loto.localImages.map(img => (
                    <SelectItem key={img.id} value={img.id}>
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span className="truncate max-w-[150px]">{img.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="delete-all" className="text-destructive">
                    🗑️ Supprimer les fichiers
                  </SelectItem>
                </SelectContent>
              </Select>

              {selectedImage && (
                <Button onClick={loto.toggleImageDisplay} variant={loto.isImageDisplayMode ? "destructive" : "default"} size="sm">
                  {loto.isImageDisplayMode ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Retirer image
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Afficher image
                    </>
                  )}
                </Button>
              )}
            </>
          )}
          
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
              <Button onClick={loto.toggleWheelMode} className={loto.isWheelMode ? "gradient-secondary text-white w-full" : "gradient-primary w-full"} size="lg">
                <CircleDot className="w-5 h-5 mr-2" />
                {loto.isWheelMode ? "Retour Loto" : "Roue de la Chance"}
              </Button>
            </CardContent>
          </Card>

          {loto.isWheelMode ? (/* Wheel of Fortune Controls */
        <Card className="bg-card/20 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>🎯 Config de la Roue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Label htmlFor="wheelNumbers" className="whitespace-nowrap">Nombre de numéros</Label>
                  <Input id="wheelNumbers" type="text" inputMode="numeric" placeholder="Ex: 36" value={loto.wheelNumberCount} onChange={e => {
                const value = parseInt(e.target.value);
                loto.setWheelNumberCount(isNaN(value) ? 1 : value);
              }} className="flex-1" />
                </div>
                
                <div>
                  <Label htmlFor="wheelPrize">Lot à gagner</Label>
                  <Input id="wheelPrize" type="text" placeholder="Ex: Bon d'achat 50€" value={loto.wheelPrize} onChange={e => loto.setWheelPrize(e.target.value)} className="mt-2" />
                </div>

                <Button onClick={loto.spinWheel} disabled={loto.isWheelSpinning} className="gradient-primary w-full" size="lg">
                  {loto.isWheelSpinning ? "🎯 Tirage en cours..." : "🎯 Tourner la roue"}
                </Button>
              </CardContent>
            </Card>) : <>
              <GameControls currentGame={loto.currentGame} drawnNumbers={loto.drawnNumbers} isDrawing={loto.isDrawing} isManualMode={true} isBingoMode={loto.isBingoMode} withDemarque={loto.withDemarque} prizeDescription={loto.prizeDescription} isQuinesDuSudMode={loto.isQuinesDuSudMode} prizeDescriptions={loto.prizeDescriptions} isWinning={loto.isWinning} onStartGame={loto.startGame} onDrawNumber={loto.drawNumber} onDrawManualNumber={loto.drawManualNumber} onEndGame={loto.endGame} onReset={loto.resetAll} onToggleMode={() => {}} onToggleBingoMode={loto.toggleBingoMode} onToggleDemarque={loto.toggleDemarque} onSetPrizeDescription={loto.setPrizeDescription} onToggleQuinesDuSud={loto.toggleQuinesDuSud} onSetPrizeDescriptions={loto.setPrizeDescriptions} onSetWinning={loto.setWinning} onResumeGame={loto.resumeGame} />
            </>}
        </div>

        {loto.isWheelMode ? <div className="lg:col-span-2">
            <Card className="bg-card/20 backdrop-blur-sm border-border/50">
              <CardContent className="p-2">
                <WheelOfFortune numberOfSegments={loto.wheelNumberCount} winningNumber={loto.wheelWinningNumber} isSpinning={loto.isWheelSpinning} prize={loto.wheelPrize} drawHistory={loto.wheelDrawHistory} targetRotation={loto.wheelTargetRotation} />
              </CardContent>
            </Card>
          </div> : <div className="lg:col-span-2">
            <Card className="bg-card/20 backdrop-blur-sm border-border/50">
              <CardContent className="space-y-6 p-6">
                <>
                  <ManualGrid drawnNumbers={loto.drawnNumbers} onNumberClick={loto.drawManualNumber} isDrawing={loto.isDrawing} isBingoMode={loto.isBingoMode} />
                  
                  {loto.currentGame && (
                    <>
                      <div className="flex gap-3 justify-center flex-wrap">
                        <Button onClick={() => loto.setWinning(true)} className="bg-loto-blue text-white font-bold" disabled={loto.isWinning}>
                          <Trophy className="w-4 h-4 mr-2" />
                          C'est gagné !
                        </Button>
                        <Button onClick={loto.resumeGame} variant="outline" className="border-loto-green text-loto-green hover:bg-loto-green hover:text-white" disabled={!loto.isWinning}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reprise du jeu
                        </Button>
                        <Button onClick={loto.endGame} variant="outline" className="border-loto-yellow text-loto-yellow hover:bg-loto-yellow hover:text-gray-900">
                          <Square className="w-4 h-4 mr-2" />
                          Terminer
                        </Button>
                        <Button onClick={loto.resetAll} variant="outline" className="border-loto-red text-loto-red hover:bg-loto-red hover:text-white">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      </div>

                      <div className="text-center">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Derniers numéros tirés</h3>
                        <div className="flex gap-2 justify-center flex-wrap">
                          {loto.drawnNumbers.slice(-10).reverse().map((num, i) => (
                            <span key={i} className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold">
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              </CardContent>
            </Card>
          </div>}
      </div>

    </div>;
};
export default Dashboard;