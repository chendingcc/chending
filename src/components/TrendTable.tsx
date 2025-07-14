import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, ExternalLink, Filter, ArrowUpDown, ArrowUp, ArrowDown, Heart } from 'lucide-react';
import { TrendData } from '../types';

interface FavoriteKeyword {
  keyword: string;
  category: string;
  addedDate: string;
  searchVolume: number;
  changePercentage: number;
  isExploding: boolean;
}

interface TrendTableProps {
  trends: TrendData[];
  onTrendClick: (keyword: string) => void;
  favorites: FavoriteKeyword[];
  onAddFavorite: (keyword: FavoriteKeyword) => void;
  onRemoveFavorite: (keyword: string) => void;
}

type SortField = 'keyword' | 'growth' | 'volume' | 'category' | 'status' | 'exploding';
type SortDirection = 'asc' | 'desc';

export const TrendTable: React.FC<TrendTableProps> = ({ 
  trends, 
  onTrendClick,
  favorites,
  onAddFavorite,
  onRemoveFavorite
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('exploding');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [explodingFilter, setExplodingFilter] = useState<'all' | 'exploding' | 'normal'>('all');

  const isFavorite = (keyword: string) => {
    return favorites.some(fav => fav.keyword === keyword);
  };

  const handleFavoriteToggle = (trend: TrendData) => {
    if (isFavorite(trend.keyword)) {
      onRemoveFavorite(trend.keyword);
    } else {
      onAddFavorite({
        keyword: trend.keyword,
        category: trend.category,
        addedDate: new Date().toISOString(),
        searchVolume: trend.searchVolume,
        changePercentage: trend.changePercentage,
        isExploding: trend.isExploding
      });
    }
  };

  // 排序和筛选逻辑
  const sortedAndFilteredTrends = useMemo(() => {
    let filteredTrends = trends;

    // 应用黑天鹅筛选
    if (explodingFilter === 'exploding') {
      filteredTrends = trends.filter(trend => trend.isExploding);
    } else if (explodingFilter === 'normal') {
      filteredTrends = trends.filter(trend => !trend.isExploding);
    }

    // 应用排序
    return [...filteredTrends].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'keyword':
          aValue = a.keyword.toLowerCase();
          bValue = b.keyword.toLowerCase();
          break;
        case 'growth':
          aValue = a.changePercentage;
          bValue = b.changePercentage;
          break;
        case 'volume':
          aValue = a.searchVolume;
          bValue = b.searchVolume;
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'status':
          // 自定义状态排序：up > stable > down
          const statusOrder = { 'up': 3, 'stable': 2, 'down': 1 };
          aValue = statusOrder[a.currentTrend];
          bValue = statusOrder[b.currentTrend];
          break;
        case 'exploding':
          // 黑天鹅优先，然后按增长率排序
          if (a.isExploding && !b.isExploding) return -1;
          if (!a.isExploding && b.isExploding) return 1;
          aValue = a.changePercentage;
          bValue = b.changePercentage;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [trends, sortField, sortDirection, explodingFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // 默认降序
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-blue-600" />
      : <ArrowDown size={14} className="text-blue-600" />;
  };

  const renderMiniChart = (data: TrendData) => {
    const { chartData } = data;
    const values = chartData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    const width = 1200;
    const height = 240;
    const padding = 2;

    const pathData = chartData.map((point, index) => {
      const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const fillPath = pathData + ` L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

    return (
      <div className="bg-gray-50 rounded-lg p-3">
        <svg width={width} height={height} className="cursor-pointer w-full h-auto">
          <defs>
            <linearGradient id={`mini-gradient-${data.keyword.replace(/\s+/g, '-')}`} x1="0%\" y1="0%\" x2="0%\" y2="100%">
              <stop offset="0%" stopColor={data.isExploding ? "#ef4444" : "#10b981"} stopOpacity="0.3" />
              <stop offset="100%" stopColor={data.isExploding ? "#ef4444" : "#10b981"} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {[0, 0.5, 1].map((ratio, i) => (
            <line
              key={i}
              x1={padding}
              y1={height - padding - ratio * (height - 2 * padding)}
              x2={width - padding}
              y2={height - padding - ratio * (height - 2 * padding)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          <path
            d={fillPath}
            fill={`url(#mini-gradient-${data.keyword.replace(/\s+/g, '-')})`}
          />
          
          <path
            d={pathData}
            fill="none"
            stroke={data.isExploding ? "#ef4444" : "#10b981"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {chartData.map((point, index) => {
            const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding);
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={data.isExploding ? "#ef4444" : "#10b981"}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const renderExpandedChart = (data: TrendData) => {
    const { chartData, keyword } = data;
    const values = chartData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    const width = 800;
    const height = 300;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const pathData = chartData.map((point, index) => {
      const x = padding + (index / (chartData.length - 1)) * chartWidth;
      const y = height - padding - ((point.value - minValue) / range) * chartHeight;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const fillPath = pathData + ` L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Trend Details - {keyword}</h3>
          <a
            href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(keyword)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <ExternalLink size={14} />
            View in Google Trends
          </a>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm text-gray-600 mb-1">Search Volume</div>
            <div className="text-xl font-bold text-blue-600">{data.searchVolume.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm text-gray-600 mb-1">Growth Rate</div>
            <div className={`text-xl font-bold ${data.changePercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.changePercentage > 0 ? '+' : ''}{data.changePercentage}%
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm text-gray-600 mb-1">Peak Date</div>
            <div className="text-xl font-bold text-gray-800">{new Date(data.peakDate).toLocaleDateString()}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <div className={`text-xl font-bold ${data.isExploding ? 'text-red-600' : 'text-green-600'}`}>
              {data.isExploding ? 'Exploding' : 'Stable'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border">
          <h4 className="text-md font-semibold text-gray-700 mb-4">Trend Chart (2004-2024)</h4>
          <div className="w-full overflow-x-auto">
            <svg width={width} height={height} className="w-full h-auto min-w-[800px]">
              <defs>
                <linearGradient id={`expanded-gradient-${keyword.replace(/\s+/g, '-')}`} x1="0%\" y1="0%\" x2="0%\" y2="100%">
                  <stop offset="0%" stopColor={data.isExploding ? "#ef4444" : "#10b981"} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={data.isExploding ? "#ef4444" : "#10b981"} stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line
                  key={i}
                  x1={padding}
                  y1={height - padding - ratio * chartHeight}
                  x2={width - padding}
                  y2={height - padding - ratio * chartHeight}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}

              {[2004, 2008, 2012, 2016, 2020, 2024].map((year, index) => {
                const x = padding + (index / 5) * chartWidth;
                return (
                  <text
                    key={year}
                    x={x}
                    y={height - padding + 20}
                    textAnchor="middle"
                    className="text-xs fill-gray-500"
                  >
                    {year}
                  </text>
                );
              })}

              <path
                d={fillPath}
                fill={`url(#expanded-gradient-${keyword})`}
              />

              <path
                d={pathData}
                fill="none"
                stroke={data.isExploding ? "#ef4444" : "#10b981"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chartData.map((point, index) => {
                const x = padding + (index / (chartData.length - 1)) * chartWidth;
                const y = height - padding - ((point.value - minValue) / range) * chartHeight;
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={data.isExploding ? "#ef4444" : "#10b981"}
                    className="hover:r-5 transition-all cursor-pointer"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm text-yellow-800">
            <strong>Note:</strong> This section will display real-time data from SerpAPI Google Trends, including:
            <ul className="mt-2 ml-4 list-disc">
              <li>Real-time search volume data</li>
              <li>Geographic distribution information</li>
              <li>Related query recommendations</li>
              <li>Popular topic associations</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'down':
        return <TrendingDown size={16} className="text-red-600" />;
      default:
        return <Minus size={16} className="text-gray-600" />;
    }
  };

  const getChangeColor = (percentage: number) => {
    if (percentage > 100) return 'text-red-600 font-bold';
    if (percentage > 50) return 'text-orange-600 font-semibold';
    if (percentage > 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const handleRowClick = (keyword: string) => {
    setExpandedRow(expandedRow === keyword ? null : keyword);
    onTrendClick(keyword);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* 筛选控制栏 */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            <select
              value={explodingFilter}
              onChange={(e) => setExplodingFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Trends ({trends.length})</option>
              <option value="exploding">🚀 Black Swan Only ({trends.filter(t => t.isExploding).length})</option>
              <option value="normal">📊 Normal Trends ({trends.filter(t => !t.isExploding).length})</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{sortedAndFilteredTrends.length}</span> results
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('keyword')}
              >
                <div className="flex items-center gap-2">
                  Keyword
                  {getSortIcon('keyword')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[1200px]">
                Trend Chart (2004-2024)
              </th>
              <th className="px-2 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                ❤️
              </th>
              <th 
                className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('growth')}
              >
                <div className="flex items-center gap-2">
                  Growth
                  {getSortIcon('growth')}
                </div>
              </th>
              <th 
                className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('volume')}
              >
                <div className="flex items-center gap-2">
                  Search Volume
                  {getSortIcon('volume')}
                </div>
              </th>
              <th 
                className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('exploding')}
              >
                <div className="flex items-center gap-2">
                  🚀 Black Swan
                  {getSortIcon('exploding')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAndFilteredTrends.map((trend, index) => (
              <React.Fragment key={index}>
                <tr 
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                    expandedRow === trend.keyword ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleRowClick(trend.keyword)}
                >
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-900 flex items-center gap-1">
                          {trend.keyword}
                          {expandedRow === trend.keyword ? 
                            <ChevronUp size={12} className="text-gray-400" /> : 
                            <ChevronDown size={12} className="text-gray-400" />
                          }
                        </div>
                        {trend.isExploding && (
                          <div className="text-xs text-red-600 font-medium mt-1">
                            🚀 Black Swan Candidate
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {renderMiniChart(trend)}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(trend);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite(trend.keyword)
                          ? 'text-red-500 hover:text-red-600 bg-red-50'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                      title={isFavorite(trend.keyword) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart size={16} className={isFavorite(trend.keyword) ? 'fill-current' : ''} />
                    </button>
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className={`text-xs ${getChangeColor(trend.changePercentage)}`}>
                      {trend.changePercentage > 0 ? '+' : ''}{trend.changePercentage}%
                    </div>
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className="text-xs text-gray-900">
                      {trend.searchVolume.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <div className="flex flex-col items-center">
                        {getTrendIcon(trend.currentTrend)}
                        <span className="text-xs text-gray-600 capitalize mt-1">
                        {trend.currentTrend === 'up' ? 'Rising' : 
                         trend.currentTrend === 'down' ? 'Declining' : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      {trend.isExploding ? (
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-red-600 font-medium mt-1">Exploding</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                          <span className="text-xs text-gray-500 mt-1">Normal</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                
                {expandedRow === trend.keyword && (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 bg-gray-50">
                      {renderExpandedChart(trend)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};