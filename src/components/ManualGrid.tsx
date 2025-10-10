import { Button } from '@/components/ui/button';

interface ManualGridProps {
  drawnNumbers: number[];
  onNumberClick: (number: number) => void;
  isDrawing: boolean;
}

const getNumberColor = (number: number) => {
  if (number <= 15) return 'border-blue-700';
  if (number <= 30) return 'border-red-600';
  if (number <= 45) return 'border-white';
  if (number <= 60) return 'border-green-600';
  if (number <= 75) return 'border-yellow-400';
  return 'border-pink-600';
};

export const ManualGrid = ({ drawnNumbers, onNumberClick, isDrawing }: ManualGridProps) => {
  const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
  const latestNumber = drawnNumbers[drawnNumbers.length - 1];

  const bingoLetters = ['B', 'I', 'N', 'G', 'O'];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white">
          Cliquez sur le numéro tiré physiquement
        </h3>
        <p className="text-sm text-white/70">
          {drawnNumbers.length}/75 numéros tirés
        </p>
      </div>
      
      <div className="grid grid-cols-[auto_repeat(15,1fr)] gap-1.5 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <>
            <div key={`letter-${rowIndex}`} className="flex items-center justify-center text-xl font-bold text-primary pr-2">
              {bingoLetters[rowIndex]}
            </div>
            {numbers.slice(rowIndex * 15, (rowIndex + 1) * 15).map((number) => {
              const isDrawn = drawnNumbers.includes(number);
              const isLatest = number === latestNumber && isDrawing;
              
              return (
                <button
                  key={number}
                  className={`
                    aspect-square flex items-center justify-center text-sm font-bold transition-all duration-300 rounded-md border-4
                    ${getNumberColor(number)}
                    ${isDrawn 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white text-black hover:scale-105'
                    }
                    ${isLatest ? 'animate-pulse' : ''}
                  `}
                  onClick={() => onNumberClick(number)}
                >
                  {number}
                </button>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
};