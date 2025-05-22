import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/rico-logo.png';
import LoginModal from '../components/loginModal';
import { Box, Typography, Button, TextField } from '@mui/material';
import { useLanguage } from '../context/language/LanguageContext';
import { useAuth } from '../context/auth-context';
import { createReview } from '../services/review-service';
import { useEffect } from 'react';


const LandingPage: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
    useEffect(() => {
      if (user) {
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else {
          setLoginOpen(false);
        }
      }
    }, [user, loginOpen, navigate]);

  const handleSubmitFeedback = async () => {
    try {
      await createReview({ text: reviewText });
      navigate('/GreetingPage');
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  return (
    <Box
      sx={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f2f0de',
        textAlign: 'center',
        minHeight: '100vh',
        px: 2,
        py: 4,
        position: 'relative',
        color: 'black',
      }}
    >
      {/* Login Button - top right */}
      {!isAuthenticated && (
        <Button
          onClick={() => setLoginOpen(true)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: '#fff',
            borderRadius: '1rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            color: 'black',
            textTransform: 'none',
            '&:hover': {
              background: '#eee',
            },
          }}
        >
          {t("login")}
        </Button>
      )}

      {/* Login Modal */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* Main Content */}
      <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
        <Box
          component="img"
          src={logo}
          alt="Rico logo"
          sx={{
            width: '100px',
            mb: 3,
            display: 'block',
            mx: 'auto',
          }}
        />

        {isAuthenticated && user?.name && (
          <Typography variant="h6" sx={{ mt: 2 }}>
            {t('welcome')}, {user.name}!
          </Typography>
        )}

        <Typography variant="h4" sx={{ fontSize: '1.8rem', mb: 1 }}>
          ברוך הבא!
        </Typography>

        <Typography sx={{ mb: 1 }}>
          עזור לנו לשפר את חווייתך במסעדה
        </Typography>
        <Typography sx={{ mb: 1 }}>
          במקום זה תוכל לשתף אותנו בחוויותיך מהביקור במסעדה. יש לך אפשרות להגיב על מגוון חוויות–מהאוכל
          ועד השירות והאווירה. נשמח אם תוכל להקדיש כמה רגעים ולענות על כמה שאלות.
        </Typography>
        <Typography sx={{ mb: 1 }}>
          המשוב שלך חשוב לנו מאוד וישפיע על שיפור החוויה לכל מבקר.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <TextField
            label={t('tellUs') ?? "Share your experience"}
            multiline
            rows={5}
            variant="outlined"
            fullWidth
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              '& .MuiOutlinedInput-root': {
                borderRadius: '1rem',
              },
            }}
          />

          <Button
            onClick={handleSubmitFeedback}
            disabled={!isAuthenticated || !reviewText.trim()}
            sx={{
              mt: 2,
              background: '#fff',
              borderRadius: '1rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              color: 'black',
              textTransform: 'none',
              '&:hover': {
                background: '#eee',
              },
            }}
          >
            {t('submitFeedback') ?? "Submit Feedback"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
