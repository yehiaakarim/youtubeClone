import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
  styled,
  Tooltip,
  Typography,
  Avatar,
  Collapse,
  Badge,
  IconButton,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Home,
  WatchLater,
  PlaylistPlay,
  History,
  Whatshot,
  MusicNote,
  SportsEsports,
  LiveTv,
  ExpandMore,
  ExpandLess,
  Recommend,
  Description,
  Info,
} from "@mui/icons-material";

const StyledListItem = styled(ListItemButton)(({ theme, darkmode }) => ({
  borderRadius: 10,
  padding: "6px 12px",
  margin: "0 8px",
  "&:hover": {
    backgroundColor:
      darkmode === "true" ? theme.palette.grey[800] : theme.palette.grey[200],
  },
  "&.Mui-selected": {
    backgroundColor:
      darkmode === "true" ? theme.palette.grey[700] : theme.palette.grey[300],
    "&:hover": {
      backgroundColor:
        darkmode === "true" ? theme.palette.grey[700] : theme.palette.grey[300],
    },
  },
}));

const ChannelAvatar = styled(Avatar)({
  width: 24,
  height: 24,
  marginRight: 12,
});

const Sidebar = ({
  darkMode,
  activeCategory,
  onCategoryChange,
  open,
  onClose,
  watchLaterCount,
  playlistCount,
  historyCount,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedItem, setSelectedItem] = useState("Home");
  const [expandedSubs, setExpandedSubs] = useState(!isSmallScreen);
  const [expandedRecommended, setExpandedRecommended] = useState(
    !isSmallScreen
  );
  const [openTerms, setOpenTerms] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);

  const recommendedChannels = [
    {
      id: 1,
      name: "MrBeast",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuQj_n_x95vXTb5LaWGVl-HTKXtMOFs565xQ&s",
      category: "Entertainment",
      isVerified: true,
      link: "https://www.youtube.com/@MrBeast",
    },
    {
      id: 2,
      name: "Adele",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwn0qjheDJd9OK4H2uPm63PAoEkHLKTJE1pw&s",
      category: "Music",
      isVerified: true,
      link: "https://www.youtube.com/channel/UCsRM0YB_dabtEPGPTKo-gcw",
    },
    {
      id: 3,
      name: "PewDiePie",
      avatar:
        "https://ih1.redbubble.net/image.2334848365.3187/flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
      category: "Gaming",
      isVerified: true,
      link: "https://www.youtube.com/@PewDiePie",
    },
    {
      id: 4,
      name: "Tasty",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx03Kd3m2_RmU1DY6PdbIFcxG1cr75f50_0w&s",
      category: "Food",
      isVerified: true,
      link: "https://www.youtube.com/@buzzfeedtasty",
    },
    {
      id: 5,
      name: "National Geographic",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDSPwGKYMeBt8q-cLtNHrQ4gHy89NA-1yXPA&s",
      category: "Education",
      isVerified: true,
      link: "https://www.youtube.com/@NatGeo",
    },
    {
      id: 6,
      name: "NASA",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj7cyiblt27C0oBPY7_380M2xNSNuWkX0PJA&s",
      category: "Science",
      isVerified: true,
      link: "https://www.youtube.com/@NASA",
    },
  ];

  useEffect(() => {
    setSelectedItem(activeCategory.split(":")[0].trim());
  }, [activeCategory]);

  const mainItems = [
    { icon: <Home />, text: "Home" },
    { icon: <WatchLater />, text: "Watch Later", count: watchLaterCount },
    { icon: <PlaylistPlay />, text: "Playlists", count: playlistCount },
    { icon: <History />, text: "History", count: historyCount },
  ];

  const secondaryItems = [
    { icon: <MusicNote />, text: "Music" },
    { icon: <SportsEsports />, text: "Gaming" },
    { icon: <LiveTv />, text: "Live", displayText: "News" }, 
  ];

  const handleItemClick = (text) => {
    setSelectedItem(text);

    const count = mainItems.find((item) => item.text === text)?.count || 0;
    onCategoryChange(text, count);
  };

  const toggleRecommended = () => setExpandedRecommended(!expandedRecommended);

  const handleOpenTerms = () => setOpenTerms(true);
  const handleCloseTerms = () => setOpenTerms(false);

  const handleOpenAbout = () => setOpenAbout(true);
  const handleCloseAbout = () => setOpenAbout(false);

  const handleChannelClick = (link) => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Box
      sx={{
        width: isSmallScreen ? 72 : 240,
        flexShrink: 0,
        position: "fixed",
        top: 64,
        left: 0,
        height: "calc(100vh - 64px)",
        overflowY: "auto",
        backgroundColor: darkMode ? theme.palette.background.paper : "#f9f9f9",
        borderRight: `1px solid ${darkMode ? "#303030" : "#e5e5e5"}`,
        transition: "width 0.3s ease",
        zIndex: theme.zIndex.drawer,
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: darkMode ? "#606060" : "#cccccc",
          borderRadius: "3px",
        },
      }}
    >
      <List sx={{ pt: 2 }}>
        {mainItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <Tooltip title={isSmallScreen ? item.text : ""} placement="right">
              <StyledListItem
                darkmode={darkMode.toString()}
                selected={selectedItem === item.text}
                onClick={() => handleItemClick(item.text)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "auto",
                    mr: isSmallScreen ? 0 : 2,
                    color: darkMode ? "#fff" : "inherit",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isSmallScreen && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight:
                          selectedItem === item.text ? "bold" : "normal",
                      }}
                    />
                    {item.count > 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: darkMode
                            ? theme.palette.text.secondary
                            : theme.palette.text.primary,
                          ml: "auto",
                          fontSize: "0.75rem",
                        }}
                      >
                        {item.count}
                      </Typography>
                    )}
                  </Box>
                )}
              </StyledListItem>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider
        sx={{
          my: 1,
          mx: 2,
          bgcolor: darkMode ? "#303030" : "#e5e5e5",
        }}
      />

      <List>
        {secondaryItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <Tooltip
              title={isSmallScreen ? item.displayText || item.text : ""}
              placement="right"
            >
              <StyledListItem
                darkmode={darkMode.toString()}
                selected={selectedItem === item.text}
                onClick={() => handleItemClick(item.text)}
              >
                <ListItemIcon
                   sx={{
                    minWidth: "auto",
                    mr: isSmallScreen ? 0 : 2,
                    color: darkMode ? "#fff" : "inherit",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isSmallScreen && (
                  <ListItemText
                    primary={item.displayText || item.text}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight:
                        selectedItem === item.text ? "bold" : "normal",
                    }}
                  />
                )}
              </StyledListItem>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider
        sx={{
          my: 1,
          mx: 2,
          bgcolor: darkMode ? "#303030" : "#e5e5e5",
        }}
      />

      <List>
        <ListItem disablePadding>
          <Tooltip title={isSmallScreen ? "Recommended" : ""} placement="right">
            <StyledListItem
              darkmode={darkMode.toString()}
              onClick={toggleRecommended}
            >
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  mr: isSmallScreen ? 0 : 2,
                  color: darkMode ? "#fff" : "inherit",
                  justifyContent: "center",
                }}
              >
                <Recommend />
              </ListItemIcon>
              {!isSmallScreen && (
                <>
                  <ListItemText
                    primary="RECOMMENDED CHANNELS"
                    primaryTypographyProps={{
                      fontSize: 13,
                      fontWeight: "bold",
                      color: darkMode ? "#aaa" : "#606060",
                    }}
                  />
                  {expandedRecommended ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </StyledListItem>
          </Tooltip>
        </ListItem>

        <Collapse
          in={isSmallScreen ? true : expandedRecommended}
          timeout="auto"
          unmountOnExit
        >
          {recommendedChannels.map((channel) => (
            <ListItem key={channel.id} disablePadding sx={{ display: "block" }}>
              <ButtonBase
                component="div"
                sx={{
                  width: "100%",
                  textAlign: "left",
                  "&:hover": {
                    backgroundColor: darkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.04)",
                  },
                }}
                onClick={() => handleChannelClick(channel.link)}
              >
                <StyledListItem
                  darkmode={darkMode.toString()}
                  sx={{ pl: isSmallScreen ? 2 : 4 }}
                >
                  {isSmallScreen ? (
                    <Tooltip
                      title={`${channel.name} (${channel.category})`}
                      placement="right"
                    >
                      <ChannelAvatar src={channel.avatar} />
                    </Tooltip>
                  ) : (
                    <>
                      <ChannelAvatar src={channel.avatar} />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          ml: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{
                              color: darkMode ? "#fff" : "#030303",
                            }}
                          >
                            {channel.name}
                          </Typography>
                          {channel.isVerified && (
                            <Box
                              component="span"
                              sx={{
                                ml: 0.5,
                                color: darkMode ? "#aaa" : "#606060",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="14"
                                viewBox="0 0 24 24"
                                width="14"
                                fill="currentColor"
                              >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                            </Box>
                          )}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: darkMode ? "#aaa" : "#606060",
                          }}
                        >
                          {channel.category}
                        </Typography>
                      </Box>
                    </>
                  )}
                </StyledListItem>
              </ButtonBase>
            </ListItem>
          ))}
        </Collapse>
      </List>

      <Divider
        sx={{
          my: 1,
          mx: 2,
          bgcolor: darkMode ? "#303030" : "#e5e5e5",
        }}
      />

      <List>
        <ListItem disablePadding sx={{ display: "block" }}>
          <Tooltip
            title={isSmallScreen ? "Terms of Use" : ""}
            placement="right"
          >
            <StyledListItem
              darkmode={darkMode.toString()}
              onClick={handleOpenTerms}
            >
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  mr: isSmallScreen ? 0 : 2,
                  color: darkMode ? "#fff" : "inherit",
                  justifyContent: "center",
                }}
              >
                <Description />
              </ListItemIcon>
              {!isSmallScreen && (
                <ListItemText
                  primary="Terms of Use"
                  primaryTypographyProps={{
                    fontSize: 14,
                  }}
                />
              )}
            </StyledListItem>
          </Tooltip>
        </ListItem>

        <ListItem disablePadding sx={{ display: "block" }}>
          <Tooltip title={isSmallScreen ? "About" : ""} placement="right">
            <StyledListItem
              darkmode={darkMode.toString()}
              onClick={handleOpenAbout}
            >
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  mr: isSmallScreen ? 0 : 2,
                  color: darkMode ? "#fff" : "inherit",
                  justifyContent: "center",
                }}
              >
                <Info />
              </ListItemIcon>
              {!isSmallScreen && (
                <ListItemText
                  primary="About"
                  primaryTypographyProps={{
                    fontSize: 14,
                  }}
                />
              )}
            </StyledListItem>
          </Tooltip>
        </ListItem>
      </List>

      <Dialog
        open={openTerms}
        onClose={handleCloseTerms}
        aria-labelledby="terms-dialog-title"
        PaperProps={{
          sx: {
            bgcolor: darkMode ? theme.palette.background.paper : "#fff",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          id="terms-dialog-title"
          sx={{
            color: darkMode ? "#fff" : "#030303",
            borderBottom: `1px solid ${darkMode ? "#303030" : "#e5e5e5"}`,
          }}
        >
          Terms of Use
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: darkMode ? "#aaa" : "#606060",
              pt: 2,
              whiteSpace: "pre-line",
            }}
          >
            {`This YouTube clone is for educational purposes only. All video content is served directly from the official YouTube API.

1. Copyright: All content is property of their respective owners.
2. Fair Use: This project falls under fair use for educational demonstration.
3. No Commercial Use: This application is not for commercial purposes.
4. Data Privacy: We do not store any user data permanently.
5. API Usage: This app uses the official YouTube Data API.
     © 2026 Yehia Abdelkarim · YouTube Clone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: `1px solid ${darkMode ? "#303030" : "#e5e5e5"}`,
            padding: "8px 24px",
          }}
        >
          <Button
            onClick={handleCloseTerms}
            sx={{
              color: darkMode ? "#fff" : "#065fd4",
              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(6,95,212,0.04)",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAbout}
        onClose={handleCloseAbout}
        aria-labelledby="about-dialog-title"
        PaperProps={{
          sx: {
            bgcolor: darkMode ? theme.palette.background.paper : "#fff",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          id="about-dialog-title"
          sx={{
            color: darkMode ? "#fff" : "#030303",
            borderBottom: `1px solid ${darkMode ? "#303030" : "#e5e5e5"}`,
          }}
        >
          About YouTube Clone
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: darkMode ? "#aaa" : "#606060",
              pt: 2,
              whiteSpace: "pre-line",
            }}
          >
            {`This is a fully functional YouTube clone built with modern web technologies.

Technologies Used:
- React.js (Frontend Framework)
- Material-UI (Component Library)
- YouTube Data API v3 (Official API)
- Vite (Build Tool)
- React Router (Navigation)

Features:
- Light/Dark Mode
- Responsive Design
- Video Search
- Category Filtering
- Voice Search
- Watch Later Functionality
- PlayLists Functionality
This project was created and designed by Yehia Abdelkarim for educational purposes to demonstrate modern web development techniques with React.js.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: `1px solid ${darkMode ? "#303030" : "#e5e5e5"}`,
            padding: "8px 24px",
          }}
        >
          <Button
            onClick={handleCloseAbout}
            sx={{
              color: darkMode ? "#fff" : "#065fd4",
              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(6,95,212,0.04)",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
