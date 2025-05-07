import { useNavigate } from "react-router-dom";
import "../styles/components/NavbarNG.css";
import logo from "../assets/rico-logo.jpg";

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
