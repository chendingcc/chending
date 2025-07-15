import React from 'react';
import { TrendingUp, TrendingDown, Activity, Eye } from 'lucide-react';
import { TrendData } from '../types';

interface StatsOverviewProps {
  trends: TrendData[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ trends }) => {
  const explodingCount = trends.filter(t => t.isExploding).length;
  const totalSearchVolume = trends.reduce((sum, t) => sum + t.searchVolume, 0);
  const avgChangePercentage = Math.round(trends.reduce((sum, t) => sum + t.changePercentage, 0) / trends.length);
  const risingTrends = trends.filter(t => t.currentTrend === 'up').length;

  const stats = [
    {
      label: 'Black Swan Candidates',
      value: explodingCount,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      label: 'Total Search Volume',
      value: totalSearchVolume.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Average Growth',
      value: `${avgChangePercentage}%`,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Rising Trends',
      value: risingTrends,
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-6 transition-all hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};