import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <button className="home-button-l" onClick={() => navigate('/login')}>
        Giriş Yap
      </button>
      <div className="spacer" />
      <button className="home-button-r" onClick={() => navigate('/register')}>
        Kayıt Ol
      </button>
    </div>
  );
}

export default Home;
