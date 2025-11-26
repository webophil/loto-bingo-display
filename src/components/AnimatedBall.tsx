import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBallProps {
  number: number;
  onAnimationComplete: () => void;
}

const getNumberColor = (number: number) => {
  if (number <= 15) return 'bg-blue-700 border-blue-700';
  if (number <= 30) return 'bg-red-600 border-red-600';
  if (number <= 45) return 'bg-gray-600 border-gray-600';
  if (number <= 60) return 'bg-green-600 border-green-600';
  if (number <= 75) return 'bg-yellow-400 border-yellow-400 text-black';
  return 'bg-pink-600 border-pink-600';
};

export const AnimatedBall = ({ number, onAnimationComplete }: AnimatedBallProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // After 4 seconds, hide the ball and call completion callback
    const timer = setTimeout(() => {
      setIsVisible(false);
      onAnimationComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold text-white border-8 animate-ball-zoom',
          getNumberColor(number)
        )}
        style={{
          width: '75vmin',
          height: '75vmin',
          fontSize: 'clamp(4rem, 25vmin, 30rem)',
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.5), 0 0 120px hsl(var(--primary) / 0.6)',
        }}
      >
        {number}
      </div>
    </div>
  );
};
