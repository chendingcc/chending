import React from 'react';
import { TrendData } from '../types';

interface TrendChartProps {
  data: TrendData;
  onClick: (keyword: string) => void;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, onClick }) => {
  const { chartData, keyword } = data;
  
  // Find min and max values for scaling
  const values = chartData.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  // Create SVG path
  const width = 300;
  const height = 120;
  const padding = 10;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const pathData = chartData.map((point, index) => {
    const x = padding + (index / (chartData.length - 1)) * chartWidth;
    const y = height - padding - ((point.value - minValue) / range) * chartHeight;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Create gradient fill path
  const fillPath = pathData + ` L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(keyword)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">{keyword}</h3>
          <p className="text-xs text-gray-500">{data.category}</p>
        </div>
        <div className="text-right">
          <div className={`text-sm font-bold ${data.isExploding ? 'text-red-600' : 'text-green-600'}`}>
            {data.changePercentage > 0 ? '+' : ''}{data.changePercentage}%
          </div>
          <div className="text-xs text-gray-500">
            {data.searchVolume.toLocaleString()} searches
          </div>
        </div>
      </div>

      <div className="relative">
        <svg width={width} height={height} className="w-full h-auto">
          {/* Grid lines */}
          <defs>
            <linearGradient id={`gradient-${keyword}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={data.isExploding ? "#ef4444" : "#10b981"} stopOpacity="0.3" />
              <stop offset="100%" stopColor={data.isExploding ? "#ef4444" : "#10b981"} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={padding}
              y1={height - padding - ratio * chartHeight}
              x2={width - padding}
              y2={height - padding - ratio * chartHeight}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          {/* Fill area */}
          <path
            d={fillPath}
            fill={`url(#gradient-${keyword})`}
          />

          {/* Trend line */}
          <path
            d={pathData}
            fill="none"
            stroke={data.isExploding ? "#ef4444" : "#10b981"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {chartData.map((point, index) => {
            const x = padding + (index / (chartData.length - 1)) * chartWidth;
            const y = height - padding - ((point.value - minValue) / range) * chartHeight;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={data.isExploding ? "#ef4444" : "#10b981"}
                className="opacity-0 hover:opacity-100 transition-opacity"
              />
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
        <span>2004</span>
        <span className={`font-medium ${
          data.currentTrend === 'up' ? 'text-green-600' : 
          data.currentTrend === 'down' ? 'text-red-600' : 
          'text-gray-600'
        }`}>
          {data.currentTrend === 'up' ? '↗ Rising' : 
           data.currentTrend === 'down' ? '↘ Declining' : 
           '→ Stable'}
        </span>
        <span>2024</span>
      </div>
    </div>
  );
};