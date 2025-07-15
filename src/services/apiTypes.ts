// TODO: SERPAPI_INTEGRATION - Step 1: Define API response types

export interface SerpApiGoogleTrendsResponse {
  search_metadata: {
    id: string;
    status: string;
    json_endpoint: string;
    created_at: string;
    processed_at: string;
    google_trends_url: string;
    raw_html_file: string;
    total_time_taken: number;
  };
  search_parameters: {
    engine: string;
    q: string;
    geo: string;
    hl: string;
    data_type: string;
    date: string;
  };
  interest_over_time: {
    timeline_data: Array<{
      date: string;
      timestamp: string;
      values: Array<{
        query: string;
        value: number;
        extracted_value: number;
      }>;
    }>;
  };
  interest_by_region?: {
    region_data: Array<{
      location: string;
      value: number;
      extracted_value: number;
    }>;
  };
  related_topics?: {
    rising: Array<{
      query: string;
      value: number;
      extracted_value: number;
      link: string;
    }>;
    top: Array<{
      query: string;
      value: number;
      extracted_value: number;
      link: string;
    }>;
  };
  related_queries?: {
    rising: Array<{
      query: string;
      value: number;
      extracted_value: number;
      link: string;
    }>;
    top: Array<{
      query: string;
      value: number;
      extracted_value: number;
      link: string;
    }>;
  };
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  cached?: boolean;
  timestamp: number;
}

// TODO: SERPAPI_INTEGRATION - Step 1.1: Add rate limiting types
export interface RateLimitInfo {
  remaining: number;
  reset: number;
  limit: number;
}

export interface ApiQuotaInfo {
  used: number;
  limit: number;
  resetDate: string;
}