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
import { mockTrendData, blackSwanSuggestions } from './data/mockData';
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

function App() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: 'login' | 'register' }>({
    isOpen: false,
    type: 'login'
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [favorites, setFavorites] = useState<FavoriteKeyword[]>([]);
  const [showCacheManager, setShowCacheManager] = useState(false);

  const handleSearch = async (keywords: string[], forceRefresh: boolean = false) => {
    if (keywords.length === 0) return;

    setIsLoading(true);
    
    try {
      const searchFunction = async (searchKeywords: string[]) => {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 过滤匹配的趋势数据
        const filteredTrends = mockTrendData.filter(trend =>
          searchKeywords.some(keyword =>
            trend.keyword.toLowerCase().includes(keyword.toLowerCase())
          )
        );
        
        return filteredTrends.length > 0 ? filteredTrends : mockTrendData.slice(0, 20);
      };

      const { results, fromCache, cacheAge } = await searchCache.executeSearch(
        keywords,
        searchFunction,
        forceRefresh
      );

      setTrends(results);
      
      if (fromCache && cacheAge) {
        console.log(`Results loaded from cache (${cacheAge} old)`);
      } else {
        console.log('Fresh results from API');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setTrends(mockTrendData.slice(0, 20));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (email: string, password: string, name?: string) => {
    // 模拟认证
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsAuthenticated(true);
    setUser({
      name: name || email.split('@')[0],
      email
    });
    setAuthModal({ isOpen: false, type: 'login' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleAddFavorite = (keyword: FavoriteKeyword) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.keyword === keyword.keyword);
      if (exists) return prev;
      return [...prev, keyword];
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

  const handleTrendClick = (keyword: string) => {
    console.log('Trend clicked:', keyword);
  };

  const handleViewAllBlackSwanKeywords = () => {
    const allKeywords = blackSwanSuggestions.map(suggestion => suggestion.keyword);
    handleSearch(allKeywords);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAuthClick={(type) => setAuthModal({ isOpen: true, type })}
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

        {/* Results Section */}
        {trends.length > 0 ? (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Trend Analysis Results
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowCacheManager(true)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Cache Manager
                  </button>
                  <div className="flex bg-gray-200 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Grid View
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
        ) : (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="bg-white rounded-lg shadow-lg p-12">
                <div className="text-6xl mb-6">📈</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Start Trend Hunting?
                </h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Click the search box to view Black Swan keyword categories, or enter custom keywords to start analysis.
                </p>
                <button
                  onClick={handleViewAllBlackSwanKeywords}
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
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        type={authModal.type}
        onTypeChange={(type) => setAuthModal({ ...authModal, type })}
        onAuth={handleAuth}
      />

      <CacheManager
        isOpen={showCacheManager}
        onClose={() => setShowCacheManager(false)}
        onRefreshSearch={handleSearch}
      />
    </div>
  );
}

export default App;