// TODO: SERPAPI_INTEGRATION - Step 3: Main Google Trends API service

import { TrendData } from '../types';
import { SerpApiGoogleTrendsResponse, ApiResponse, RateLimitInfo } from './apiTypes';
import { API_CONFIG, buildApiUrl, validateApiConfig } from './apiConfig';
import { transformSerpApiToTrendData } from './dataTransformer';
import { searchCache } from '../utils/searchCache';

class GoogleTrendsService {
  private rateLimitInfo: RateLimitInfo = {
    remaining: API_CONFIG.RATE_LIMIT.MAX_REQUESTS_PER_MINUTE,
    reset: Date.now() + 60000,
    limit: API_CONFIG.RATE_LIMIT.MAX_REQUESTS_PER_MINUTE,
  };

  // TODO: SERPAPI_INTEGRATION - Step 3.1: Main search method
  async searchTrends(keywords: string[]): Promise<ApiResponse<TrendData[]>> {
    try {
      // Validate configuration
      if (!validateApiConfig()) {
        // Return a special response indicating fallback should be used
        return {
          success: false,
          error: {
            message: 'SerpAPI key not configured, using mock data',
            code: 'NO_API_KEY',
            status: 200, // Not a real error, just missing config
          },
          timestamp: Date.now(),
        };
      }

      // Check rate limits
      if (!this.checkRateLimit()) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Process keywords (SerpAPI supports up to 5 keywords per request)
      const results: TrendData[] = [];
      const keywordBatches = this.batchKeywords(keywords, 5);

      for (const batch of keywordBatches) {
        const batchResults = await this.fetchTrendsBatch(batch);
        results.push(...batchResults);
        
        // Add delay between batches to respect rate limits
        if (keywordBatches.length > 1) {
          await this.delay(API_CONFIG.RATE_LIMIT.RETRY_DELAY);
        }
      }

      return {
        success: true,
        data: results,
        timestamp: Date.now(),
      };

    } catch (error) {
      console.error('❌ Google Trends API Error:', error);
      
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'API_ERROR',
          status: 500,
          details: error,
        },
        timestamp: Date.now(),
      };
    }
  }

  // TODO: SERPAPI_INTEGRATION - Step 3.2: Fetch trends for a batch of keywords
  private async fetchTrendsBatch(keywords: string[]): Promise<TrendData[]> {
    const query = keywords.join(',');
    const url = buildApiUrl({ q: query });

    console.log('🌐 Fetching Google Trends data for:', keywords);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: SerpApiGoogleTrendsResponse = await response.json();
    
    // Update rate limit info from response headers
    this.updateRateLimitInfo(response);

    // Transform SerpAPI response to our TrendData format
    return transformSerpApiToTrendData(data, keywords);
  }

  // TODO: SERPAPI_INTEGRATION - Step 3.3: Rate limiting helpers
  private checkRateLimit(): boolean {
    const now = Date.now();
    
    if (now > this.rateLimitInfo.reset) {
      // Reset rate limit
      this.rateLimitInfo.remaining = this.rateLimitInfo.limit;
      this.rateLimitInfo.reset = now + 60000; // Reset in 1 minute
    }
    
    return this.rateLimitInfo.remaining > 0;
  }

  private updateRateLimitInfo(response: Response): void {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    
    if (remaining) this.rateLimitInfo.remaining = parseInt(remaining);
    if (reset) this.rateLimitInfo.reset = parseInt(reset) * 1000; // Convert to ms
  }

  // TODO: SERPAPI_INTEGRATION - Step 3.4: Utility methods
  private batchKeywords(keywords: string[], batchSize: number): string[][] {
    const batches: string[][] = [];
    for (let i = 0; i < keywords.length; i += batchSize) {
      batches.push(keywords.slice(i, i + batchSize));
    }
    return batches;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // TODO: SERPAPI_INTEGRATION - Step 3.5: Get rate limit status
  getRateLimitStatus(): RateLimitInfo {
    return { ...this.rateLimitInfo };
  }
}

// TODO: SERPAPI_INTEGRATION - Step 3.6: Export singleton instance
export const googleTrendsService = new GoogleTrendsService();

// TODO: SERPAPI_INTEGRATION - Step 3.7: Fallback to mock data
export const searchTrendsWithFallback = async (keywords: string[]): Promise<TrendData[]> => {
  try {
    const response = await googleTrendsService.searchTrends(keywords);
    
    if (response.success && response.data) {
      console.log('✅ Using real Google Trends data');
      return response.data;
    } else {
      // Check if it's just missing API key (not a real error)
      if (response.error?.code === 'NO_API_KEY') {
        console.log('💡 SerpAPI key not configured, using mock data');
      } else {
        console.warn('⚠️ API request failed, falling back to mock data:', response.error?.message);
      }
      throw new Error(response.error?.message || 'API request failed');
    }
  } catch (error) {
    // Only show warning for actual errors, not missing config
    if (!error.message?.includes('SerpAPI key not configured')) {
      console.warn('⚠️ Falling back to mock data due to API error:', error);
    }
    
    // Import mock data as fallback
    const { mockTrendData } = await import('../data/mockData');
    
    // Filter mock data based on keywords
    const filteredResults = mockTrendData.filter(trend =>
      keywords.some(keyword =>
        trend.keyword.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(trend.keyword.toLowerCase())
      )
    );

    return filteredResults.length > 0 ? filteredResults : mockTrendData.slice(0, 50);
  }
};