import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBarsStaggered, FaBookAtlas, FaUser, FaXmark} from "react-icons/fa6"
import { AuthContext } from '../context/AuthProvider';
import Logout from './Logout';
import useCart from '../../hooks/useCart';

const Navbar = () => {
    const [activeItem, setActiveItem] = useState('');
    const [isMenuOpen,setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSticky,setIsSticky] = useState(false);
    const [isAdmin,setIsAdmin] = useState(false);
    const [username, setUsername] = useState('');
    const [profilePic,setProfilePic] = useState(null)
    const {user} = useContext (AuthContext);
    const [cart,refetch] = useCart();
    
    const token = localStorage.getItem('access-token');

    const toggleMenu = () => {
        setIsUserMenuOpen(false);
        setIsMenuOpen(!isMenuOpen);
    }
    const toggleUserMenu = () => {
        setIsMenuOpen(false);
        setIsUserMenuOpen(!isUserMenuOpen);
    }
    const CloseUserMenu = () => {
        setIsUserMenuOpen(false);
    }

    useEffect(() => {
        if (!user) return 
        const userEmail = user?.email;
        
                    fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json", 
                        authorization: `Bearer ${token}`
                    },
                    })
                .then(res => {
                    if (!res.ok) {
                    return res.json().then(error => {
                        console.error("Error fetching user data:", error);
                    });
                    }
                    return res.json(); 
                })
                .then(userData => {

                    {
                        userData.role == "admin" ?
                      (setIsAdmin(true)) : (setIsAdmin(false))
                      }
                    setUsername(userData.username);                    
                    setProfilePic(userData.profilePic);
                })
            
        

        const handleScroll = () => {
            if(window.scrollY > 100){
                setIsSticky(true);
            }
            else{
                setIsSticky(false);
            }
        }
        window.addEventListener("scroll",handleScroll);

        return() => {
            window.addEventListener("scroll",handleScroll);
        }

    },[user,token])

    const navItems = [
        {link:"Home",path:"/"},
        {link:"Categories",path:"/bookcategories"},
        {link:"Shop",path:"/shop"},
        {link:"Admin",path: isAdmin ? "/admin/Dashboard" : "/login"},
    ]
    
        const userMenuItems = user ? [
            { link: "Profile", path: "/userProfile" },
            { link: "Wishlist", path: "/wishlist" },
            { link: "Cart", path: "/cart" },
            { link: "Upload Book", path: "/user/upload-book" },
            { link: "My Books", path: "/uploaded-books" },
            { link: "Orders", path: "/orders" },
            { link: <Logout/>,path:"#" },
        ] : [
            { link: "Signup", path: "/sign-up" },
            { link: "Login", path: "/login" }
        ];


return (
    <header className='w-full bg-transparent fixed top-0 left-0 right-0 transition-all ease-in duration-300'>
        <nav className={`py-2 lg:px-14 px-4 ${isSticky ? "sticky top-0 left-0 right-0 bg-blue-300" : ""}`}>
            <div className='flex justify-between items-center text-base gap-8'>
                {/* logo */} 
                <Link to="/" className='text-2x1 font-bold text-blue-700 flex items-center gap-2'><div className={`imglogo text-transparent ${isSticky ? "w-28 sm:w-20 sm:h-10 h-12 sm:ml-4" : "lg:w-40 w-32 sm:w-24 sm:h-10 h-24"} rounded-full`}>Logo</div></Link>
                {/*nav items for large device */}
                <ul className='md:flex space-x-12 hidden'>
                    {
                        navItems.map(({link,path}) => <Link key={path} to={path} className={`block text-base text-black uppercase cursor-pointer hover:text-blue-700 ${activeItem === link ? 'font-bold text-md text-blue-700' : 'text-black'}` } onClick={() => setActiveItem(link)}> {link}</Link>)
                    }
                </ul>

                {/* btn for lg devices */}
                <div className='space-x-5  hidden lg:flex sm:flex items-center mr-0'>
                    {/* Use the img tag to display the user's photo */}
                    {user?.displayName || username || user?.email}
                    <span>
                            {user ? (
                                user.photoURL ? (
                                        <Link to="/userProfile">
                                            <img src={user.photoURL} alt="" className='p-0 h-8 w-8 border-none rounded-full mr-0' />
                                        </Link>
                                    ) : (
                                        <Link to="/userProfile">
                                            <img src={profilePic} alt="Profile" className='rounded-full h-10 w-10 ml-2' />
                                        </Link>
                                    )
                            ) : (
                                <FaUser className='p-0 mt-1 h-4 w-4 border-none rounded-full' />
                            )}
                    </span>
                       {
                        user ? (
                            <Link to={"/cart"}> 
                       <label tabIndex={0} role='button' className="btn btn-ghost btn-circle relative top-4">
                        <div className="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <span className="badge badge-sm indicator-item relative bottom-9 left-4">{cart.length }</span>
                        </div>
                        </label>
                       </Link>
                        ) : null
                       }
                    
                    <div className="relative">
                        <button onClick={toggleUserMenu} className="text-black focus:outline-none">
                            <FaBarsStaggered className="h-5 w-5 text-black mt-3" />
                        </button>
                        <div className={`absolute top-full right-0  z-10 mt-2 py-2 bg-white rounded-lg shadow-md text-left ${isUserMenuOpen ? "block" : "hidden"}`}>
                            {userMenuItems.map(({ link, path }) => (
                                <Link key={path} to={path} className="block items-center w-28 p-0 py-1 text-center text-inherit text-black  bg-white hover:bg-gray-200 " >
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='md:hidden absolute top-6 left-1 '>
                    <button onClick={toggleMenu} className="text-black focus:outline-none">
                        {isMenuOpen ? <FaXmark className='h-5 w-5 text-black' /> : <FaBarsStaggered className='h-5 w-5 text-black text-3xl' />}
                    </button>
                </div>
                <div className='md:hidden sm:hidden flex ' >
                {/* <Link to="/userProfile" className='relative right-8'>
                {user? (user.photoURL ? (<img src={user?.photoURL} alt="" className='p-0 h-8 w-8 border-none rounded-full' />) : <img src={profilePic} alt="Profile" className='p-0 h-8 w-8 border-none rounded-full' />
) : <FaUser className='p-0 mt-1 mr-1 h-4 w-4 border-none rounded-full' />}
                </Link> */}
                    <button onClick={toggleUserMenu} className="text-black focus:outline-none relative right-8">
                    {user? (user.photoURL ? (<img src={user?.photoURL} alt="" className='p-0 h-8 w-8 border-none rounded-full' />) : <img src={profilePic} alt="Profile" className='p-0 h-8 w-8 border-none rounded-full' />
) : <FaUser className='p-0 mt-1 mr-1 h-4 w-4 border-none rounded-full' />}
                    </button>
                    <div className={`absolute top-10 right-0 z-10 mt-2 py-2 bg-white rounded-lg shadow-md text-left ${isUserMenuOpen ? "block" : "hidden"}`}>
                            {userMenuItems.map(({ link, path }) => (
                                <Link key={path} to={path} onClick={CloseUserMenu} className=" block p-0 px-4 py-2 text-base text-black  bg-white hover:bg-gray-200 ">
                                    {link}
                                </Link>
                            ))}
                        </div>
                </div>
            
            </div> 
                    
                {/* MENU BAR FOR THE MOBILE DEVICES */}

            {/* nav for sm devises */}
            <div className={`space-y-4 px-4 mt-16 py-7 bg-blue-700 text-white ${ isMenuOpen ? "block fixed top-0 right-0 left-0" : "hidden"}`}>
                {
                    navItems.map(({link,path}) => <Link key={path} to={path} className="block text-base text-white uppercase cursor-pointer "> {link}</Link>)
                }
            </div>
        </nav>
    </header>  
) 
}

export default Navbar



