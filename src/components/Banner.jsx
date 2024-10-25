import { useState } from 'react';
import BannerCard from '../home/BannerCard';
import { Link } from 'react-router-dom';
import { BiSearch } from 'react-icons/bi';
import Search from './Search';
const Banner = () => {  

  return (
    <div className='px-4 lg:px-10 bg-teal-100 flex items-center'>
        <div className='flex w-full flex-col md:flex-row justify-around items-center gap-12 pt-40 pb-10'>
            {/* left side */}
            <div className='md:w-7/12 space-y-8 h-f'>
              <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold leading-snug text-black'>Buy And Sell Your Books <span className='text-blue-700 '>for the best prices</span></h2>
              <p className='md:w-4/5'>
                Welcome to Book Store, your haven for literary treasures! Dive into our curated selection of books, where each title promises an adventure, a lesson, or a moment of pure delight. From bestsellers to hidden gems, we&apos;ve got your next favorite read waiting. Explore our virtual shelves and let the stories unfold. Your next literary escape awaits at Book Store.
              </p>
              <div>
            
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