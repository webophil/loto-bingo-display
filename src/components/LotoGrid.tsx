import { NumberBall } from './NumberBall';

interface LotoGridProps {
  drawnNumbers: number[];
  isDrawing: boolean;
}

export const LotoGrid = ({ drawnNumbers, isDrawing }: LotoGridProps) => {
  const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
  const latestNumber = drawnNumbers[drawnNumbers.length - 1];

  const bingoLetters = ['B', 'I', 'N', 'G', 'O'];

  return (
    <div className="grid grid-cols-[auto_repeat(15,1fr)] gap-1.5 p-6 bg-card/20 backdrop-blur-sm rounded-3xl border border-border/50 flex-shrink-0">
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <>
          <div key={`letter-${rowIndex}`} className="flex items-center justify-center text-2xl font-bold text-primary pr-2">
            {bingoLetters[rowIndex]}
          </div>
          {numbers.slice(rowIndex * 15, (rowIndex + 1) * 15).map((number) => (
            <NumberBall
              key={number}
              number={number}
              isDrawn={drawnNumbers.includes(number)}
              isLatest={number === latestNumber && isDrawing}
            />
          ))}
        </>
      ))}
    </div>
  );
};