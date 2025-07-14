import React, { useState, useEffect } from 'react';
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
import { mockTrendData, blackSwanSuggestions } from './data/mockData';
import { searchCache } from './utils/searchCache';
import { TrendData } from './types';
import { Grid, List, Database, Brain } from 'lucide-react';

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
  const [searchResults, setSearchResults] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showCacheManager, setShowCacheManager] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteKeyword[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('chending_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('chending_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (keywords: string[], forceRefresh: boolean = false) => {
    if (keywords.length === 0) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const searchFunction = async (searchKeywords: string[]) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Filter mock data based on search keywords
        const results = mockTrendData.filter(trend =>
          searchKeywords.some(keyword =>
            trend.keyword.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(trend.keyword.toLowerCase())
          )
        );

        // If no exact matches, return some sample data
        if (results.length === 0) {
          return mockTrendData.slice(0, Math.min(20, searchKeywords.length * 5));
        }

        return results;
      };

      const { results, fromCache, cacheAge } = await searchCache.executeSearch(
        keywords,
        searchFunction,
        forceRefresh
      );

      setSearchResults(results);

      // Show cache notification
      if (fromCache && !forceRefresh) {
        console.log(`Results loaded from cache (${cacheAge})`);
      }

    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrendClick = (keyword: string) => {
    console.log('Trend clicked:', keyword);
    // Here you could open a detailed view or perform additional actions
  };

  const handleAuthClick = (type: 'login' | 'register') => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  const handleAuth = async (email: string, password: string, name?: string) => {
    // Simulate authentication
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

  const handleRefreshSearch = (keywords: string[]) => {
    handleSearch(keywords, true);
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

        {/* AI Panel Toggle */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  showAIPanel 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50'
                }`}
              >
                <Brain size={20} />
                {showAIPanel ? 'Hide AI Keywords' : 'Show AI Era Keywords'}
              </button>
              <button
                onClick={() => setShowCacheManager(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <Database size={20} />
                Cache Management
              </button>
            </div>
          </div>
        </section>

        {/* AI Black Swan Panel */}
        {showAIPanel && (
          <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AIBlackSwanPanel onSearch={handleSearch} />
            </div>
          </section>
        )}

        {/* Search Results */}
        {hasSearched && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Analyzing trends...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Search Results ({searchResults.length} trends found)
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'grid' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Grid size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'table' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <List size={20} />
                      </button>
                    </div>
                  </div>

                  <StatsOverview trends={searchResults} />

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
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No trends found</h3>
                  <p className="text-gray-500">Try different keywords or check the suggestions above.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Call to Action */}
        {!hasSearched && (
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Start Trend Hunting?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Click the search box to view Black Swan keyword categories, or enter custom keywords to start analysis.
              </p>
              
              <button
                onClick={() => handleSearch(['ChatGPT', 'remote work', 'climate change', 'cryptocurrency'])}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Black Swan Keywords
              </button>
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
        onRefreshSearch={handleRefreshSearch}
      />
    </div>
  );
}

export default App;