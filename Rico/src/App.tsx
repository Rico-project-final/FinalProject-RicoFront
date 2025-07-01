import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { LanguageProvider } from "./context/language/LanguageContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/auth-context";
import { useCustomTheme, CustomThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/appRoutes";
import { LoadScript } from "@react-google-maps/api"; 

const libraries: ("places")[] = ["places"]; 

function AppWrapper() {
  return (
    <LanguageProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <CustomThemeProvider>
          <App />
        </CustomThemeProvider>
      </GoogleOAuthProvider>
    </LanguageProvider>
  );
}

// ✅ Main App component with dark/light theme support
function App() {
  const { mode, toggleTheme, theme } = useCustomTheme(); 

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <LoadScript 
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
          libraries={libraries}
        >
          <Router>
            <AppRoutes />
          </Router>
        </LoadScript>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppWrapper;
