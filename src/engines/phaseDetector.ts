// ============================================================
// Phase Detector
// Determines which lifecycle phase a keyword is in (0-3)
// ============================================================

import { AnomalySignal, PhaseAssessment, Phase, SignalConfirmation } from '../types';

const PHASE_LABELS: Record<Phase, string> = {
  0: 'Latent',
  1: 'Emergence',
  2: 'Acceleration',
  3: 'Mainstream',
};

/**
 * Detect the current phase of a keyword based on anomaly signal
 * and optional confirmation data.
 */
export function detectPhase(
  signal: AnomalySignal,
  confirmation?: SignalConfirmation
): PhaseAssessment {
  const scores: [number, number, number, number] = [0, 0, 0, 0];
  const { metrics, signalType } = signal;
  const { zScore, acceleration, velocity } = metrics;

  // --- Google Trends signal ---
  if (zScore < 1.0) {
    scores[0] += 2;
  } else if (zScore < 2.0 && acceleration > 0) {
    scores[1] += 2;
  } else if (zScore < 3.0) {
    scores[2] += 2;
  } else {
    scores[3] += 2;
  }

  // --- Signal type indicator ---
  switch (signalType) {
    case 'jerk_spike':
      // Jerk spikes are early signals - Phase 1
      scores[1] += 1.5;
      break;
    case 'acceleration':
      // Sustained acceleration - Phase 1-2
      scores[1] += 1;
      scores[2] += 0.5;
      break;
    case 'velocity_breakout':
      // Already breaking out - Phase 2
      scores[2] += 1.5;
      break;
    case 'volume_surge':
      // High absolute volume - Phase 2-3
      scores[2] += 0.5;
      scores[3] += 1;
      break;
  }

  // --- Derivative direction ---
  if (velocity > 0 && acceleration > 0) {
    // Growing and accelerating: Phase 1-2
    scores[1] += 0.5;
    scores[2] += 0.5;
  } else if (velocity > 0 && acceleration <= 0) {
    // Growing but decelerating: Phase 2-3 (peaking)
    scores[2] += 0.5;
    scores[3] += 0.5;
  } else if (velocity <= 0) {
    // Declining: Phase 3 or back to 0
    scores[3] += 1;
  }

  // --- Confirmation level boost ---
  if (confirmation) {
    switch (confirmation.confirmationLevel) {
      case 0:
        scores[0] += 1;
        break;
      case 1:
        scores[1] += 1;
        break;
      case 2:
        scores[2] += 1;
        break;
      case 3:
        scores[3] += 1;
        break;
    }
  }

  // Determine phase
  const maxScore = Math.max(...scores);
  const currentPhase = scores.indexOf(maxScore) as Phase;

  // Confidence: how clearly one phase dominates
  const totalScore = scores.reduce((s, v) => s + v, 0);
  const confidence = totalScore > 0 ? maxScore / totalScore : 0;

  // Phase trend: compare adjacent phases
  let phaseTrend: 'advancing' | 'stable' | 'retreating' = 'stable';
  if (currentPhase < 3 && scores[currentPhase + 1] > scores[currentPhase] * 0.7) {
    phaseTrend = 'advancing';
  } else if (currentPhase > 0 && scores[currentPhase - 1] > scores[currentPhase] * 0.7) {
    phaseTrend = 'retreating';
  }

  return {
    keyword: signal.keyword,
    currentPhase,
    phaseScores: scores,
    confidence: Math.round(confidence * 100) / 100,
    phaseTrend,
    phaseLabel: PHASE_LABELS[currentPhase],
  };
}
