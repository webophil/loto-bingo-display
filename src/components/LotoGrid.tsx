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
        className="grid bg-card/20 backdrop-blur-sm rounded-2xl border border-border/50 flex-shrink-0 items-center overflow-hidden"
        style={{ 
          gridTemplateColumns: 'minmax(0, auto) repeat(15, minmax(0, 1fr))',
          columnGap: 'clamp(0.08rem, 0.15vw, 0.3rem)',
          rowGap: 'clamp(0.02rem, 0.04vh, 0.06rem)',
          padding: 'clamp(0.25rem, 0.5vh, 0.8rem)',
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
      className="grid bg-card/20 backdrop-blur-sm rounded-2xl border border-border/50 flex-shrink-0"
      style={{ 
        gridTemplateColumns: 'repeat(15, 1fr)',
        columnGap: 'clamp(0.072rem, 0.144vw, 0.24rem)',
        rowGap: 'clamp(0.012rem, 0.024vh, 0.04rem)',
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
          isLatest={number === latestNumber && latestNumber !== undefined}
        />
      ))}
    </div>
  );
};
