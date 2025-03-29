import axios from 'axios';
import { ref } from 'vue';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Cache storage
const cache = new Map<string, CacheItem<any>>();

// Cache expiration time (in milliseconds)
const DEFAULT_CACHE_TIME = 500 * 60 * 1000; // 5 minutes by default

export function useApi() {
  const baseURL = 'http://127.0.0.1:8000';
  const loading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  /**
   * Makes a GET request with caching support
   */
  async function get<T>(
    url: string,
    params = {},
    cacheTime = DEFAULT_CACHE_TIME
  ): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
    const cacheKey = `${fullUrl}?${new URLSearchParams(params).toString()}`;

    // Check if we have a valid cached response
    const cachedItem = cache.get(cacheKey);
    const now = Date.now();

    if (cachedItem && now < cachedItem.expiresAt) {
      return cachedItem.data;
    }

    // If no cache or expired, make the request
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get<T>(fullUrl, { params });

      // Cache the response
      cache.set(cacheKey, {
        data: response.data,
        timestamp: now,
        expiresAt: now + cacheTime
      });

      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error');
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Makes a POST request (not cached)
   */
  async function post<T>(url: string, data = {}): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post<T>(fullUrl, data);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error');
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Makes a PUT request (not cached)
   */
  async function put<T>(url: string, data = {}): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.put<T>(fullUrl, data);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error');
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Makes a DELETE request (not cached)
   */
  async function del<T>(url: string): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.delete<T>(fullUrl);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error');
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Clears the cache for a specific URL or all cache if no URL is provided
   */
  function clearCache(url?: string): void {
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
      // Clear all cache entries that start with this URL
      for (const key of cache.keys()) {
        if (key.startsWith(fullUrl)) {
          cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      cache.clear();
    }
  }

  /**
   * Invalidates and refreshes data for a specific URL
   */
  async function refresh<T>(url: string, params = {}): Promise<T> {
    clearCache(url);
    return get<T>(url, params);
  }

  return {
    get,
    post,
    put,
    del,
    clearCache,
    refresh,
    loading,
    error
  };
}
