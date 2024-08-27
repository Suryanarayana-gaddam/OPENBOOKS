import { useState } from 'react';
import BannerCard from '../home/BannerCard';
import { Link } from 'react-router-dom';
const Banner = () => {
  const [searchQuery, setSearchQuery] = useState('');
  


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
              type="search" name='search-input'
              placeholder='Search a book'
              className='py-2 px-2 rounded-s-sm lg:max-w-5/6 md:w-4/6 w-3/6 outline-none'
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