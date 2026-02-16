import React, { useState, useMemo } from 'react';
import {
  ChevronDown, ChevronUp, ArrowUpDown, ArrowUp, ArrowDown,
  AlertTriangle, Zap, TrendingUp, Activity, ExternalLink, Download,
} from 'lucide-react';
import { TrendEntry, DailyReport } from '../types';
import { PhaseIndicator } from './PhaseIndicator';
import { RACEScoreCard } from './RACEScoreCard';

interface SignalTableProps {
  report: DailyReport | null;
  onExportMarkdown: () => void;
}

type SortField = 'keyword' | 'zScore' | 'strength' | 'phase' | 'race';
type SortDir = 'asc' | 'desc';
type Filter = 'all' | 'strong_action' | 'deep_research' | 'monitor';

const SIGNAL_ICON: Record<string, React.ReactNode> = {
  jerk_spike: <Zap size={14} className="text-red-500" />,
  acceleration: <TrendingUp size={14} className="text-orange-500" />,
  velocity_breakout: <Activity size={14} className="text-amber-500" />,
  volume_surge: <AlertTriangle size={14} className="text-blue-500" />,
};

export const SignalTable: React.FC<SignalTableProps> = ({ report, onExportMarkdown }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('race');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filter, setFilter] = useState<Filter>('all');

  const allEntries = useMemo(() => {
    if (!report) return [];
    return [...report.strongAction, ...report.deepResearch, ...report.monitor];
  }, [report]);

  const filteredEntries = useMemo(() => {
    let entries = allEntries;
    if (filter !== 'all') {
      entries = entries.filter(e => e.race.rating === filter);
    }

    return [...entries].sort((a, b) => {
      let av: number, bv: number;
      switch (sortField) {
        case 'keyword':
          return sortDir === 'asc'
            ? a.keyword.localeCompare(b.keyword)
            : b.keyword.localeCompare(a.keyword);
        case 'zScore':
          av = a.anomaly.metrics.zScore;
          bv = b.anomaly.metrics.zScore;
          break;
        case 'strength':
          av = a.anomaly.signalStrength;
          bv = b.anomaly.signalStrength;
          break;
        case 'phase':
          av = a.phase.currentPhase;
          bv = b.phase.currentPhase;
          break;
        case 'race':
        default:
          av = a.race.composite;
          bv = b.race.composite;
          break;
      }
      return sortDir === 'asc' ? av - bv : bv - av;
    });
  }, [allEntries, filter, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="text-gray-400" />;
    return sortDir === 'asc'
      ? <ArrowUp size={12} className="text-indigo-600" />
      : <ArrowDown size={12} className="text-indigo-600" />;
  };

  if (!report || allEntries.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <Zap size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Signals Yet</h3>
        <p className="text-sm text-gray-500">Run a scan to discover anomalous trends.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as Filter)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Signals ({allEntries.length})</option>
            <option value="strong_action">Strong Action ({report.strongAction.length})</option>
            <option value="deep_research">Deep Research ({report.deepResearch.length})</option>
            <option value="monitor">Monitor ({report.monitor.length})</option>
          </select>
          <span className="text-xs text-gray-500">
            {filteredEntries.length} results
          </span>
        </div>
        <button
          onClick={onExportMarkdown}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <Download size={14} />
          Export Report
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('keyword')}
              >
                <div className="flex items-center gap-1">Keyword <SortIcon field="keyword" /></div>
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase w-28">
                Signal
              </th>
              <th
                className="px-3 py-2.5 text-center text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 w-20"
                onClick={() => handleSort('zScore')}
              >
                <div className="flex items-center justify-center gap-1">Z <SortIcon field="zScore" /></div>
              </th>
              <th
                className="px-3 py-2.5 text-center text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 w-24"
                onClick={() => handleSort('strength')}
              >
                <div className="flex items-center justify-center gap-1">Strength <SortIcon field="strength" /></div>
              </th>
              <th
                className="px-3 py-2.5 text-center text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 w-28"
                onClick={() => handleSort('phase')}
              >
                <div className="flex items-center justify-center gap-1">Phase <SortIcon field="phase" /></div>
              </th>
              <th
                className="px-3 py-2.5 text-center text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 w-32"
                onClick={() => handleSort('race')}
              >
                <div className="flex items-center justify-center gap-1">RACE <SortIcon field="race" /></div>
              </th>
              <th className="px-3 py-2.5 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEntries.map((entry) => (
              <React.Fragment key={entry.keyword}>
                <tr
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    expandedRow === entry.keyword ? 'bg-indigo-50' : ''
                  }`}
                  onClick={() => setExpandedRow(
                    expandedRow === entry.keyword ? null : entry.keyword
                  )}
                >
                  {/* Keyword */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm text-gray-900">{entry.keyword}</div>
                    <div className="text-xs text-gray-500">{entry.category}</div>
                  </td>

                  {/* Signal type */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      {SIGNAL_ICON[entry.anomaly.signalType]}
                      <span className="text-xs text-gray-600">
                        {entry.anomaly.signalType.replace('_', ' ')}
                      </span>
                    </div>
                    {entry.anomaly.isPulse && (
                      <span className="text-xs text-orange-500 font-medium">pulse</span>
                    )}
                  </td>

                  {/* Z-Score */}
                  <td className="px-3 py-3 text-center">
                    <span className={`text-sm font-mono font-bold ${
                      entry.anomaly.metrics.zScore > 3 ? 'text-red-600' :
                      entry.anomaly.metrics.zScore > 2 ? 'text-orange-600' :
                      entry.anomaly.metrics.zScore > 1 ? 'text-amber-600' :
                      'text-gray-600'
                    }`}>
                      {entry.anomaly.metrics.zScore.toFixed(1)}
                    </span>
                  </td>

                  {/* Strength */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-12 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            entry.anomaly.signalStrength > 70 ? 'bg-red-500' :
                            entry.anomaly.signalStrength > 40 ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${entry.anomaly.signalStrength}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-mono">
                        {entry.anomaly.signalStrength}
                      </span>
                    </div>
                  </td>

                  {/* Phase */}
                  <td className="px-3 py-3 text-center">
                    <PhaseIndicator phase={entry.phase} compact />
                  </td>

                  {/* RACE */}
                  <td className="px-3 py-3 text-center">
                    <RACEScoreCard race={entry.race} compact />
                  </td>

                  {/* Expand arrow */}
                  <td className="px-3 py-3 text-center">
                    {expandedRow === entry.keyword
                      ? <ChevronUp size={14} className="text-gray-400" />
                      : <ChevronDown size={14} className="text-gray-400" />
                    }
                  </td>
                </tr>

                {/* Expanded detail */}
                {expandedRow === entry.keyword && (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                      <SignalDetail entry={entry} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Inline expanded detail ---

const SignalDetail: React.FC<{ entry: TrendEntry }> = ({ entry }) => {
  const { anomaly, phase, race, confirmation } = entry;
  const values = anomaly.chartData.map(p => p.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  // Simple SVG sparkline
  const w = 600;
  const h = 100;
  const pad = 4;
  const pathD = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - 2 * pad);
      const y = h - pad - ((v - minVal) / range) * (h - 2 * pad);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chart */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700">Trend Timeline</h4>
            <a
              href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(entry.keyword)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
            >
              Google Trends <ExternalLink size={10} />
            </a>
          </div>
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
            <path
              d={pathD + ` L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`}
              fill="url(#chart-grad)"
              opacity={0.3}
            />
            <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Derivative metrics */}
          <div className="grid grid-cols-4 gap-3 mt-3">
            {[
              { label: 'Velocity', value: anomaly.metrics.velocity.toFixed(1), desc: '1st derivative' },
              { label: 'Acceleration', value: anomaly.metrics.acceleration.toFixed(1), desc: '2nd derivative' },
              { label: 'Jerk', value: anomaly.metrics.jerk.toFixed(1), desc: '3rd derivative' },
              { label: 'Z-Score', value: anomaly.metrics.zScore.toFixed(2), desc: 'std devs from mean' },
            ].map(m => (
              <div key={m.label} className="text-center">
                <div className="text-xs text-gray-500">{m.label}</div>
                <div className="text-sm font-bold text-gray-800">{m.value}</div>
                <div className="text-xs text-gray-400">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-lg p-3">
          <p className="text-sm text-indigo-800">{entry.summary}</p>
        </div>
      </div>

      {/* Right panel: Phase + RACE */}
      <div className="space-y-3">
        <PhaseIndicator phase={phase} />
        <RACEScoreCard race={race} />

        {/* Confirmation */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Signal Confirmation (Level {confirmation.confirmationLevel})
          </h4>
          <div className="space-y-1">
            {Object.values(confirmation.sources).map(src => (
              <div key={src.source} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{src.source}</span>
                <span className={src.isAnomalous ? 'text-red-600 font-medium' : 'text-gray-400'}>
                  {src.isAnomalous ? `anomalous (${(src.anomalyScore * 100).toFixed(0)}%)` : 'normal'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Flags */}
        <div className="flex gap-2">
          {anomaly.isPulse && (
            <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full">
              Pulse detected
            </span>
          )}
          {anomaly.isSeasonal && (
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
              Seasonal ({anomaly.seasonalAdjustedGrowth}x adj.)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
