import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    user_type: 'B', 
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = 'http://127.0.0.1:8000/api/auth/register/';
      
      console.log('İstek gönderiliyor:', apiUrl);
      console.log('Form verileri:', formData);
      
      // Backend'e JSON veri gönderme
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', 
      });

      console.log('Sunucu yanıtı:', response.status, response.statusText);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        console.error('JSON olmayan yanıt alındı:', textResponse.substring(0, 200) + '...');
        throw new Error('Sunucudan geçersiz yanıt alındı');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Kayıt sırasında bir hata oluştu');
      }

      console.log('Kayıt başarılı:', data);
      navigate('/login');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      setError(error.message || 'Kayıt sırasında bir hata oluştu. CORS hatası olabilir.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Kayıt Ol</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Kullanıcı Adı"
          value={formData.username}
          onChange={handleChange}
          required
          minLength="3"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="6"
        />
        <select
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
          required
        >
          <option value="B">Alıcı</option>
          <option value="S">Satıcı</option>
        </select>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
        </button>
      </form>
    </div>
  );
}

export default Register;