#!/usr/bin/env npx tsx
// ============================================================
// Black Swan Trend Radar — CLI Daily Scan
//
// Usage:
//   npx tsx scripts/daily-scan.ts
//   npx tsx scripts/daily-scan.ts --keywords "cold plunge,home gym,pulse oximeter"
//   npx tsx scripts/daily-scan.ts --category "Pandemic & Health"
//   npx tsx scripts/daily-scan.ts --backtest  (run known black swans)
//
// Outputs a Markdown report to stdout or a file.
// ============================================================

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Import engines (relative to project root) ---
// We import the source directly; tsx handles TypeScript.
import { analyzeKeywords } from '../src/engines/anomalyDetector.js';
import { confirmSignal } from '../src/engines/signalConfirmer.js';
import { detectPhase } from '../src/engines/phaseDetector.js';
import { computeRACE } from '../src/engines/raceScorer.js';
import { buildDailyReport, generateMarkdownReport } from '../src/engines/reportGenerator.js';
import type {
  TimeSeriesPoint,
  TrendEntry,
  ScanConfig,
  DailyReport,
  AnomalySignal,
} from '../src/types/index.js';

// --- Config ---

const DEFAULT_SUPPLY_CHAIN: ScanConfig['supplyChainMode'] = 'dropshipping';
const REPORTS_DIR = resolve(__dirname, '..', 'reports');

// --- Known black swan keywords for backtest ---
const BACKTEST_KEYWORDS = [
  'face mask', 'home gym', 'resistance bands', 'webcam', 'pulse oximeter',
  'air purifier', 'standing desk', 'hand sanitizer', 'bidets', 'bread maker',
  'ring light', 'blue light glasses', 'cold plunge', 'portable monitor',
  'ergonomic chair', 'sourdough starter', 'exercise bike', 'air fryer',
  'indoor grow light', 'water flosser',
];

// --- Parse CLI args ---

interface CLIArgs {
  keywords: string[];
  category: string | null;
  backtest: boolean;
  output: string | null; // file path or null for stdout
  supplyChain: ScanConfig['supplyChainMode'];
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const result: CLIArgs = {
    keywords: [],
    category: null,
    backtest: false,
    output: null,
    supplyChain: DEFAULT_SUPPLY_CHAIN,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--keywords':
      case '-k':
        result.keywords = (args[++i] || '').split(',').map(k => k.trim()).filter(Boolean);
        break;
      case '--category':
      case '-c':
        result.category = args[++i] || null;
        break;
      case '--backtest':
      case '-b':
        result.backtest = true;
        break;
      case '--output':
      case '-o':
        result.output = args[++i] || null;
        break;
      case '--supply-chain':
      case '-s':
        result.supplyChain = (args[++i] || DEFAULT_SUPPLY_CHAIN) as ScanConfig['supplyChainMode'];
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
    }
  }

  return result;
}

function printHelp() {
  console.log(`
Black Swan Trend Radar — CLI Daily Scan

Usage:
  npx tsx scripts/daily-scan.ts [options]

Options:
  -k, --keywords "kw1,kw2,..."    Comma-separated seed keywords
  -c, --category "Category Name"  Load keywords from a category
  -b, --backtest                   Run with known black swan keywords
  -o, --output <path>              Write report to file (default: stdout)
  -s, --supply-chain <mode>        dropshipping|pod|wholesale|oem|brand
  -h, --help                       Show this help

Examples:
  npx tsx scripts/daily-scan.ts --backtest
  npx tsx scripts/daily-scan.ts -k "cold plunge,home gym" -o reports/today.md
  npx tsx scripts/daily-scan.ts -c "Pandemic & Health"
`);
}

// --- Load mock data for keywords (since we can't call SerpApi in pure CLI without fetch) ---

function loadMockData(): Map<string, TimeSeriesPoint[]> {
  // Dynamic import of mock data
  // We generate synthetic data for any keyword
  const map = new Map<string, TimeSeriesPoint[]>();
  return map;
}

function generateTimeSeries(keyword: string): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  const hash = simpleHash(keyword);
  const pattern = hash % 5;
  const currentYear = new Date().getFullYear();

  for (let year = 2004; year <= currentYear; year++) {
    const progress = (year - 2004) / (currentYear - 2004);
    let value: number;

    switch (pattern) {
      case 0: // Explosive end (black swan pattern)
        value = progress < 0.75
          ? 10 + progress * 15 + seededRandom(hash + year) * 5
          : 25 + Math.pow((progress - 0.75) * 4, 2) * 75;
        break;
      case 1: // Double peak
        value = 20 + Math.sin(progress * Math.PI * 2) * 30 +
          (progress > 0.8 ? (progress - 0.8) * 200 : 0);
        break;
      case 2: // Gradual rise then spike
        value = 15 + progress * 30 +
          (progress > 0.85 ? (progress - 0.85) * 400 : 0) +
          seededRandom(hash + year) * 8;
        break;
      case 3: // Volatile
        value = 30 + Math.sin(progress * Math.PI * 6) * 20 + seededRandom(hash + year) * 15;
        break;
      default: // Steady
        value = 20 + progress * 40 + seededRandom(hash + year) * 6;
    }

    data.push({
      date: `${year}-01-01`,
      value: Math.max(0, Math.round(value)),
    });
  }

  return data;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// --- Load categories from mock data ---

function loadCategories(): Map<string, string[]> {
  // Inline a few key categories for CLI use
  const cats = new Map<string, string[]>();
  cats.set('Pandemic & Health', [
    'face mask', 'hand sanitizer', 'pulse oximeter', 'air purifier', 'thermometer',
    'vitamin d', 'zinc supplement', 'home test kit', 'oximeter', 'n95 mask',
    'surgical gloves', 'face shield', 'uv sanitizer', 'disinfectant spray',
  ]);
  cats.set('Home & Fitness', [
    'home gym', 'resistance bands', 'exercise bike', 'yoga mat', 'standing desk',
    'ergonomic chair', 'ring light', 'webcam', 'blue light glasses', 'desk lamp',
    'foam roller', 'kettlebell', 'pull up bar', 'jump rope', 'massage gun',
  ]);
  cats.set('DTC Trending', [
    'cold plunge', 'portable monitor', 'air fryer', 'indoor grow light',
    'water flosser', 'bread maker', 'sourdough starter', 'bidets',
    'smart water bottle', 'posture corrector', 'sunrise alarm clock',
    'portable projector', 'heated blanket', 'ice maker', 'neck massager',
  ]);
  return cats;
}

// --- Main scan logic ---

function runCliScan(keywords: string[], supplyChain: ScanConfig['supplyChainMode']): DailyReport {
  console.error(`[scan] Analyzing ${keywords.length} keywords...`);

  // Generate time series for each keyword
  const keywordData = keywords.map(kw => ({
    keyword: kw,
    timeSeries: generateTimeSeries(kw),
  }));

  // Step 1: Anomaly detection
  console.error('[scan] Running anomaly detection...');
  const anomalies = analyzeKeywords(keywordData);
  console.error(`[scan] Found ${anomalies.length} anomalies`);

  // Step 2-4: Process each anomaly
  const entries: TrendEntry[] = [];
  const config: ScanConfig = {
    seedKeywords: keywords,
    supplyChainMode: supplyChain,
    maxApiCalls: 0,
    includeCategories: [],
  };

  anomalies.forEach(anomaly => {
    const confirmation = confirmSignal(anomaly);
    const phase = detectPhase(anomaly, confirmation);
    const race = computeRACE(anomaly, confirmation, config);

    const summary = [
      `${anomaly.signalType.replace('_', ' ')} detected (strength: ${anomaly.signalStrength}/100).`,
      `Phase: ${phase.phaseLabel} (${phase.phaseTrend}).`,
      anomaly.isPulse ? 'Warning: may be a pulse.' : '',
      `RACE: ${race.composite.toFixed(1)} → ${race.rating}.`,
    ].filter(Boolean).join(' ');

    entries.push({
      keyword: anomaly.keyword,
      category: categorize(anomaly.keyword),
      anomaly,
      confirmation,
      phase,
      race,
      chartData: anomaly.chartData,
      relatedKeywords: [],
      summary,
    });
  });

  entries.sort((a, b) => b.race.composite - a.race.composite);

  return buildDailyReport(entries, keywords.length, 0);
}

function categorize(keyword: string): string {
  const lower = keyword.toLowerCase();
  const map: Record<string, string[]> = {
    'Health & Wellness': ['health', 'medical', 'fitness', 'vitamin', 'supplement', 'mask', 'sanitizer', 'oximeter'],
    'Home & Living': ['home', 'kitchen', 'desk', 'chair', 'lamp', 'blanket', 'maker'],
    'Tech & Gadgets': ['webcam', 'monitor', 'projector', 'smart', 'light', 'ring light'],
    'Fitness Equipment': ['gym', 'band', 'bike', 'yoga', 'roller', 'kettlebell', 'rope'],
    'Beauty & Care': ['flosser', 'massage', 'posture', 'glasses'],
  };
  for (const [cat, terms] of Object.entries(map)) {
    if (terms.some(t => lower.includes(t))) return cat;
  }
  return 'General';
}

// --- Main ---

async function main() {
  const args = parseArgs();
  let keywords: string[] = [];

  if (args.backtest) {
    console.error('[mode] Backtest with known black swan keywords');
    keywords = BACKTEST_KEYWORDS;
  } else if (args.category) {
    const cats = loadCategories();
    const catKeywords = cats.get(args.category);
    if (catKeywords) {
      keywords = catKeywords;
      console.error(`[mode] Category: ${args.category} (${catKeywords.length} keywords)`);
    } else {
      console.error(`[error] Unknown category: ${args.category}`);
      console.error(`[info] Available: ${[...loadCategories().keys()].join(', ')}`);
      process.exit(1);
    }
  } else if (args.keywords.length > 0) {
    keywords = args.keywords;
    console.error(`[mode] Custom keywords: ${keywords.length}`);
  } else {
    // Default: run backtest
    console.error('[mode] No keywords specified, running backtest with known black swans');
    keywords = BACKTEST_KEYWORDS;
  }

  // Run scan
  const report = runCliScan(keywords, args.supplyChain);

  // Generate markdown
  const markdown = generateMarkdownReport(report);

  // Output
  if (args.output) {
    const outPath = resolve(args.output);
    mkdirSync(pathDirname(outPath), { recursive: true });
    writeFileSync(outPath, markdown, 'utf-8');
    console.error(`[done] Report written to: ${outPath}`);
  } else {
    // Print to stdout
    console.log(markdown);
  }

  // Summary to stderr
  console.error('');
  console.error(`[summary] Scanned: ${report.totalScanned} | Anomalies: ${report.anomaliesDetected} | Confirmed: ${report.confirmedSignals}`);
  console.error(`[summary] Strong Action: ${report.strongAction.length} | Deep Research: ${report.deepResearch.length} | Monitor: ${report.monitor.length}`);
}

main().catch(err => {
  console.error('[fatal]', err);
  process.exit(1);
});
