// TODO: SERPAPI_INTEGRATION - Step 4: Transform SerpAPI data to TrendData format

import { TrendData } from '../types';
import { SerpApiGoogleTrendsResponse } from './apiTypes';

// TODO: SERPAPI_INTEGRATION - Step 4.1: Main transformation function
export const transformSerpApiToTrendData = (
  serpApiResponse: SerpApiGoogleTrendsResponse,
  keywords: string[]
): TrendData[] => {
  const results: TrendData[] = [];

  try {
    // Process each keyword
    keywords.forEach((keyword, index) => {
      const trendData = transformSingleKeyword(serpApiResponse, keyword, index);
      if (trendData) {
        results.push(trendData);
      }
    });

    console.log(`✅ Transformed ${results.length} trends from SerpAPI response`);
    return results;

  } catch (error) {
    console.error('❌ Error transforming SerpAPI data:', error);
    return [];
  }
};

// TODO: SERPAPI_INTEGRATION - Step 4.2: Transform single keyword data
const transformSingleKeyword = (
  response: SerpApiGoogleTrendsResponse,
  keyword: string,
  keywordIndex: number
): TrendData | null => {
  try {
    const timelineData = response.interest_over_time?.timeline_data || [];
    
    if (timelineData.length === 0) {
      console.warn(`⚠️ No timeline data for keyword: ${keyword}`);
      return null;
    }

    // Extract chart data
    const chartData = timelineData.map(point => ({
      date: point.date,
      value: point.values[keywordIndex]?.extracted_value || 0,
    }));

    // Calculate metrics
    const values = chartData.map(d => d.value);
    const currentValue = values[values.length - 1] || 0;
    const previousValue = values[values.length - 2] || 0;
    const maxValue = Math.max(...values);
    const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;

    // Calculate change percentage
    const changePercentage = previousValue > 0 
      ? Math.round(((currentValue - previousValue) / previousValue) * 100)
      : currentValue > 0 ? 100 : 0;

    // Determine if it's exploding (black swan candidate)
    const isExploding = changePercentage > 200 || (currentValue > avgValue * 3);

    // Find peak date
    const peakIndex = values.indexOf(maxValue);
    const peakDate = chartData[peakIndex]?.date || new Date().toISOString().split('T')[0];

    // Determine current trend
    const recentValues = values.slice(-5); // Last 5 data points
    const trendDirection = calculateTrendDirection(recentValues);

    // Estimate search volume (SerpAPI doesn't provide absolute numbers)
    const estimatedSearchVolume = Math.round(currentValue * 10000 + Math.random() * 50000);

    // Categorize keyword
    const category = categorizeKeyword(keyword);

    return {
      keyword,
      searchVolume: estimatedSearchVolume,
      changePercentage,
      isExploding,
      category,
      chartData,
      peakDate,
      currentTrend: trendDirection,
    };

  } catch (error) {
    console.error(`❌ Error processing keyword "${keyword}":`, error);
    return null;
  }
};

// TODO: SERPAPI_INTEGRATION - Step 4.3: Calculate trend direction
const calculateTrendDirection = (values: number[]): 'up' | 'down' | 'stable' => {
  if (values.length < 2) return 'stable';

  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));

  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

  const threshold = 5; // 5% threshold for stability

  if (secondAvg > firstAvg * (1 + threshold / 100)) return 'up';
  if (secondAvg < firstAvg * (1 - threshold / 100)) return 'down';
  return 'stable';
};

// TODO: SERPAPI_INTEGRATION - Step 4.4: Categorize keywords
const categorizeKeyword = (keyword: string): string => {
  const categories = {
    'AI & Technology': ['ai', 'artificial intelligence', 'chatgpt', 'machine learning', 'automation', 'robot', 'tech'],
    'Health & Pandemic': ['covid', 'vaccine', 'health', 'pandemic', 'virus', 'medical', 'hospital'],
    'Finance & Crypto': ['bitcoin', 'crypto', 'stock', 'investment', 'finance', 'trading', 'market'],
    'Climate & Environment': ['climate', 'environment', 'green', 'renewable', 'carbon', 'sustainability'],
    'Remote Work': ['remote', 'work from home', 'zoom', 'virtual', 'online', 'digital'],
    'Social & Politics': ['election', 'politics', 'social', 'protest', 'democracy', 'vote'],
    'Supply Chain': ['supply', 'shortage', 'logistics', 'shipping', 'manufacturing'],
    'Consumer Behavior': ['shopping', 'ecommerce', 'delivery', 'subscription', 'streaming'],
    'Emerging Tech': ['blockchain', 'nft', 'metaverse', 'vr', 'ar', 'quantum'],
  };

  const lowerKeyword = keyword.toLowerCase();
  
  for (const [category, terms] of Object.entries(categories)) {
    if (terms.some(term => lowerKeyword.includes(term))) {
      return category;
    }
  }

  return 'General Trends';
};

// TODO: SERPAPI_INTEGRATION - Step 4.5: Extract related queries and topics
export const extractRelatedData = (response: SerpApiGoogleTrendsResponse) => {
  return {
    relatedQueries: {
      rising: response.related_queries?.rising || [],
      top: response.related_queries?.top || [],
    },
    relatedTopics: {
      rising: response.related_topics?.rising || [],
      top: response.related_topics?.top || [],
    },
    regionData: response.interest_by_region?.region_data || [],
  };
};