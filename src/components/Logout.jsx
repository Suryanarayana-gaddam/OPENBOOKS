
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const isConfirmed = window.confirm("Are you sure, you want to logout ?");
      if (isConfirmed) {
        await logOut();
        localStorage.removeItem('access-token');
        // Update sessionStorage to signal other tabs
        //sessionStorage.setItem('session-active', JSON.stringify(false));
        alert('Sign-out successful!!!');
        navigate('/', { replace: true });
        window.location.reload()
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="bg-red-700 px-8 py-2 text-white rounded">
      Logout
    </button>
  );
};

export default Logout;
