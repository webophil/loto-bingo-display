import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBallProps {
  number: number;
  duration: number;
  onAnimationComplete: () => void;
}

const getNumberColor = (number: number) => {
  if (number <= 15) return 'ball-blue';
  if (number <= 30) return 'ball-red';
  if (number <= 45) return 'ball-white';
  if (number <= 60) return 'ball-green';
  if (number <= 75) return 'ball-yellow';
  return 'ball-pink';
};

export const AnimatedBall = ({ number, duration, onAnimationComplete }: AnimatedBallProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onAnimationComplete();
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div
        className={cn(
          'number-ball',
          getNumberColor(number)
        )}
        style={{
          width: '75vmin',
          height: '75vmin',
          animation: `ball-zoom-enhanced ${duration}s cubic-bezier(0.68, -0.8, 0.265, 1.8) forwards`,
        }}
      >
        <div 
          className="number-text" 
          style={{ 
            width: '53vmin',
            height: '53vmin',
            fontSize: 'clamp(4rem, 25vmin, 30rem)',
          }}
        >
          {number}
        </div>
      </div>
    </div>
  );
};
