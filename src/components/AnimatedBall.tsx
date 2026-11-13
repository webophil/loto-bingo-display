import { useLayoutEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { getDrawTiming } from '@/lib/drawAnimation';

interface AnimatedBallProps {
  number: number;
  duration: number;
  onAnimationComplete: () => void;
  startPosition: { x: number; y: number; size: number };
  endPosition: { x: number; y: number; size: number };
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
  const ballRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ball = ballRef.current;
    if (!ball) return;
    const timing = getDrawTiming(duration, window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    let animation: Animation | undefined;
    const animate = () => {
      const elapsed = Number(animation?.currentTime ?? 0);
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
      }
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.75;
      const rack = document.querySelector(`[data-ball-number="${number}"]`)?.getBoundingClientRect();
      const target = document.querySelector('[data-last-drawn]')?.getBoundingClientRect();
      const start = rack ? { x: rack.left + rack.width / 2, y: rack.top + rack.height / 2, size: rack.width } : startPosition;
      const end = target ? { x: target.left + target.width / 2, y: target.top + target.height / 2, size: target.width } : endPosition;
      const transform = (position: typeof start) => `translate3d(${position.x - centerX}px, ${position.y - centerY}px, 0) scale(${position.size / size})`;
      animation = ball.animate([
        { transform: transform(start), offset: 0, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        { transform: 'translate3d(0, 0, 0) scale(1)', offset: timing.holdStart },
        { transform: 'translate3d(0, 0, 0) scale(1)', offset: timing.holdEnd, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
        { transform: transform(end), offset: 1 },
      ], { duration: timing.totalMs, fill: 'forwards' });
      animation.currentTime = elapsed;
      animation.onfinish = onAnimationComplete;
    };
    animate();
    window.addEventListener('resize', animate);
    return () => {
      window.removeEventListener('resize', animate);
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
      }
    };
  }, [number, duration, startPosition, endPosition, onAnimationComplete]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div
        ref={ballRef}
        data-animated-ball={number}
        className={cn(
          'number-ball draw-animation-ball',
          getNumberColor(number)
        )}
      >
        <div className="number-text">
          {number}
        </div>
      </div>
    </div>
  );
};
