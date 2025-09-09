import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Snackbar, Alert, Grow } from '@mui/material';
import authService from '../services/auth-service';
import { useAuth } from '../context/auth-context';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token.');
        return;
      }

      const { request } = authService.verifyEmail(token);
      try {
        const response = await request;
        const { user, accessToken, message } = response.data;

        // ✅ Save user & login
        authService.saveAuth({ user, accessToken });
        setUser(user);

        setMessage(message);
        setStatus('success');
        setSnackbarOpen(true);

        // ⏳ Redirect after 3 seconds
        setTimeout(() => {
          navigate(user.role === 'admin' ? '/dashboard' : '/customerProfile');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err?.response?.data?.message || 'Verification failed.');
        setSnackbarOpen(true);
      }
    };

    verify();
  }, [token, navigate, setUser]);

  return (
    //TODO :: make this page more beautiful
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      {status === 'loading' && (
        <>
          <CircularProgress />
          <Typography mt={2}>מאמת את האימייל...</Typography>
        </>
      )}
      {status !== 'loading' && (
        <Typography variant="h5" color={status === 'success' ? 'green' : 'error'} mt={2}>
          {message}
        </Typography>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        TransitionComponent={Grow}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={status === 'success' ? 'success' : 'error'}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VerifyEmailPage;
