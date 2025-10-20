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
        className="grid bg-card/20 backdrop-blur-sm rounded-2xl border border-border/50 flex-shrink-0 items-center overflow-hidden"
        style={{ 
          gridTemplateColumns: 'minmax(0, auto) repeat(15, minmax(0, 1fr))',
          columnGap: 'clamp(0.1rem, 0.2vw, 0.4rem)',
          rowGap: 'clamp(0.032rem, 0.065vh, 0.097rem)',
          padding: 'clamp(0.3rem, 0.6vh, 1rem)',
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <>
            <div 
              key={`letter-${rowIndex}`} 
              className={`flex items-center justify-center font-bold rounded-lg flex-shrink-0 ${bingoLetterColors[rowIndex]}`}
              style={{ 
                fontSize: 'clamp(1.5rem, 4vmin, 5rem)',
                width: 'clamp(2.5rem, 6vmin, 8rem)',
                height: 'clamp(2.5rem, 6vmin, 8rem)',
                marginRight: 'clamp(0.2rem, 0.4vw, 0.8rem)'
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
      className="grid bg-card/20 backdrop-blur-sm rounded-2xl border border-border/50 flex-shrink-0"
      style={{ 
        gridTemplateColumns: 'repeat(15, 1fr)',
        columnGap: 'clamp(0.072rem, 0.144vw, 0.24rem)',
        rowGap: 'clamp(0.019rem, 0.039vh, 0.065rem)',
        padding: 'clamp(0.3rem, 0.6vh, 1rem) clamp(0.3rem, 0.6vw, 1rem)',
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%'
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
