import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchBar } from './components/SearchBar';
import { TrendGrid } from './components/TrendGrid';
import { TrendTable } from './components/TrendTable';
import { StatsOverview } from './components/StatsOverview';
import { BlogSection } from './components/BlogSection';
import { AuthModal } from './components/AuthModal';
import { AIBlackSwanPanel } from './components/AIBlackSwanPanel';
import { CacheManager } from './components/CacheManager';
import { mockTrendData } from './data/mockData';
import { searchCache } from './utils/searchCache';
// TODO: SERPAPI_INTEGRATION - Step 5: Import real API service
import { searchTrendsWithFallback } from './services/googleTrendsService';
import { TrendData } from './types';
import { Grid, List, Database, TrendingUp, Sparkles, Download } from 'lucide-react';

interface FavoriteKeyword {
  keyword: string;
  category: string;
  addedDate: string;
  searchVolume: number;
  changePercentage: number;
  isExploding: boolean;
}

interface User {
  name: string;
  email: string;
}

function App() {
  console.log('🚀 CHENDING App is starting...');
  
  const [searchResults, setSearchResults] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<FavoriteKeyword[]>([]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showCacheManager, setShowCacheManager] = useState(false);
  const [lastSearchFromCache, setLastSearchFromCache] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 初始化时不加载数据，显示空状态
  useEffect(() => {
    console.log('📱 App initialized...');
    
    // 加载收藏夹
    const savedFavorites = localStorage.getItem('chending_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
        console.log('✅ Favorites loaded successfully');
      } catch (error) {
        console.error('❌ Error loading favorites:', error);
      }
    }
  }, []);

  // 保存收藏夹到localStorage
  useEffect(() => {
    localStorage.setItem('chending_favorites', JSON.stringify(favorites));
  }, []);

  const handleSearch = async (keywords: string[], forceRefresh: boolean = false) => {
    if (keywords.length === 0) return;

    console.log('🔍 Starting search for:', keywords);
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const { results, fromCache, cacheAge } = await searchCache.executeSearch(
        keywords,
        async (searchKeywords) => {
          // TODO: SERPAPI_INTEGRATION - Step 5.1: Replace mock with real API
          console.log('🌐 Calling Google Trends API for:', searchKeywords);
          return await searchTrendsWithFallback(searchKeywords);
        },
        forceRefresh
      );

      setSearchResults(results);
      setLastSearchFromCache(fromCache);
      
      if (fromCache && cacheAge) {
        console.log(`💾 Results loaded from cache (${cacheAge} old)`);
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAllBlackSwanKeywords = () => {
    setHasSearched(true);
    setSearchResults(mockTrendData);
  };

  const handleAuthClick = (type: 'login' | 'register') => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  const handleAuth = async (email: string, password: string, name?: string) => {
    // 模拟认证
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = {
      name: name || email.split('@')[0],
      email
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleTrendClick = (keyword: string) => {
    console.log('📈 Trend clicked:', keyword);
  };

  const handleAddFavorite = (favorite: FavoriteKeyword) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.keyword === favorite.keyword);
      if (exists) return prev;
      return [...prev, favorite];
    });
  };

  const handleRemoveFavorite = (keyword: string) => {
    setFavorites(prev => prev.filter(fav => fav.keyword !== keyword));
  };

  const handleClearFavorites = () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      setFavorites([]);
    }
  };

  const handleRefreshSearch = (keywords: string[]) => {
    handleSearch(keywords, true);
  };

  const handleDownloadCSV = () => {
    const csvHeaders = ['Keyword', 'Category', 'Search Volume', 'Growth %', 'Status', 'Is Exploding'];
    const csvData = searchResults.map(trend => [
      `"${trend.keyword}"`,
      `"${trend.category}"`,
      trend.searchVolume,
      `${trend.changePercentage}%`,
      trend.currentTrend,
      trend.isExploding ? 'Yes' : 'No'
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

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

  console.log('🎨 Rendering CHENDING App with', searchResults.length, 'search results');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAuthClick={handleAuthClick}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover the Next Black Swan Event
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Uncover explosive keyword growth patterns and business opportunities before they become 
            mainstream. CHENDING helps you discover trends before they're trending.
          </p>
          
          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            favorites={favorites}
            onAddFavorite={handleAddFavorite}
            onRemoveFavorite={handleRemoveFavorite}
            onClearFavorites={handleClearFavorites}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!hasSearched ? (
          /* Empty State - 显示引导用户开始搜索 */
          <div className="text-center py-16">
            <div className="mb-8">
              <TrendingUp size={64} className="text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Trend Hunting?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Click the search box to view Black Swan keyword categories, or enter custom keywords to start analysis.
              </p>
              <button
                onClick={handleViewAllBlackSwanKeywords}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All Black Swan Keywords
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <StatsOverview trends={searchResults} />

            {/* Results Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  📊 Trend Analysis Results
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    <Database size={12} />
                    实时数据
                  </span>
                  <span>Found <strong>{searchResults.length}</strong> keyword trends</span>
                  {lastSearchFromCache && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      <Database size={12} />
                      From Cache
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => setShowCacheManager(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                >
                  <Database size={16} />
                  缓存管理
                </button>
                
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Download size={16} />
                  Download CSV
                </button>
                
                <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid size={16} />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'table'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List size={16} />
                    Table
                  </button>
                </div>
              </div>
            </div>

            {/* Results Display */}
            {viewMode === 'grid' ? (
              <TrendGrid trends={searchResults} onTrendClick={handleTrendClick} />
            ) : (
              <TrendTable
                trends={searchResults}
                onTrendClick={handleTrendClick}
                favorites={favorites}
                onAddFavorite={handleAddFavorite}
                onRemoveFavorite={handleRemoveFavorite}
              />
            )}
          </>
        )}
      </main>

      {/* Blog Section */}
      <BlogSection />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        type={authType}
        onTypeChange={setAuthType}
        onAuth={handleAuth}
      />

      {showAIPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">🤖 AI Era Black Swan Keywords</h2>
              <button
                onClick={() => setShowAIPanel(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <AIBlackSwanPanel onSearch={handleSearch} />
            </div>
          </div>
        </div>
      )}

      <CacheManager
        isOpen={showCacheManager}
        onClose={() => setShowCacheManager(false)}
        onRefreshSearch={handleRefreshSearch}
      />
    </div>
  );
}

export default App;