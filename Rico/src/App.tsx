import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { LanguageProvider } from './context/language/LanguageContext'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from '@mui/material/styles';
import AppRoutes from './routes/appRoutes'
import { AuthProvider } from './context/auth-context';
import { useState } from 'react';
import { lightTheme, darkTheme } from './theme';


function App() {
   const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggle = () => {
    setIsDarkMode((prev) => !prev);
  };
  return (
    <LanguageProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <AuthProvider>
                  <Router>
                      <AppRoutes handleToggle={handleToggle} isDarkMode={isDarkMode} />
                  </Router>
          </AuthProvider>
          </ThemeProvider>
      </GoogleOAuthProvider>
     </LanguageProvider>
  )
}

export default App
