// ============================================================
// Report Generator
// Produces Markdown reports and DailyReport objects
// ============================================================

import { TrendEntry, DailyReport } from '../types';

const PHASE_EMOJI: Record<number, string> = {
  0: '🔵',
  1: '🟡',
  2: '🟠',
  3: '🔴',
};

const RATING_EMOJI: Record<string, string> = {
  strong_action: '🔴',
  deep_research: '🟡',
  monitor: '🟢',
  skip: '⚪',
};

/**
 * Build a DailyReport from analyzed trend entries.
 */
export function buildDailyReport(
  entries: TrendEntry[],
  totalScanned: number,
  apiCallsUsed: number,
  previousKeywords?: string[]
): DailyReport {
  const strongAction = entries.filter(e => e.race.rating === 'strong_action');
  const deepResearch = entries.filter(e => e.race.rating === 'deep_research');
  const monitor = entries.filter(e => e.race.rating === 'monitor');

  const currentKeywords = entries.map(e => e.keyword);
  const newSignals = previousKeywords
    ? currentKeywords.filter(k => !previousKeywords.includes(k))
    : currentKeywords;

  const resolved = previousKeywords
    ? previousKeywords.filter(k => !currentKeywords.includes(k))
    : [];

  return {
    date: new Date().toISOString().split('T')[0],
    generatedAt: new Date().toISOString(),
    totalScanned,
    anomaliesDetected: entries.length,
    confirmedSignals: entries.filter(e => e.confirmation.confirmationLevel >= 1).length,
    strongAction,
    deepResearch,
    monitor,
    newSignals,
    escalated: [], // TODO: compare with previous report tiers
    resolved,
    apiCallsUsed,
  };
}

/**
 * Generate a Markdown report string from a DailyReport.
 */
export function generateMarkdownReport(report: DailyReport): string {
  const lines: string[] = [];

  lines.push(`# Black Swan Trend Report — ${report.date}`);
  lines.push('');
  lines.push(`> Generated: ${new Date(report.generatedAt).toLocaleString()}`);
  lines.push('');

  // Overview
  lines.push('## Overview');
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Keywords Scanned | ${report.totalScanned} |`);
  lines.push(`| Anomalies Detected | ${report.anomaliesDetected} |`);
  lines.push(`| Confirmed Signals | ${report.confirmedSignals} |`);
  lines.push(`| API Calls Used | ${report.apiCallsUsed} |`);
  lines.push('');

  // Strong Action
  if (report.strongAction.length > 0) {
    lines.push('## 🔴 Strong Action (RACE >= 4.0)');
    lines.push('');
    report.strongAction.forEach((entry, i) => {
      lines.push(...renderEntry(entry, i + 1));
    });
  }

  // Deep Research
  if (report.deepResearch.length > 0) {
    lines.push('## 🟡 Deep Research (RACE 3.0-4.0)');
    lines.push('');
    report.deepResearch.forEach((entry, i) => {
      lines.push(...renderEntry(entry, i + 1));
    });
  }

  // Monitor
  if (report.monitor.length > 0) {
    lines.push('## 🟢 Monitor (RACE 2.0-3.0)');
    lines.push('');
    lines.push('| Keyword | Z-Score | Signal | Phase | RACE |');
    lines.push('|---------|---------|--------|-------|------|');
    report.monitor.forEach(entry => {
      lines.push(
        `| ${entry.keyword} ` +
        `| ${entry.anomaly.metrics.zScore.toFixed(1)} ` +
        `| ${entry.anomaly.signalType} ` +
        `| ${PHASE_EMOJI[entry.phase.currentPhase]} ${entry.phase.phaseLabel} ` +
        `| ${entry.race.composite.toFixed(1)} |`
      );
    });
    lines.push('');
  }

  // Delta
  if (report.newSignals.length > 0 || report.resolved.length > 0) {
    lines.push('## Changes from Previous');
    lines.push('');
    if (report.newSignals.length > 0) {
      lines.push(`**New:** ${report.newSignals.join(', ')}`);
    }
    if (report.resolved.length > 0) {
      lines.push(`**Resolved:** ${report.resolved.join(', ')}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function renderEntry(entry: TrendEntry, index: number): string[] {
  const lines: string[] = [];
  const { anomaly, phase, race, confirmation } = entry;

  lines.push(`### ${index}. ${entry.keyword}`);
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Z-Score | ${anomaly.metrics.zScore.toFixed(2)} |`);
  lines.push(`| Signal Type | ${anomaly.signalType} |`);
  lines.push(`| Signal Strength | ${anomaly.signalStrength}/100 |`);
  lines.push(`| Phase | ${PHASE_EMOJI[phase.currentPhase]} ${phase.phaseLabel} (${phase.phaseTrend}) |`);
  lines.push(`| Confirmation | Level ${confirmation.confirmationLevel} (${confirmation.compositeScore}/100) |`);
  lines.push(`| RACE | R=${race.responseTime} A=${race.addressableGap} C=${race.categoryFit} E=${race.evidenceStrength} → **${race.composite.toFixed(2)}** |`);
  lines.push(`| Rating | ${RATING_EMOJI[race.rating]} ${race.rating} |`);
  lines.push(`| Pulse? | ${anomaly.isPulse ? 'Yes (caution)' : 'No'} |`);
  lines.push(`| Seasonal? | ${anomaly.isSeasonal ? `Yes (adj. growth: ${anomaly.seasonalAdjustedGrowth}×)` : 'No'} |`);
  lines.push('');

  if (entry.summary) {
    lines.push(`> ${entry.summary}`);
    lines.push('');
  }

  return lines;
}
