import { NumberBall } from './NumberBall';
import { Button } from '@/components/ui/button';

interface ManualGridProps {
  drawnNumbers: number[];
  onNumberClick: (number: number) => void;
  isDrawing: boolean;
}

export const ManualGrid = ({ drawnNumbers, onNumberClick, isDrawing }: ManualGridProps) => {
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);
  const latestNumber = drawnNumbers[drawnNumbers.length - 1];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">
          Cliquez sur le numéro tiré physiquement
        </h3>
        <p className="text-sm text-muted-foreground">
          {drawnNumbers.length}/90 numéros tirés
        </p>
      </div>
      
      <div className="grid grid-cols-10 gap-2 p-4 bg-card/20 backdrop-blur-sm rounded-2xl border border-border/50">
        {numbers.map((number) => {
          const isDrawn = drawnNumbers.includes(number);
          const isLatest = number === latestNumber && isDrawing;
          
          return (
            <Button
              key={number}
              variant={isDrawn ? "default" : "outline"}
              size="sm"
              className={`
                aspect-square p-0 text-sm font-bold transition-all duration-300
                ${isDrawn 
                  ? 'bg-primary hover:bg-primary/90 scale-95 opacity-80' 
                  : 'hover:scale-105 hover:bg-accent'
                }
                ${isLatest ? 'animate-bounce-soft animate-pulse-glow' : ''}
              `}
              onClick={() => !isDrawn && onNumberClick(number)}
              disabled={isDrawn || isDrawing}
            >
              {number}
            </Button>
          );
        })}
      </div>
    </div>
  );
};