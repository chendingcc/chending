// ============================================================
// Scan Orchestrator
// Ties all engines together: anomaly → confirm → phase → RACE → report
// ============================================================

import {
  TimeSeriesPoint,
  TrendEntry,
  DailyReport,
  ScanConfig,
  AnomalySignal,
} from '../types';
import { analyzeKeywords } from './anomalyDetector';
import { confirmSignal } from './signalConfirmer';
import { detectPhase } from './phaseDetector';
import { computeRACE } from './raceScorer';
import { buildDailyReport } from './reportGenerator';

export interface ScanInput {
  keyword: string;
  timeSeries: TimeSeriesPoint[];
  category?: string;
  relatedKeywords?: string[];
}

export interface ScanProgress {
  stage: 'anomaly' | 'confirm' | 'phase' | 'race' | 'report' | 'done';
  current: number;
  total: number;
  message: string;
}

/**
 * Run a full scan pipeline on a set of keywords.
 * Returns a DailyReport with all analyzed entries.
 */
export function runScan(
  inputs: ScanInput[],
  config: ScanConfig,
  onProgress?: (progress: ScanProgress) => void,
  previousKeywords?: string[]
): DailyReport {
  const totalKeywords = inputs.length;

  // --- Stage 1: Anomaly Detection ---
  onProgress?.({
    stage: 'anomaly',
    current: 0,
    total: totalKeywords,
    message: `Analyzing ${totalKeywords} keywords for anomalies...`,
  });

  const anomalies = analyzeKeywords(
    inputs.map(i => ({ keyword: i.keyword, timeSeries: i.timeSeries }))
  );

  onProgress?.({
    stage: 'anomaly',
    current: totalKeywords,
    total: totalKeywords,
    message: `Found ${anomalies.length} anomalies from ${totalKeywords} keywords`,
  });

  // --- Stage 2-4: Process each anomaly ---
  const entries: TrendEntry[] = [];

  anomalies.forEach((anomaly, index) => {
    const input = inputs.find(i => i.keyword === anomaly.keyword);

    // Stage 2: Confirm
    onProgress?.({
      stage: 'confirm',
      current: index + 1,
      total: anomalies.length,
      message: `Confirming: ${anomaly.keyword}`,
    });
    const confirmation = confirmSignal(anomaly);

    // Stage 3: Phase
    onProgress?.({
      stage: 'phase',
      current: index + 1,
      total: anomalies.length,
      message: `Phase detecting: ${anomaly.keyword}`,
    });
    const phase = detectPhase(anomaly, confirmation);

    // Stage 4: RACE
    onProgress?.({
      stage: 'race',
      current: index + 1,
      total: anomalies.length,
      message: `RACE scoring: ${anomaly.keyword}`,
    });
    const race = computeRACE(anomaly, confirmation, config);

    // Generate summary
    const summary = generateSummary(anomaly, phase, race);

    entries.push({
      keyword: anomaly.keyword,
      category: input?.category || categorize(anomaly.keyword),
      anomaly,
      confirmation,
      phase,
      race,
      chartData: anomaly.chartData,
      relatedKeywords: input?.relatedKeywords || [],
      summary,
    });
  });

  // Sort by RACE composite descending
  entries.sort((a, b) => b.race.composite - a.race.composite);

  // --- Stage 5: Build report ---
  onProgress?.({
    stage: 'report',
    current: 1,
    total: 1,
    message: 'Generating report...',
  });

  const report = buildDailyReport(entries, totalKeywords, 0, previousKeywords);

  onProgress?.({
    stage: 'done',
    current: 1,
    total: 1,
    message: `Done. ${entries.length} signals analyzed.`,
  });

  return report;
}

function generateSummary(
  anomaly: AnomalySignal,
  phase: { phaseLabel: string; phaseTrend: string },
  race: { composite: number; rating: string }
): string {
  const parts: string[] = [];

  parts.push(`${anomaly.signalType.replace('_', ' ')} detected (strength: ${anomaly.signalStrength}/100).`);
  parts.push(`Currently in ${phase.phaseLabel} phase (${phase.phaseTrend}).`);

  if (anomaly.isPulse) {
    parts.push('Warning: may be a pulse (short-lived spike).');
  }
  if (anomaly.isSeasonal) {
    parts.push(`Seasonal pattern detected (adjusted growth: ${anomaly.seasonalAdjustedGrowth}x).`);
  }

  parts.push(`RACE: ${race.composite.toFixed(1)} → ${race.rating}.`);

  return parts.join(' ');
}

function categorize(keyword: string): string {
  const lower = keyword.toLowerCase();
  const categories: Record<string, string[]> = {
    'Health & Wellness': ['health', 'medical', 'fitness', 'wellness', 'vitamin', 'supplement', 'therapy'],
    'Home & Living': ['home', 'kitchen', 'garden', 'furniture', 'decor', 'cleaning', 'organize'],
    'Tech & Gadgets': ['tech', 'gadget', 'electronic', 'smart', 'wireless', 'bluetooth', 'usb'],
    'Outdoor & Sport': ['outdoor', 'camping', 'hiking', 'sport', 'bike', 'fishing', 'travel'],
    'Beauty & Care': ['beauty', 'skin', 'hair', 'makeup', 'cosmetic', 'grooming'],
    'Pet': ['pet', 'dog', 'cat', 'animal'],
    'Kids & Baby': ['baby', 'kid', 'child', 'toy', 'learning'],
  };

  for (const [cat, terms] of Object.entries(categories)) {
    if (terms.some(t => lower.includes(t))) return cat;
  }
  return 'General';
}
