import { Sidebar } from 'flowbite-react';
import { BiBuoy } from 'react-icons/bi';
import { HiCash, HiChartPie, HiInbox, HiOutlineCloudUpload, HiTable, HiUser } from 'react-icons/hi';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import Logout from '../components/Logout';
import { FaX } from 'react-icons/fa6';

const SideBar = ({toggleSidebar}) => {
  const {user} = useContext(AuthContext);
  const [profilePic,setProfilePic] = useState(null);
  const [userName, setUserName] = useState('');
  const [userData,refetch] = useUser();

  useEffect(() => {
    if(userData){
      setUserName(userData.username);
      setProfilePic(userData.profilePic);
    }
  }, [userData]);

  return (
    <Sidebar className='bg-[#a2c9ff]' style={{backgroundColor:'#d5f5f6'}} aria-label="Sidebar with content separator example">
      
      <div className="flex items-center pb-3 p-1 bg-[#a2c9ff] hover:bg-red-300 ">
      <Link to="/userProfile">
        {user && user.photoURL !== null && user.photoURL !== undefined ? (
          <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full mr-2" />
        ) : (
          <img src={profilePic} alt="Profile" className='rounded-full h-10 w-10 ml-2' />
        )}
        </Link>
        <span>{user ? user.displayName || userName : "Guest"}</span>
      </div>
      <Sidebar.Items className='m-1'>
        <Sidebar.ItemGroup className=''>
          <Link to={"/admin/Dashboard"} onClick={toggleSidebar}>
            <Sidebar.Item className='bg-[#a2c9ff] my-2 hover:bg-red-300 duration-700 cursor-pointer hover:text-pretty hover:scale-105' icon={HiChartPie}>
              DashBoard
            </Sidebar.Item>
          </Link>
          <Link to={"/admin/Dashboard/upload"} onClick={toggleSidebar}>
            <Sidebar.Item className='bg-[#a2c9ff] my-2 hover:bg-red-300 duration-700 cursor-pointer hover:text-pretty hover:scale-105' icon={HiOutlineCloudUpload}>
              Upload Book
            </Sidebar.Item>
          </Link>
          <Link to={"/admin/Dashboard/manage"} onClick={toggleSidebar}>
            <Sidebar.Item className='bg-[#a2c9ff] my-2 hover:bg-red-300 duration-700 cursor-pointer hover:text-pretty hover:scale-105' icon={HiInbox}>
              Mangage Books
            </Sidebar.Item>
          </Link>
          <Link to={"/admin/Dashboard/all-users"} onClick={toggleSidebar}>
            <Sidebar.Item className='bg-[#a2c9ff] my-2 hover:bg-red-300 duration-700 cursor-pointer hover:text-pretty hover:scale-105' icon={HiUser}>
              Mangage Users
            </Sidebar.Item>
          </Link>
          <Link to={"/admin/Dashboard/all-orders"} onClick={toggleSidebar}>
            <Sidebar.Item className='bg-[#a2c9ff] my-2 hover:bg-red-300 duration-700 cursor-pointer hover:text-pretty hover:scale-105' icon={HiCash}>
              Orders
            </Sidebar.Item>
          </Link>
          <Sidebar.Item className='bg-[#a2c9ff] my-2 hover:bg-red-300 duration-700 cursor-pointer hover:text-pretty hover:scale-105' icon={HiTable}>
            <Logout nocolor={true}/>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          
          <Sidebar.Item className='bg-[#a2c9ff] my-2 hover:bg-red-300 duration-700 cursor-pointer hover:text-pretty hover:scale-105' href="#" icon={BiBuoy} onClick={toggleSidebar}>
            Help
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default SideBar
