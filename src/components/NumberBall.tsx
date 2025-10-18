import { cn } from '@/lib/utils';

interface NumberBallProps {
  number: number;
  isDrawn: boolean;
  isLatest?: boolean;
}

const getNumberColor = (number: number) => {
  if (number <= 15) return 'ball-blue';
  if (number <= 30) return 'ball-red';
  if (number <= 45) return 'ball-white';
  if (number <= 60) return 'ball-green';
  if (number <= 75) return 'ball-yellow';
  return 'ball-pink';
};

export const NumberBall = ({ number, isDrawn, isLatest }: NumberBallProps) => {
  return (
    <div
      className={cn(
        'number-ball',
        getNumberColor(number),
        isDrawn && 'drawn',
        isLatest && 'animate-bounce-soft animate-pulse-glow animate-blink',
        !isDrawn && 'opacity-40 scale-75'
      )}
    >
      <div className="number-text font-bold">{number}</div>
    </div>
  );
};