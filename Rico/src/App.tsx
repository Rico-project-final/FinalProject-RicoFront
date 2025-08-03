import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { LanguageProvider } from "./context/language/LanguageContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/auth-context";
import { useCustomTheme, CustomThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/appRoutes";

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
  const { theme } = useCustomTheme(); 

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes/>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppWrapper;
