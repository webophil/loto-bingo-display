import { cn } from '@/lib/utils';

interface NumberBallProps {
  number: number;
  isDrawn: boolean;
  isLatest?: boolean;
}

const getNumberColor = (number: number) => {
  if (number <= 15) return 'bg-white border-[15px] border-blue-700 text-black';
  if (number <= 30) return 'bg-white border-[15px] border-red-600 text-black';
  if (number <= 45) return 'bg-white border-[15px] border-white text-black';
  if (number <= 60) return 'bg-white border-[15px] border-green-600 text-black';
  if (number <= 75) return 'bg-white border-[15px] border-yellow-400 text-black';
  return 'bg-white border-[15px] border-pink-600 text-black';
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