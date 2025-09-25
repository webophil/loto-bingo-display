import { useState, useEffect } from 'react';

interface WheelOfFortuneProps {
  numberOfSegments: number;
  winningNumber: number | null;
  isSpinning: boolean;
  prize: string;
}

export const WheelOfFortune = ({ numberOfSegments, winningNumber, isSpinning, prize }: WheelOfFortuneProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isSpinning && winningNumber !== null) {
      const segmentAngle = 360 / numberOfSegments;
      const winningAngle = (winningNumber - 1) * segmentAngle;
      // Add multiple rotations for dramatic effect + final position
      const finalRotation = 1440 + (360 - winningAngle); // 4 full rotations + stop at winning position
      setRotation(finalRotation);
    }
  }, [isSpinning, winningNumber, numberOfSegments]);

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
      {/* Pointer */}
      <div className="absolute top-8 z-20 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-white shadow-lg">
      </div>

      {/* Wheel Container */}
      <div className="relative">
        <svg
          width="600"
          height="600"
          viewBox="0 0 600 600"
          className="drop-shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
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

      {/* Result Display */}
      {winningNumber !== null && !isSpinning && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="bg-white p-12 rounded-3xl shadow-2xl text-center animate-bounce-soft border-8 border-primary">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-6xl font-bold text-primary mb-4">
              NUMÉRO {winningNumber}
            </h2>
            {prize && (
              <p className="text-2xl text-gray-700 font-semibold">
                🎁 {prize}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Spinning indicator */}
      {isSpinning && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold animate-pulse">
          🎯 Tirage en cours...
        </div>
      )}
    </div>
  );
};