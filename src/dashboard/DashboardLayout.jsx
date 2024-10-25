import React, { useEffect, useRef, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import SideBar from './SideBar'
import image from '../assets/Open Books.jpg'
import { FaBarsStaggered, FaX } from 'react-icons/fa6'
import { BiArrowBack } from 'react-icons/bi'
const DashboardLayout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [width,setWidth] = useState(window.innerWidth);

  const toggleSidebar = () => {
    if(sideBarOpen){
      setSideBarOpen(false);
    }else{
      setSideBarOpen(true);
    }
  }

  useEffect(() => {
    const setSidebarFalse = () => {
      setSideBarOpen(false)
    }

    if(sideBarOpen){
      window.addEventListener('scroll',setSidebarFalse) 
      window.addEventListener('dblclick',setSidebarFalse) 
    }

    return () => {
      window.removeEventListener('scroll',setSidebarFalse)
      window.removeEventListener('dblclick',setSidebarFalse)
    }
  },[sideBarOpen,setSideBarOpen])

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };  
  },[])

  const handleGoBack = () => {
    window.history.back();
  }

  return (
    <div>
      <div style={{zIndex:2}}  className='bg-blue-500 flex md:justify-center md:h-[71px] gap-12 p-2 text-white text-xl fixed md:fixed top-0 left-0 right-0'>
          <div style={{zIndex:1}} className='relative z-100 left-[5px] flex md:flex-row md:absolute md:top-0 md:left-56'>
            <button onClick={handleGoBack} className=''><BiArrowBack className='text-black border border-black rounded-full p-1 w-7 h-7 relative right-1 md:right-52 md:top-1 lg:right-90 xl:right-106 text-2xl'/></button>
            { sideBarOpen ? 
              <FaX className='text-xl text-black hover:scale-110 cursor-pointer relative top-[14px] left-2 md:hidden' onClick={toggleSidebar}/>
              :
              <FaBarsStaggered className={`relative left-2 top-[14px] text-xl text-black cursor-pointer md:hidden`} onClick={toggleSidebar}/>
            }
            <div className=''>
            <Link to="/" ><img src={image} alt='logo' width={100} height={100} className={`md:w-16  relative top-0 md:right-52 md:top-1 w-12 h-12 md:h-16 ml-4 duration-700 rounded-full `}/></Link>
            </div>
          </div>

          <h1 className=' text-2xl lg:text-3xl relative top-2 right-4 sm:left-16 md:left-[-6px]'>Admin Dashboard</h1>
        </div>
      <div className='flex gap-4 mt-10 md:mt-0 flex-col md:flex-row'>
        <div style={{zIndex: (width > 640 ? 0 : 1)}} className={`${sideBarOpen ? "fixed top-16 left-0 md:block" : "hidden"} md:block md:relative md:top-[72px]`}><SideBar toggleSidebar={toggleSidebar} className=' shadow-xl'/></div>
        <div style={{zIndex:0}} className='w-full md:relative top-8 '>
          <Outlet/>
        </div>
    </div>
    </div>
  )
}

export default DashboardLayout
