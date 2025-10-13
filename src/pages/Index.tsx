import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Settings, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import logoImage from "@/assets/logo.png";
const Index = () => {
  const openDisplayOnExternalScreen = () => {
    // Obtenir l'URL complète pour l'affichage
    const displayUrl = `${window.location.origin}/display`;

    // Paramètres pour maximiser la fenêtre sur l'écran externe
    const features = [
      "width=" + screen.availWidth,
      "height=" + screen.availHeight,
      "left=" + (screen.availWidth + 100),
      // Positionner sur l'écran externe
      "top=0",
      "scrollbars=no",
      "toolbar=no",
      "menubar=no",
      "status=no",
      "location=no",
      "resizable=yes",
    ].join(",");

    // Ouvrir la fenêtre maximisée
    const newWindow = window.open(displayUrl, "LotoDisplay", features);
    if (newWindow) {
      newWindow.focus();
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-4 lg:w-1/3">
            <img src={logoImage} alt="Loto Bingo Display" className="w-[230px] h-[230px] object-contain" />
            <div className="text-center text-base text-muted-foreground leading-relaxed">
              <p>Loto Bingo Display v1.0 - &copy;2025</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:w-2/3">
            <Card className="gradient-secondary border-border/50 hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <Monitor className="w-8 h-8" />
                  Écran Externe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-6">
                  Affichage public des 90 (ou Bingo 75) boules, et &quot;Dernier Sorti&quot; en évidence. Lots, choix
                  démarque et phase de jeu. Ecrans annonces, sponsors...
                </p>
                <Button
                  onClick={openDisplayOnExternalScreen}
                  className="w-full gradient-primary text-white font-semibold text-lg py-3"
                >
                  Ouvrir l'Affichage
                </Button>
              </CardContent>
            </Card>

            <Card className="gradient-accent border-border/50 hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                  <Settings className="w-8 h-8" />
                  Animation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800 mb-6">
                  Configuration de vos tirages (loto/bingo), des phases de jeu et des lots offerts. Grille des numéros à
                  cocher. Gestion affichage "Annonces".
                </p>
                <Link to="/dashboard">
                  <Button className="w-full gradient-secondary text-white font-semibold text-lg py-3">
                    Tableau de bord
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-card/20 backdrop-blur-sm border-border/50">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Trophy className="w-12 h-12 text-loto-yellow mx-auto" />
                <h3 className="text-xl font-semibold">Types de Jeux</h3>
                <p className="text-muted-foreground text-sm">Quine, Double Quine, Carton Plein</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  Loto 90 numéros
                  <br />
                  Bingo 75 numéros
                  <br />
                  Roue de la Chance Las Végas
                </h3>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-yellow-300">Tirage Equitable</h3>
                <p className="text-muted-foreground text-sm">
                  Le tirage système (Auto) est effectué par un &quot;crypto-randomizer&quot; utilisant la méthode
                  Fisher-Yates Shuffle pour des tirages vraiment aléatoires.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Index;
