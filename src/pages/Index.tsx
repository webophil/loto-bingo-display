import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Monitor, Settings, Trophy, HelpCircle } from "lucide-react";
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
      newWindow.addEventListener('load', () => {
        newWindow.document.documentElement.requestFullscreen?.().catch(() => {});
      });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-4 lg:w-1/3">
            <img src={logoImage} alt="Loto Bingo Display" className="w-[290px] h-[290px] object-contain" />
            <div className="text-center text-base text-muted-foreground leading-relaxed"></div>
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
                <div className="flex gap-2">
                  <Button
                    onClick={openDisplayOnExternalScreen}
                    className="flex-1 gradient-primary text-white font-semibold text-lg py-3"
                  >
                    Afficher
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="px-3 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <HelpCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">Aide</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>🖥️ Aide rapide – Affichage écran externe</DialogTitle>
                      </DialogHeader>
                      <div className="py-4 space-y-4 text-sm">
                        <p>
                          <strong>Pour afficher la fenêtre visible par les joueurs :</strong>
                        </p>
                        <p>Raccordez votre TV ou vidéo-projecteur à votre ordinateur.</p>
                        <p>
                          <strong>Sous Windows</strong>, clic droit sur le bureau → Paramètres d'affichage → choisir{" "}
                          <em>Étendre ces affichages</em> → Appliquer.
                        </p>
                        <p>
                          Dans Loto Bingo Display, cliquez sur <strong>Afficher</strong> (ou Afficher Écran Externe
                          depuis le tableau de bord).
                        </p>
                        <p>
                          La nouvelle fenêtre s'affiche sur le second écran, réduite. Déplacez votre curseur de souris à
                          droite de votre écran de contrôle, votre pointeur apparait sur l'écran externe. Cliquez alors
                          dans la fenêtre puis appuyez sur <strong>F11</strong> pour le plein écran. Vous n'aurez plus
                          besoin de refaire cette manipulation pendant votre session. Ramenez simplement votre curseur à
                          la gauche de l'écran extérieur, pour qu'il soit à nouveau dans votre écran de contrôle.
                        </p>
                        <p className="text-muted-foreground">
                          💡 Si la fenêtre n'apparaît pas, vérifiez le mode "Étendre" dans vos paramètres d'affichage.
                          Rafraîchissez l'application (F5) et réessayez.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
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
          <CardContent className="p-8 opacity-90">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-yellow-300">Types de Jeux</h3>
                <p className="text-muted-foreground text-sm">
                  Quine, Double Quine, Carton Plein
                  <br />
                  enchaînés ou non
                  <br />
                  Mode Rapide
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-yellow-300">
                  Au choix :<br />
                </h3>
                <p className="text-muted-foreground text-sm">
                  Loto avec 90 boules
                  <br />
                  Bingo avec 75 boules
                  <br />
                  Démarque ou non
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-yellow-300">Annonces et Sponsors</h3>
                <p className="text-muted-foreground text-sm">
                  Affichez des images de votre choix entre les phases de jeu : annonce prochain loto, pub d'un sponsor,
                  gros plan sur les lots...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-center">
          Loto Bingo Display v1.2 - &copy;2025 par Philippe André Pérard - Tous droits réservés
        </div>
      </div>
    </div>
  );
};
export default Index;
