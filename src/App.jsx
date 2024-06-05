//import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import MyFooter from './components/MyFooter'
import { useEffect, useState } from 'react';


function App() {
  // const [count, setCount] = useState(0)
  const [cartLength, setCartLength] = useState(0);

  // Function to update cart length
  const updateCartLength = (newLength) => {
    setCartLength(newLength);
  };

  // Use the session management hook
 // useSessionManagement();

  return (
    <>
      <Navbar updateCartLength={updateCartLength} cartLength={cartLength}/>
      <div className='min-h-screen'>
          <Outlet/>
      </div>
      <MyFooter/>
    </>
  )
}

export default App
