// ============================================================
// Black Swan Trend Radar - Core Types
// ============================================================

// --- Existing types (kept for backward compat) ---

export interface TrendData {
  keyword: string;
  searchVolume: number;
  changePercentage: number;
  isExploding: boolean;
  category: string;
  chartData: TimeSeriesPoint[];
  peakDate: string;
  currentTrend: 'up' | 'down' | 'stable';
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface SearchSuggestion {
  keyword: string;
  category: string;
  description: string;
}

export interface BlackSwanCategory {
  name: string;
  keywords: string[];
}

export interface AIKeyword {
  name: string;
  relevanceScore: number;
  businessValue: 'High' | 'Medium' | 'Low';
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  trendPrediction: 'Explosive' | 'Rising' | 'Stable' | 'Declining';
  applicationField: string;
  description: string;
  opportunities: string[];
  risks: string[];
}

export interface AIBlackSwanCategory {
  name: string;
  keywords: AIKeyword[];
  totalKeywords: number;
  avgRelevanceScore: number;
  highRiskCount: number;
}

// --- New: Anomaly Detection ---

export type SignalType = 'jerk_spike' | 'acceleration' | 'velocity_breakout' | 'volume_surge';

export interface DerivativeMetrics {
  velocity: number;         // first derivative: growth rate
  acceleration: number;     // second derivative: change in growth rate
  jerk: number;             // third derivative: change in acceleration
  zScore: number;           // how many std devs from mean
  mean: number;             // historical mean
  stdDev: number;           // historical std deviation
}

export interface AnomalySignal {
  keyword: string;
  detectedAt: string;       // ISO date

  // derivative metrics
  metrics: DerivativeMetrics;

  // signal classification
  signalType: SignalType;
  signalStrength: number;   // 0-100

  // filters
  isPulse: boolean;
  isSeasonal: boolean;
  seasonalAdjustedGrowth: number;

  // raw data
  chartData: TimeSeriesPoint[];
}

// --- New: Signal Confirmation ---

export type ConfirmationLevel = 0 | 1 | 2 | 3;

export interface SourceSignal {
  source: string;
  isAnomalous: boolean;
  anomalyScore: number;     // 0-1
  detail: string;
  fetchedAt: string;
}

export interface SignalConfirmation {
  keyword: string;
  sources: Record<string, SourceSignal>;
  confirmationLevel: ConfirmationLevel;
  compositeScore: number;   // 0-100
}

// --- New: Phase Detection ---

export type Phase = 0 | 1 | 2 | 3;

export interface PhaseAssessment {
  keyword: string;
  currentPhase: Phase;
  phaseScores: [number, number, number, number];
  confidence: number;       // 0-1
  phaseTrend: 'advancing' | 'stable' | 'retreating';
  phaseLabel: string;       // "Latent" | "Emergence" | "Acceleration" | "Mainstream"
}

// --- New: RACE Scoring ---

export type RACERating = 'strong_action' | 'deep_research' | 'monitor' | 'skip';

export interface RACEScore {
  keyword: string;
  responseTime: number;       // R: 1-5
  addressableGap: number;     // A: 1-5
  categoryFit: number;        // C: 1-5
  evidenceStrength: number;   // E: 1-5
  composite: number;          // weighted total
  rating: RACERating;
}

// --- New: Trend Entry (full analysis for one keyword) ---

export interface TrendEntry {
  keyword: string;
  category: string;
  anomaly: AnomalySignal;
  confirmation: SignalConfirmation;
  phase: PhaseAssessment;
  race: RACEScore;
  chartData: TimeSeriesPoint[];
  relatedKeywords: string[];
  summary: string;
}

// --- New: Daily Report ---

export interface DailyReport {
  date: string;
  generatedAt: string;

  // stats
  totalScanned: number;
  anomaliesDetected: number;
  confirmedSignals: number;

  // results by tier
  strongAction: TrendEntry[];
  deepResearch: TrendEntry[];
  monitor: TrendEntry[];

  // delta from previous
  newSignals: string[];
  escalated: string[];
  resolved: string[];

  // api usage
  apiCallsUsed: number;
}

// --- New: Scan Config ---

export interface ScanConfig {
  seedKeywords: string[];
  supplyChainMode: 'dropshipping' | 'pod' | 'wholesale' | 'oem' | 'brand';
  maxApiCalls: number;
  includeCategories: string[];
}
