import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Plus, Heart, Star } from 'lucide-react';
import { blackSwanCategories } from '../data/mockData';
import { FavoritesPanel } from './FavoritesPanel';

interface FavoriteKeyword {
  keyword: string;
  category: string;
  addedDate: string;
  searchVolume: number;
  changePercentage: number;
  isExploding: boolean;
}

interface SearchBarProps {
  onSearch: (keywords: string[]) => void;
  isLoading?: boolean;
  favorites: FavoriteKeyword[];
  onAddFavorite: (keyword: FavoriteKeyword) => void;
  onRemoveFavorite: (keyword: string) => void;
  onClearFavorites: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isLoading = false,
  favorites,
  onAddFavorite,
  onRemoveFavorite,
  onClearFavorites
}) => {
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showFavoritesPanel, setShowFavoritesPanel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchText.trim()) {
      const keywords = searchText.split(',').map(k => k.trim()).filter(k => k);
      onSearch(keywords);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    const category = blackSwanCategories.find(c => c.name === categoryName);
    if (category) {
      const keywordsText = category.keywords.join(', ');
      setSearchText(keywordsText);
      setShowDropdown(false);
      setSelectedCategory(null);
    }
  };

  const handleKeywordSelect = (keyword: string) => {
    const currentKeywords = searchText.split(',').map(k => k.trim()).filter(k => k);
    if (!currentKeywords.includes(keyword)) {
      const newText = currentKeywords.length > 0 
        ? `${searchText}, ${keyword}` 
        : keyword;
      setSearchText(newText);
    }
  };

  const handleBulkImportFavorites = (keywords: string[]) => {
    const keywordsText = keywords.join(', ');
    setSearchText(keywordsText);
    setShowFavoritesPanel(false);
    onSearch(keywords);
  };

  const isFavorite = (keyword: string) => {
    return favorites.some(fav => fav.keyword === keyword);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      {/* Favorites Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowFavoritesPanel(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
        >
          <Heart size={16} className={favorites.length > 0 ? 'fill-current' : ''} />
          My Favorites ({favorites.length})
          {favorites.filter(f => f.isExploding).length > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs">
              <Star size={10} />
              {favorites.filter(f => f.isExploding).length} Black Swan
            </span>
          )}
        </button>
      </div>

      <div ref={searchRef}>
      <div className="relative">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onKeyPress={handleKeyPress}
                placeholder="Enter keywords separated by commas (e.g.: remote work, ai chatbot, climate change)..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchText.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              {isLoading ? 'Analyzing...' : 'Search Trends'}
            </button>
          </div>
        </div>

        {/* 黑天鹅关键词下拉菜单 */}
        {showDropdown && !showAIPanel && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-10">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-800">Black Swan Keyword Categories</h3>
                <button
                  onClick={() => setShowAIPanel(true)}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors font-medium"
                >
                  🤖 AI Era Keywords
                </button>
              </div>
              <p className="text-xs text-gray-600">Select category for bulk import, or click individual keywords to add</p>
            </div>
            
            <div className="p-2">
              {blackSwanCategories.map((category, index) => (
                <div key={index} className="mb-2">
                  <button
                    onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 text-sm">{category.name}</span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {category.keywords.length} keywords
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategorySelect(category.name);
                        }}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                      >
                        <Plus size={12} className="inline mr-1" />
                        Bulk Import
                      </button>
                      <ChevronDown 
                        size={16} 
                        className={`text-gray-400 transition-transform ${
                          selectedCategory === category.name ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </button>
                  
                  {selectedCategory === category.name && (
                    <div className="ml-4 mt-2 grid grid-cols-2 gap-1">
                      {category.keywords.slice(0, 20).map((keyword, keywordIndex) => (
                        <div
                          key={keywordIndex}
                          className="flex items-center justify-between px-2 py-1 text-xs text-gray-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <button
                            onClick={() => handleKeywordSelect(keyword)}
                            className="flex-1 text-left hover:text-blue-700 transition-colors"
                          >
                            {keyword}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isFavorite(keyword)) {
                                onRemoveFavorite(keyword);
                              } else {
                                onAddFavorite({
                                  keyword,
                                  category: category.name,
                                  addedDate: new Date().toISOString(),
                                  searchVolume: Math.floor(Math.random() * 1000000) + 100000,
                                  changePercentage: Math.floor(Math.random() * 500) + 50,
                                  isExploding: Math.random() > 0.7
                                });
                              }
                            }}
                            className={`p-1 rounded transition-colors ${
                              isFavorite(keyword) 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                            title={isFavorite(keyword) ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Heart size={12} className={isFavorite(keyword) ? 'fill-current' : ''} />
                          </button>
                        </div>
                      ))}
                      {category.keywords.length > 20 && (
                        <div className="col-span-2 text-xs text-gray-500 px-2 py-1">
                          {category.keywords.length - 20} more keywords...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI黑天鹅关键词面板 */}
        {showDropdown && showAIPanel && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-[600px] overflow-y-auto z-10">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-800">AI Era Black Swan Keywords</h3>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors font-medium"
                >
                  ← Back to General
                </button>
              </div>
              <p className="text-xs text-gray-600">AI时代专属黑天鹅关键词，包含技术风险和商业机会</p>
            </div>
            
            <div className="p-4">
              <div className="text-center py-8">
                <div className="text-gray-500">AI Keywords Panel Coming Soon</div>
                <button
                  onClick={() => onSearch(['ChatGPT', 'AI coding', 'GPT-4', 'artificial intelligence'])}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Search AI Keywords
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Favorites Panel */}
      <FavoritesPanel
        favorites={favorites}
        onRemoveFavorite={onRemoveFavorite}
        onBulkImport={handleBulkImportFavorites}
        onClearAll={onClearFavorites}
        isOpen={showFavoritesPanel}
        onClose={() => setShowFavoritesPanel(false)}
      />
    </div>
  );
};