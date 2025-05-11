import { useNavigate } from "react-router-dom";
import "../styles/css/NavbarNG.css";
import logo from "../assets/rico-logo.png";

const NavbarNG: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav>
      <button onClick={() => navigate(-1)} className="back-button">←</button>
      <img src={logo} alt="Rico Logo" className="logo" />
    </nav>
  )
  
}

export default NavbarNG;
