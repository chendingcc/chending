import React from 'react';
import { TrendChart } from './TrendChart';
import { TrendData } from '../types';

interface TrendGridProps {
  trends: TrendData[];
  onTrendClick: (keyword: string) => void;
}

export const TrendGrid: React.FC<TrendGridProps> = ({ trends, onTrendClick }) => {
  const explodingTrends = trends.filter(t => t.isExploding);
  const otherTrends = trends.filter(t => !t.isExploding);

  return (
    <div className="space-y-8">
      {/* Exploding Trends Section */}
      {explodingTrends.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-800">🚀 Exploding Trends</h2>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {explodingTrends.length} Black Swan Candidates
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {explodingTrends.map((trend, index) => (
              <TrendChart
                key={`exploding-${index}`}
                data={trend}
                onClick={onTrendClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Trends Section */}
      {otherTrends.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-800">📊 Other Trends</h2>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {otherTrends.length} Keywords
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {otherTrends.map((trend, index) => (
              <TrendChart
                key={`other-${index}`}
                data={trend}
                onClick={onTrendClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};