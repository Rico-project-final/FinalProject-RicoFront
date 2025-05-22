import { useState } from 'react';
import logo from '../assets/rico-logo.png';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useLanguage } from '../context/language/LanguageContext';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const { t } = useLanguage();

  const handleGoogleSuccess = async (response: any) => {
    if (response.credential) {
      try {
        setLoading(true);
        await loginWithGoogle(response.credential);
        navigate('/');
      } catch (err: any) {
        console.error('Google login error:', err);
        setError(t('loginError'));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        fontFamily: `'Varela Round', 'Baloo', 'Rubik', Arial, sans-serif`,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          width: '100%',
          maxWidth: { xs: '98vw', sm: '420px' },
          px: 2,
        }}
      >
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
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: { xs: '2.1rem', sm: '3rem' },
            margin: '0 0 32px 0',
            letterSpacing: '1px',
            textAlign: 'center',
          }}
        >
          {t('login')}
        </Typography>

        <Box
          sx={{
            flex: 1,
            background: '#fff',
            borderRadius: '28px',
            padding: { xs: '24px 0', sm: '32px 0' },
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            marginTop: '12px',
            textAlign: 'center',
          }}
        >
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError(t('loginError'))}
          />

          {error && (
            <Typography
              sx={{
                mt: 2,
                color: 'red',
                fontSize: '1rem',
                textAlign: 'center',
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
