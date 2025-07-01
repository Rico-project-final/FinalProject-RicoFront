/**
 * AppNavbar Component
 * -------------------
 * Top navigation bar for the app including:
 * - Logo linking to home
 * - Language selector dropdown (Hebrew/English)
 * - User info with avatar and name (if logged in)
 * - Theme toggle button (dark/light mode)
 * 
 * Uses MUI AppBar and Toolbar components with responsive styling
 * and dynamic theming based on the current mode.
 */

import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  useTheme,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LightModeIcon from "@mui/icons-material/LightMode";
import logo from "../assets/rico-logo.png";

import { useLanguage } from "../context/language/LanguageContext";
import { useAuth } from "../context/auth-context";
import { useCustomTheme } from "../context/ThemeContext";

export default function AppNavbar() {
  const theme = useTheme();

  const { lang, setLang } = useLanguage();

  const { user } = useAuth();

  const { toggleTheme, mode } = useCustomTheme();

  const handleLangChange = (event: SelectChangeEvent) => {
    setLang(event.target.value as "he" | "en");
  };

  const isDark = theme.palette.mode === "dark";

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: isDark ? theme.palette.background.paper : "primary.main", // Background changes with theme
        boxShadow: 3,
        width: "100%",
        color: isDark ? theme.palette.text.primary : theme.palette.primary.contrastText, // Text color adjusts to theme
      }}
    >
      <Toolbar>
        {/* Left side: Logo and home link */}
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
                filter: isDark ? "brightness(0) invert(1)" : "none", // Invert colors for dark mode if needed
              }}
            />
          </Link>
        </Box>

        {/* Right side controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Language Selector Dropdown */}
          <Select
            value={lang}
            onChange={handleLangChange}
            size="small"
            sx={{
              backgroundColor: isDark ? theme.palette.background.default : "#fff",
              borderRadius: 1,
              fontSize: 14,
              minWidth: 100,
              height: 36,
              color: isDark ? theme.palette.text.primary : "inherit",
              ".MuiSelect-select": {
                padding: "4px 12px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? theme.palette.divider : undefined,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? theme.palette.primary.light : undefined,
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: isDark ? theme.palette.background.paper : "#fff",
                  color: isDark ? theme.palette.text.primary : "inherit",
                },
              },
            }}
          >
            <MenuItem value="he">עברית</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>

          {/* User information - shown only if logged in */}
          {user && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: isDark ? theme.palette.text.primary : "inherit",
              }}
            >
              {/* User avatar */}
              <Avatar
                alt={user.name}
                src={user.profileImage}
                sx={{
                  border: isDark ? `1px solid ${theme.palette.divider}` : "none",
                }}
              />
              {/* User name */}
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

          {/* Theme toggle button */}
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
