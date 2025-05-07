import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import FoodRatingPage from './pages/FoodRatingPage';
import ServicePage from './pages/ServicePage';
import ExperiencePage from './pages/ExperiencePage';
import GreetingPage from './pages/GreetingPage'
import MobileOnlyWrapper from './components/MobileOnlyWrapper';

function App() {
  return (
    <MobileOnlyWrapper>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/food" element={<FoodRatingPage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/greeting" element={<GreetingPage />} />
        </Routes>
      </Router>
    </MobileOnlyWrapper>    
  );
}

export default App;
