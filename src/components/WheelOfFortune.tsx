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

  useEffect(() => {
    if (isSpinning && winningNumber !== null) {
      const segmentAngle = 360 / numberOfSegments;
      // Center the winning number under the pointer (at top = 0 degrees)
      const winningAngle = (winningNumber - 1) * segmentAngle + (segmentAngle / 2);
      // Add multiple rotations for dramatic effect + final position
      const finalRotation = 1440 + (360 - winningAngle); // 4 full rotations + stop at winning position centered
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
    <div className="flex items-center justify-center min-h-screen p-8 relative">
      {/* Current winning number display - Left side */}
      {winningNumber !== null && !isSpinning && (
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-30">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center border-4 border-primary">
            <div className="text-6xl mb-2">🎯</div>
            <h3 className="text-4xl font-bold text-primary">
              N° {winningNumber}
            </h3>
          </div>
        </div>
      )}

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

      {/* Draw History - Right side */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 max-w-xs">
        <div className="bg-white p-6 rounded-2xl shadow-2xl border-4 border-primary">
          <h3 className="text-2xl font-bold text-primary mb-4 text-center">
            📋 Historique
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {drawHistory.map((draw, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                <div className="text-xl font-bold text-primary">
                  N° {draw.number}
                </div>
                {draw.prize && (
                  <div className="text-sm text-gray-600 mt-1">
                    🎁 {draw.prize}
                  </div>
                )}
              </div>
            ))}
            {winningNumber !== null && !isSpinning && (
              <div className="bg-primary/10 p-3 rounded-lg border-2 border-primary">
                <div className="text-xl font-bold text-primary">
                  N° {winningNumber}
                </div>
                {prize && (
                  <div className="text-sm text-gray-600 mt-1">
                    🎁 {prize}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spinning indicator */}
      {isSpinning && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold animate-pulse">
          🎯 Tirage en cours...
        </div>
      )}
    </div>
  );
};