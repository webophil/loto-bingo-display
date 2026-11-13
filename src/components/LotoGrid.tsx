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
        className="grid bg-gray-700 rounded-2xl border border-gray-600 flex-shrink-0 display-rack items-center overflow-hidden mx-auto"
        style={{ 
          gridTemplateColumns: 'minmax(0, auto) repeat(15, minmax(0, 1fr))',
          gap: 'min(0.9vw, 1.6vh)',
          padding: 'min(0.9vw, 1.6vh)',
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
                fontSize: 'min(2.4vw, 4.4vh)',
                width: 'min(3.6vw, 6.6vh)',
                height: 'min(3.6vw, 6.6vh)',
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
      className="grid bg-gray-700 rounded-2xl border border-gray-600 flex-shrink-0 display-rack mx-auto"
      style={{ 
        gridTemplateColumns: 'repeat(15, 1fr)',
        gap: 'min(0.9vw, 1.6vh)',
        padding: 'min(0.9vw, 1.6vh)',
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
