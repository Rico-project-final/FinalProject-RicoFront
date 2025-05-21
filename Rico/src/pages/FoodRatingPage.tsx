import { useNavigate } from 'react-router-dom';
import RatingPage from '../components/RatingPage';

const FoodRatingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <RatingPage>
      <h1>אוכל</h1>
      <p>
        החוויה שלך חשובה לנו! כאן תוכל לשתף אותנו על האוכל במסעדה, על איכות האוכל, על טריות האוכל,
        על המנה שהזמנת ועל עוד דברים שאתה חושב לנכון לשתף אותנו
      </p>
      <textarea placeholder="כתוב את החוויה שלך כאן..." />

      <div className="buttons">
        <button onClick={() => navigate('/service')}>המשך לדרג קטגוריות נוספות</button>
        <button onClick={() => navigate("/greeting")}>סיים ושלח</button>
      </div>
    </RatingPage>
  );
}

export default FoodRatingPage;
