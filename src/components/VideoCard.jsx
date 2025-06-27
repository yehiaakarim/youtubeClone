import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack,
  Skeleton,
  useTheme,
  IconButton,
  ButtonBase,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  CheckCircle,
  MoreVert,
  WatchLater,
  PlaylistAdd,
  Delete,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

const VideoCard = ({
  video,
  darkMode,
  onRemoveVideo,
  onAddToWatchLater,
  onAddToPlaylist,
  onVideoClick,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const formatViews = (views) => {
    if (!views || views === "N/A") return "No views";
    if (views.includes('M') || views.includes('K')) return views;
    
    const count = parseInt(views, 10);
    if (isNaN(count)) return "No views";
    
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  };

  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "";
    }
  };

  const handleVideoClick = (e) => {
    e.preventDefault();
    onVideoClick(video);
    window.open(
      `https://www.youtube.com/watch?v=${video.id}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    e?.stopPropagation();
    setAnchorEl(null);
  };

  const handleRemoveVideo = (e) => {
    e.stopPropagation();
    onRemoveVideo(video.id);
    handleMenuClose();
  };

  const handleAddToWatchLater = (e) => {
    e.stopPropagation();
    onAddToWatchLater(video);
    handleMenuClose();
  };

  const handleAddToPlaylist = (e) => {
    e.stopPropagation();
    onAddToPlaylist(video);
    handleMenuClose();
  };

  return (
    <Card
      elevation={isHovered ? 4 : 1}
      sx={{
        width: "100%",
        height: "100%", 
        bgcolor: "transparent",
        backgroundImage: "none",
        border: "none",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ButtonBase
        component="div"
        onClick={handleVideoClick}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          textAlign: "left",
        }}
      >
        
        <Box
          sx={{
            position: "relative",
            width: "100%",
            paddingBottom: {
              
              xs: "75%", 
              sm: "65%", 
              md: "60%", 
              lg: "56.25%", 
            },
            overflow: "hidden",
            borderRadius: 1,
            flexShrink: 0, 
          }}
        >
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{
                position: "absolute",
                bgcolor: darkMode
                  ? theme.palette.grey[800]
                  : theme.palette.grey[300],
              }}
            />
          )}
          <CardMedia
            component="img"
            image={video.thumbnail}
            alt={video.title}
            sx={{
              display: imageLoaded ? "block" : "none",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onLoad={() => setImageLoaded(true)}
          />
        </Box>

        
        <CardContent
          sx={{
            width: "100%",
            p: 1,
            pt: 1,
            flexGrow: 1, 
            "&:last-child": { pb: 1 },
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ width: "100%" }}>
            <Avatar
              src={`https://i.pravatar.cc/150?u=${video.channelTitle}`}
              sx={{ width: 36, height: 36, mt: 0.5 }}
            />
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                maxWidth: "calc(100% - 60px)",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.3,
                  mb: 0.5,
                }}
              >
                {video.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: theme.palette.text.secondary,
                  fontSize: "0.75rem",
                }}
              >
                {video.channelTitle}
                <CheckCircle
                  sx={{
                    fontSize: 12,
                    ml: 0.5,
                    color: theme.palette.text.secondary,
                  }}
                />
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                  }}
                >
                  {formatViews(video.views)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                  }}
                >
                  {formatTimestamp(video.timestamp)}
                </Typography>
              </Stack>
            </Box>
            <Box
              sx={{
                
                alignSelf: "flex-start",
                mt: 0.5,
              }}
            >
              <IconButton
                size="small"
                onClick={handleMenuClick}
                aria-label="video actions"
                aria-controls={open ? "video-actions-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu
                id="video-actions-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                MenuListProps={{
                  "aria-labelledby": "video-actions-button",
                }}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    minWidth: 200,
                    bgcolor: darkMode ? theme.palette.grey[800] : "#fff",
                    "& .MuiMenuItem-root": {
                      fontSize: "0.875rem",
                    },
                  },
                }}
              >
                <MenuItem onClick={handleRemoveVideo}>
                  <ListItemIcon>
                    <Delete fontSize="small" />
                  </ListItemIcon>
                  Remove
                </MenuItem>
                <MenuItem onClick={handleAddToWatchLater}>
                  <ListItemIcon>
                    <WatchLater fontSize="small" />
                  </ListItemIcon>
                  Watch Later
                </MenuItem>
                <MenuItem onClick={handleAddToPlaylist}>
                  <ListItemIcon>
                    <PlaylistAdd fontSize="small" />
                  </ListItemIcon>
                  Add to Playlist
                </MenuItem>
              </Menu>
            </Box>
          </Stack>
        </CardContent>
      </ButtonBase>
    </Card>
  );
};

export default VideoCard;