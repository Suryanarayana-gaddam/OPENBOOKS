import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBarsStaggered, FaBookAtlas, FaHeart, FaUser, FaX, FaXmark} from "react-icons/fa6"
import { VscHeart } from "react-icons/vsc"
import { AuthContext } from '../context/AuthProvider';
import Logout from './Logout';
import useUser from '../../hooks/useUser';
import "./nav.css"
import image from "../assets/Open Books.jpg"
import Search from './Search';
import { FaSearch } from 'react-icons/fa';
const Navbar = () => {
    const [activeItem, setActiveItem] = useState({Menu: "Home", userMenu: ""});
    const [isMenuOpen,setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSticky,setIsSticky] = useState(false);
    const [isAdmin,setIsAdmin] = useState(false);
    const [username, setUsername] = useState(null);
    const [profilePic,setProfilePic] = useState(null)
    const {user} = useContext (AuthContext);
    const [userData,refetch] = useUser();
    const [timeDate,setTimeDate] = useState(null);
    //const TimeAndDate = new Date().toISOString();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
    const CloseMenu = () => {
        setIsMenuOpen(false);
    }

    const timefun = () => {
        let d = new Date();
        setTimeDate(
            d.getHours() + ":" +
            d.getMinutes() + ":" +
            d.getSeconds() )   
        }
    setInterval(timefun,1000);

    useEffect(() => {
        if(userData && userData.role){
            {
                userData.role == "admin" ?
            (setIsAdmin(true)) : (setIsAdmin(false))
            }
            setUsername(userData.username);                    
            setProfilePic(userData.profilePic);
        }   
        
        const handleScroll = () => {
            if(window.scrollY > 100){
                setIsSticky(true);
            }
            else{
                setIsSticky(false);
            }
        }
        window.addEventListener("scroll",handleScroll);

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);

        return() => {
            window.addEventListener("scroll",handleScroll);
            window.removeEventListener('resize', handleResize);
        }
    },[user,userData,token])

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
    <header className='w-full bg-transparent fixed top-0 left-0 right-0 transition-all ease-in duration-2000'>
        <nav className={`py-2 lg:px-10 px-4 ${isSticky ? "sticky top-0 left-0 right-0 bg-blue-300" : ""}`}>
            <div className='flex justify-between items-center text-base'>
                <div className='flex'>
                    {/* logo */} 
                    <div>
                    <Link to="/" ><img src={image} alt='logo' width={100} height={100} className={`${isSticky ? "w-14 h-14" : "lg:w-20 relative top-0 w-16 h-16 lg:h-20"} ml-4 duration-700 rounded-full `}/></Link>
                    </div>

                    {/* search for small devices */}
                    <div className={`absolute top-[-38px] duration-500 ${isSticky ? "left-[97px]" : " left-[105px]"}`}>
                        <Search 
                            inputStyles={"md:hidden relative top-3 rounded-s-md w-40 h-[34px] outline-none px-1"} 
                            searchStyles={"md:hidden bg-blue-700 px-4 py-[10px] relative top-[12px] w-[32px] h-[33px] hover:scale-100  text-white font-medium rounded-e-md hover:bg-black transition ease-in duration-200"}
                            searchIconStyles={"relative right-[9px] bottom-[2px] text-xl"}
                            styles={"text-xl"}
                        />
                    </div>

                    {/*nav items for large device */}
                    <ul className={` relative md:flex ${isSticky ? "top-[17px]" : "top-[21px] lg:top-[27px]"} md:left-5 duration-700 lg:left-10 md:space-x-5 lg:space-x-12 hidden`} 
                    onClick={CloseMenu}
                    >
                        {
                            navItems.map(({link,path}) => 
                                <Link 
                                    key={path} 
                                    to={path}  
                                    className={`block text-black uppercase cursor-pointer hover:text-blue-700 ${activeItem.Menu === link ? 'font-semibold relative bottom-[3px] text-lg text-blue-700' : 'text-black'}` } 
                                    onClick={() => {
                                        setActiveItem(prev => ({...prev,Menu: link}));
                                        if(link === "Admin" && !isAdmin){
                                            window.alert("You are not an Admin!")
                                        }
                                    }}
                                > 
                                    {link}
                                </Link>
                            )
                        }
                    </ul>

                    {/* MENU BAR FOR THE MOBILE DEVICES */}
                    {/* nav for sm devises */}
                    <div className={`space-y-4 md:hidden px-4 mt-16 py-9 bg-blue-700 text-white ${ isMenuOpen ? "block fixed top-[-64px] right-0 left-0 h-screen w-56" : "hidden"}`}
                    >
                        <FaXmark className=' text-3xl text-black cursor-pointer absolute top-3 right-4 hover:scale-125'
                         onClick={CloseMenu}/>
                        {
                            navItems.map(({link,path}) => 
                                <Link key={path} to={path} className={`block text-base text-[#4f30ec] font-semibold uppercase cursor-pointer text-center rounded-md ${activeItem.Menu == link ? "bg-[#A2C8FB]" : "hover:bg-[#A2C8FB] bg-[#aae6e8]"} hover:font-bold hover:text-black hover:scale-105 duration-500 py-1`} 
                                onClick={() => {
                                    setActiveItem(prev => ({...prev,Menu: link}))
                                    CloseMenu();
                                    if(link === "Admin" && !isAdmin){
                                        window.alert("You are not admin!")
                                    }
                                }} 
                                > 
                                    {link}
                                </Link>
                            )
                        }
                    </div>

                    {/* Toggle button for Nav Items */}
                    <div className='md:hidden absolute top-[28px] left-2 w-full mr-0 pr-0'>
                        <button onClick={toggleMenu} className="text-black focus:outline-none">
                            {isMenuOpen ? "" : <FaBarsStaggered className='h-5 w-5 text-black text-3xl' />}
                        </button>
                    </div>
                </div>

                {/* Time And Date at the bottom */}
                <p className='fixed bottom-0 right-0 mr-2 mb-1 '>{timeDate}</p>

                {/* btn for lg devices */}
                <div className='space-x-5  hidden sm:flex items-center mr-0'>
                    {/* search from md devices */}
                {/* {
                    isSearchOpen ? 
                    <div className={`absolute w-full hidden md:flex duration-500 ${isSticky ? "top-[-36px] md:left-[85px]  xl:left-[197px]" : "top-[-26px] lg:top-[-17px] md:left-[80px] lg:left-[120px] xl:left-[205px]"}`}>
                        <Search 
                            inputStyles={"py-1 px-1 rounded-s-lg outline-none xl:w-[40%] lg:w-[36%] md:w-[25%] w-4/6 text-center md:ml-6 lg:ml-10"}
                            searchStyles={"bg-blue-700 px-4 py-[15px] relative top-[-4px] w-[36px] h-[36px] hover:scale-100  text-white font-medium rounded-e-md hover:bg-black transition ease-in duration-200"}
                            searchIconStyles={"relative right-[13px] bottom-[10px] text-2xl"}
                            CancelBtnStyles={"bg-blue-700 px-4 py-[15px] relative top-[-4px] right-[6px] border-l-2 border-black w-[34px] h-[36px] hover:scale-100  text-white font-medium rounded-e-md hover:bg-black transition ease-in duration-200"}
                            XiconStyles={"relative right-[9px] bottom-[9px] text-xl"}
                            setSearchOpen={setSearchOpen}
                            searchOpen={isSearchOpen}
                        />
                    </div>
                    : */}
                    <Link to='/books/searchedbooks'><FaSearch title='Search a Book here...' className=' cursor-pointer hidden md:block p-[3px] w-8 h-6 rounded-full relative top-[1px] right-4 md:right-[-30px] lg:right-[-24px] border border-black'/></Link>
                
                    {/* Use the img tag to display the user's photo */}
                    <span className='text-wrap hidden md:flex relative md:left-6 lg:left-4'>{user?.displayName || user ? username : "" || user?.email}</span>
                    <span title={windowWidth > 640 ? "View the Profile" : "Toggle the User Menu"}>
                            {user ? (
                                user.photoURL ? (
                                        <Link to="/userProfile">
                                            <img src={user.photoURL} alt="Profile pic" className='p-0 h-8 w-8 border-none rounded-full mr-0' />
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
                        user && <div title='Wishlist' className='relative top-[2px]'>
                            <Link to= '/wishlist'><VscHeart className=' text-2xl hover:scale-105'/></Link>
                        </div>
                    }
    
                    {
                        user ? (
                            <Link to={"/cart"}> 
                                <label title='Cart' tabIndex={0} role='button' className="btn btn-ghost btn-circle relative top-4">
                                    <div className="indicator">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    <span className="badge badge-sm indicator-item relative bottom-9 left-4">{userData.cart?.length}</span>
                                    </div>
                                </label>
                            </Link>
                        ) : null
                    }
                                   
                    {/* User menu Items non-mobile devices*/}
                    <div className="relative">
                        <button title='Toggle User Menu' onClick={toggleUserMenu} className="text-black focus:outline-none">
                            { isUserMenuOpen ?
                                <FaX className="h-5 w-5 text-black mt-3" />
                                :
                                <FaBarsStaggered className="h-5 w-5 text-black mt-3" />
                            }
                        </button>
                        <div className={`absolute top-full right-[-5px]  z-10 mt-2 px-2 py-2 bg-gray-200 rounded-lg shadow-md text-left ${isUserMenuOpen ? "block" : "hidden"}`}>
                            {userMenuItems.map(({ link, path }) => (
                                <Link key={path} to={path} onClick={() => {setActiveItem(prev => ({...prev,userMenu : link})); CloseUserMenu()}} className={`block font-semibold hover:text-white items-center w-36  p-0 py-1 text-center text-inherit text-black my-1 rounded-md ${activeItem.userMenu == link ? "bg-[#3379dc]" : "bg-[#99c0f8] hover:bg-[#3379dc]"} duration-700`} >
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                
                <div className='sm:hidden flex ' >
                    {
                        user ? (
                            <Link to={"/cart"}> 
                       <label tabIndex={0} role='button' className="btn btn-ghost btn-circle relative top-4 right-4">
                        <div className="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <span className="badge badge-sm indicator-item relative bottom-9 left-4">{userData.cart?.length}</span>
                        </div>
                        </label>
                       </Link>
                        ) : null
                    }
                    {/* users menu for mobile devices */}
                    <button onClick={toggleUserMenu} className="text-black focus:outline-none relative right-1">
                        {
                            isUserMenuOpen ? 
                            <FaXmark className='text-3xl '/>
                            :
                            (user? 
                                (user.photoURL ? 
                                    (<img src={user?.photoURL} alt="" className='p-0 h-8 w-8 border-none rounded-full' />) : 
                                    <img src={profilePic} alt="Profile" className='p-0 h-8 w-8 border-none rounded-full' />
                                ) : 
                                <FaUser className='p-0 mt-1 mr-1 h-4 w-4 border-none rounded-full' />
                            )
                        }
                    </button>
                    <div className={`absolute top-12 lg:top-10 right-1 z-10 mt-2 py-2 px-2 bg-gray-200 rounded-lg shadow-md text-left ${isUserMenuOpen ? "block" : "hidden"}`}>
                            {userMenuItems.map(({ link, path }) => (
                                <Link key={path} to={path} onClick={() => {setActiveItem(prev => ({...prev,userMenu: link})); CloseUserMenu();}} className={`block p-0 px-4 py-2 text-base text-black hover:text-white shadow-xl font-bold duration-700 my-1 rounded  cursor-pointer text-center ${activeItem.userMenu == link ? "bg-[#3372d9]" : "bg-[#9ac1f8] hover:bg-[#3372d9]"}`}>
                                    {link}
                                </Link>
                            ))}
                    </div>
                </div>
            </div> 
                
        </nav>
    </header>  
) 
}

export default Navbar



