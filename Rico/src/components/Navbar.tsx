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
  IconButton,
} from "@mui/material";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LightModeIcon from "@mui/icons-material/LightMode";
import logo from "../assets/rico-logo.png";

import { useLanguage } from "../context/language/LanguageContext";
import { useAuth } from "../context/auth-context";

interface AppNavbarProps {
  handleToggle: () => void;
  isDarkMode: boolean;
}

export default function AppNavbar({ handleToggle, isDarkMode }: AppNavbarProps) {
  const theme = useTheme();
  const { lang, setLang } = useLanguage();
  const { user } = useAuth();

  const handleLangChange = (event: SelectChangeEvent) => {
    setLang(event.target.value as "he" | "en");
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "primary.main", boxShadow: 3 ,width: '100%'}}>
      <Toolbar>
        {/* Logo & Title */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ width: 40, height: 40 }}
            />
          </Link>
        </Box>

        {/* Right side controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* 🌐 Language Selector */}
          <Select
            value={lang}
            onChange={handleLangChange}
            size="small"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              fontSize: 14,
              minWidth: 100,
              height: 36,
              ".MuiSelect-select": {
                padding: "4px 12px",
              },
            }}
          >
            <MenuItem value="he">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                 <span>עברית</span>
              </Box>
            </MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>

          {/* 👤 User Info */}
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar alt={user.name} src={user.profileImage} />
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>{user.name}</Typography>
              </Box>
            </Box>
          )}

          {/* 🌗 Theme Toggle */}
          <Button
            onClick={handleToggle}
            sx={{
              ml: 1,
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.secondary.main
                  : theme.palette.primary.contrastText,
              minWidth: "auto",
            }}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <BedtimeIcon /> : <LightModeIcon />}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
