import { useState } from 'react';
import logo from '../assets/rico-logo.png';
import '../styles/css/LoginPage.css'; 
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  

  // Handle Google login success
  const handleGoogleSuccess = async (response: any) => {
    if (response.credential) {
      try {
        setLoading(true);
        await loginWithGoogle(response.credential);
        navigate('/');
      } catch (err: any) {
        console.error('Google login error:', err);
        setError(err.response?.data?.message || 'Google login failed');
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="login-root">
      <div className="login-container">
        <img src={logo} alt="Rico Logo" className="logo" />
        <h1 className="login-title">Login</h1> 
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google login failed')} />

      </div>
    </div>
  );
};

export default LoginPage;