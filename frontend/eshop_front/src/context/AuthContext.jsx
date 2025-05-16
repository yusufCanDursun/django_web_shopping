import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/auth/user/', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          console.log('Fetched user data:', data);
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Kullanıcı kontrolü başarısız:', err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const login = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/user/', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Login sonrası kullanıcı bilgisi alınamadı:', err);
      setUser(null);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
