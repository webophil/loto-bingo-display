import { cn } from '@/lib/utils';

interface NumberBallProps {
  number: number;
  isDrawn: boolean;
  isLatest?: boolean;
}

const getNumberColor = (number: number) => {
  if (number <= 15) return 'bg-loto-red';
  if (number <= 30) return 'bg-loto-blue';
  if (number <= 45) return 'bg-loto-yellow text-gray-900';
  if (number <= 60) return 'bg-loto-green';
  if (number <= 75) return 'bg-loto-purple';
  return 'bg-loto-orange';
};

export const NumberBall = ({ number, isDrawn, isLatest }: NumberBallProps) => {
  return (
    <div
      className={cn(
        'number-ball',
        getNumberColor(number),
        isDrawn && 'drawn',
        isLatest && 'animate-bounce-soft animate-pulse-glow',
        !isDrawn && 'opacity-40 scale-75'
      )}
    >
      {number}
    </div>
  );
};