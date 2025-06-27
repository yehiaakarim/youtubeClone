import { mockVideos } from './mockData';

const API_BASE = 'https://www.googleapis.com/youtube/v3';
const CACHE_EXPIRY_HOURS = 2;
const CACHE_EXPIRY_MS = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;

const CACHE_KEYS = {
  live: 'yt_cache_live',
  music: 'yt_cache_music',
  gaming: 'yt_cache_gaming',
  popular: 'yt_cache_popular'
};

let cachedLiveVideos = [];
let cachedMusicVideos = [];
let cachedGamingVideos = [];

const getLocalStorageCache = (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
};

const setLocalStorageCache = (key, data) => {
  const cache = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(cache));
};

const fetchWithFallback = async (endpoint, params = {}) => {
  const apiKeys = import.meta.env.VITE_YOUTUBE_API_KEYS.split(',');
  
  for (const key of apiKeys) {
    try {
      const url = new URL(`${API_BASE}${endpoint}`);
      const finalParams = {
        ...params,
        key,
        part: params.part || 'snippet',
      };
      url.search = new URLSearchParams(finalParams).toString();
      
      const response = await fetch(url);
      
      if (response.ok) {
        return await response.json();
      }
      
      const errorData = await response.json();
      if (response.status === 403 && errorData.error?.errors?.[0]?.reason === 'quotaExceeded') {
        console.warn(`Quota exceeded for key: ${key.substring(0,8)}...`);
        continue;
      }
      
      throw new Error(errorData.error?.message || 'API request failed');
      
    } catch (error) {
      console.error(`API error with key ${key.substring(0,8)}...:`, error.message);
      if (error.message.includes('quotaExceeded')) continue;
      break;
    }
  }

  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return { items: mockVideos.slice(0, params.maxResults || 12) };
  }
  return { items: [] };
};

const formatItem = (item) => {
  const formatViews = (viewCount) => {
    if (!viewCount) return "N/A";
    const count = parseInt(viewCount, 10);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  };

  return {
    id: item.id?.videoId || item.id,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails?.medium?.url || 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    views: item.statistics ? formatViews(item.statistics.viewCount) : "N/A",
    timestamp: item.snippet.publishedAt
  };
};

const fetchVideoStatistics = async (videoIds) => {
  if (videoIds.length === 0) return [];
  try {
    const data = await fetchWithFallback('/videos', {
      id: videoIds.join(','),
      part: 'statistics',
      maxResults: videoIds.length
    });
    return data.items;
  } catch (error) {
    return [];
  }
};

const fetchCategoryVideos = async (params, cache, cacheKey) => {
  const now = Date.now();
  const storedCache = getLocalStorageCache(cacheKey);
  
  if (storedCache && (now - storedCache.timestamp < CACHE_EXPIRY_MS)) {
    cache.splice(0, cache.length, ...storedCache.data);
    return storedCache.data;
  }

  try {
    const searchParams = {
      ...params,
      type: 'video',
      maxResults: 12,
      regionCode: 'US',
      part: 'snippet',
      relevanceLanguage: 'en'
    };

    const searchData = await fetchWithFallback('/search', searchParams);
    if (!searchData.items || searchData.items.length === 0) {
      throw new Error('No videos found');
    }

    const videoIds = searchData.items.map(item => item.id.videoId);
    const statsItems = await fetchVideoStatistics(videoIds);

    const mergedItems = searchData.items.map(item => {
      const stats = statsItems.find(s => s.id === item.id.videoId);
      return {
        ...item,
        statistics: stats?.statistics
      };
    });

    const formatted = mergedItems.map(formatItem);
    cache.splice(0, cache.length, ...formatted);
    setLocalStorageCache(cacheKey, formatted);
    return formatted;
  } catch (error) {
    if (cache.length) return cache;
    
    const storedCache = getLocalStorageCache(cacheKey);
    if (storedCache) {
      cache.splice(0, cache.length, ...storedCache.data);
      return storedCache.data;
    }
    
    return mockVideos.slice(0, 12).map(formatItem);
  }
};

export const fetchLiveVideos = async () => {
  const params = {
    eventType: 'live',
    order: 'viewCount',
    maxResults: 12,
    q: ' live news'  
  };
  return fetchCategoryVideos(params, cachedLiveVideos, CACHE_KEYS.live);
};

export const fetchMusicVideos = async () => {
  const params = {
    videoCategoryId: '10',
    maxResults: 12,
    order: 'viewCount',
    q: 'pop rock hiphop rap country jazz music'  
  };
  return fetchCategoryVideos(params, cachedMusicVideos, CACHE_KEYS.music);
};

export const fetchGamingVideos = async () => {
  const params = {
    videoCategoryId: '20',
    maxResults: 12,
    order: 'viewCount',
    q: 'gaming walkthrough gameplay esports stream'  
  };
  return fetchCategoryVideos(params, cachedGamingVideos, CACHE_KEYS.gaming);
};

export const fetchPopularVideos = async () => {
  const cacheKey = CACHE_KEYS.popular;
  const now = Date.now();
  const storedCache = getLocalStorageCache(cacheKey);
  
  if (storedCache && (now - storedCache.timestamp < CACHE_EXPIRY_MS)) {
    return storedCache.data;
  }

  try {
    const data = await fetchWithFallback('/videos', {
      part: 'snippet,statistics',
      chart: 'mostPopular',
      maxResults: 12,
      regionCode: 'US',
    });
    const formatted = data.items.map(formatItem);
    setLocalStorageCache(cacheKey, formatted);
    return formatted;
  } catch (error) {
    const storedCache = getLocalStorageCache(cacheKey);
    if (storedCache) return storedCache.data;
    
    return mockVideos.slice(0, 12).map(formatItem);
  }
};

export const searchVideos = async (query) => {
  try {
    const searchData = await fetchWithFallback('/search', {
      q: query,
      part: 'snippet',
      maxResults: 12,
      type: 'video',
    });
    
    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }
    
    const videoIds = searchData.items.map(item => item.id.videoId);
    const statsItems = await fetchVideoStatistics(videoIds);
    
    const mergedItems = searchData.items.map(item => {
      const stats = statsItems.find(s => s.id === item.id.videoId);
      return {
        ...item,
        statistics: stats?.statistics
      };
    });
    
    return mergedItems.map(formatItem);
  } catch (error) {
    console.error('Search error:', error);
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return mockVideos.slice(0, 12).map(formatItem);
    }
    return [];
  }
};

export const getSearchSuggestions = async (query) => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return mockVideos
      .filter(video => video.title.toLowerCase().includes(query.toLowerCase()))
      .map(video => video.title)
      .slice(0, 5);
  }
  try {
    const response = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${query}`);
    const data = await response.json();
    return data[1] || [];
  } catch (error) {
    return [];
  }
};

export const fetchHistoryVideos = async () => {
  return mockVideos.slice(0, 5).map(formatItem);
};