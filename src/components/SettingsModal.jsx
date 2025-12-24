import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Button,
  useTheme,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  FormGroup,
  Tooltip,
} from "@mui/material";
import {
  Settings,
  Close,
  Brightness4,
  Brightness7,
  Notifications,
  NotificationsOff,
  PlayCircle,
  PlayCircleOutline,
  ExpandMore,
  ExpandLess,
  HelpOutline,
} from "@mui/icons-material";

const SettingsModal = ({ open, onClose, darkMode, setDarkMode }) => {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState("appearance");
  const [settings, setSettings] = useState({
    darkMode: darkMode,
    notifications: true,
    restrictedMode: false,
    autoplay: true,
    hdQuality: false,
    captions: true,
  });

  useEffect(() => {
    setSettings((prev) => ({ ...prev, darkMode: darkMode }));
  }, [darkMode]);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));

    if (name === "darkMode") {
      setDarkMode(checked);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: 550 },
    maxHeight: "90vh",
    overflowY: "auto",
    bgcolor: theme.palette.background.paper,
    boxShadow: 24,
    borderRadius: 2,
    p: 3,
    outline: "none",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.divider,
      borderRadius: "3px",
    },
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="settings-modal"
      aria-describedby="youtube-clone-settings"
      sx={{ backdropFilter: "blur(3px)" }}
    >
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
          >
            <Settings sx={{ mr: 1.5, fontSize: 28 }} />
            Settings
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: theme.palette.text.secondary }}
          >
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ my: 1 }} />

        <List component="nav" sx={{ p: 0 }}>
          <ListItemButton onClick={() => toggleSection("appearance")}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold">
                  Appearance
                </Typography>
              }
            />
            {expandedSection === "appearance" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse
            in={expandedSection === "appearance"}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ pl: 6, pr: 2, pb: 2 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.darkMode}
                      onChange={handleChange}
                      name="darkMode"
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Dark theme
                      <Tooltip title="Toggle between light and dark mode">
                        <HelpOutline
                          sx={{
                            ml: 1,
                            fontSize: 16,
                            color: theme.palette.text.secondary,
                          }}
                        />
                      </Tooltip>
                    </Box>
                  }
                  sx={{ mb: 1 }}
                />
              </FormGroup>
            </Box>
          </Collapse>
        </List>

        <Divider sx={{ my: 1 }} />

        <List component="nav" sx={{ p: 0 }}>
          <ListItemButton onClick={() => toggleSection("playback")}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              {settings.autoplay ? <PlayCircle /> : <PlayCircleOutline />}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold">
                  Playback
                </Typography>
              }
            />
            {expandedSection === "playback" ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse
            in={expandedSection === "playback"}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ pl: 6, pr: 2, pb: 2 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoplay}
                      onChange={handleChange}
                      name="autoplay"
                      color="primary"
                    />
                  }
                  label="Autoplay next video"
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.hdQuality}
                      onChange={handleChange}
                      name="hdQuality"
                      color="primary"
                    />
                  }
                  label="Always prefer HD"
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.captions}
                      onChange={handleChange}
                      name="captions"
                      color="primary"
                    />
                  }
                  label="Show captions by default"
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.restrictedMode}
                      onChange={handleChange}
                      name="restrictedMode"
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Restricted Mode
                      <Tooltip title="Helps hide potentially mature content">
                        <HelpOutline
                          sx={{
                            ml: 1,
                            fontSize: 16,
                            color: theme.palette.text.secondary,
                          }}
                        />
                      </Tooltip>
                    </Box>
                  }
                />
              </FormGroup>
            </Box>
          </Collapse>
        </List>

        <Divider sx={{ my: 1 }} />

        <List component="nav" sx={{ p: 0 }}>
          <ListItemButton onClick={() => toggleSection("notifications")}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              {settings.notifications ? (
                <Notifications />
              ) : (
                <NotificationsOff />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold">
                  Notifications
                </Typography>
              }
            />
            {expandedSection === "notifications" ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItemButton>
          <Collapse
            in={expandedSection === "notifications"}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ pl: 6, pr: 2, pb: 2 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications}
                      onChange={handleChange}
                      name="notifications"
                      color="primary"
                    />
                  }
                  label="Enable notifications"
                  sx={{ mb: 1 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Customize notification preferences in your browser settings
                </Typography>
              </FormGroup>
            </Box>
          </Collapse>
        </List>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            YouTube Clone v1.0
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                mr: { sm: 1 }, 
              }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onClose}
              sx={{ textTransform: "none" }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
