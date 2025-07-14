import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { TrendGrid } from './components/TrendGrid';
import { TrendTable } from './components/TrendTable';
import { StatsOverview } from './components/StatsOverview';
import { BlogSection } from './components/BlogSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CacheManager } from './components/CacheManager';
import { AIBlackSwanPanel } from './components/AIBlackSwanPanel';
import { mockTrendData } from './data/mockData';
import { searchCache } from './utils/searchCache';
import type { TrendData } from './types';

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
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [showCacheManager, setShowCacheManager] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<FavoriteKeyword[]>([]);

  const handleSearch = async (keywords: string[]) => {
    if (keywords.length === 0) return;

    setIsLoading(true);
    
    try {
      const searchFunction = async (searchKeywords: string[]) => {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 从mockData中筛选匹配的关键词
        const filteredTrends = mockTrendData.filter(trend =>
          searchKeywords.some(keyword => 
            trend.keyword.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(trend.keyword.toLowerCase())
          )
        );

        // 如果没有找到匹配的，返回前20个作为示例
        return filteredTrends.length > 0 ? filteredTrends.slice(0, 50) : mockTrendData.slice(0, 20);
      };

      const { results, fromCache, cacheAge } = await searchCache.executeSearch(
        keywords,
        searchFunction
      );

      setTrends(results);
      
      if (fromCache && cacheAge) {
        console.log(`Results loaded from cache (${cacheAge} old)`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setTrends(mockTrendData.slice(0, 20));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrendClick = (keyword: string) => {
    console.log('Trend clicked:', keyword);
  };

  const handleAuthClick = (type: 'login' | 'register') => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  const handleAuth = async (email: string, password: string, name?: string) => {
    // 模拟认证过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsAuthenticated(true);
    setUser({
      name: name || email.split('@')[0],
      email: email
    });
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleAddFavorite = (keyword: FavoriteKeyword) => {
    setFavorites(prev => [...prev, keyword]);
  };

  const handleRemoveFavorite = (keyword: string) => {
    setFavorites(prev => prev.filter(fav => fav.keyword !== keyword));
  };

  const handleClearFavorites = () => {
    setFavorites([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAuthClick={handleAuthClick}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      
      <main>
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover the Next Black Swan Event
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
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

        {/* Results Section */}
        {trends.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Trend Analysis Results
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowCacheManager(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Cache Manager
                  </button>
                  <button
                    onClick={() => setShowAIPanel(true)}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                  >
                    🤖 AI Keywords
                  </button>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Grid View
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        viewMode === 'table' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Table View
                    </button>
                  </div>
                </div>
              </div>

              <StatsOverview trends={trends} />

              {viewMode === 'grid' ? (
                <TrendGrid trends={trends} onTrendClick={handleTrendClick} />
              ) : (
                <TrendTable 
                  trends={trends} 
                  onTrendClick={handleTrendClick}
                  favorites={favorites}
                  onAddFavorite={handleAddFavorite}
                  onRemoveFavorite={handleRemoveFavorite}
                />
              )}
            </div>
          </section>
        )}

        {/* Empty State */}
        {trends.length === 0 && !isLoading && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="mb-8">
                <div className="text-6xl mb-4">📈</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Start Trend Hunting?
                </h2>
                <p className="text-gray-600 mb-8">
                  Click the search box to view Black Swan keyword categories, or enter custom keywords to start analysis.
                </p>
                <button
                  onClick={() => handleSearch(['remote work', 'ai chatbot', 'climate change', 'cryptocurrency'])}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View All Black Swan Keywords
                </button>
              </div>
            </div>
          </section>
        )}

        <BlogSection />
      </main>

      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        type={authType}
        onTypeChange={setAuthType}
        onAuth={handleAuth}
      />

      <CacheManager
        isOpen={showCacheManager}
        onClose={() => setShowCacheManager(false)}
        onRefreshSearch={handleSearch}
      />

      {showAIPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">AI Era Black Swan Keywords</h2>
              <button
                onClick={() => setShowAIPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <AIBlackSwanPanel onSearch={handleSearch} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;