import React, { useEffect, useState } from 'react'
import FavBookImg from "../assets/favoritebook.jpg"
import { Link } from 'react-router-dom'
import useFetchNumber from '../../hooks/useFetchNumber';

const FavBook = () => {

  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [url1,setUrl1] = useState("")
  const {data : data1} = useFetchNumber(url1);
  const [url2,setUrl2] = useState("")
  const {data : data2} = useFetchNumber(url2);
  const [url3,setUrl3] = useState("")
  const {data : data3} = useFetchNumber(url3);

  useEffect(() => {
    setUrl1('https://book-store-api-theta.vercel.app/all-books-count');
    setUrl2('https://book-store-api-theta.vercel.app/admin/all-users-count');
    setUrl3('https://book-store-api-theta.vercel.app/get/all-orders-count');
  }, []);

  useEffect(() => {
      if (data1) {
          setBookCount(data1.count);
      }
  }, [data1]);

  useEffect(() => {
      if (data2) {
          setUserCount(data2.count);
      }
  }, [data2]);

  useEffect(() => {
      if (data3) {
          setOrderCount(data3.count);
          setIsLoading(false); 
      }
  }, [data3]);

  return (
    (!isLoading && <div className='px-4 mt-5 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-12'>
        <div className='md:w-1/2'>
            <img src={FavBookImg} alt="Favorite Book" className='rounded md:w-10/12'/>
        </div>

        <div className='md:w-1/2 space-y-6'>
         <h2 className='text-5xl font-bold my-5 md:w-3/4 leading-snug'>Find Your Favorite <span className='text-blue-700 '>Book Here!</span></h2>
            <p className='mb-10 text-lg md:w-5/6'>Explore the vast world of literature at OPENBOOKS Bookstore. With a diverse collection spanning various genres and topics, there&apos;s something for every reader. Dive into timeless classics, explore the latest bestsellers, or uncover hidden gems waiting to be discovered.</p>
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
  )
}

export default FavBook
