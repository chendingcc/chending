// ============================================================
// Anomaly Detection Engine
// Three-derivative model + Z-Score + Seasonal filter + Pulse detection
// ============================================================

import {
  TimeSeriesPoint,
  DerivativeMetrics,
  AnomalySignal,
  SignalType,
} from '../types';

// --- Math utilities ---

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function stdDev(values: number[], avg?: number): number {
  if (values.length < 2) return 0;
  const m = avg ?? mean(values);
  const variance = values.reduce((s, v) => s + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

// --- Derivative calculation ---

/** Compute first-order differences of a numeric series */
function diff(values: number[]): number[] {
  return values.slice(1).map((v, i) => v - values[i]);
}

/**
 * Compute derivative metrics for the most recent window of a time series.
 * Uses the last `window` points of `values` for baseline stats,
 * and the last few points for instantaneous derivatives.
 */
export function computeDerivatives(
  values: number[],
  window: number = 52, // default: ~1 year of weekly data
): DerivativeMetrics {
  if (values.length < 4) {
    return { velocity: 0, acceleration: 0, jerk: 0, zScore: 0, mean: 0, stdDev: 0 };
  }

  // Use last `window` points for baseline
  const baseline = values.slice(-window);
  const m = mean(baseline);
  const sd = stdDev(baseline, m);

  // Derivatives from last 4 points
  const tail = values.slice(-4);
  const v1 = diff(tail);          // 3 velocity values
  const v2 = diff(v1);            // 2 acceleration values
  const v3 = diff(v2);            // 1 jerk value

  const velocity = v1[v1.length - 1];
  const acceleration = v2[v2.length - 1];
  const jerk = v3[0];

  const current = values[values.length - 1];
  const zScore = sd > 0 ? (current - m) / sd : 0;

  return { velocity, acceleration, jerk, zScore, mean: m, stdDev: sd };
}

// --- Signal classification ---

export function classifySignal(metrics: DerivativeMetrics): { type: SignalType; strength: number } {
  const { velocity, acceleration, jerk, zScore, stdDev: sd } = metrics;

  // Jerk spike: third derivative exceeds 3σ of velocity series
  // (approximate: if jerk absolute value is large relative to typical change)
  const jerkThreshold = sd > 0 ? Math.abs(jerk) / sd : 0;
  if (jerkThreshold > 3) {
    return { type: 'jerk_spike', strength: Math.min(100, jerkThreshold * 15) };
  }

  // Acceleration positive for extended period
  if (acceleration > 0 && velocity > 0 && zScore > 1) {
    const strength = Math.min(100, (zScore * 20) + (acceleration > 0 ? 20 : 0));
    return { type: 'acceleration', strength };
  }

  // Velocity breakout: growth rate > 3× historical mean velocity
  if (velocity > 0 && zScore > 2) {
    return { type: 'velocity_breakout', strength: Math.min(100, zScore * 25) };
  }

  // Volume surge: absolute value high
  if (zScore > 1.5) {
    return { type: 'volume_surge', strength: Math.min(100, zScore * 20) };
  }

  return { type: 'volume_surge', strength: 0 };
}

// --- Seasonal filter ---

/**
 * Detect if a keyword's current spike is seasonal.
 * Compares current window to same period in prior years.
 * Returns { isSeasonal, seasonalAdjustedGrowth }.
 *
 * `yearlySlices` should be an array of arrays,
 * each containing the same calendar-window values from previous years.
 */
export function detectSeasonality(
  currentWindow: number[],
  yearlySlices: number[][]
): { isSeasonal: boolean; seasonalAdjustedGrowth: number } {
  if (yearlySlices.length === 0 || currentWindow.length === 0) {
    return { isSeasonal: false, seasonalAdjustedGrowth: 0 };
  }

  const currentMean = mean(currentWindow);
  const historicalMeans = yearlySlices.map(s => mean(s));
  const historicalAvg = mean(historicalMeans);

  if (historicalAvg === 0) {
    return { isSeasonal: false, seasonalAdjustedGrowth: currentMean > 0 ? 999 : 0 };
  }

  const seasonalAdjustedGrowth = (currentMean - historicalAvg) / historicalAvg;

  // Check correlation with last year's same period
  if (yearlySlices.length > 0 && yearlySlices[0].length === currentWindow.length) {
    const lastYear = yearlySlices[0];
    const correlation = pearsonCorrelation(currentWindow, lastYear);

    // High correlation with last year AND growth < 2× means seasonal
    if (correlation > 0.7 && seasonalAdjustedGrowth < 2.0) {
      return { isSeasonal: true, seasonalAdjustedGrowth };
    }
  }

  return { isSeasonal: false, seasonalAdjustedGrowth };
}

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 3) return 0;

  const mx = mean(x.slice(0, n));
  const my = mean(y.slice(0, n));

  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }

  const denom = Math.sqrt(dx2 * dy2);
  return denom > 0 ? num / denom : 0;
}

// --- Pulse detection ---

/**
 * Detect if a recent spike is a pulse (sharp up then down) vs a trend.
 * Looks at the last `window` data points.
 */
export function detectPulse(values: number[], window: number = 14): boolean {
  if (values.length < window) return false;

  const recent = values.slice(-window);
  const peak = Math.max(...recent);
  const peakIdx = recent.indexOf(peak);

  // Peak should be in first 60% of window to have post-peak data
  if (peakIdx > window * 0.6 || peakIdx < 1) return false;

  const afterPeak = recent.slice(peakIdx + 1);
  if (afterPeak.length < 2) return false;

  const afterPeakMean = mean(afterPeak);

  // Pulse: drops below 30% of peak after the spike
  return afterPeakMean < peak * 0.3;
}

// --- Main: analyze a single keyword ---

export function analyzeKeyword(
  keyword: string,
  timeSeries: TimeSeriesPoint[],
  yearlySlices?: number[][] // same-period data from prior years
): AnomalySignal | null {
  const values = timeSeries.map(p => p.value);
  if (values.length < 8) return null;

  const metrics = computeDerivatives(values);
  const { type, strength } = classifySignal(metrics);

  // Below threshold: not anomalous
  if (strength < 15) return null;

  const isPulse = detectPulse(values);

  // Seasonal check
  const currentWindow = values.slice(-4);
  const { isSeasonal, seasonalAdjustedGrowth } = detectSeasonality(
    currentWindow,
    yearlySlices || []
  );

  // Skip pure seasonal non-anomalies
  if (isSeasonal && seasonalAdjustedGrowth < 2.0) return null;

  return {
    keyword,
    detectedAt: new Date().toISOString(),
    metrics,
    signalType: type,
    signalStrength: Math.round(strength),
    isPulse,
    isSeasonal,
    seasonalAdjustedGrowth: Math.round(seasonalAdjustedGrowth * 100) / 100,
    chartData: timeSeries,
  };
}

// --- Batch: analyze multiple keywords ---

export function analyzeKeywords(
  keywordData: { keyword: string; timeSeries: TimeSeriesPoint[] }[]
): AnomalySignal[] {
  const signals: AnomalySignal[] = [];

  for (const { keyword, timeSeries } of keywordData) {
    const signal = analyzeKeyword(keyword, timeSeries);
    if (signal) {
      signals.push(signal);
    }
  }

  // Sort by signal strength descending
  signals.sort((a, b) => b.signalStrength - a.signalStrength);
  return signals;
}
