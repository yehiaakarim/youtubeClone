import { mockVideos } from './mockData';

const API_BASE = 'https://www.googleapis.com/youtube/v3';


let cachedLiveVideos = [];
let cachedMusicVideos = [];
let cachedGamingVideos = [];

const fetchWithFallback = async (endpoint, params = {}) => {
  try {
    const url = new URL(`${API_BASE}${endpoint}`);
    const finalParams = {
      ...params,
      key: import.meta.env.VITE_YOUTUBE_API_KEY,
      part: params.part || 'snippet',
    };
    url.search = new URLSearchParams(finalParams).toString();
    
    const response = await fetch(url);
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      console.warn('Falling back to mock data');
      return { items: mockVideos.slice(0, params.maxResults || 50) };
    }
    
    return { items: [] };
  }
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }
  return response.json();
};


const formatVideo = (item) => ({
  id: item.id,
  title: item.snippet.title,
  channelTitle: item.snippet.channelTitle,
  thumbnail: item.snippet.thumbnails?.medium?.url || 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
  views: item.statistics ? `${Math.round(item.statistics.viewCount / 1000)}K views` : "N/A",
  timestamp: item.snippet.publishedAt
});

const formatSearchResult = (item) => ({
  id: item.id.videoId || item.id,
  title: item.snippet.title,
  channelTitle: item.snippet.channelTitle,
  thumbnail: item.snippet.thumbnails?.medium?.url || 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
  views: "N/A", 
  timestamp: item.snippet.publishedAt
});


export const fetchLiveVideos = async () => {
  try {
    const data = await fetchWithFallback('/search', {
      part: 'snippet',
      eventType: 'live',
      type: 'video',
      maxResults: 30,
    });
    if (data.items?.length > 0) {
      cachedLiveVideos = data.items.map(formatSearchResult);
    }
    return cachedLiveVideos.length ? cachedLiveVideos : mockVideos.slice(0, 30).map(formatSearchResult);
  } catch (error) {
    return cachedLiveVideos.length ? cachedLiveVideos : mockVideos.slice(0, 30).map(formatSearchResult);
  }
};

export const fetchMusicVideos = async () => {
  try {
    const data = await fetchWithFallback('/search', {
      part: 'snippet',
      videoCategoryId: '10',
      type: 'video',
      maxResults: 30,
      order: 'viewCount',
    });
    if (data.items?.length > 0) {
      cachedMusicVideos = data.items.map(formatSearchResult);
    }
    return cachedMusicVideos.length ? cachedMusicVideos : mockVideos.slice(0, 30).map(formatSearchResult);
  } catch (error) {
    return cachedMusicVideos.length ? cachedMusicVideos : mockVideos.slice(0, 30).map(formatSearchResult);
  }
};

export const fetchGamingVideos = async () => {
  try {
    const data = await fetchWithFallback('/search', {
      part: 'snippet',
      videoCategoryId: '20',
      type: 'video',
      maxResults: 30,
      order: 'viewCount',
    });
    if (data.items?.length > 0) {
      cachedGamingVideos = data.items.map(formatSearchResult);
    }
    return cachedGamingVideos.length ? cachedGamingVideos : mockVideos.slice(0, 30).map(formatSearchResult);
  } catch (error) {
    return cachedGamingVideos.length ? cachedGamingVideos : mockVideos.slice(0, 30).map(formatSearchResult);
  }
};


export const fetchPopularVideos = async () => {
  const data = await fetchWithFallback('/videos', {
    part: 'snippet,statistics',
    chart: 'mostPopular',
    maxResults: 50,
    regionCode: 'US',
  });
  return data.items.map(formatVideo);
};

export const searchVideos = async (query) => {
  const data = await fetchWithFallback('/search', {
    q: query,
    part: 'snippet',
    maxResults: 50,
    type: 'video',
  });
  return data.items.map(formatSearchResult);
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
    console.error('Suggestions error:', error);
    return [];
  }
};

export const fetchHistoryVideos = async () => {
  console.log("Fetching history requires OAuth authentication");
  return mockVideos.slice(0, 5);
};