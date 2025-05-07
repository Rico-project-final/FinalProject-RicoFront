import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/rico-logo.jpg';
import '../styles/pages/LoginPage.css';

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();

  };

  return (
    <div className="login-root">
      <div className="login-container">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
          aria-label="חזור"
        >←</button>
        <img src={logo} alt="Rico Logo" className="logo" />
        <h1 className="login-title">Login</h1>
        <form
          onSubmit={handleSendCode}
          className="login-card"
        >
          <label className="login-label">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="login-input"
            required
          />
          <button
            type="submit"
            className="login-btn"
          >
            send me code
          </button>
          <div className="login-register">
            Don't have an account yet?{' '}
            <span
              className="login-register-link"
              onClick={() => navigate('/register')}
            >
              Register here
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;