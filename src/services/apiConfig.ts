// TODO: SERPAPI_INTEGRATION - Step 2: API configuration

export const API_CONFIG = {
  // TODO: SERPAPI_INTEGRATION - Step 2.1: Add your SerpAPI key here
  SERPAPI_KEY: process.env.REACT_APP_SERPAPI_KEY || 'YOUR_SERPAPI_KEY_HERE',
  
  // TODO: SERPAPI_INTEGRATION - Step 2.2: SerpAPI endpoints
  SERPAPI_BASE_URL: 'https://serpapi.com/search',
  
  // TODO: SERPAPI_INTEGRATION - Step 2.3: Default parameters
  DEFAULT_PARAMS: {
    engine: 'google_trends',
    hl: 'en',
    geo: 'US',
    data_type: 'TIMESERIES', // TIMESERIES, GEO, RELATED_TOPICS, RELATED_QUERIES
    date: 'all', // all, past_hour, past_4_hours, past_day, past_7_days, past_30_days, past_90_days, past_12_months, past_5_years
  },
  
  // TODO: SERPAPI_INTEGRATION - Step 2.4: Rate limiting
  RATE_LIMIT: {
    MAX_REQUESTS_PER_MINUTE: 60,
    MAX_REQUESTS_PER_HOUR: 3600,
    RETRY_DELAY: 1000, // ms
    MAX_RETRIES: 3,
  },
  
  // TODO: SERPAPI_INTEGRATION - Step 2.5: Cache settings
  CACHE_SETTINGS: {
    TTL: 24 * 60 * 60 * 1000, // 24 hours in ms
    MAX_CACHE_SIZE: 100,
    ENABLE_CACHE: true,
  },
};

// TODO: SERPAPI_INTEGRATION - Step 2.6: Environment validation
export const validateApiConfig = (): boolean => {
  if (!API_CONFIG.SERPAPI_KEY || API_CONFIG.SERPAPI_KEY === 'YOUR_SERPAPI_KEY_HERE') {
    console.error('❌ SERPAPI_KEY is not configured. Please set REACT_APP_SERPAPI_KEY in your .env file');
    return false;
  }
  return true;
};

// TODO: SERPAPI_INTEGRATION - Step 2.7: Build API URL helper
export const buildApiUrl = (params: Record<string, string>): string => {
  const url = new URL(API_CONFIG.SERPAPI_BASE_URL);
  
  // Add API key
  url.searchParams.append('api_key', API_CONFIG.SERPAPI_KEY);
  
  // Add default params
  Object.entries(API_CONFIG.DEFAULT_PARAMS).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  // Add custom params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
};