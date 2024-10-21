
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Logout = ({nocolor}) => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const isConfirmed = window.confirm("Are you sure, you want to logout ?");
      if (isConfirmed) {
        await logOut();
        localStorage.removeItem('access-token');

        alert('Sign-out successful!!!');
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button onClick={handleLogout} className={`${ nocolor ? "hover:scale-105" : "bg-red-700 px-8 py-2 text-white rounded"}`}>
      Logout
    </button>
  );
};

export default Logout;
