import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  useTheme,
  Button,
} from "@mui/material";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LightModeIcon from "@mui/icons-material/LightMode";
import logo from "../assets/rico-logo.png";
import { useAuth } from "../context/auth-context";
import { useCustomTheme } from "../context/ThemeContext";

export default function AppNavbar() {
  const theme = useTheme();
  const { user } = useAuth();

  const { toggleTheme, mode } = useCustomTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: isDark ? theme.palette.background.paper : "primary.main",
        boxShadow: 3,
        width: "100%",
        color: isDark ? theme.palette.text.primary : theme.palette.primary.contrastText,
      }}
    >
      <Toolbar>
        {/* Logo & Title */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: 40,
                height: 40,
                filter: isDark ? "brightness(0) invert(1)" : "none", // invert logo colors in dark mode if needed
              }}
            />
          </Link>
        </Box>

        {/* Right side controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          
          {/* 👤 User Info */}
          {user && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: isDark ? theme.palette.text.primary : "inherit",
              }}
            >
              <Avatar
                alt={user.name}
                src={user.profileImage}
                sx={{
                  border: isDark ? `1px solid ${theme.palette.divider}` : "none",
                }}
              />
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: 14,
                    color: isDark ? theme.palette.text.primary : "inherit",
                  }}
                >
                  {user.name}
                </Typography>
              </Box>
            </Box>
          )}

          {/* 🌗 Theme Toggle */}
          <Button
            onClick={toggleTheme}
            sx={{
              ml: 1,
              color: isDark ? theme.palette.secondary.main : theme.palette.primary.contrastText,
              minWidth: "auto",
            }}
            aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {mode === "dark" ? <BedtimeIcon /> : <LightModeIcon />}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
