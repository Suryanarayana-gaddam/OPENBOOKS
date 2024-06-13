// import React from 'react'
// import FavBookImg from "../assets/favoritebook.jpg"
// import { Link } from 'react-router-dom'

// const FavBook = () => {
//   return (
//     <div className='px-4 lg:px-24 my-20 flex flex-col md:flex-row justify-between items-center gap-12'>
//         <div className='md:w-1/2'>
//             <img src={FavBookImg} alt=""  className='rounded md:w-10/12'/>
//         </div>

//         <div className='md:w-1/2 space-y-6'>
//             <h2 className='text-5xl font-bold my-5 md:w-3/4 leading-snug'>Find Your Favorite <span className='text-blue-700 '>Book Here!</span></h2>
//             <p className='mb-10 text-lg md:w-5/6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam temporibus id commodi consequatur quos fuga ad esse quod ipsum unde adipisci ut, consequuntur earum, molestias accusantium veniam, nisi vitae cum?</p>
//             {/* stats */}
//             <div className='flex flex-col sm:flex-row justify-between gap-6 md:w-3/4 my-14'>
//               <div>
//                 <h3 className='text-3xl font-bold '>800+</h3>
//                 <p className='text-base'>Book Listing</p>
//               </div>
//               <div>
//                 <h3 className='text-3xl font-bold '>500+</h3>
//                 <p className='text-base'>Registered Users</p>
//               </div>
//               <div>
//                 <h3 className='text-3xl font-bold '>1200+</h3>
//                 <p className='text-base'>PDF Downloaded</p>
//               </div>
//             </div>

//             <Link to="/shop" className='mt-12 block'><button className='bg-blue-700 text-white font-semibold px-5 py-2 rounded hover:bg-black transition-all duration-300'>Explore More</button></Link>
//         </div>
//     </div>
//   )
// }

// export default FavBook

import React, { useEffect, useState } from 'react'
import FavBookImg from "../assets/favoritebook.jpg"
import { Link } from 'react-router-dom'

const FavBook = () => {

  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('access-token');


  
  useEffect(() => {
     fetch("https://book-store-api-theta.vercel.app/all-books-count",{
        method: "GET",
        headers: {
          "Content-Type" : "application/json",
          authorization: `Bearer ${token}`
        }}).then(res => res.json()).then(data => setBookCount(data.booksCount));
      fetch("https://book-store-api-theta.vercel.app/admin/all-users-count",{
        method: "GET",
        headers: {
          "Content-Type" : "application/json",
          authorization: `Bearer ${token}`
        }}).then(res => res.json()).then(data => setUserCount(data.usercount));
      //setUsername(user?.user?.displayName);
      fetch(`https://book-store-api-theta.vercel.app/get/all-orders-count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            console.error("Error fetching orders:", error);
            // Handle the error
          });
        }
        return res.json();
      })
      .then(data => {
          setOrderCount(data.ordersCount);

      })
      .catch(error => {
        console.error("Error:", error); 
        // Handle unexpected errors
      });

      setIsLoading(false);
    
  }, []);

  return (
    <div className='px-4 lg:px-24 my-20 flex flex-col md:flex-row justify-between items-center gap-12'>
        <div className='md:w-1/2'>
            <img src={FavBookImg} alt="Favorite Book" className='rounded md:w-10/12'/>
        </div>

        <div className='md:w-1/2 space-y-6'>
         <h2 className='text-5xl font-bold my-5 md:w-3/4 leading-snug'>Find Your Favorite <span className='text-blue-700 '>Book Here!</span></h2>
            <p className='mb-10 text-lg md:w-5/6'>Explore the vast world of literature at ReadIt Bookstore. With a diverse collection spanning various genres and topics, there&apos;s something for every reader. Dive into timeless classics, explore the latest bestsellers, or uncover hidden gems waiting to be discovered.</p>
            {/* stats */}
            <div className='flex flex-col sm:flex-row justify-between gap-6 md:w-3/4 my-14'>
              <div>
                <h3 className='text-3xl font-bold '>{bookCount}</h3>
                <p className='text-base'>Books Available</p>
              </div>
              <div>
                <h3 className='text-3xl font-bold '>{userCount}</h3>
                <p className='text-base'>Happy Readers</p>
              </div>
              <div>
                <h3 className='text-3xl font-bold '>{orderCount}</h3>
                <p className='text-base'>Orders</p>
              </div>
            </div>

            <Link to="/shop" className='mt-12 block'><button className='bg-blue-700 text-white font-semibold px-5 py-2 rounded hover:bg-black transition-all duration-300'>Explore Our Collection</button></Link>
        </div>
    </div>
  )
}

export default FavBook
