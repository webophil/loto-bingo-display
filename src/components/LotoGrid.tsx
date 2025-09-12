import { NumberBall } from './NumberBall';

interface LotoGridProps {
  drawnNumbers: number[];
  isDrawing: boolean;
}

export const LotoGrid = ({ drawnNumbers, isDrawing }: LotoGridProps) => {
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);
  const latestNumber = drawnNumbers[drawnNumbers.length - 1];

  return (
    <div className="grid grid-cols-15 gap-2 p-8 bg-card/20 backdrop-blur-sm rounded-3xl border border-border/50">
      {numbers.map((number) => (
        <NumberBall
          key={number}
          number={number}
          isDrawn={drawnNumbers.includes(number)}
          isLatest={number === latestNumber && isDrawing}
        />
      ))}
    </div>
  );
};