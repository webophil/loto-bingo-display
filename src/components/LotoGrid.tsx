import { NumberBall } from './NumberBall';

interface LotoGridProps {
  drawnNumbers: number[];
  isDrawing: boolean;
  isBingoMode?: boolean;
}

export const LotoGrid = ({ drawnNumbers, isDrawing, isBingoMode = false }: LotoGridProps) => {
  const maxNumbers = isBingoMode ? 75 : 90;
  const numbers = Array.from({ length: maxNumbers }, (_, i) => i + 1);
  const latestNumber = drawnNumbers[drawnNumbers.length - 1];

  const bingoLetters = ['B', 'I', 'N', 'G', 'O'];
  const bingoLetterColors = [
    'bg-blue-700 text-white',
    'bg-red-600 text-white',
    'bg-white text-black',
    'bg-green-600 text-white',
    'bg-yellow-400 text-black'
  ];

  if (isBingoMode) {
    return (
      <div className="grid grid-cols-[auto_repeat(15,1fr)] gap-x-0 gap-y-2 px-16 py-6 bg-card/20 backdrop-blur-sm rounded-3xl border border-border/50 flex-shrink-0 items-center">
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <>
            <div key={`letter-${rowIndex}`} className={`flex items-center justify-center text-4xl font-bold mr-2 aspect-square rounded-lg ${bingoLetterColors[rowIndex]}`}>
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
  }

  return (
    <div className="grid grid-cols-15 gap-1 px-16 py-6 bg-card/20 backdrop-blur-sm rounded-3xl border border-border/50 flex-shrink-0">
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