import React, { useState } from 'react';
import { Heart, Trash2, Download, Search, X, Star, Calendar, TrendingUp } from 'lucide-react';

interface FavoriteKeyword {
  keyword: string;
  category: string;
  addedDate: string;
  searchVolume: number;
  changePercentage: number;
  isExploding: boolean;
}

interface FavoritesPanelProps {
  favorites: FavoriteKeyword[];
  onRemoveFavorite: (keyword: string) => void;
  onBulkImport: (keywords: string[]) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({
  favorites,
  onRemoveFavorite,
  onBulkImport,
  onClearAll,
  isOpen,
  onClose
}) => {
  const [sortBy, setSortBy] = useState<'date' | 'keyword' | 'growth'>('date');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'keyword':
        return a.keyword.localeCompare(b.keyword);
      case 'growth':
        return b.changePercentage - a.changePercentage;
      case 'date':
      default:
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    }
  });

  const handleBulkImport = () => {
    if (selectedKeywords.length === 0) {
      alert('Please select at least one keyword to search');
      return;
    }
    onBulkImport(selectedKeywords);
    onClose();
  };

  const handleSelectAll = () => {
    if (selectedKeywords.length === favorites.length) {
      setSelectedKeywords([]);
    } else {
      setSelectedKeywords(favorites.map(fav => fav.keyword));
    }
  };

  const handleKeywordSelect = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const exportFavorites = () => {
    const csvHeaders = ['Keyword', 'Category', 'Added Date', 'Search Volume', 'Growth %', 'Is Exploding'];
    const csvData = favorites.map(fav => [
      `"${fav.keyword}"`,
      `"${fav.category}"`,
      fav.addedDate,
      fav.searchVolume,
      `${fav.changePercentage}%`,
      fav.isExploding ? 'Yes' : 'No'
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `my-favorite-keywords-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Heart className="text-red-500" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">My Favorite Keywords</h2>
              <p className="text-sm text-gray-600">
                {favorites.length} keywords saved • Ready for bulk analysis
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
        <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{favorites.length}</div>
            <div className="text-sm text-gray-600">Total Keywords</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {favorites.filter(f => f.isExploding).length}
            </div>
            <div className="text-sm text-gray-600">Black Swans</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(favorites.reduce((sum, f) => sum + f.changePercentage, 0) / favorites.length || 0)}%
            </div>
            <div className="text-sm text-gray-600">Avg Growth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(favorites.map(f => f.category)).size}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSelectAll}
              disabled={favorites.length === 0}
              className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {selectedKeywords.length === favorites.length ? 'Deselect All' : 'Select All'}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="date">Date Added</option>
                <option value="keyword">Keyword A-Z</option>
                <option value="growth">Growth Rate</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Selected: <span className="font-semibold text-purple-600">{selectedKeywords.length}</span>
            </div>
            <button
              onClick={exportFavorites}
              disabled={favorites.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={handleBulkImport}
              disabled={selectedKeywords.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <Search size={16} />
              Bulk Search ({selectedKeywords.length})
            </button>
            <button
              onClick={onClearAll}
              disabled={favorites.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>
        </div>

        {/* Favorites List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No favorites yet</h3>
              <p className="text-gray-500">
                Click the heart icon next to keywords to add them to your favorites
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid gap-3">
                {sortedFavorites.map((favorite, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      selectedKeywords.includes(favorite.keyword) 
                        ? 'bg-blue-50 border-2 border-blue-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedKeywords.includes(favorite.keyword)}
                        onChange={() => handleKeywordSelect(favorite.keyword)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-800">{favorite.keyword}</h4>
                        {favorite.isExploding && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            <Star size={12} />
                            Black Swan
                          </span>
                        )}
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {favorite.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          Added {new Date(favorite.addedDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp size={12} />
                          {favorite.searchVolume.toLocaleString()} searches
                        </div>
                        <div className={`flex items-center gap-1 font-medium ${
                          favorite.changePercentage > 100 ? 'text-red-600' :
                          favorite.changePercentage > 50 ? 'text-orange-600' :
                          favorite.changePercentage > 0 ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {favorite.changePercentage > 0 ? '+' : ''}{favorite.changePercentage}% growth
                        </div>
                      </div>
                    </div>
                    </div>

                    <button
                      onClick={() => onRemoveFavorite(favorite.keyword)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};