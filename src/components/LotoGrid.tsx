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
        className="grid bg-card/20 backdrop-blur-sm rounded-2xl border border-border/50 flex-shrink-0 items-center"
        style={{ 
          gridTemplateColumns: 'auto repeat(15, 1fr)',
          columnGap: 'clamp(0.17rem, 0.34vw, 0.56rem)',
          rowGap: 'clamp(0.054rem, 0.108vh, 0.162rem)',
          padding: 'clamp(0.5rem, 1vh, 1.5rem) clamp(0.5rem, 1vw, 2rem)',
          width: 'min(90vw, 100%)',
          height: 'min(90vh, 100%)',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <>
            <div 
              key={`letter-${rowIndex}`} 
              className={`flex items-center justify-center font-bold aspect-square rounded-lg ${bingoLetterColors[rowIndex]}`}
              style={{ 
                fontSize: 'clamp(2rem, 5vmin, 7rem)',
                marginRight: 'clamp(0.3rem, 0.8vw, 1.5rem)'
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
        rowGap: 'clamp(0.0324rem, 0.0648vh, 0.108rem)',
        padding: 'clamp(0.5rem, 1vh, 1.5rem) clamp(0.5rem, 1vw, 2rem)',
        width: 'min(90vw, 100%)',
        height: 'min(90vh, 100%)',
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
