import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token and user in localStorage on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      setToken(data.token);
      setUser(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Logged in successfully!');
      return data;
    } catch (error) {
      // Error is handled by api interceptor
      throw error;
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const { data } = await api.post('/auth/signup', { name, email, password, role });
      
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      setToken(data.token);
      setUser(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Account created successfully!');
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
