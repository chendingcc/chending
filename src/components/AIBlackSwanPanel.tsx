import React, { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, Star, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { aiBlackSwanKeywords, generateAITrendData } from '../data/aiBlackSwanData';

interface AIBlackSwanPanelProps {
  onSearch: (keywords: string[]) => void;
}

export const AIBlackSwanPanel: React.FC<AIBlackSwanPanelProps> = ({ onSearch }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'business' | 'risk' | 'trend'>('relevance');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getBusinessValueColor = (value: string) => {
    switch (value) {
      case 'High': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Explosive': return '🚀';
      case 'Rising': return '📈';
      case 'Stable': return '➡️';
      case 'Declining': return '📉';
      default: return '➡️';
    }
  };

  const handleBulkImport = (category: AIBlackSwanCategory) => {
    const keywords = category.keywords.map(k => k.name);
    onSearch(keywords);
  };

  const handleKeywordSelect = (keyword: string) => {
    onSearch([keyword]);
  };

  const filteredCategories = aiBlackSwanKeywords.map(category => ({
    ...category,
    keywords: category.keywords.filter(keyword => {
      const matchesSearch = searchTerm === '' || 
        keyword.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        keyword.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRisk = filterRisk === 'all' || keyword.riskLevel === filterRisk;
      
      return matchesSearch && matchesRisk;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevanceScore - a.relevanceScore;
        case 'business':
          const businessOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return businessOrder[b.businessValue] - businessOrder[a.businessValue];
        case 'risk':
          const riskOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        case 'trend':
          const trendOrder = { 'Explosive': 4, 'Rising': 3, 'Stable': 2, 'Declining': 1 };
          return trendOrder[b.trendPrediction] - trendOrder[a.trendPrediction];
        default:
          return 0;
      }
    })
  }));

  const totalKeywords = filteredCategories.reduce((sum, cat) => sum + cat.keywords.length, 0);
  const highRiskKeywords = filteredCategories.reduce((sum, cat) => 
    sum + cat.keywords.filter(k => k.riskLevel === 'Critical' || k.riskLevel === 'High').length, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="text-purple-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">AI Era Black Swan Keywords</h2>
            <p className="text-sm text-gray-600">AI时代黑天鹅关键词数据库 - 发现AI领域的机遇与风险</p>
          </div>
        </div>
        <button
          onClick={() => onSearch(generateAITrendData().map(t => t.keyword))}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
        >
          View All AI Trends
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-600 mb-1">Total Keywords</div>
          <div className="text-2xl font-bold text-purple-800">{totalKeywords}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-600 mb-1">High Risk</div>
          <div className="text-2xl font-bold text-red-800">{highRiskKeywords}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-600 mb-1">High Business Value</div>
          <div className="text-2xl font-bold text-green-800">
            {filteredCategories.reduce((sum, cat) => 
              sum + cat.keywords.filter(k => k.businessValue === 'High').length, 0)}
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm text-orange-600 mb-1">Explosive Trends</div>
          <div className="text-2xl font-bold text-orange-800">
            {filteredCategories.reduce((sum, cat) => 
              sum + cat.keywords.filter(k => k.trendPrediction === 'Explosive').length, 0)}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search AI keywords..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
        >
          <option value="relevance">Sort by Relevance</option>
          <option value="business">Sort by Business Value</option>
          <option value="risk">Sort by Risk Level</option>
          <option value="trend">Sort by Trend</option>
        </select>

        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
        >
          <option value="all">All Risk Levels</option>
          <option value="Critical">Critical Risk</option>
          <option value="High">High Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {filteredCategories.map((category, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-800">{category.name}</span>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                  {category.keywords.length} keywords
                </span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  Avg Score: {category.avgRelevanceScore}
                </span>
                {category.highRiskCount > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    {category.highRiskCount} high risk
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBulkImport(category);
                  }}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
                >
                  Bulk Import
                </button>
                {selectedCategory === category.name ? 
                  <ChevronUp size={16} className="text-gray-400" /> : 
                  <ChevronDown size={16} className="text-gray-400" />
                }
              </div>
            </button>
            
            {selectedCategory === category.name && (
              <div className="border-t border-gray-200 p-4">
                <div className="grid gap-3">
                  {category.keywords.map((keyword, keywordIndex) => (
                    <div key={keywordIndex} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <button
                            onClick={() => setExpandedKeyword(expandedKeyword === keyword.name ? null : keyword.name)}
                            className="text-left"
                          >
                            <h4 className="font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                              {keyword.name}
                              {expandedKeyword === keyword.name ? 
                                <ChevronUp size={14} className="inline ml-1" /> : 
                                <ChevronDown size={14} className="inline ml-1" />
                              }
                            </h4>
                          </button>
                          <p className="text-sm text-gray-600 mt-1">{keyword.description}</p>
                        </div>
                        <button
                          onClick={() => handleKeywordSelect(keyword.name)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors ml-3"
                        >
                          Search
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="flex items-center gap-1 text-xs">
                          <Star size={12} className="text-yellow-500" />
                          {keyword.relevanceScore}/10
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getBusinessValueColor(keyword.businessValue)}`}>
                          {keyword.businessValue} Value
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(keyword.riskLevel)}`}>
                          {keyword.riskLevel} Risk
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {getTrendIcon(keyword.trendPrediction)} {keyword.trendPrediction}
                        </span>
                        <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                          {keyword.applicationField}
                        </span>
                      </div>

                      {expandedKeyword === keyword.name && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-green-700 mb-2">🚀 Business Opportunities</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {keyword.opportunities.map((opp, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    {opp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-red-700 mb-2">⚠️ Potential Risks</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {keyword.risks.map((risk, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">•</span>
                                    {risk}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Update Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-blue-600 mt-0.5" size={16} />
          <div className="text-sm text-blue-800">
            <strong>Auto-Update Feature:</strong> This AI keyword database is designed to integrate with the latest AI APIs for automatic expansion and real-time updates. 
            Keywords are continuously monitored for relevance, business value, and risk assessment changes.
          </div>
        </div>
      </div>
    </div>
  );
};