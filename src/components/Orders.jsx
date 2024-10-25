import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useUser from '../../hooks/useUser'
import useFetch from '../../hooks/useFetch';
import Loading from './Loading';
import Search from './Search';
import Pagination from './Pagination';


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const user = useContext(AuthContext);
  const token = localStorage.getItem('access-token');
  const [userData,refetch] = useUser();
  const [userId, setUserId] = useState(userData._id);
  const {data : data1} = useFetch(`https://book-store-api-theta.vercel.app/user/${userId}/get/orders` || " ");
  const [loading, setLoading] = useState(true);

  const [indexOfFirstBook,setIndexOfFirstBook] = useState(null);
  const [currentBooks,setCurrentBooks] = useState([]);

  const [filteredBooks,setFilteredBooks] = useState([]);
  const [searchKey,setSearchKey] = useState('');

  useEffect(() => {
    if(userData && userData._id){
      setUserId(userData._id)
    } 
    setOrders(data1 ? data1.reverse() : "");
    setTimeout(() => setLoading(false),2000)
  },[data1])

  const setBooksFun = (x) => {
    setFilteredBooks(x);
  }
  const setSearchKeyFun = (x) => {
    setSearchKey(x);
  }

  const setItemsDetails = (x) => {
    setCurrentBooks(x);
  }
  const setIndexBook = (y) => {
    setIndexOfFirstBook(y);
  }

  if(loading){
    return <Loading/>
  }

  return (
    <div className="container mx-auto px-4 mt-16 mb-5">
    <h1 className="text-3xl font-bold text-gray-800 mt-4 md:mt-0 text-center">My Orders</h1>
    <div className='mb-4'>
        <Search books={orders} setSearchKeyFun={setSearchKeyFun} setBooksFun={setBooksFun} />
      </div>
    <div className='transition-all duration-1000'>
      { orders && Array.isArray(orders) && orders.length > 0 ? (
        <div className="">
        <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {currentBooks && Array.isArray(currentBooks) &&  currentBooks.map((order,index) => (
          <motion.div
            key={order._id}
            className="bg-white rounded-lg overflow-hidden shadow-md p-4 w-full flex items-center justify-between"
            whileHover={{ scale: 1.05 }}
          >
          <div className=' md:flex grid  justify-items-center place-items-center border-zinc-300'>
            <Link to={`/book/${order.bookId}`}>
              <img src={order.imageURL} alt={order.bookTitle} className=" max-h-40 max-w-24 object-cover mr-5 cursor-pointer" />
            </Link>
            <div className="flex items-center">
              <div>
                <p className='text-center'>{index+1+indexOfFirstBook}</p>
                <p className="text-sm text-gray-600 font-bold">Order ID: <span className='xl:block'>{order._id}</span></p>
                <p className="text-sm text-gray-600">Date: {new Date(order.date).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    hour12: true,
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  })}
                  </p>                  
                <p className="text-lg font-bold text-gray-800">{order.bookTitle}</p>
                <p className="text-sm text-gray-600">Author: {order.authorName}</p>
                <p className="text-sm text-gray-600">Price: ₹{order.bookPrice}</p>
                <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                <p className="text-sm text-gray-600">Total Price: ₹{order.totalPrice}</p>
                <p className="text-sm text-gray-600">Book URL: <a href={order.bookPDFURL} target='_blank'><span className='text-blue-500 text-xs overflow-auto' title={`${order.bookPDFURL}`}>{order.bookPDFURL}</span></a></p>

              </div>
            </div>
          </div>
          </motion.div>
        ))}
        </div>
        {currentBooks.length < 1 && <p className='text-center text-red-400'>&apos;&apos;&nbsp;No Books matched the Search !!!&nbsp;&apos;&apos;</p>}
        <Pagination setItemsDetails={setItemsDetails} setIndexBook={setIndexBook} itemsPerPage={10} maxPageNumbers={10} inputArrayItems={ searchKey ? filteredBooks : orders}/>
      </div>
      ) : (
          <p className="text-gray-600">You don&apos;t have any orders</p>

      )}
    </div>
  </div>
  
  );
};

export default Orders;
