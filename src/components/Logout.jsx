// import React, { useContext } from 'react'
// import { AuthContext } from '../context/AuthProvider'
// import {useLocation,useNavigate} from "react-router-dom"

// const Logout = () => {
//     const {logOut} = useContext(AuthContext);

//     const location = useLocation();
//     const navigate = useNavigate();

//     const from = location.state?.form?.pathname || "/";

//     const handleLogout = () => {
//         logOut().then(() => {
//             //Sign-out successful.
//             alert("Sign-out successful!!!");
//             navigate(from,{replace: true});
//           }).catch((error) => {
//             // An error happened.
//           });
//     }

//   return (
//     <div className='h-screen bg-teal-100 flex items-center justify-center'>
//       <button onClick={handleLogout} className='bg-red-700 px-8 py-2 text-white rounded'>Logout</button>
//     </div>
//   )
// }

// export default Logout


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
