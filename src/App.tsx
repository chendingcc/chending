import React, { useState, useCallback, useEffect } from 'react';
import { Radar, FileText, Wifi, WifiOff } from 'lucide-react';
import { ScanPanel } from './components/ScanPanel';
import { ScanStats } from './components/ScanStats';
import { SignalTable } from './components/SignalTable';
import { mockTrendData, blackSwanCategories } from './data/mockData';
import { runScan, ScanProgress, ScanInput } from './engines/scanOrchestrator';
import { generateMarkdownReport } from './engines/reportGenerator';
import { fetchTrendsBatch, fetchRelatedQueries, TrendsFetchResult } from './services/trendDataService';
import { validateApiConfig } from './services/apiConfig';
import { DailyReport, ScanConfig } from './types';

// localStorage keys
const STORAGE_KEYS = {
  LAST_REPORT: 'bstr_last_report',
  API_CALLS: 'bstr_api_calls_total',
  WATCHLIST: 'bstr_watchlist',
};

function loadStoredReport(): DailyReport | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_REPORT);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function loadWatchlist(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function App() {
  const [report, setReport] = useState<DailyReport | null>(() => loadStoredReport());
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);
  const [lastScanTime, setLastScanTime] = useState<string | null>(
    () => report ? new Date(report.generatedAt).toLocaleTimeString() : null
  );
  const [apiCallsUsed, setApiCallsUsed] = useState<number>(
    () => parseInt(localStorage.getItem(STORAGE_KEYS.API_CALLS) || '0', 10)
  );
  const [hasApiKey, setHasApiKey] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>(() => loadWatchlist());
  const [dataSource, setDataSource] = useState<'api' | 'mock'>('mock');

  // Check API key on mount
  useEffect(() => {
    setHasApiKey(validateApiConfig());
  }, []);

  // Persist report
  useEffect(() => {
    if (report) {
      localStorage.setItem(STORAGE_KEYS.LAST_REPORT, JSON.stringify(report));
    }
  }, [report]);

  // Persist API call count
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.API_CALLS, String(apiCallsUsed));
  }, [apiCallsUsed]);

  // Persist watchlist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
  }, [watchlist]);

  const handleStartScan = useCallback(async (config: ScanConfig) => {
    setIsScanning(true);
    setScanProgress(null);

    await new Promise(r => setTimeout(r, 50));

    try {
      // Collect keywords
      let keywords: string[] = [...config.seedKeywords];

      // Add watchlist keywords
      if (watchlist.length > 0) {
        keywords.push(...watchlist);
      }

      // Add category keywords
      if (config.includeCategories.length > 0) {
        config.includeCategories.forEach(catName => {
          const cat = blackSwanCategories.find(c => c.name === catName);
          if (cat) keywords.push(...cat.keywords.slice(0, 15));
        });
      }

      // Deduplicate
      keywords = [...new Set(keywords.map(k => k.trim().toLowerCase()).filter(k => k))];

      if (keywords.length === 0) {
        keywords = mockTrendData.slice(0, 30).map(t => t.keyword);
      }

      // --- Try real API first ---
      let inputs: ScanInput[] = [];
      let usedApiCalls = 0;
      let source: 'api' | 'mock' = 'mock';

      if (hasApiKey) {
        setScanProgress({
          stage: 'anomaly',
          current: 0,
          total: keywords.length,
          message: 'Fetching data from SerpApi...',
        });

        const apiResults = await fetchTrendsBatch(
          keywords.slice(0, config.maxApiCalls), // Respect API budget
          (done, total) => {
            setScanProgress({
              stage: 'anomaly',
              current: done,
              total,
              message: `Fetching from SerpApi: ${done}/${total}`,
            });
          }
        );

        usedApiCalls = Math.ceil(keywords.slice(0, config.maxApiCalls).length / 5);

        if (apiResults.length > 0) {
          source = 'api';

          // Build inputs from API results
          inputs = apiResults.map(r => ({
            keyword: r.keyword,
            timeSeries: r.timeSeries,
            relatedKeywords: r.relatedQueries,
            category: 'General',
          }));

          // Fill remaining keywords with mock data
          const apiKeywords = new Set(apiResults.map(r => r.keyword.toLowerCase()));
          const remaining = keywords.filter(k => !apiKeywords.has(k));
          remaining.forEach(kw => {
            const mock = mockTrendData.find(t => t.keyword.toLowerCase() === kw);
            if (mock) {
              inputs.push({
                keyword: mock.keyword,
                timeSeries: mock.chartData,
                category: mock.category,
              });
            }
          });
        }
      }

      // --- Fallback to mock data ---
      if (inputs.length === 0) {
        source = 'mock';
        inputs = keywords.map(kw => {
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
          return {
            keyword: kw,
            timeSeries: generateSyntheticTimeSeries(kw),
            category: 'General',
          };
        });
      }

      setDataSource(source);

      // --- Run engine ---
      const previousKeywords = report
        ? [...report.strongAction, ...report.deepResearch, ...report.monitor].map(e => e.keyword)
        : undefined;

      const result = await new Promise<DailyReport>((resolve) => {
        setTimeout(() => {
          const r = runScan(inputs, config, (progress) => {
            setScanProgress({ ...progress });
          }, previousKeywords);
          resolve(r);
        }, 100);
      });

      // Update API call count in report
      result.apiCallsUsed = usedApiCalls;

      setReport(result);
      setLastScanTime(new Date().toLocaleTimeString());
      setApiCallsUsed(prev => prev + usedApiCalls);
    } catch (error) {
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
      setScanProgress(null);
    }
  }, [report, hasApiKey, watchlist]);

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

  const handleAddToWatchlist = useCallback((keyword: string) => {
    setWatchlist(prev => {
      if (prev.includes(keyword.toLowerCase())) return prev;
      return [...prev, keyword.toLowerCase()];
    });
  }, []);

  const handleRemoveFromWatchlist = useCallback((keyword: string) => {
    setWatchlist(prev => prev.filter(k => k !== keyword.toLowerCase()));
  }, []);

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
            <div className="flex items-center gap-3">
              {/* Data source indicator */}
              <div className="flex items-center gap-1.5 text-xs">
                {hasApiKey ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Wifi size={12} /> API
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400">
                    <WifiOff size={12} /> Mock
                  </span>
                )}
              </div>

              {/* Watchlist count */}
              {watchlist.length > 0 && (
                <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                  {watchlist.length} watched
                </span>
              )}

              {report && (
                <button
                  onClick={handleExportMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <FileText size={14} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* API key notice */}
        {!hasApiKey && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <strong>Mock mode:</strong> Set <code className="bg-amber-100 px-1 rounded text-xs">REACT_APP_SERPAPI_KEY</code> in <code className="bg-amber-100 px-1 rounded text-xs">.env</code> to use real Google Trends data. Running on synthetic data for now.
          </div>
        )}

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

        {/* Data source badge */}
        {report && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Source: {dataSource === 'api' ? 'SerpApi (real data)' : 'Mock data'}</span>
            <span>|</span>
            <span>Scanned: {report.totalScanned} keywords</span>
            <span>|</span>
            <span>API calls this session: {apiCallsUsed}</span>
          </div>
        )}

        {/* Signal Table */}
        <SignalTable
          report={report}
          onExportMarkdown={handleExportMarkdown}
          watchlist={watchlist}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
        />

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

        {/* Watchlist */}
        {watchlist.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Watchlist ({watchlist.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {watchlist.map(kw => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-700"
                >
                  {kw}
                  <button
                    onClick={() => handleRemoveFromWatchlist(kw)}
                    className="text-gray-400 hover:text-red-500 ml-0.5"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Watchlisted keywords are automatically included in every scan.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
          Black Swan Trend Radar &mdash; DTC Anomaly Detection Engine
        </div>
      </footer>
    </div>
  );
}

// --- Utility: synthetic time series for keywords without mock data ---

function generateSyntheticTimeSeries(keyword: string): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = [];
  const hash = simpleHash(keyword);
  const pattern = hash % 4;
  const currentYear = new Date().getFullYear();

  for (let year = 2004; year <= currentYear; year++) {
    const progress = (year - 2004) / (currentYear - 2004);
    let value: number;

    switch (pattern) {
      case 0:
        value = progress < 0.8
          ? 10 + progress * 20 + seededRandom(hash + year) * 5
          : 30 + (progress - 0.8) * 350;
        break;
      case 1:
        value = progress < 0.3
          ? progress * 200
          : 60 - (progress - 0.3) * 70 + seededRandom(hash + year) * 10;
        break;
      case 2:
        value = 30 + Math.sin(progress * Math.PI * 4) * 20 + seededRandom(hash + year) * 15;
        break;
      default:
        value = 20 + progress * 50 + seededRandom(hash + year) * 8;
    }

    data.push({ date: `${year}-01-01`, value: Math.max(0, Math.round(value)) });
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
