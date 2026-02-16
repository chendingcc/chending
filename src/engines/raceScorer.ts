// ============================================================
// RACE Scoring Model
// Response-Addressable-Category-Evidence scoring for DTC products
// ============================================================

import {
  AnomalySignal,
  SignalConfirmation,
  RACEScore,
  RACERating,
  ScanConfig,
} from '../types';

// Weights from PRD
const WEIGHTS = {
  R: 0.15,
  A: 0.30,
  C: 0.25,
  E: 0.30,
};

// Response time scores based on supply chain mode
const RESPONSE_TIME_SCORES: Record<string, number> = {
  dropshipping: 5,
  pod: 4,
  wholesale: 3,
  oem: 2,
  brand: 1,
};

function getRating(composite: number): RACERating {
  if (composite >= 4.0) return 'strong_action';
  if (composite >= 3.0) return 'deep_research';
  if (composite >= 2.0) return 'monitor';
  return 'skip';
}

/**
 * Compute the RACE score for a keyword.
 *
 * R (Response Time) - from user's supply chain config
 * A (Addressable Gap) - estimated from signal strength (placeholder for Amazon/Shopping data)
 * C (Category Fit) - estimated heuristically (can be overridden by user)
 * E (Evidence Strength) - from confirmation level
 */
export function computeRACE(
  anomaly: AnomalySignal,
  confirmation: SignalConfirmation,
  config: ScanConfig,
  overrides?: { addressableGap?: number; categoryFit?: number }
): RACEScore {
  // R - Response Time (from config)
  const responseTime = RESPONSE_TIME_SCORES[config.supplyChainMode] || 3;

  // A - Addressable Gap (estimated)
  // In MVP, we estimate from signal strength: stronger signal with lower z-score
  // means less competition has noticed yet
  let addressableGap = overrides?.addressableGap ?? estimateAddressableGap(anomaly);

  // C - Category Fit (estimated heuristically)
  let categoryFit = overrides?.categoryFit ?? estimateCategoryFit(anomaly.keyword);

  // E - Evidence Strength (from confirmation)
  const evidenceStrength = confirmationToEvidence(confirmation.confirmationLevel);

  // Composite
  const composite =
    responseTime * WEIGHTS.R +
    addressableGap * WEIGHTS.A +
    categoryFit * WEIGHTS.C +
    evidenceStrength * WEIGHTS.E;

  return {
    keyword: anomaly.keyword,
    responseTime,
    addressableGap: Math.round(addressableGap * 10) / 10,
    categoryFit: Math.round(categoryFit * 10) / 10,
    evidenceStrength: Math.round(evidenceStrength * 10) / 10,
    composite: Math.round(composite * 100) / 100,
    rating: getRating(composite),
  };
}

function estimateAddressableGap(anomaly: AnomalySignal): number {
  // Early-phase signals (low z-score but high acceleration) suggest less competition
  const { zScore, acceleration } = anomaly.metrics;

  if (zScore < 1.5 && acceleration > 0) return 4.5; // Very early, big gap
  if (zScore < 2.0) return 4.0;
  if (zScore < 2.5) return 3.5;
  if (zScore < 3.0) return 3.0;
  return 2.0; // High z-score = many people already know
}

function estimateCategoryFit(keyword: string): number {
  const lower = keyword.toLowerCase();

  // DTC-friendly indicators
  const positiveSignals = [
    'portable', 'mini', 'compact', 'home', 'personal', 'kit', 'set',
    'wireless', 'rechargeable', 'foldable', 'travel', 'outdoor',
  ];

  // DTC-unfriendly indicators
  const negativeSignals = [
    'industrial', 'commercial', 'enterprise', 'professional',
    'wholesale', 'bulk', 'software', 'service', 'platform',
  ];

  let score = 3.0; // default middle

  for (const signal of positiveSignals) {
    if (lower.includes(signal)) { score += 0.5; break; }
  }
  for (const signal of negativeSignals) {
    if (lower.includes(signal)) { score -= 1.0; break; }
  }

  return Math.max(1, Math.min(5, score));
}

function confirmationToEvidence(level: number): number {
  switch (level) {
    case 0: return 1.0;
    case 1: return 2.5;
    case 2: return 4.0;
    case 3: return 5.0;
    default: return 1.0;
  }
}
