import React, { useState, useCallback } from 'react';
import { Radar, FileText } from 'lucide-react';
import { ScanPanel } from './components/ScanPanel';
import { ScanStats } from './components/ScanStats';
import { SignalTable } from './components/SignalTable';
import { mockTrendData, blackSwanCategories } from './data/mockData';
import { runScan, ScanProgress, ScanInput } from './engines/scanOrchestrator';
import { generateMarkdownReport } from './engines/reportGenerator';
import { DailyReport, ScanConfig } from './types';

function App() {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);
  const [apiCallsUsed, setApiCallsUsed] = useState(0);

  const handleStartScan = useCallback(async (config: ScanConfig) => {
    setIsScanning(true);
    setScanProgress(null);

    // Small delay to let UI update
    await new Promise(r => setTimeout(r, 50));

    try {
      // Build scan inputs from seed keywords and/or categories
      let keywords: string[] = [...config.seedKeywords];

      // If categories selected, add their keywords
      if (config.includeCategories.length > 0) {
        config.includeCategories.forEach(catName => {
          const cat = blackSwanCategories.find(c => c.name === catName);
          if (cat) {
            keywords.push(...cat.keywords.slice(0, 15));
          }
        });
      }

      // Deduplicate
      keywords = [...new Set(keywords.map(k => k.trim().toLowerCase()).filter(k => k))];

      // If no keywords at all, use a default set from mock data
      if (keywords.length === 0) {
        keywords = mockTrendData.slice(0, 30).map(t => t.keyword);
      }

      // Build scan inputs: use mock trend chart data for each keyword
      const inputs: ScanInput[] = keywords.map(kw => {
        // Try to find existing mock data for this keyword
        const existing = mockTrendData.find(
          t => t.keyword.toLowerCase() === kw.toLowerCase()
        );

        if (existing) {
          return {
            keyword: existing.keyword,
            timeSeries: existing.chartData,
            category: existing.category,
          };
        }

        // Generate synthetic time series for keywords without mock data
        return {
          keyword: kw,
          timeSeries: generateSyntheticTimeSeries(kw),
          category: 'General',
        };
      });

      // Run the scan engine
      const previousKeywords = report
        ? [...report.strongAction, ...report.deepResearch, ...report.monitor].map(e => e.keyword)
        : undefined;

      // Use setTimeout to allow progress updates to render
      const result = await new Promise<DailyReport>((resolve) => {
        setTimeout(() => {
          const r = runScan(inputs, config, (progress) => {
            setScanProgress({ ...progress });
          }, previousKeywords);
          resolve(r);
        }, 100);
      });

      setReport(result);
      setLastScanTime(new Date().toLocaleTimeString());
      setApiCallsUsed(prev => prev + result.apiCallsUsed);
    } catch (error) {
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
      setScanProgress(null);
    }
  }, [report]);

  const handleExportMarkdown = useCallback(() => {
    if (!report) return;

    const markdown = generateMarkdownReport(report);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `black-swan-report-${report.date}.md`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [report]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <Radar size={24} className="text-indigo-600" />
              <span className="text-lg font-bold text-gray-900">Black Swan Radar</span>
              <span className="hidden sm:inline text-xs text-gray-400 border-l border-gray-200 pl-2.5 ml-1">
                DTC Trend Discovery
              </span>
            </div>
            {report && (
              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <FileText size={14} />
                <span className="hidden sm:inline">Export Report</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Scan Panel */}
        <ScanPanel
          onStartScan={handleStartScan}
          isScanning={isScanning}
          progress={scanProgress}
          lastScanTime={lastScanTime}
          apiCallsUsed={apiCallsUsed}
        />

        {/* Stats */}
        <ScanStats report={report} />

        {/* Signal Table */}
        <SignalTable report={report} onExportMarkdown={handleExportMarkdown} />

        {/* New signals callout */}
        {report && report.newSignals.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-indigo-800 mb-1">
              New Signals This Scan
            </h3>
            <p className="text-sm text-indigo-600">
              {report.newSignals.join(', ')}
            </p>
          </div>
        )}
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
          Black Swan Trend Radar &mdash; DTC Anomaly Detection Engine
        </div>
      </footer>
    </div>
  );
}

/**
 * Generate a synthetic time series for keywords without mock data.
 * Creates plausible trend data with some randomized patterns.
 */
function generateSyntheticTimeSeries(keyword: string): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = [];
  const hash = simpleHash(keyword);
  const pattern = hash % 4; // 0: explosive, 1: declining, 2: volatile, 3: stable
  const currentYear = new Date().getFullYear();

  for (let year = 2004; year <= currentYear; year++) {
    const progress = (year - 2004) / (currentYear - 2004);
    let value: number;

    switch (pattern) {
      case 0: // Explosive end
        value = progress < 0.8
          ? 10 + progress * 20 + seededRandom(hash + year) * 5
          : 30 + (progress - 0.8) * 350;
        break;
      case 1: // Early peak then decline
        value = progress < 0.3
          ? progress * 200
          : 60 - (progress - 0.3) * 70 + seededRandom(hash + year) * 10;
        break;
      case 2: // Volatile
        value = 30 + Math.sin(progress * Math.PI * 4) * 20 + seededRandom(hash + year) * 15;
        break;
      default: // Steady growth
        value = 20 + progress * 50 + seededRandom(hash + year) * 8;
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

export default App;
