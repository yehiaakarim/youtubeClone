// mockData.js
export const mockVideos = [
  {
    id: "1",
    title: "How to Build a YouTube Clone with React",
    channelTitle: "CodeWithMe",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    views: "150K views",
    timestamp: "2024-05-10T08:00:00Z",
  },
  {
    id: "2",
    title: "Top 10 Trending Videos This Week",
    channelTitle: "Trending Now",
    thumbnail: "https://i.ytimg.com/vi/abcdefghijk/mqdefault.jpg",
    views: "2.1M views",
    timestamp: "2024-05-15T14:30:00Z",
  },
  {
    id: "3",
    title: "Live: 24/7 Music Stream",
    channelTitle: "Music Channel",
    thumbnail: "https://i.ytimg.com/vi/lmnopqrstuv/mqdefault.jpg",
    views: "N/A",
    timestamp: "2024-05-20T20:00:00Z",
  },
  {
    id: "4",
    title: "Gaming Tournament Finals",
    channelTitle: "eSports Network",
    thumbnail: "https://i.ytimg.com/vi/wxyz123456/mqdefault.jpg",
    views: "850K views",
    timestamp: "2024-05-18T12:45:00Z",
  },
  {
    id: "5",
    title: "Latest News Update",
    channelTitle: "News Channel",
    thumbnail: "https://i.ytimg.com/vi/7890qwerty/mqdefault.jpg",
    views: "320K views",
    timestamp: "2024-05-19T19:00:00Z",
  },
  {
    id: "6",
    title: "Learn React in 1 Hour",
    channelTitle: "Web Dev Simplified",
    thumbnail: "https://i.ytimg.com/vi/7ghhRHRP6t4/mqdefault.jpg",
    views: "1.2M views",
    timestamp: "2024-04-25T09:15:00Z",
  }
];

export const mockTrending = mockVideos.slice(0, 4);
export const mockLive = [mockVideos[2]];
export const mockMusic = [mockVideos[2], mockVideos[4]];
export const mockGaming = [mockVideos[3]];
export const mockHistory = [mockVideos[0], mockVideos[5]];