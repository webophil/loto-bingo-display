import { NumberBall } from './NumberBall';

interface LotoGridProps {
  drawnNumbers: number[];
  isDrawing: boolean;
  isBingoMode?: boolean;
  disableLatestAnimation?: boolean;
}

export const LotoGrid = ({ drawnNumbers, isDrawing, isBingoMode = false, disableLatestAnimation = false }: LotoGridProps) => {
  const maxNumbers = isBingoMode ? 75 : 90;
  const numbers = Array.from({ length: maxNumbers }, (_, i) => i + 1);
  const latestNumber = disableLatestAnimation ? undefined : drawnNumbers[drawnNumbers.length - 1];

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
        className="grid bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex-shrink-0 items-center overflow-hidden mx-auto"
        style={{ 
          gridTemplateColumns: 'minmax(0, auto) repeat(15, minmax(0, 1fr))',
          gap: 'clamp(0.15rem, 0.4vmin, 0.5rem)',
          padding: 'clamp(0.4rem, 1vmin, 1rem)',
          maxWidth: 'fit-content',
          maxHeight: '100%',
        }}
      >
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <>
            <div 
              key={`letter-${rowIndex}`} 
              className={`flex items-center justify-center font-bold rounded-lg flex-shrink-0 ${bingoLetterColors[rowIndex]}`}
              style={{ 
                fontSize: 'clamp(1.1rem, 3vmin, 4rem)',
                width: 'clamp(1.6rem, 4vmin, 5.5rem)',
                height: 'clamp(1.6rem, 4vmin, 5.5rem)',
                marginRight: 'clamp(0.1rem, 0.25vw, 0.5rem)'
              }}
            >
              {bingoLetters[rowIndex]}
            </div>
            {numbers.slice(rowIndex * 15, (rowIndex + 1) * 15).map((number) => (
              <NumberBall
                key={number}
                number={number}
                isDrawn={drawnNumbers.includes(number)}
                isLatest={number === latestNumber && latestNumber !== undefined}
              />
            ))}
          </>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="grid bg-white/5 backdrop-blur-sm rounded-2xl border border-border/50 flex-shrink-0 mx-auto"
      style={{ 
        gridTemplateColumns: 'repeat(15, 1fr)',
        gap: 'clamp(0.15rem, 0.4vmin, 0.5rem)',
        padding: 'clamp(0.4rem, 1vmin, 1rem)',
        maxWidth: 'fit-content',
        maxHeight: '100%',
      }}
    >
      {numbers.map((number) => (
        <NumberBall
          key={number}
          number={number}
          isDrawn={drawnNumbers.includes(number)}
          isLatest={number === latestNumber && latestNumber !== undefined}
        />
      ))}
    </div>
  );
};
