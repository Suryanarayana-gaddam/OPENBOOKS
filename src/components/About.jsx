import { useState, useEffect } from 'react';
import useFetchNumber from '../../hooks/useFetchNumber';
import Loading from './Loading';

const About = () => {
  const {data : data1} = useFetchNumber('https://book-store-api-theta.vercel.app/all-books-count' || "");
  const {data : data2} = useFetchNumber('https://book-store-api-theta.vercel.app/admin/all-users-count' || "");
  const {data : data3} = useFetchNumber('https://book-store-api-theta.vercel.app/get/all-orders-count' || "");
  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (data1) {
      setBookCount(data1.count);
    }
    
    if (data2) {
      setUserCount(data2.count);
    }
    
    if (data3) {
      setOrderCount(data3.count);
    }
    setTimeout(() =>setLoading(false),1000);
  }, [data1,data2,data3]);
  
  if(loading){
    return (
      <Loading/>
    )
  }
  return (
    <div className='pt-20 mx-5'>
        <div>
          <h1 className='sm:text-2xl md:text-3xl text-xl relative left-2 top-8 mb-4'>About OPENBOOKS Bookstore </h1><br />
          <p className='indent-4'>Welcome to OPENBOOKS Bookstore! We are passionate about providing a wide range of books to cater to every reader&apos;s taste and interest. Whether you&apos;re a fiction enthusiast, a history buff, or someone exploring self-help and personal development, we have something for you.</p>
          <p>Our bookstore offers a seamless browsing and shopping experience, with an extensive collection of books across various genres, including fiction, non-fiction, romance, mystery, science fiction, and more. With our user-friendly interface and intuitive search features, finding your next favorite read is just a few clicks away.</p>
          <p>At OPENBOOKS, we prioritize user satisfaction and aim to create a community of book lovers where readers can discover new titles, share recommendations, and engage in meaningful discussions. Join us on our journey to celebrate the joy of reading and explore the vast world of literature!</p>
            <div className='flex justify-around mt-10 '>
              <div className='inline-block bg-red'>Total Books: {bookCount}</div>
              <div>Total Users: {userCount}</div>
              <div>Total Orders: {orderCount}</div>
            </div>
        </div>
    </div>
    
  );
};

export default About;
