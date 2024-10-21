import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import Login from '../components/Login'
import App from '../App'
import { Navigate, useLocation } from 'react-router-dom'
import Loading from '../components/Loading'

const HOC = ({component : Component}) => {
    const token = localStorage.getItem("access-token")
    const location = useLocation();
    if(!token){
        return <Component/>
    }

  return (
    <>
      <Navigate to={"/"} state={{from: location}} replace/>
    </>
  )
}

export default HOC
