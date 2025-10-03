import { useState, useEffect } from 'react';

interface WheelOfFortuneProps {
  numberOfSegments: number;
  winningNumber: number | null;
  isSpinning: boolean;
  prize: string;
  drawHistory: Array<{ number: number; prize: string }>;
}

export const WheelOfFortune = ({ numberOfSegments, winningNumber, isSpinning, prize, drawHistory }: WheelOfFortuneProps) => {
  const [rotation, setRotation] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    if (isSpinning && winningNumber !== null) {
      const segmentAngle = 360 / numberOfSegments;
      
      // Calculate the center angle of the winning segment
      const winningSegmentCenter = (winningNumber - 1) * segmentAngle + (segmentAngle / 2);
      
      // Add random offset within segment (with margins to avoid edges)
      const margin = segmentAngle * 0.15; // 15% margin on each side
      const randomOffset = (Math.random() - 0.5) * (segmentAngle - 2 * margin);
      
      // Delta: angle to reach inside the winning segment
      const delta = 360 - winningSegmentCenter + randomOffset;
      
      // Random number of complete rotations (5 to 7)
      const fullRotations = Math.floor(Math.random() * 3) + 5; // 5, 6, or 7
      
      // Calculate target rotation from current position
      const targetRotation = currentRotation + fullRotations * 360 + delta;
      
      setRotation(targetRotation);
    }
  }, [isSpinning, winningNumber, numberOfSegments, currentRotation]);

  // Generate colors for segments
  const getSegmentColor = (index: number) => {
    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--secondary))', 
      'hsl(221.2 83.2% 53.3%)', // blue
      'hsl(142.1 76.2% 36.3%)', // green
      'hsl(346.8 77.2% 49.8%)', // red
      'hsl(262.1 83.3% 57.8%)', // purple
      'hsl(32.2 94.6% 43.7%)', // orange
      'hsl(280 100% 70%)', // pink
    ];
    return colors[index % colors.length];
  };

  const segmentAngle = 360 / numberOfSegments;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 relative">
      {/* Wheel Container */}
      <div className="relative">
        {/* Pointer - Now pointing down */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-white shadow-lg">
        </div>
        
        <svg
          width="600"
          height="600"
          viewBox="0 0 600 600"
          className="drop-shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
          onTransitionEnd={() => {
            if (!isSpinning) {
              setCurrentRotation(rotation);
            }
          }}
        >
          {/* Wheel segments */}
          {Array.from({ length: numberOfSegments }, (_, index) => {
            const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
            const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
            const radius = 280;
            const centerX = 300;
            const centerY = 300;

            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            const largeArcFlag = segmentAngle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            // Text position (middle of segment)
            const textAngle = (startAngle + endAngle) / 2;
            const textRadius = radius * 0.7;
            const textX = centerX + textRadius * Math.cos(textAngle);
            const textY = centerY + textRadius * Math.sin(textAngle);

            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={getSegmentColor(index)}
                  stroke="white"
                  strokeWidth="3"
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="28"
                  fontWeight="bold"
                  transform={`rotate(${(startAngle + endAngle) / 2 * (180 / Math.PI)}, ${textX}, ${textY})`}
                >
                  {index + 1}
                </text>
              </g>
            );
          })}
          
          {/* Center circle */}
          <circle
            cx="300"
            cy="300"
            r="40"
            fill="white"
            stroke="hsl(var(--border))"
            strokeWidth="4"
          />
        </svg>
      </div>

      {/* Result display below the wheel */}
      {winningNumber !== null && !isSpinning && (
        <div className="mt-8 text-center">
          <div className="text-4xl font-bold text-primary animate-pulse">
            N° {winningNumber}
            {prize && <span className="ml-4 text-3xl text-foreground">🎁 {prize}</span>}
          </div>
        </div>
      )}

      {/* Spinning indicator */}
      {isSpinning && (
        <div className="mt-8 text-2xl font-bold text-foreground animate-pulse">
          🎯 Tirage en cours...
        </div>
      )}
    </div>
  );
};