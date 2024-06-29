import { Sidebar } from 'flowbite-react';
import { BiBuoy } from 'react-icons/bi';
import { HiCash, HiChartPie, HiInbox, HiOutlineCloudUpload, HiTable, HiUser } from 'react-icons/hi';

//import userImg from "../assets/profile.jpg"
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaPerson, FaUser } from 'react-icons/fa6';


const SideBar = () => {
  const {user} = useContext(AuthContext);
  const token = localStorage.getItem('access-token');
  const [profilePic,setProfilePic] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userEmail = user?.email;
        fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json", // Set content type header explicitly
                        authorization: `Bearer ${token}`
                    },
                    })
                .then(res => {
                    if (!res.ok) {
                    return res.json().then(error => {
                        console.error("Error fetching user data:", error);
                        // Handle the error (e.g., display a message to the user)
                    });
                    }
                    return res.json(); // Parse valid JSON response
                })
                .then(userData => {
                    //console.log("User Data:", userData);
                    // Get user ID from userData
                    setUserName(userData.username);                    
                    setProfilePic(userData.profilePic);
                })
  },[user])
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
      <Link to="/userProfile">
        {user && user.photoURL !== null && user.photoURL !== undefined ? (
          <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full mr-2" />
        ) : (
          <img src={profilePic} alt="Profile" className='rounded-full h-10 w-10 ml-2' />
        )}
        </Link>
        <span>{user ? user.displayName || userName : "Guest"}</span>
      </div>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item  icon={HiChartPie}>
            <Link to={"/admin/Dashboard"}>DashBoard</Link>
          </Sidebar.Item>
          <Sidebar.Item  icon={HiOutlineCloudUpload}>
            <Link to={"/admin/Dashboard/upload"}>Upload Book</Link>
          </Sidebar.Item>
          <Sidebar.Item  icon={HiInbox}>
            <Link to={"/admin/Dashboard/manage"}>Mangage Books</Link>
          </Sidebar.Item>
          <Sidebar.Item icon={HiUser}>
          <Link to={"/admin/Dashboard/all-users"}>Mangage Users</Link>
          </Sidebar.Item>
          <Sidebar.Item  icon={HiCash}>
            <Link to={"/admin/Dashboard/all-orders"}>Orders</Link>
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
