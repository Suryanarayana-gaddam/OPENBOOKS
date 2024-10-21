import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import {Navigate,useLocation} from "react-router-dom";

const PrivateRoute = ({children}) => {
    const {user,loading} = useContext(AuthContext);
    const location = useLocation();

    if(loading){
      <div className="flex items-center justify-center h-screen">
      <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
          </div>
      </div>
  </div>
    }
    
    if(user){
        return children;
    }

  return (
    <Navigate to="/login" state={{from: location}} replace/>
  ) 
}

export default PrivateRoute




