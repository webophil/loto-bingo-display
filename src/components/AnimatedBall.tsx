import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBallProps {
  number: number;
  duration: number;
  onAnimationComplete: () => void;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
}

const getNumberColor = (number: number) => {
  if (number <= 15) return 'ball-blue';
  if (number <= 30) return 'ball-red';
  if (number <= 45) return 'ball-white';
  if (number <= 60) return 'ball-green';
  if (number <= 75) return 'ball-yellow';
  return 'ball-pink';
};

export const AnimatedBall = ({ number, duration, onAnimationComplete, startPosition, endPosition }: AnimatedBallProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onAnimationComplete();
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration, onAnimationComplete]);

  if (!isVisible) return null;

  // Calculate center of screen
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Calculate translations
  const startTranslateX = startPosition.x - centerX;
  const startTranslateY = startPosition.y - centerY;
  const endTranslateX = endPosition.x - centerX;
  const endTranslateY = endPosition.y - centerY;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <style>
        {`
          @keyframes ball-zoom-dynamic {
            0% {
              transform: translate(${startTranslateX}px, ${startTranslateY}px) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            50% {
              transform: translate(0, 0) scale(1.1);
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translate(${endTranslateX}px, ${endTranslateY}px) scale(0);
              opacity: 0;
            }
          }
        `}
      </style>
      <div
        className={cn(
          'number-ball',
          getNumberColor(number)
        )}
        style={{
          width: '75vmin',
          height: '75vmin',
          animation: `ball-zoom-dynamic ${duration}s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`,
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
