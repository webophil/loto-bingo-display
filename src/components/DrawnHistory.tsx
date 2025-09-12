import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DrawnHistoryProps {
  drawnNumbers: number[];
}

export const DrawnHistory = ({ drawnNumbers }: DrawnHistoryProps) => {
  const latest5 = drawnNumbers.slice(-5).reverse();

  return (
    <Card className="gradient-accent border-border/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center text-gray-900">
          🎲 Derniers numéros
        </CardTitle>
      </CardHeader>
      <CardContent>
        {latest5.length === 0 ? (
          <p className="text-center text-gray-700 italic">Aucun numéro tiré</p>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {latest5.map((number, index) => (
              <Badge
                key={`${number}-${index}`}
                className={`text-2xl px-4 py-2 ${
                  index === 0 
                    ? 'bg-primary text-primary-foreground animate-pulse-glow' 
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {number}
              </Badge>
            ))}
          </div>
        )}
        
        {drawnNumbers.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-700">
              Total: {drawnNumbers.length}/90 numéros
            </p>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(drawnNumbers.length / 90) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};