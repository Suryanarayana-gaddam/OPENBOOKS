import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import MyFooter from './components/MyFooter'
import { useState } from 'react';


function App() {
  const [cartLength, setCartLength] = useState(0);

  const updateCartLength = (newLength) => {
    setCartLength(newLength);
  };

  return (
    <>
      <Navbar updateCartLength={updateCartLength} cartLength={cartLength}/>
      <div className='min-h-screen mt-5'>
          <Outlet/>
      </div>
      <MyFooter/>
    </>
  )
}

export default App
