import { cn } from '@/lib/utils';

interface NumberBallProps {
  number: number;
  isDrawn: boolean;
  isLatest?: boolean;
}

const getNumberColor = (number: number) => {
  if (number <= 15) return 'blue-700';
  if (number <= 30) return 'red-600';
  if (number <= 45) return 'white';
  if (number <= 60) return 'green-600';
  if (number <= 75) return 'yellow-400';
  return 'pink-600';
};

const getGradientStyle = (number: number) => {
  const colorMap: { [key: string]: string } = {
    'blue-700': '#1d4ed8',
    'red-600': '#dc2626',
    'white': '#ffffff',
    'green-600': '#16a34a',
    'yellow-400': '#facc15',
    'pink-600': '#db2777'
  };
  
  const color = colorMap[getNumberColor(number)];
  
  return {
    background: `radial-gradient(circle at 30% 30%, 
      rgba(255, 255, 255, 0.9), 
      ${color} 20%, 
      ${color} 70%, 
      color-mix(in srgb, ${color} 70%, black) 100%)`
  };
};

export const NumberBall = ({ number, isDrawn, isLatest }: NumberBallProps) => {
  return (
    <div
      style={getGradientStyle(number)}
      className={cn(
        'number-ball',
        'text-black',
        isDrawn && 'drawn',
        isLatest && 'animate-bounce-soft animate-pulse-glow animate-blink',
        !isDrawn && 'opacity-40 scale-75'
      )}
    >
      {number}
    </div>
  );
};