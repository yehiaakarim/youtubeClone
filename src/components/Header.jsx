import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Avatar,
  useMediaQuery,
  useTheme,
  alpha,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ClickAwayListener,
  Divider,
  Typography,
  styled,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Mic as MicIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import youtubeLogo from "/youtube-logo.png";
import {
  getSearchHistory,
  addToSearchHistory,
  debounce,
} from "../api/searchUtils";
import { getSearchSuggestions } from "../api/youtube";
import SettingsModal from "./SettingsModal";
import { startVoiceRecognition } from "../utils/voiceSearch";

const PulseCircle = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: "50%",
  backgroundColor: theme.palette.error.main,
  animation: "pulse 1s infinite",
  "@keyframes pulse": {
    "0%": { transform: "scale(0.95)", opacity: 0.7 },
    "50%": { transform: "scale(1.05)", opacity: 1 },
    "100%": { transform: "scale(0.95)", opacity: 0.7 },
  },
}));

const Header = ({ darkMode, setDarkMode, onSearch, toggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("en");
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [voiceMenuAnchor, setVoiceMenuAnchor] = useState(null);
  const searchRef = useRef(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleVoiceMenuOpen = (event) => {
    setVoiceMenuAnchor(event.currentTarget);
  };

  const handleVoiceMenuClose = () => {
    setVoiceMenuAnchor(null);
  };

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchSuggestions = debounce(async (query) => {
    if (query.trim()) {
      const results = await getSearchSuggestions(query);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, 300);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchSuggestions(query);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery);
      setSearchHistory(getSearchHistory());
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    addToSearchHistory(suggestion);
    setSearchHistory(getSearchHistory());
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const clearHistory = () => {
    localStorage.removeItem("youtube-clone-search-history");
    setSearchHistory([]);
  };

  const handleVoiceSearch = () => {
    if (isListening) return;

    setIsListening(true);
    startVoiceRecognition(
      (transcript) => {
        setSearchQuery(transcript);
        setIsListening(false);
        if (transcript.trim()) {
          handleSubmit({ preventDefault: () => {} });
        }
      },
      (error) => {
        console.error("Voice recognition error:", error);
        setIsListening(false);
      },
      language === "en" ? "en-US" : "ar-SA"
    );
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
    handleVoiceMenuClose();
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          backgroundColor: darkMode
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.paper, 0.95),
          backdropFilter: "blur(8px)",
          transition: "all 0.3s ease",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            gap: { xs: 1, sm: 2 },
            justifyContent: "space-between",
            padding: { xs: "0 8px", sm: "0 16px" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              minWidth: { xs: "auto", sm: "180px" },
            }}
          >
            <Box
              component="img"
              src={youtubeLogo}
              alt="YouTube Logo"
              onClick={reloadPage}
              sx={{
                height: { xs: 44, sm: 58 },
                cursor: "pointer",
                filter: darkMode ? "invert(1)" : "none",
                marginLeft: { xs: 0, md: "10px" },
              }}
            />
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              flexGrow: 1,
              maxWidth: { xs: "100%", sm: "600px", md: "700px" },
              display: "flex",
              justifyContent: "center",
              margin: { xs: "0 8px", sm: "0 16px" },
            }}
            ref={searchRef}
          >
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                maxWidth: "600px",
                border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
                borderRadius: 2,
                overflow: "hidden",
                "&:hover": {
                  borderColor: alpha(theme.palette.text.primary, 0.4),
                },
              }}
            >
              <InputBase
                fullWidth
                placeholder="Search"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => {
                  setShowSuggestions(true);
                  setSearchHistory(getSearchHistory());
                }}
                onClick={() => {
                  setShowSuggestions(true);
                  setSearchHistory(getSearchHistory());
                }}
                sx={{
                  px: 2,
                  py: 1,
                  color: theme.palette.text.primary,
                }}
              />
              <IconButton
                type="submit"
                sx={{
                  px: 2,
                  borderRadius: 0,
                  borderLeft: `1px solid ${alpha(
                    theme.palette.text.primary,
                    0.2
                  )}`,
                  backgroundColor: alpha(theme.palette.text.primary, 0.05),
                }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
            <IconButton
              onClick={handleVoiceMenuOpen}
              disabled={isListening}
              sx={{ ml: 1 }}
            >
              {isListening ? <PulseCircle /> : <MicIcon />}
            </IconButton>

            <Popper
              open={
                showSuggestions &&
                (suggestions.length > 0 || searchHistory.length > 0)
              }
              anchorEl={searchRef.current}
              placement="bottom-start"
              sx={{
                zIndex: theme.zIndex.modal,
                width: searchRef.current?.clientWidth,
              }}
            >
              <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
                <Paper
                  elevation={4}
                  sx={{ width: "100%", maxHeight: 400, overflow: "auto" }}
                >
                  {searchHistory.length > 0 && (
                    <>
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle2">
                          Recent searches
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ cursor: "pointer", color: "primary.main" }}
                          onClick={clearHistory}
                        >
                          Clear all
                        </Typography>
                      </Box>
                      <List dense>
                        {searchHistory.map((item, index) => (
                          <ListItem key={index} disablePadding>
                            <ListItemButton
                              onClick={() => handleSuggestionClick(item)}
                            >
                              <HistoryIcon sx={{ mr: 1.5, fontSize: 20 }} />
                              <ListItemText primary={item} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                      <Divider />
                    </>
                  )}
                  {suggestions.length > 0 && (
                    <List dense>
                      {suggestions.map((item, index) => (
                        <ListItem key={`suggestion-${index}`} disablePadding>
                          <ListItemButton
                            onClick={() => handleSuggestionClick(item)}
                          >
                            <SearchIcon sx={{ mr: 1.5, fontSize: 20 }} />
                            <ListItemText primary={item} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </ClickAwayListener>
            </Popper>
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
              minWidth: { xs: "auto", sm: "180px" },
              justifyContent: "flex-end",
            }}
          >
            <IconButton onClick={toggleDarkMode}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <IconButton onClick={() => setSettingsOpen(true)}>
              <SettingsIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              alignItems: "center",
              ml: 1,
            }}
          >
            <IconButton onClick={handleMobileMenuOpen}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        sx={{
          "& .MuiPaper-root": {
            minWidth: 200,
            mt: 1,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            toggleDarkMode();
            handleMobileMenuClose();
          }}
        >
          {darkMode ? (
            <>
              <LightModeIcon sx={{ mr: 1.5 }} />
              Light Mode
            </>
          ) : (
            <>
              <DarkModeIcon sx={{ mr: 1.5 }} />
              Dark Mode
            </>
          )}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSettingsOpen(true);
            handleMobileMenuClose();
          }}
        >
          <SettingsIcon sx={{ mr: 1.5 }} />
          Settings
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={voiceMenuAnchor}
        open={Boolean(voiceMenuAnchor)}
        onClose={handleVoiceMenuClose}
        sx={{
          "& .MuiPaper-root": {
            minWidth: 200,
            mt: 1,
          },
        }}
      >
        <MenuItem onClick={handleVoiceSearch}>
          <MicIcon sx={{ mr: 1.5 }} />
          {isListening ? "Listening..." : "Start Voice Search"}
        </MenuItem>
        <MenuItem onClick={toggleLanguage}>
          <LanguageIcon sx={{ mr: 1.5 }} />
          Switch Voice to {language === "en" ? "Arabic" : "English"}
        </MenuItem>
      </Menu>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    </>
  );
};

export default Header;