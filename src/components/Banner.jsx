


import { useContext, useEffect, useState } from 'react';
import BannerCard from '../home/BannerCard';
import { Link } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import { AuthContext } from '../context/AuthProvider';

const Banner = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [username,refetch] = useUser();
  console.log("uname: ",username);
  const [uName,setUName] = useState(null)
  const usernames = username;
  const user = useContext(AuthContext);
  const token = localStorage.getItem('access-token');

  useEffect(() => {
    const userEmail = user?.user?.email;
    // Fetch user data by email
    fetch(`http://localhost:5000/userByEmail/${userEmail}`, {
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
  
        setUName(userData.username);
      })
      .catch(error => {
        console.error("Error:", error);
        // Handle unexpected errors
      });
    },[user]);  
    if(localStorage.getItem('alertToken')){
      const  alertname = () =>{
          alert("Welcome back : ",usernames || uName);
          console.log("UserName :",usernames || uName);
        }
        setTimeout(alertname,3000);
        localStorage.removeItem('alertToken')
      }

  return (
    <div className='px-4 lg:px-24 bg-teal-100 flex items-center'>
        <div className='flex w-full flex-col md:flex-row justify-around items-center gap-12 pt-40 pb-20'>
            {/* left side */}
            <div className='md:w-7/12 space-y-8 h-f'>
              <h2 className='text-5xl font-bold leading-snug text-black'>Buy And Sell Your Books <span className='text-blue-700 '>for the best prices</span></h2>
              <p className='md:w-4/5'>
                Welcome to Book Store, your haven for literary treasures! Dive into our curated selection of books, where each title promises an adventure, a lesson, or a moment of pure delight. From bestsellers to hidden gems, we&apos;ve got your next favorite read waiting. Explore our virtual shelves and let the stories unfold. Your next literary escape awaits at Book Store.
              </p>
              <div>
            <input
              type="text" name='search-input'
              placeholder='Search a book'
              className='py-2 px-2 rounded-s-sm outline-none'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Link to={`/books/searchedbooks?query=${encodeURIComponent(searchQuery)}`}>
              <button
                className='bg-blue-700 px-6 py-2 text-white font-medium hover:bg-black transition-all ease-in duration-200'
              >
                Search
              </button>
            </Link>
          </div>
            </div>

            {/* right side */}
            <div>
              <BannerCard className="width"/>
            </div>
        </div>
    </div>
  );
};

export default Banner;