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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    login,
    register,
    loginWithGoogle,
    isLoading,
    error,
    clearError,
  } = useAuth();
  const { t } = useLanguage();

  const handleGoogleSuccess = async (response: any) => {
    clearError();
    if (response.credential) {
      try {
        await loginWithGoogle(response.credential);
        onClose();
      } catch (err) {
        console.error('Google login failed:', err);
      }
    }
  };

  const handleEmailLogin = async () => {
    clearError();
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      console.error('Email login failed:', err);
    }
  };

  const handleRegister = async () => {
    clearError();
    try {
      await register(name, email, password);
      onClose();
      alert(`${t('welcome')}, ${name}!`);
    } catch (err) {
      console.error('Register failed:', err);
    }
  };

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
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>

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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {isRegisterMode && (
            <TextField
              label={t('name')}
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
          )}
          <TextField
            label={t('email')}
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />
          <TextField
            label={t('password')}
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />
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

          <Box sx={{ mt: 2 ,display: 'flex', justifyContent: 'center', alignItems: 'center' , gap: 1}}>
             <Link
                component="button"
                onClick={switchMode}
                sx={{ ml: 1,  background: '#fff',
                  borderRadius: '1rem',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  color: 'black',
                  textTransform: 'none',
                  '&:hover': {
                    background: '#eee',
                  },}}
                  >
                {isRegisterMode ? t('login') : t('register')}
              </Link>
            <Typography variant="body2">
              {isRegisterMode ? t('alreadyHaveAccount') : t('noAccount')}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
