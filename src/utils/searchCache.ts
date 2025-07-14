// 搜索缓存管理工具
export interface CachedSearchResult {
  keywords: string[];
  results: any[];
  timestamp: number;
  searchHash: string;
  apiCallCount: number;
}

export interface CacheStats {
  totalSearches: number;
  cachedSearches: number;
  apiCalls: number;
  cacheHits: number;
  lastCleared: number;
}

class SearchCacheManager {
  private readonly CACHE_KEY = 'chending_search_cache';
  private readonly STATS_KEY = 'chending_cache_stats';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时
  private readonly MAX_CACHE_SIZE = 100; // 最多缓存100个搜索结果

  // 生成搜索哈希值
  private generateSearchHash(keywords: string[]): string {
    const sortedKeywords = [...keywords].sort().map(k => k.toLowerCase().trim());
    return btoa(JSON.stringify(sortedKeywords)).replace(/[^a-zA-Z0-9]/g, '');
  }

  // 获取缓存统计
  getStats(): CacheStats {
    try {
      const stats = localStorage.getItem(this.STATS_KEY);
      return stats ? JSON.parse(stats) : {
        totalSearches: 0,
        cachedSearches: 0,
        apiCalls: 0,
        cacheHits: 0,
        lastCleared: Date.now()
      };
    } catch {
      return {
        totalSearches: 0,
        cachedSearches: 0,
        apiCalls: 0,
        cacheHits: 0,
        lastCleared: Date.now()
      };
    }
  }

  // 更新统计
  private updateStats(type: 'search' | 'cache_hit' | 'api_call') {
    const stats = this.getStats();
    
    switch (type) {
      case 'search':
        stats.totalSearches++;
        break;
      case 'cache_hit':
        stats.cacheHits++;
        break;
      case 'api_call':
        stats.apiCalls++;
        break;
    }

    try {
      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.warn('Failed to update cache stats:', error);
    }
  }

  // 获取所有缓存
  private getAllCache(): Record<string, CachedSearchResult> {
    try {
      const cache = localStorage.getItem(this.CACHE_KEY);
      return cache ? JSON.parse(cache) : {};
    } catch {
      return {};
    }
  }

  // 保存缓存
  private saveCache(cache: Record<string, CachedSearchResult>) {
    try {
      // 清理过期缓存
      const now = Date.now();
      const cleanedCache: Record<string, CachedSearchResult> = {};
      
      Object.entries(cache).forEach(([hash, result]) => {
        if (now - result.timestamp < this.CACHE_DURATION) {
          cleanedCache[hash] = result;
        }
      });

      // 如果缓存过多，删除最旧的
      const cacheEntries = Object.entries(cleanedCache);
      if (cacheEntries.length > this.MAX_CACHE_SIZE) {
        cacheEntries.sort((a, b) => b[1].timestamp - a[1].timestamp);
        const limitedCache: Record<string, CachedSearchResult> = {};
        cacheEntries.slice(0, this.MAX_CACHE_SIZE).forEach(([hash, result]) => {
          limitedCache[hash] = result;
        });
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(limitedCache));
      } else {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(cleanedCache));
      }
    } catch (error) {
      console.warn('Failed to save cache:', error);
    }
  }

  // 检查是否有缓存
  hasCache(keywords: string[]): boolean {
    if (keywords.length === 0) return false;
    
    const hash = this.generateSearchHash(keywords);
    const cache = this.getAllCache();
    const cached = cache[hash];
    
    if (!cached) return false;
    
    // 检查是否过期
    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      delete cache[hash];
      this.saveCache(cache);
      return false;
    }
    
    return true;
  }

  // 获取缓存结果
  getCache(keywords: string[]): any[] | null {
    if (keywords.length === 0) return null;
    
    const hash = this.generateSearchHash(keywords);
    const cache = this.getAllCache();
    const cached = cache[hash];
    
    if (!cached) return null;
    
    // 检查是否过期
    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      delete cache[hash];
      this.saveCache(cache);
      return null;
    }
    
    this.updateStats('cache_hit');
    return cached.results;
  }

  // 保存搜索结果到缓存
  setCache(keywords: string[], results: any[], apiCallCount: number = 1) {
    if (keywords.length === 0) return;
    
    const hash = this.generateSearchHash(keywords);
    const cache = this.getAllCache();
    
    cache[hash] = {
      keywords: [...keywords],
      results: JSON.parse(JSON.stringify(results)), // 深拷贝
      timestamp: Date.now(),
      searchHash: hash,
      apiCallCount
    };
    
    this.saveCache(cache);
    this.updateStats('api_call');
  }

  // 删除特定缓存
  removeCache(keywords: string[]) {
    const hash = this.generateSearchHash(keywords);
    const cache = this.getAllCache();
    delete cache[hash];
    this.saveCache(cache);
  }

  // 清空所有缓存
  clearAllCache() {
    try {
      localStorage.removeItem(this.CACHE_KEY);
      const stats = this.getStats();
      stats.lastCleared = Date.now();
      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  // 获取缓存信息列表
  getCacheList(): Array<{
    keywords: string[];
    timestamp: number;
    searchHash: string;
    apiCallCount: number;
    age: string;
  }> {
    const cache = this.getAllCache();
    const now = Date.now();
    
    return Object.values(cache).map(item => ({
      keywords: item.keywords,
      timestamp: item.timestamp,
      searchHash: item.searchHash,
      apiCallCount: item.apiCallCount,
      age: this.formatAge(now - item.timestamp)
    })).sort((a, b) => b.timestamp - a.timestamp);
  }

  // 格式化时间差
  private formatAge(ms: number): string {
    const minutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  }

  // 获取缓存大小（KB）
  getCacheSize(): number {
    try {
      const cache = localStorage.getItem(this.CACHE_KEY);
      return cache ? Math.round(new Blob([cache]).size / 1024) : 0;
    } catch {
      return 0;
    }
  }

  // 执行搜索（带缓存逻辑）
  async executeSearch(
    keywords: string[], 
    searchFunction: (keywords: string[]) => Promise<any[]>,
    forceRefresh: boolean = false
  ): Promise<{ results: any[], fromCache: boolean, cacheAge?: string }> {
    this.updateStats('search');
    
    // 如果不强制刷新且有缓存，返回缓存结果
    if (!forceRefresh && this.hasCache(keywords)) {
      const cachedResults = this.getCache(keywords);
      if (cachedResults) {
        const cache = this.getAllCache();
        const hash = this.generateSearchHash(keywords);
        const cacheAge = this.formatAge(Date.now() - cache[hash].timestamp);
        
        return {
          results: cachedResults,
          fromCache: true,
          cacheAge
        };
      }
    }
    
    // 执行实际搜索
    const results = await searchFunction(keywords);
    
    // 保存到缓存
    this.setCache(keywords, results);
    
    return {
      results,
      fromCache: false
    };
  }
}

// 导出单例实例
export const searchCache = new SearchCacheManager();