import { useState, createContext, useContext } from 'react';
import * as userService from '../services/userService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, clearCart }) => {
  const [user, setUser] = useState(userService.getUser());

  const login = async (email, password) => {
    try {
      const loggedInUser = await userService.login(email, password);
      setUser(loggedInUser);
      toast.success('Login Successful');
    } catch (err) {
      toast.error(err.response?.data || 'Login failed');
    }
  };

  const setUserData = (userData) => {
    setUser(userData);
  };

  const register = async data => {
    try {
      const registeredUser = await userService.register(data);
      setUser(registeredUser);
      toast.success('Register Successful');
    } catch (err) {
      toast.error(err.response?.data || 'Registration failed');
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    if (clearCart) clearCart();
    toast.success('Logout Successful');
  };

  const updateProfile = async updatedUser => {
    try {
      const result = await userService.updateProfile(updatedUser);
      toast.success('Profile Update Was Successful');
      setUser(result);
    } catch (err) {
      toast.error('Profile Update Failed');
    }
  };

  const changePassword = async passwords => {
    try {
      await userService.changePassword(passwords);
      logout();
      toast.success('Password Changed Successfully, Please Login Again!');
    } catch (err) {
      toast.error('Password Change Failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateProfile,
        changePassword,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
