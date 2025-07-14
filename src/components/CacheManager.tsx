import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Trash2, Clock, HardDrive, TrendingUp, X, AlertCircle } from 'lucide-react';
import { searchCache, CacheStats } from '../utils/searchCache';

interface CacheManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshSearch?: (keywords: string[]) => void;
}

export const CacheManager: React.FC<CacheManagerProps> = ({
  isOpen,
  onClose,
  onRefreshSearch
}) => {
  const [stats, setStats] = useState<CacheStats>({
    totalSearches: 0,
    cachedSearches: 0,
    apiCalls: 0,
    cacheHits: 0,
    lastCleared: Date.now()
  });
  const [cacheList, setCacheList] = useState<any[]>([]);
  const [cacheSize, setCacheSize] = useState(0);

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const refreshData = () => {
    setStats(searchCache.getStats());
    setCacheList(searchCache.getCacheList());
    setCacheSize(searchCache.getCacheSize());
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有搜索缓存吗？这将导致下次搜索重新调用API。')) {
      searchCache.clearAllCache();
      refreshData();
    }
  };

  const handleRefreshCache = (keywords: string[]) => {
    searchCache.removeCache(keywords);
    if (onRefreshSearch) {
      onRefreshSearch(keywords);
    }
    refreshData();
    onClose();
  };

  const calculateSavings = () => {
    const totalPotentialCalls = stats.totalSearches;
    const actualCalls = stats.apiCalls;
    const savedCalls = Math.max(0, totalPotentialCalls - actualCalls);
    const savingsPercentage = totalPotentialCalls > 0 
      ? Math.round((savedCalls / totalPotentialCalls) * 100) 
      : 0;
    
    return { savedCalls, savingsPercentage };
  };

  if (!isOpen) return null;

  const { savedCalls, savingsPercentage } = calculateSavings();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Database className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">搜索缓存管理</h2>
              <p className="text-sm text-gray-600">
                管理API调用缓存，节省搜索成本
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSearches}</div>
            <div className="text-sm text-gray-600">总搜索次数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.cacheHits}</div>
            <div className="text-sm text-gray-600">缓存命中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.apiCalls}</div>
            <div className="text-sm text-gray-600">API调用</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{savedCalls}</div>
            <div className="text-sm text-gray-600">节省调用</div>
          </div>
        </div>

        {/* Savings Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-600" size={20} />
                <span className="text-lg font-semibold text-gray-800">
                  节省率: {savingsPercentage}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="text-gray-600" size={16} />
                <span className="text-sm text-gray-600">
                  缓存大小: {cacheSize} KB
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refreshData}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                <RefreshCw size={14} />
                刷新数据
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                <Trash2 size={14} />
                清空缓存
              </button>
            </div>
          </div>
        </div>

        {/* Cache List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              缓存记录 ({cacheList.length})
            </h3>
            
            {cacheList.length === 0 ? (
              <div className="text-center py-8">
                <Database size={48} className="text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">暂无缓存记录</h4>
                <p className="text-gray-500">
                  执行搜索后，结果将自动缓存以节省API调用
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cacheList.map((cache, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-800">
                          {cache.keywords.join(', ')}
                        </h4>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {cache.keywords.length} 关键词
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          缓存时间: {cache.age}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp size={12} />
                          API调用: {cache.apiCallCount} 次
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRefreshCache(cache.keywords)}
                      className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                      title="刷新此搜索缓存"
                    >
                      <RefreshCw size={14} />
                      重新搜索
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
            <div className="text-sm text-yellow-800">
              <strong>缓存说明：</strong>
              <ul className="mt-1 ml-4 list-disc space-y-1">
                <li>搜索结果自动缓存24小时，避免重复API调用</li>
                <li>相同关键词组合会复用缓存结果</li>
                <li>点击"重新搜索"可强制刷新特定缓存</li>
                <li>开发过程中建议定期清理缓存以获取最新数据</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};