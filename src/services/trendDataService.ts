// ============================================================
// Trend Data Service
// Bridges SerpApi → Engine pipeline
// Handles both real API and mock data fallback
// ============================================================

import { TimeSeriesPoint } from '../types';
import { SerpApiGoogleTrendsResponse } from './apiTypes';
import { API_CONFIG, buildApiUrl, validateApiConfig } from './apiConfig';

export interface TrendsFetchResult {
  keyword: string;
  timeSeries: TimeSeriesPoint[];
  relatedQueries: string[];
  source: 'api' | 'mock';
}

/**
 * Fetch Google Trends time series for a single keyword via SerpApi.
 * Returns standardized TimeSeriesPoint[] ready for the anomaly engine.
 */
export async function fetchTrendTimeSeries(keyword: string): Promise<TrendsFetchResult | null> {
  if (!validateApiConfig()) {
    return null; // Caller should fall back to mock
  }

  try {
    const url = buildApiUrl({
      q: keyword,
      data_type: 'TIMESERIES',
      date: 'today 5-y', // last 5 years for good derivative calculation
    });

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: SerpApiGoogleTrendsResponse = await response.json();
    return transformToTimeSeries(keyword, data);
  } catch (error) {
    console.warn(`SerpApi fetch failed for "${keyword}":`, error);
    return null;
  }
}

/**
 * Fetch trends for multiple keywords.
 * SerpApi Google Trends supports up to 5 keywords per request for comparison.
 * We batch accordingly and add delays between batches.
 */
export async function fetchTrendsBatch(
  keywords: string[],
  onProgress?: (done: number, total: number) => void
): Promise<TrendsFetchResult[]> {
  if (!validateApiConfig()) {
    return []; // Caller should fall back to mock
  }

  const results: TrendsFetchResult[] = [];
  const batchSize = 5;
  const batches: string[][] = [];

  for (let i = 0; i < keywords.length; i += batchSize) {
    batches.push(keywords.slice(i, i + batchSize));
  }

  let done = 0;
  for (const batch of batches) {
    try {
      const url = buildApiUrl({
        q: batch.join(','),
        data_type: 'TIMESERIES',
        date: 'today 5-y',
      });

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: SerpApiGoogleTrendsResponse = await response.json();

      // Each keyword in the batch gets its own time series
      batch.forEach((kw, index) => {
        const result = transformToTimeSeriesMulti(kw, index, data);
        if (result) {
          results.push(result);
        }
      });

      done += batch.length;
      onProgress?.(done, keywords.length);

      // Rate limit delay between batches
      if (batches.length > 1) {
        await delay(API_CONFIG.RATE_LIMIT.RETRY_DELAY);
      }
    } catch (error) {
      console.warn(`Batch fetch failed for [${batch.join(', ')}]:`, error);
      done += batch.length;
      onProgress?.(done, keywords.length);
    }
  }

  return results;
}

/**
 * Fetch related queries for a keyword (useful for long-tail detection).
 */
export async function fetchRelatedQueries(keyword: string): Promise<string[]> {
  if (!validateApiConfig()) return [];

  try {
    const url = buildApiUrl({
      q: keyword,
      data_type: 'RELATED_QUERIES',
    });

    const response = await fetch(url);
    if (!response.ok) return [];

    const data: SerpApiGoogleTrendsResponse = await response.json();
    const rising = data.related_queries?.rising || [];
    return rising.map(q => q.query);
  } catch {
    return [];
  }
}

// --- Internal helpers ---

function transformToTimeSeries(
  keyword: string,
  data: SerpApiGoogleTrendsResponse
): TrendsFetchResult | null {
  const timeline = data.interest_over_time?.timeline_data;
  if (!timeline || timeline.length === 0) return null;

  const timeSeries: TimeSeriesPoint[] = timeline.map(point => ({
    date: point.date,
    value: point.values[0]?.extracted_value || 0,
  }));

  const relatedQueries = [
    ...(data.related_queries?.rising || []).map(q => q.query),
    ...(data.related_queries?.top || []).slice(0, 5).map(q => q.query),
  ];

  return {
    keyword,
    timeSeries,
    relatedQueries,
    source: 'api',
  };
}

function transformToTimeSeriesMulti(
  keyword: string,
  index: number,
  data: SerpApiGoogleTrendsResponse
): TrendsFetchResult | null {
  const timeline = data.interest_over_time?.timeline_data;
  if (!timeline || timeline.length === 0) return null;

  const timeSeries: TimeSeriesPoint[] = timeline.map(point => ({
    date: point.date,
    value: point.values[index]?.extracted_value || 0,
  }));

  // Only return if we got actual data (not all zeros)
  const hasData = timeSeries.some(p => p.value > 0);
  if (!hasData) return null;

  return {
    keyword,
    timeSeries,
    relatedQueries: [],
    source: 'api',
  };
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
