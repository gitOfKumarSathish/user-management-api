import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../core/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await api.auth.getMe();
        // Handle potential response wrappers: data.user or just data
        let userObj = data.user || data;
        if (userObj._id && !userObj.id) {
            userObj = { ...userObj, id: userObj._id };
        }
        setUser(userObj);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const { data } = await api.auth.login({ email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.auth.signUp(userData);
    // localStorage.setItem('token', data.token);
    // setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const updateProfile = async (data) => {
    // console.log({data});
    const { data: responseData } = await api.user.updateProfile(data);
    
    // Handle various response structures:
    // 1. { data: { user: { ... } } }
    // 2. { user: { ... } }
    // 3. { ...user fields... }
    let userObj = responseData.data?.user || responseData.user || responseData;

    // Normalize _id to id
    if (userObj && userObj._id && !userObj.id) {
        userObj = { ...userObj, id: userObj._id };
    }
    
    setUser(userObj); // Update local user state
    return userObj;
  };

  const changePassword = async (data) => {
    const { data: response } = await api.user.changePassword(data);
    return response;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
