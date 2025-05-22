import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
// import RatingPage from '../components/RatingPage'; // Uncomment if you use a layout wrapper

const GreetingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLeaveAnother = () => {
    navigate('/');
  };

  return (
    // If you use a layout wrapper, uncomment this:
    // <RatingPage>
    <Box
      sx={{
        fontFamily: `'Varela Round', 'Baloo', 'Rubik', Arial, sans-serif`,
        backgroundColor: '#f2f0de',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        px: 3,
        py: 6,
        color: 'black',
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        תודה רבה על המשוב שלך!
      </Typography>

      <Typography variant="h6" sx={{ mb: 2, maxWidth: 600 }}>
        אנחנו מאוד מעריכים את הזמן שלך ואת המשוב שסיפקת. כל מילה חשובה לנו,
        ונעשה כל מאמץ לשפר את השירות והחוויה שלך.
      </Typography>

      <Typography variant="h6" sx={{ mb: 4, maxWidth: 600 }}>
        במידת הצורך ניצור איתך קשר בהקדם. תודה רבה על שיתוף הפעולה — אנחנו מחכים לראותך שוב!
      </Typography>

      <Button
        onClick={handleLeaveAnother}
        sx={{
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
        השאר ביקורת נוספת
      </Button>
    </Box>
    // </RatingPage>
  );
};

export default GreetingPage;
