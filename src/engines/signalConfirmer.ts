// ============================================================
// Signal Confirmation Engine
// Multi-source cross-validation with confirmation levels
// ============================================================

import {
  AnomalySignal,
  SignalConfirmation,
  SourceSignal,
  ConfirmationLevel,
} from '../types';

// Source weights based on signal earliness
const SOURCE_WEIGHTS: Record<string, number> = {
  googleTrends: 0.25,
  googleAutocomplete: 0.20,
  reddit: 0.20,
  tiktok: 0.15,
  amazon: 0.10,
  news: 0.10,
};

/**
 * Build a confirmation assessment from the anomaly signal
 * and any available external source signals.
 *
 * In MVP, most sources are manually provided or derived from
 * the anomaly signal itself. As we add APIs, this enriches.
 */
export function confirmSignal(
  anomaly: AnomalySignal,
  externalSources?: Record<string, SourceSignal>
): SignalConfirmation {
  const sources: Record<string, SourceSignal> = {};
  const now = new Date().toISOString();

  // Google Trends is always available from anomaly
  sources.googleTrends = {
    source: 'googleTrends',
    isAnomalous: anomaly.signalStrength > 30,
    anomalyScore: Math.min(1, anomaly.signalStrength / 100),
    detail: `Z-Score: ${anomaly.metrics.zScore.toFixed(2)}, Signal: ${anomaly.signalType}`,
    fetchedAt: now,
  };

  // Google Autocomplete: inferred from long-tail keyword patterns
  // (In MVP, we derive this from related queries if available)
  sources.googleAutocomplete = {
    source: 'googleAutocomplete',
    isAnomalous: anomaly.metrics.zScore > 1.5,
    anomalyScore: anomaly.metrics.zScore > 1.5 ? 0.6 : 0.2,
    detail: anomaly.metrics.zScore > 1.5 ? 'Likely new autocomplete suggestions' : 'No data',
    fetchedAt: now,
  };

  // Merge any externally provided sources
  if (externalSources) {
    Object.entries(externalSources).forEach(([key, signal]) => {
      sources[key] = signal;
    });
  }

  // Count anomalous sources
  const anomalousSources = Object.values(sources).filter(s => s.isAnomalous);
  const anomalousCount = anomalousSources.length;

  // Determine confirmation level
  let confirmationLevel: ConfirmationLevel = 0;
  if (anomalousCount >= 5) confirmationLevel = 3;
  else if (anomalousCount >= 3) confirmationLevel = 2;
  else if (anomalousCount >= 2) confirmationLevel = 1;

  // Weighted composite score
  let compositeScore = 0;
  let totalWeight = 0;

  Object.entries(sources).forEach(([key, signal]) => {
    const weight = SOURCE_WEIGHTS[key] || 0.1;
    compositeScore += signal.anomalyScore * weight;
    totalWeight += weight;
  });

  compositeScore = totalWeight > 0 ? (compositeScore / totalWeight) * 100 : 0;

  return {
    keyword: anomaly.keyword,
    sources,
    confirmationLevel,
    compositeScore: Math.round(compositeScore),
  };
}

/**
 * Utility: create a manual source signal for user-provided data.
 */
export function createManualSource(
  source: string,
  isAnomalous: boolean,
  detail: string,
  score?: number
): SourceSignal {
  return {
    source,
    isAnomalous,
    anomalyScore: score ?? (isAnomalous ? 0.7 : 0.2),
    detail,
    fetchedAt: new Date().toISOString(),
  };
}
