import React from 'react'
import { useAppState } from '../../context/Context'

const LogIn = () => {
  const { setLoginActive, isAuthenticated, setIsAuthenticated, setUser } = useAppState();
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isAuthenticated) {
    return (
      <button 
        onClick={handleLogout}
        className='rounded-3xl px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold transition duration-300'
      >
        Log Out
      </button>
    );
  }

  return (
    <button 
      onClick={() => setLoginActive(true)}
      className='rounded-3xl w-[6rem] border border-gray-200 px-4 py-2 bg-blue-50 text-blue-500 font-semibold hover:bg-blue-100 transition duration-300'
    >
      Log In
    </button>
  );
}

export default LogIn