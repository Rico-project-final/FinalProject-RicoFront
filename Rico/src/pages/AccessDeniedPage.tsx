import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, useTheme } from '@mui/material';
// import { useLanguage } from '../context/language/LanguageContext';
import lock from '../assets/hacking.png';

const AccessDeniedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  // const { t } = useLanguage();

  // Redirect to "/" if user re-visits this page
  useEffect(() => {
    const alreadyVisited = sessionStorage.getItem('wasOnAccessDenied');
    if (alreadyVisited === 'true') {
      sessionStorage.removeItem('wasOnAccessDenied');
      navigate('/', { replace: true });
    } else {
      sessionStorage.setItem('wasOnAccessDenied', 'true');
    }

    return () => {
      sessionStorage.removeItem('wasOnAccessDenied');
    };
  }, [navigate]);

  const handleBack = () => {
    const lastPublic = localStorage.getItem('lastPublicRoute');
    if (lastPublic && lastPublic !== location.pathname) {
      navigate(lastPublic);
    } else {
      navigate('/');
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
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        textAlign: 'center',
        px: 2,
      }}
    >
      <Box
        component="img"
        src={lock}
        alt="No Access Cat"
        sx={{
          width: { xs: '180px', sm: '260px' },
          mb: 3,
        }}
      />

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 1,
        }}
      >
        { 'Access Denied 😼'}
      </Typography>

      <Typography
        sx={{
          fontSize: '1.2rem',
          maxWidth: '480px',
          mb: 4,
        }}
      >
        {
          "This area is strictly for cats with proper credentials. You, human, shall not pass!"}
      </Typography>

      <Button
        onClick={handleBack}
        variant="contained"
        sx={{
          borderRadius: '999px',
          px: 4,
          py: 1.5,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          textTransform: 'none',
          fontWeight: 'bold',
          fontSize: '1rem',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        {'Go Back'}
      </Button>
    </Box>
  );
};

export default AccessDeniedPage;
