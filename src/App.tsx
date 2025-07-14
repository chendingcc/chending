import React, { useState } from 'react';
import { Download, TrendingUp, Database } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BlogSection } from './components/BlogSection';
import { AuthModal } from './components/AuthModal';
import { CacheManager } from './components/CacheManager';
import { SearchBar } from './components/SearchBar';
import { TrendTable } from './components/TrendTable';
import { StatsOverview } from './components/StatsOverview';
import { mockTrendData } from './data/mockData';
import { type TrendData } from './types';
import { searchCache } from './utils/searchCache';

interface FavoriteKeyword {
  keyword: string;
  category: string;
  addedDate: string;
  searchVolume: number;
  changePercentage: number;
  isExploding: boolean;
}

function App() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteKeyword[]>([]);
  
  // Auth state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Cache management state
  const [isCacheManagerOpen, setIsCacheManagerOpen] = useState(false);
  const [lastSearchInfo, setLastSearchInfo] = useState<{
    fromCache: boolean;
    cacheAge?: string;
  } | null>(null);

  const downloadTrendsData = () => {
    if (trends.length === 0) return;

    // 准备CSV数据
    const csvHeaders = [
      'Keyword',
      'Category', 
      'Search Volume',
      'Growth Percentage',
      'Current Trend',
      'Peak Date',
      'Is Exploding',
      'Status'
    ];

    const csvData = trends.map(trend => [
      `"${trend.keyword}"`,
      `"${trend.category}"`,
      trend.searchVolume,
      `${trend.changePercentage}%`,
      trend.currentTrend,
      trend.peakDate,
      trend.isExploding ? 'Yes' : 'No',
      trend.isExploding ? 'Black Swan Candidate' : 'Normal Trend'
    ]);

    // 创建CSV内容
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // 创建并下载文件
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `chending-trends-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearch = async (keywords: string[]) => {
    setIsLoading(true);
    
    try {
      // 使用缓存系统执行搜索
      const searchResult = await searchCache.executeSearch(
        keywords,
        async (searchKeywords) => {
          // 模拟API调用延迟
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (searchKeywords.length === 0) {
            return mockTrendData;
          } else {
            const filteredTrends = mockTrendData.filter(trend => 
              searchKeywords.some(keyword => 
                trend.keyword.toLowerCase().includes(keyword.toLowerCase())
              )
            );
            return filteredTrends.length === 0 ? mockTrendData : filteredTrends;
          }
        }
      );
      
      setTrends(searchResult.results);
      setLastSearchInfo({
        fromCache: searchResult.fromCache,
        cacheAge: searchResult.cacheAge
      });
    } catch (error) {
      console.error('Search failed:', error);
      // 发生错误时显示所有数据
      setTrends(mockTrendData);
      setLastSearchInfo(null);
    }
    
    setIsLoading(false);
  };

  const handleRefreshSearch = async (keywords: string[]) => {
    setIsLoading(true);
    
    try {
      // 强制刷新搜索（不使用缓存）
      const searchResult = await searchCache.executeSearch(
        keywords,
        async (searchKeywords) => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (searchKeywords.length === 0) {
            return mockTrendData;
          } else {
            const filteredTrends = mockTrendData.filter(trend => 
              searchKeywords.some(keyword => 
                trend.keyword.toLowerCase().includes(keyword.toLowerCase())
              )
            );
            return filteredTrends.length === 0 ? mockTrendData : filteredTrends;
          }
        },
        true // 强制刷新
      );
      
      setTrends(searchResult.results);
      setLastSearchInfo({
        fromCache: false
      });
    } catch (error) {
      console.error('Refresh search failed:', error);
    }
    
    setIsLoading(false);
  };
  const handleTrendClick = (keyword: string) => {
    console.log('Trend clicked:', keyword);
  };

  const handleAddFavorite = (favorite: FavoriteKeyword) => {
    setFavorites(prev => {
      // 避免重复添加
      if (prev.some(fav => fav.keyword === favorite.keyword)) {
        return prev;
      }
      return [...prev, favorite];
    });
  };

  const handleRemoveFavorite = (keyword: string) => {
    setFavorites(prev => prev.filter(fav => fav.keyword !== keyword));
  };

  const handleClearFavorites = () => {
    setFavorites([]);
  };

  const handleAuthClick = (type: 'login' | 'register') => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  const handleAuth = async (email: string, password: string, name?: string) => {
    // 模拟认证过程 - 将来替换为Supabase认证
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsAuthenticated(true);
    setUser({
      name: name || email.split('@')[0],
      email: email
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAuthClick={handleAuthClick}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main id="trends" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover the Next Black Swan Event</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Uncover explosive keyword growth patterns and business opportunities before they become mainstream.
              CHENDING helps you discover trends before they're trending.
            </p>
          </div>
          
          <SearchBar 
            onSearch={handleSearch}
            isLoading={isLoading}
            favorites={favorites}
            onAddFavorite={handleAddFavorite}
            onRemoveFavorite={handleRemoveFavorite}
            onClearFavorites={handleClearFavorites}
          />
        </div>

        {/* Results Section */}
        {trends.length > 0 && (
          <div className="space-y-8">
            <StatsOverview trends={trends} />
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Analyzing trend data...</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Trend Analysis Results</h3>
                  <div className="flex items-center gap-4">
                    {lastSearchInfo && (
                      <div className="text-sm text-gray-600">
                        {lastSearchInfo.fromCache ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <Database size={14} />
                            缓存结果 {lastSearchInfo.cacheAge && `(${lastSearchInfo.cacheAge})`}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-blue-600">
                            <TrendingUp size={14} />
                            实时数据
                          </span>
                        )}
                      </div>
                    )}
                    <div className="text-sm text-gray-600">
                      Found <span className="font-semibold text-blue-600">{trends.length}</span> keyword trends
                    </div>
                    <button
                      onClick={() => setIsCacheManagerOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                    >
                      <Database size={16} />
                      缓存管理
                    </button>
                    <button
                      onClick={downloadTrendsData}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                    >
                      <Download size={16} />
                      Download CSV
                    </button>
                  </div>
                </div>
                <TrendTable 
                  trends={trends} 
                  onTrendClick={handleTrendClick}
                  favorites={favorites}
                  onAddFavorite={handleAddFavorite}
                  onRemoveFavorite={handleRemoveFavorite}
                />
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {trends.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Start Trend Hunting?</h3>
              <p className="text-gray-600 mb-4">
                Click the search box to view Black Swan keyword categories, or enter custom keywords to start analysis.
              </p>
              <button
                onClick={() => handleSearch([])}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All Black Swan Keywords
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Blog Section */}
      <BlogSection />

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
        onTypeChange={setAuthType}
        onAuth={handleAuth}
      />

      {/* Cache Manager */}
      <CacheManager
        isOpen={isCacheManagerOpen}
        onClose={() => setIsCacheManagerOpen(false)}
        onRefreshSearch={handleRefreshSearch}
      />
    </div>
  );
}

export default App;