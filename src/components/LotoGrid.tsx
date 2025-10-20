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
      <div 
        className="grid bg-card/20 backdrop-blur-sm rounded-3xl border border-border/50 flex-shrink-0 items-center"
        style={{ 
          gridTemplateColumns: 'auto repeat(15, 1fr)',
          gap: '0 clamp(0.125rem, 0.3vw, 0.5rem)',
          rowGap: 'clamp(0.25rem, 0.5vh, 1rem)',
          padding: 'clamp(0.75rem, 2vh, 3rem) clamp(1rem, 3vw, 4rem)',
          maxWidth: '90vw',
          maxHeight: '80vh'
        }}
      >
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <>
            <div 
              key={`letter-${rowIndex}`} 
              className={`flex items-center justify-center font-bold aspect-square rounded-lg ${bingoLetterColors[rowIndex]}`}
              style={{ 
                fontSize: 'clamp(1.5rem, 4vmin, 4rem)',
                marginRight: 'clamp(0.25rem, 0.5vw, 1rem)'
              }}
            >
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
    <div 
      className="grid bg-card/20 backdrop-blur-sm rounded-3xl border border-border/50 flex-shrink-0"
      style={{ 
        gridTemplateColumns: 'repeat(15, 1fr)',
        gap: 'clamp(0.125rem, 0.3vmin, 0.5rem)',
        padding: 'clamp(0.75rem, 2vh, 3rem) clamp(1rem, 3vw, 4rem)',
        maxWidth: '90vw',
        maxHeight: '80vh'
      }}
    >
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