// import React from 'react'
// import BannerCard from '../home/BannerCard'

// const Banner = () => {
//   return (
//     <div className='px-4 lg:px-24 bg-teal-100 flex items-center'>
//         <div className='flex w-full flex-col md:flex-row justify-between items-center gap-12 py-40'>
//             {/* left side */}
//             <div className='md:w-1/2 space-y-8 h-f'>
//               <h2 className='text-5xl font-bold leading-snug text-black'>Buy And Sell Your Books <span className='text-blue-700 '>for the best prices</span></h2>
//               <p className='md:w-4/5'>
//               Welcome to Book Store, your haven for literary treasures! Dive into our curated selection of books, where each title promises an adventure, a lesson, or a moment of pure delight. From bestsellers to hidden gems, we've got your next favorite read waiting. Explore our virtual shelves and let the stories unfold. Your next literary escape awaits at Book Store.
//               </p>
//               <div>
//                 <input type="search" name='search' id='search' placeholder='Search a book' className='py-2 px-2 rounded-s-sm outline-none' />
//                 <button className='bg-blue-700 px-6 py-2  text-white font-medium hover:bg-black transition-all ease-in duration-200'>Search</button>
//               </div>
//             </div>

//             {/* right side */}
//             <div>
//               <BannerCard/>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default Banner


import React, { useState } from 'react';
import BannerCard from '../home/BannerCard';
import { Link } from 'react-router-dom';

const Banner = () => {
  const [searchQuery, setSearchQuery] = useState('');


  // const handleSearch = () => {
  //   // Fetch all books from the API
  //   fetch("http://localhost:5000/all-books")
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log("Received data from API:", data); // Log the received data
  //       // Filter the fetched books based on the search query
  //       const filtered = data.filter(book => {
  //         // Check if book and its properties are defined before accessing them
  //         return (
  //           book && // Check if book is defined
  //           book.title && book.category && // Check if title and category are defined
  //           book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //           book.category.toLowerCase().includes(searchQuery.toLowerCase())
  //         );
  //       });
  //       console.log("Filtered books:", filtered); // Log the filtered books
  //       // Update state with the filtered books
  //       setFilteredBooks(filtered);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching books:', error);
  //     });
  // };

  return (
    <div className='px-4 lg:px-24 bg-teal-100 flex items-center'>
        <div className='flex w-full flex-col md:flex-row justify-between items-center gap-12 pt-40 pb-20'>
            {/* left side */}
            <div className='md:w-1/2 space-y-8 h-f'>
              <h2 className='text-5xl font-bold leading-snug text-black'>Buy And Sell Your Books <span className='text-blue-700 '>for the best prices</span></h2>
              <p className='md:w-4/5'>
                Welcome to Book Store, your haven for literary treasures! Dive into our curated selection of books, where each title promises an adventure, a lesson, or a moment of pure delight. From bestsellers to hidden gems, we&apos;ve got your next favorite read waiting. Explore our virtual shelves and let the stories unfold. Your next literary escape awaits at Book Store.
              </p>
              <div>
            <input
              type="text"
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
              <BannerCard/>
            </div>
        </div>
    </div>
  );
};

export default Banner;