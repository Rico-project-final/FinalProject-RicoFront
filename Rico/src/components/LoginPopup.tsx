import '../styles/css/LoginPopup.css';

interface LoginPopupProps {
  onClose: () => void;
  onLogin: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ onClose, onLogin }) => {
  return (
    <div className="popup">
      <button onClick={onClose}>✕</button>
      <h2>אורח יקר,</h2>
      <p>תרצה להמשיך בתור אורח או להתחבר?</p>
      <button onClick={onLogin}>התחברות</button>
      <button onClick={onClose}>המשך בתור אורח</button>
    </div>
  );
}

export default LoginPopup;