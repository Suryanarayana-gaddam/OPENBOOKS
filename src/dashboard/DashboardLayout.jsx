import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar'

const DashboardLayout = () => {
  return (
    <div className='flex gap-4 flex-col md:flex-row'>
        <SideBar/>
        <div className='w-full'>
          <Outlet/>
        </div>
    </div>
  )
}

export default DashboardLayout
