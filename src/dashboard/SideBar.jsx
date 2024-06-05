import { Sidebar } from 'flowbite-react';
import { BiBuoy } from 'react-icons/bi';
import { HiArrowSmRight, HiCash, HiChartPie, HiInbox, HiOutlineCloudUpload, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';

//import userImg from "../assets/profile.jpg"
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaPerson } from 'react-icons/fa6';


const SideBar = () => {
  const {user} = useContext(AuthContext)
  //console.log(user)
  return (
    <Sidebar aria-label="Sidebar with content separator example">
      <div className="flex items-center pb-2">
        <Link to="/" className="flex items-center">
        <IoArrowBack />
          <span className="ml-2" >Back</span>
        </Link>
      </div>
      <div className="flex items-center pb-3">
        {user && user.photoURL !== null && user.photoURL !== undefined ? (
          <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full mr-2" />
        ) : (
          <FaPerson className="w-8 h-8 mr-2" />
        )}
        <span>{user ? user.displayName || user.email : "Guest"}</span>
      </div>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item  icon={HiChartPie}>
            <Link to={"/admin/dashboard"}>DashBoard</Link>
          </Sidebar.Item>
          <Sidebar.Item  icon={HiOutlineCloudUpload}>
            <Link to={"/admin/upload"}>Upload Book</Link>
          </Sidebar.Item>
          <Sidebar.Item  icon={HiInbox}>
            <Link to={"/admin/manage"}>Mangage Books</Link>
          </Sidebar.Item>
          <Sidebar.Item icon={HiUser}>
          <Link to={"/admin/all-users"}>Mangage Users</Link>
          </Sidebar.Item>
          <Sidebar.Item  icon={HiCash}>
            <Link to={"/admin/all-orders"}>Orders</Link>
          </Sidebar.Item>
          <Sidebar.Item icon={HiTable}>
            <Link to={"/logout"}>Log Out</Link>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          
          <Sidebar.Item href="#" icon={BiBuoy}>
            Help
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default SideBar
