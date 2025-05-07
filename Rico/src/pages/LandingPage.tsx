import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/LandingPage.css';
import logo from '../assets/rico-logo.jpg';
import foodIcon from '../assets/food-icon.png';
import serviceIcon from '../assets/service-icon.png';
import experienceIcon from '../assets/experience-icon.png';
import LoginPopup from '../components/LoginPopup';

const LandingPage: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');
  const navigate = useNavigate();

  const isLoggedIn = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
  };

  const handleButtonClick = (path: string) => {
    if (isLoggedIn()) {
      navigate(path);
    } else {
      setRedirectTo(path);
      setShowPopup(true);
    }
  };

  const handleLogin = () => {
    setShowPopup(false);
    navigate('/login');
  };

  const handleContinueAsGuest = () => {
    setShowPopup(false);
    navigate(redirectTo);
  };

  return (
    <div className="app">
      <img src={logo} alt="Rico logo" className="logo" />
      <h1>ברוך הבא!</h1>
      <p>עזור לנו לשפר את חווייתך במסעדה</p>
      <p>
        במקום זה תוכל לשתף אותנו בחוויותיך מהביקור במסעדה. יש לך אפשרות להגיב על מגוון חוויות–מהאוכל
        ועד השירות והאווירה. נשמח אם תוכל להקדיש כמה רגעים ולענות על כמה שאלות.
      </p>
      <p>המשוב שלך חשוב לנו מאוד וישפיע על שיפור החוויה לכל מבקר.</p>

      <div className="buttons">
        <button className="rate-button" onClick={() => handleButtonClick('/food')}>
          <img src={foodIcon} alt="Food icon" />
          <span>לדירוג האוכל</span>
        </button>
        <button className="rate-button" onClick={() => handleButtonClick('/service')}>
          <img src={serviceIcon} alt="Service icon" />
          <span>לדירוג השירות</span>
        </button>
        <button className="rate-button" onClick={() => handleButtonClick('/experience')}>
          <img src={experienceIcon} alt="Experience Icon" />
          <span>לדירוג השירות</span>
        </button>
      </div>
      {showPopup && (
        <LoginPopup
          onClose={handleContinueAsGuest}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default LandingPage;