import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './SideProfile.css';

function SideProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

   console.log('SideProfile user:', user);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        credentials: 'include',
      });
      logout();
      navigate('/login'); 
    } catch (error) {
      console.error('Çıkış yaparken hata:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="side-profile">
      <div className="profile-header">
        <h3>Profil Bilgileri</h3>
      </div>
      <div className="profile-content">
        <p><strong>Ad:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Yetki:</strong> {user.user_type === 'seller' ? 'Satıcı' : 'Alıcı'}</p>
        
        <button onClick={handleLogout} className="logout-btn">
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}

export default SideProfile;
