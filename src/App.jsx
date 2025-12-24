import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  CircularProgress,
  ThemeProvider,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import {
  fetchPopularVideos,
  searchVideos,
  fetchLiveVideos,
  fetchMusicVideos,
  fetchGamingVideos,
} from "./api/youtube";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import VideoCard from "./components/VideoCard";
import { lightTheme, darkTheme } from "./theme";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const App = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("youtube-clone-dark-mode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [activeCategory, setActiveCategory] = useState("Home");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [watchLaterVideos, setWatchLaterVideos] = useState(() => {
    const saved = localStorage.getItem("youtube-clone-watch-later");
    return saved ? JSON.parse(saved) : [];
  });
  const [playlistVideos, setPlaylistVideos] = useState(() => {
    const saved = localStorage.getItem("youtube-clone-playlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [historyVideos, setHistoryVideos] = useState(() => {
    const saved = localStorage.getItem("youtube-clone-history");
    return saved ? JSON.parse(saved) : [];
  });
  const [showEmptyState, setShowEmptyState] = useState(false);

  
  useEffect(() => {
    localStorage.setItem("youtube-clone-dark-mode", JSON.stringify(darkMode));
    localStorage.setItem(
      "youtube-clone-watch-later",
      JSON.stringify(watchLaterVideos)
    );
    localStorage.setItem(
      "youtube-clone-playlist",
      JSON.stringify(playlistVideos)
    );
    localStorage.setItem(
      "youtube-clone-history",
      JSON.stringify(historyVideos)
    );
  }, [darkMode, watchLaterVideos, playlistVideos, historyVideos]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchVideosByCategory = async (category, count) => {
    setLoading(true);
    setActiveCategory(category);
    setSearchQuery("");

    try {
      let data;
      switch (category) {
        case "Home":
          data = await fetchPopularVideos();
          setShowEmptyState(false);
          break;
        case "Music":
          data = await fetchMusicVideos();
          setShowEmptyState(false);
          break;
        case "Gaming":
          data = await fetchGamingVideos();
          setShowEmptyState(false);
          break;
        case "Live":
          data = await fetchLiveVideos();
          setShowEmptyState(false);
          break;
        case "History":
          data = historyVideos;
          setShowEmptyState(count === 0);
          break;
        case "Watch Later":
          data = watchLaterVideos;
          setShowEmptyState(count === 0);
          break;
        case "Playlists":
          data = playlistVideos;
          setShowEmptyState(count === 0);
          break;
        default:
          data = await fetchPopularVideos();
          setShowEmptyState(false);
      }
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideosByCategory("Home");
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      fetchVideosByCategory("Home");
      return;
    }
    setLoading(true);
    setSearchQuery(query);
    setActiveCategory(`Search: ${query}`);
    setShowEmptyState(false);

    try {
      const data = await searchVideos(query);
      setVideos(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category, count = 0) => {
    if (category === activeCategory) return;
    fetchVideosByCategory(category, count);
  };

  const handleRemoveVideo = (videoId) => {
    setVideos((prev) => prev.filter((video) => video.id !== videoId));
    
    setWatchLaterVideos((prev) => prev.filter((v) => v.id !== videoId));
    setPlaylistVideos((prev) => prev.filter((v) => v.id !== videoId));
    setHistoryVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  const handleAddToWatchLater = (video) => {
    if (!watchLaterVideos.some((v) => v.id === video.id)) {
      setWatchLaterVideos((prev) => [video, ...prev]);
      
      if (activeCategory === "Watch Later") {
        setVideos([video, ...videos]);
        setShowEmptyState(false);
      }
    }
  };

  const handleAddToPlaylist = (video) => {
    if (!playlistVideos.some((v) => v.id === video.id)) {
      setPlaylistVideos((prev) => [video, ...prev]);
      
      if (activeCategory === "Playlists") {
        setVideos([video, ...videos]);
        setShowEmptyState(false);
      }
    }
  };

  const handleVideoClick = (video) => {
    
    if (!historyVideos.some((v) => v.id === video.id)) {
      setHistoryVideos((prev) => [video, ...prev]);
      
      if (activeCategory === "History") {
        setVideos([video, ...videos]);
        setShowEmptyState(false);
      }
    }
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh" }}>
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onSearch={handleSearch}
          toggleSidebar={toggleSidebar}
        />
        <Box sx={{ display: "flex" }}>
          <Sidebar
            darkMode={darkMode}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            open={sidebarOpen}
            onClose={toggleSidebar}
            watchLaterCount={watchLaterVideos.length}
            playlistCount={playlistVideos.length}
            historyCount={historyVideos.length}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 1, sm: 2 },
              ml: {
                xs: sidebarOpen ? "72px" : "0",
                md: sidebarOpen ? "240px" : "72px",
              },
              mt: "64px",
              transition: (theme) =>
                theme.transitions.create("margin", {
                  easing: theme.transitions.easing.sharp,
                  duration: sidebarOpen
                    ? theme.transitions.duration.enteringScreen
                    : theme.transitions.duration.leavingScreen,
                }),
            }}
          >
            <Offset />
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                color: darkMode ? "#fff" : "#030303",
              }}
            >
              {activeCategory === "Live" ? "News" : activeCategory}
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : showEmptyState ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "50vh",
                  textAlign: "center",
                  color: darkMode ? "#aaa" : "#606060",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {activeCategory === "Watch Later"
                    ? "No videos in Watch Later"
                    : activeCategory === "Playlists"
                    ? "No playlists yet"
                    : "No history yet"}
                </Typography>
                <Typography variant="body2">
                  {activeCategory === "Watch Later"
                    ? "Save videos to watch later by clicking the watch later button"
                    : activeCategory === "Playlists"
                    ? "Create playlists and add videos to them"
                    : "Videos you watch will appear here"}
                </Typography>
              </Box>
            ) : videos.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "50vh",
                  textAlign: "center",
                  color: darkMode ? "#aaa" : "#606060",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  No videos found
                </Typography>
                <Typography variant="body2">
                The API Quota will reset at 10 AM.
                </Typography>
              </Box>
            ) : (
              
              <Grid
                container
                spacing={1}
                sx={{ justifyContent: "center" }}
              >
                {videos.map((video) => (
                  <Grid
                    key={video.id}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{
                      display: "flex",
                      
                      height: { 
                        xs: '470px',  
                        sm: '320px',  
                        md: '300px',  
                        lg: '300px'   
                      },
                      '@media (max-width:550px)': {
                        height: 430
                      },
                      '@media (max-width:500px)': {
                        height: 390
                      },
                      '@media (max-width:450px)': {
                        height: 360
                      },
                      width: {
                        xs: "100%",
                        sm: "calc(50% - 16px)",
                        md: "calc(33.333% - 16px)",
                        lg: "calc(25% - 16px)",
                      },
                      maxWidth: {
                        xs: "100%",
                        sm: "calc(50% - 16px)",
                        md: "calc(33.333% - 16px)",
                        lg: "calc(25% - 16px)",
                      },
                      mb: 1  
                    }}
                  >
                    <VideoCard
                      video={video}
                      darkMode={darkMode}
                      onRemoveVideo={handleRemoveVideo}
                      onAddToWatchLater={handleAddToWatchLater}
                      onAddToPlaylist={handleAddToPlaylist}
                      onVideoClick={handleVideoClick}
                      isInWatchLater={watchLaterVideos.some(
                        (v) => v.id === video.id
                      )}
                      isInPlaylist={playlistVideos.some(
                        (v) => v.id === video.id
                      )}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
