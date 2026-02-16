import React from 'react';
import { Zap, Target, Signal, TrendingUp } from 'lucide-react';
import { DailyReport } from '../types';

interface ScanStatsProps {
  report: DailyReport | null;
}

export const ScanStats: React.FC<ScanStatsProps> = ({ report }) => {
  if (!report) return null;

  const stats = [
    {
      label: 'Anomalies',
      value: report.anomaliesDetected,
      icon: Zap,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    {
      label: 'Confirmed',
      value: report.confirmedSignals,
      icon: Signal,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      label: 'Phase 1 (Early)',
      value: [...report.strongAction, ...report.deepResearch, ...report.monitor]
        .filter(e => e.phase.currentPhase === 1).length,
      icon: Target,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
    },
    {
      label: 'Strong Action',
      value: report.strongAction.length,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} ${stat.border} border rounded-lg px-4 py-3 transition-all hover:shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color} mt-0.5`}>{stat.value}</p>
            </div>
            <div className={`${stat.color} p-2 rounded-lg ${stat.bg}`}>
              <stat.icon size={18} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
