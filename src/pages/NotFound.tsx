import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-8xl font-bold gradient-primary bg-clip-text text-transparent">404</h1>
          <h2 className="text-3xl font-bold text-foreground">Page non trouvée</h2>
          <p className="text-xl text-muted-foreground max-w-md">
            Oops ! La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        <Button asChild className="gradient-secondary text-white font-semibold">
          <a href="/">
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
