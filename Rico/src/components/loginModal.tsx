/**
 * LoginModal Component
 * --------------------
 * Modal dialog that handles both login and registration of users.
 * Supports email/password login and registration, as well as Google OAuth login.
 * Displays appropriate input fields based on mode (login or register).
 * Shows success/error feedback using a Snackbar component.
 * 
 * Props:
 * - open: boolean that controls if the modal is open or closed.
 * - onClose: function to close the modal.
 */

import { useState } from 'react';
import logo from '../assets/rico-logo.png';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/auth-context';
import { useLanguage } from '../context/language/LanguageContext';
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Link,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Define typed Alert component for Snackbar
const Alert = MuiAlert as React.FC<
  React.PropsWithChildren<{
    onClose: () => void;
    severity: 'success' | 'error';
    sx?: object;
  }>
>;

interface LoginModalProps {
  open: boolean;        // Whether the modal is open
  onClose: () => void;  // Callback to close the modal
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  // Local state to toggle between login and registration modes
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Snackbar states for feedback messages
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Auth context provides login, register, Google login, loading state, error, and error clearing
  const {
    login,
    registerUser,
    loginWithGoogle,
    isLoading,
    error,
    clearError,
  } = useAuth();

  // Language context for translation
  const { t } = useLanguage();

  // Handle Google login success response
  const handleGoogleSuccess = async (response: any) => {
    clearError(); // Clear any previous errors
    if (response.credential) {
      try {
        await loginWithGoogle(response.credential);
        onClose(); // Close modal on success
      } catch (err) {
        console.error('Google login failed:', err);
      }
    }
  };

  // Handle login with email and password
  const handleEmailLogin = async () => {
    clearError();
    try {
      await login(email, password);
      onClose(); // Close modal on success
    } catch (err) {
      console.error('Email login failed:', err);
    }
  };

  // Handle user registration
  const handleRegister = async () => {
    clearError();
    try {
      const response = await registerUser(email, password, name, phone);

      // Show success snackbar message on registration
      setSnackbarMessage(response?.message || 'Registration successful. Please check your email to verify your account.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      onClose(); // Close modal on success
    } catch (err: any) {
      console.error('Register failed:', err);
      // Show error snackbar message on failure
      setSnackbarMessage(err?.response?.data?.message || 'Registration failed. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Switch between login and registration modes
  const switchMode = () => {
    clearError();
    setIsRegisterMode((prev) => !prev);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent
        sx={{
          fontFamily: `'Varela Round', 'Baloo', 'Rubik', Arial, sans-serif`,
          padding: 4,
          position: 'relative',
          backgroundColor: '#f2f0de',
        }}
      >
        {/* Close icon button */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Logo image */}
        <Box
          component="img"
          src={logo}
          alt="Rico Logo"
          sx={{
            width: { xs: '90px', sm: '120px' },
            margin: '10px auto 16px auto',
            display: 'block',
          }}
        />

        {/* Title changes depending on mode */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem' },
            mb: 3,
            textAlign: 'center',
            color: 'black',
          }}
        >
          {isRegisterMode ? t('register') : t('login')}
        </Typography>

        {/* Form inputs */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Show extra inputs when registering */}
          {isRegisterMode && (
            <>
              <TextField
                label="שם מלא"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              />
              <TextField
                label="טלפון"
                variant="outlined"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              />
            </>
          )}

          {/* Email input */}
          <TextField
            label="אימייל"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />

          {/* Password input */}
          <TextField
            label="סיסמא"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />

          {/* Submit button changes text and handler based on mode */}
          <Button
            disabled={isLoading}
            onClick={isRegisterMode ? handleRegister : handleEmailLogin}
            sx={{
              background: '#fff',
              borderRadius: '1rem',
              padding: '0.75rem',
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              color: 'black',
              textTransform: 'none',
              '&:hover': {
                background: '#eee',
              },
            }}
          >
            {isRegisterMode ? t('register') : t('loginWithEmail')}
          </Button>
        </Box>

        {/* Google login button only shown on login mode */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          {!isRegisterMode && (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                clearError();
                console.error('Google login error');
              }}
            />
          )}

          {/* Show any auth errors */}
          {error && (
            <Typography
              sx={{
                mt: 2,
                color: 'red',
                fontSize: '1rem',
              }}
            >
              {error}
            </Typography>
          )}

          {/* Link to switch between login and register modes */}
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Link
              component="button"
              onClick={switchMode}
              sx={{
                ml: 1,
                background: '#fff',
                borderRadius: '1rem',
                padding: '0.75rem',
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                color: 'black',
                textTransform: 'none',
                '&:hover': {
                  background: '#eee',
                },
              }}
            >
              {isRegisterMode ? t('login') : t('register')}
            </Link>
            <Typography variant="body2">
              {isRegisterMode ? t('alreadyHaveAccount') : t('noAccount')}
            </Typography>
          </Box>
        </Box>

        {/* Snackbar for success/error feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
