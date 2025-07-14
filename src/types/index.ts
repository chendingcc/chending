export interface TrendData {
  keyword: string;
  searchVolume: number;
  changePercentage: number;
  isExploding: boolean;
  category: string;
  chartData: { date: string; value: number }[];
  peakDate: string;
  currentTrend: 'up' | 'down' | 'stable';
}

export interface SearchSuggestion {
  keyword: string;
  category: string;
  description: string;
}

export interface BlackSwanCategory {
  name: string;
  keywords: string[];
}

export interface AIKeyword {
  name: string;
  relevanceScore: number; // 1-10
  businessValue: 'High' | 'Medium' | 'Low';
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  trendPrediction: 'Explosive' | 'Rising' | 'Stable' | 'Declining';
  applicationField: string;
  description: string;
  opportunities: string[];
  risks: string[];
}

export interface AIBlackSwanCategory {
  name: string;
  keywords: AIKeyword[];
  totalKeywords: number;
  avgRelevanceScore: number;
  highRiskCount: number;
}