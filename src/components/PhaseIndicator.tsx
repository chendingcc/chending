import React from 'react';
import { Phase, PhaseAssessment } from '../types';

interface PhaseIndicatorProps {
  phase: PhaseAssessment;
  compact?: boolean;
}

const PHASE_CONFIG: Record<Phase, { label: string; color: string; bg: string; border: string }> = {
  0: { label: 'Latent', color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-300' },
  1: { label: 'Emergence', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300' },
  2: { label: 'Acceleration', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-300' },
  3: { label: 'Mainstream', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300' },
};

const TREND_ARROW: Record<string, string> = {
  advancing: '\u2197',   // ↗
  stable: '\u2192',      // →
  retreating: '\u2198',  // ↘
};

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({ phase, compact = false }) => {
  const config = PHASE_CONFIG[phase.currentPhase];

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color} border ${config.border}`}>
        P{phase.currentPhase}
        <span className="opacity-70">{TREND_ARROW[phase.phaseTrend]}</span>
      </span>
    );
  }

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-3`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold ${config.color}`}>
          Phase {phase.currentPhase}: {config.label}
        </span>
        <span className="text-xs text-gray-500">
          {TREND_ARROW[phase.phaseTrend]} {phase.phaseTrend}
        </span>
      </div>

      {/* Phase bar */}
      <div className="flex gap-1 mb-2">
        {[0, 1, 2, 3].map(p => (
          <div
            key={p}
            className={`h-1.5 flex-1 rounded-full ${
              p <= phase.currentPhase
                ? p === phase.currentPhase
                  ? 'bg-indigo-600'
                  : 'bg-indigo-300'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <div className="text-xs text-gray-500">
        Confidence: {Math.round(phase.confidence * 100)}%
      </div>
    </div>
  );
};
