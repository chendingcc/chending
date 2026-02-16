import React, { useState, useRef, useEffect } from 'react';
import { Radar, Play, Settings, ChevronDown, Loader2 } from 'lucide-react';
import { blackSwanCategories } from '../data/mockData';
import { ScanConfig } from '../types';
import { ScanProgress } from '../engines/scanOrchestrator';

interface ScanPanelProps {
  onStartScan: (config: ScanConfig) => void;
  isScanning: boolean;
  progress: ScanProgress | null;
  lastScanTime: string | null;
  apiCallsUsed: number;
}

const SUPPLY_CHAIN_OPTIONS: { value: ScanConfig['supplyChainMode']; label: string; desc: string }[] = [
  { value: 'dropshipping', label: 'Dropshipping', desc: '1-3 days' },
  { value: 'pod', label: 'Print on Demand', desc: '2-5 days' },
  { value: 'wholesale', label: 'Wholesale (1688)', desc: '1-2 weeks' },
  { value: 'oem', label: 'OEM', desc: '4-8 weeks' },
  { value: 'brand', label: 'Brand', desc: '3-6 months' },
];

export const ScanPanel: React.FC<ScanPanelProps> = ({
  onStartScan,
  isScanning,
  progress,
  lastScanTime,
  apiCallsUsed,
}) => {
  const [seedText, setSeedText] = useState('');
  const [supplyChain, setSupplyChain] = useState<ScanConfig['supplyChainMode']>('dropshipping');
  const [showSettings, setShowSettings] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setShowCategories(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScan = () => {
    const seeds = seedText
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    onStartScan({
      seedKeywords: seeds,
      supplyChainMode: supplyChain,
      maxApiCalls: 30,
      includeCategories: selectedCats,
    });
  };

  const handleCategoryToggle = (catName: string) => {
    setSelectedCats(prev =>
      prev.includes(catName)
        ? prev.filter(c => c !== catName)
        : [...prev, catName]
    );
  };

  const handleLoadCategory = (catName: string) => {
    const cat = blackSwanCategories.find(c => c.name === catName);
    if (cat) {
      const current = seedText ? seedText.split(',').map(k => k.trim()).filter(k => k) : [];
      const newKws = cat.keywords.slice(0, 15).filter(k => !current.includes(k));
      const combined = [...current, ...newKws].slice(0, 30);
      setSeedText(combined.join(', '));
    }
  };

  const progressPercent = progress
    ? Math.round((progress.current / Math.max(progress.total, 1)) * 100)
    : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Radar size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Trend Radar Scan</h2>
            <p className="text-xs text-gray-500">
              {lastScanTime
                ? `Last scan: ${lastScanTime}`
                : 'No scans yet'
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">API: {apiCallsUsed} used</span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Supply Chain Mode</label>
              <select
                value={supplyChain}
                onChange={e => setSupplyChain(e.target.value as ScanConfig['supplyChainMode'])}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                {SUPPLY_CHAIN_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.desc})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-6 py-4">
        <div className="flex gap-3">
          <div className="flex-1 relative" ref={catRef}>
            <textarea
              value={seedText}
              onChange={e => setSeedText(e.target.value)}
              onFocus={() => setShowCategories(true)}
              placeholder="Enter seed keywords (comma-separated), or select from categories below..."
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm resize-none"
            />

            {/* Category dropdown */}
            {showCategories && (
              <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-20">
                <div className="p-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500 px-2">Click to load keywords from a category</p>
                </div>
                {blackSwanCategories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      handleLoadCategory(cat.name);
                      setShowCategories(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-indigo-50 transition-colors text-left"
                  >
                    <span className="text-gray-700">{cat.name}</span>
                    <span className="text-xs text-gray-400">{cat.keywords.length} kw</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning || (!seedText.trim() && selectedCats.length === 0)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm self-start"
          >
            {isScanning ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Play size={16} />
                Scan
              </>
            )}
          </button>
        </div>

        {/* Keyword count */}
        {seedText.trim() && (
          <div className="mt-2 text-xs text-gray-500">
            {seedText.split(',').filter(k => k.trim()).length} keywords loaded
          </div>
        )}
      </div>

      {/* Progress bar */}
      {isScanning && progress && (
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">{progress.message}</span>
            <span className="text-xs font-medium text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
