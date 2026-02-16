import React from 'react';
import { RACEScore } from '../types';

interface RACEScoreCardProps {
  race: RACEScore;
  compact?: boolean;
}

const RATING_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  strong_action: { label: 'Strong Action', color: 'text-red-700', bg: 'bg-red-50' },
  deep_research: { label: 'Deep Research', color: 'text-amber-700', bg: 'bg-amber-50' },
  monitor: { label: 'Monitor', color: 'text-green-700', bg: 'bg-green-50' },
  skip: { label: 'Skip', color: 'text-gray-500', bg: 'bg-gray-50' },
};

const FACTOR_LABELS = {
  responseTime: { label: 'R', full: 'Response Time', weight: '15%' },
  addressableGap: { label: 'A', full: 'Addressable Gap', weight: '30%' },
  categoryFit: { label: 'C', full: 'Category Fit', weight: '25%' },
  evidenceStrength: { label: 'E', full: 'Evidence', weight: '30%' },
};

function getScoreColor(score: number): string {
  if (score >= 4) return 'text-green-600';
  if (score >= 3) return 'text-amber-600';
  if (score >= 2) return 'text-orange-600';
  return 'text-red-600';
}

export const RACEScoreCard: React.FC<RACEScoreCardProps> = ({ race, compact = false }) => {
  const ratingCfg = RATING_CONFIG[race.rating];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold ${getScoreColor(race.composite)}`}>
          {race.composite.toFixed(1)}
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${ratingCfg.bg} ${ratingCfg.color} font-medium`}>
          {ratingCfg.label}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">RACE Score</h4>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${getScoreColor(race.composite)}`}>
            {race.composite.toFixed(2)}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${ratingCfg.bg} ${ratingCfg.color} font-semibold`}>
            {ratingCfg.label}
          </span>
        </div>
      </div>

      {/* Factor bars */}
      <div className="space-y-2">
        {(Object.entries(FACTOR_LABELS) as [keyof typeof FACTOR_LABELS, typeof FACTOR_LABELS[keyof typeof FACTOR_LABELS]][]).map(([key, info]) => {
          const value = race[key as keyof RACEScore] as number;
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-gray-500 w-4">{info.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    value >= 4 ? 'bg-green-500' :
                    value >= 3 ? 'bg-amber-500' :
                    value >= 2 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(value / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 w-8 text-right">{value.toFixed(1)}</span>
              <span className="text-xs text-gray-400 w-8">{info.weight}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
