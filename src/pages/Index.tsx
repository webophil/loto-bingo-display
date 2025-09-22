import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Settings, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
const Index = () => {
  const openDisplayOnExternalScreen = () => {
    // Obtenir l'URL complète pour l'affichage
    const displayUrl = `${window.location.origin}/display`;

    // Paramètres pour maximiser la fenêtre sur l'écran externe
    const features = ['width=' + screen.availWidth, 'height=' + screen.availHeight, 'left=' + (screen.availWidth + 100),
    // Positionner sur l'écran externe
    'top=0', 'scrollbars=no', 'toolbar=no', 'menubar=no', 'status=no', 'location=no', 'resizable=yes'].join(',');

    // Ouvrir la fenêtre maximisée
    const newWindow = window.open(displayUrl, 'LotoDisplay', features);
    if (newWindow) {
      newWindow.focus();
    }
  };
  return <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-6xl font-bold gradient-primary bg-clip-text text-transparent">🎯 LOTO Corail's Rémoises🎯</h1>
          <p className="text-xl text-muted-foreground">Système de gestion de lotos, bingos et roue de la fortune par Fifi</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="gradient-secondary border-border/50 hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Monitor className="w-8 h-8" />
                Affichage Grand Écran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-6">Affichage public avec grille des 90 numéros, animations et derniers tirages visibles de loin.</p>
              <Button onClick={openDisplayOnExternalScreen} className="w-full gradient-primary text-white font-semibold text-lg py-3">
                Ouvrir l'Affichage
              </Button>
            </CardContent>
          </Card>

          <Card className="gradient-accent border-border/50 hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                <Settings className="w-8 h-8" />
                Dashboard Animateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 mb-6">
                Interface de contrôle complète pour gérer les tirages, 
                lancer les différents types de jeux et suivre l'historique.
              </p>
              <Link to="/dashboard">
                <Button className="w-full gradient-secondary text-white font-semibold text-lg py-3">
                  Accéder au Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/20 backdrop-blur-sm border-border/50">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Trophy className="w-12 h-12 text-loto-yellow mx-auto" />
                <h3 className="text-xl font-semibold">Types de Jeux</h3>
                <p className="text-muted-foreground text-sm">
                  Quine, Double Quine, Carton Plein
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-loto-red mx-auto flex items-center justify-center text-white font-bold text-xl">
                  90
                </div>
                <h3 className="text-xl font-semibold">Boules</h3>
                <p className="text-muted-foreground text-sm">
                  Système traditionnel 90 numéros
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-loto-blue mx-auto flex items-center justify-center text-white font-bold">
                  ⚡
                </div>
                <h3 className="text-xl font-semibold">Temps Réel</h3>
                <p className="text-muted-foreground text-sm">
                  Synchronisation instantanée
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Index;