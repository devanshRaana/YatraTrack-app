import React from 'react';

interface PieChartProps {
  data: { name: string; value: number }[];
  size?: number;
}

const COLORS = ['#14b8a6', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'];

const PieChart: React.FC<PieChartProps> = ({ data, size = 100 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent) * (size / 2.2);
    const y = Math.sin(2 * Math.PI * percent) * (size / 2.2);
    return [x, y];
  };

  const slices = data.map((item, index) => {
    const percent = item.value / total;
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += percent;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = percent > 0.5 ? 1 : 0;

    const pathData = [
      `M ${startX} ${startY}`,
      `A ${size / 2.2} ${size / 2.2} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `L 0 0`,
    ].join(' ');
    
    return (
        <path
            key={item.name}
            d={pathData}
            fill="none"
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={size/5}
        >
            <animate attributeName="stroke-dasharray" from="0 360" to="360 360" dur="0.8s" fill="freeze" />
        </path>
    );
  });

  return (
    <div className="flex items-center gap-4">
        <svg height={size} width={size} viewBox={`-50 -50 100 100`} transform="rotate(-90)">
            {slices}
        </svg>
        <div className="text-xs space-y-1">
            {data.map((item, index) => (
                <div key={item.name} className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                    <span className="ml-2 font-semibold text-gray-500 dark:text-gray-400">({((item.value / total) * 100).toFixed(0)}%)</span>
                </div>
            ))}
        </div>
    </div>
  );
};

export default PieChart;
