import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { all } from 'axios';
import Pagination from '../components/Pagination';
const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const user = useContext(AuthContext);
  const token = localStorage.getItem('access-token');
  const [isLoading, setIsLoading] = useState(true);

  const [indexOfFirstBook,setIndexOfFirstBook] = useState(null);
  const [currentOrders,setCurrentOrders] = useState([]);

  const setItemsDetails = (x) => {
    setCurrentOrders(x);
  }
  const setIndexBook = (y) => {
    setIndexOfFirstBook(y);
  }

  useEffect(() => {
        fetch(`https://book-store-api-theta.vercel.app/get/all-orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
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
            setAllOrders(data.reverse());
            setIsLoading(false);
        })
        .catch(error => {
          console.error("Error:", error); 
          // Handle unexpected errors
        });
  }, [user]);

  if(isLoading){
    return <div className="flex items-center justify-center h-screen">
    <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
        </div>
    </div>
</div>
  }


  return (
    <div className="container mx-auto px-4 mt-16">
    <h1 className="text-3xl font-bold text-gray-800 mt-4 md:mt-0">All Orders</h1>
    <div className=''>
      {currentOrders.length === 0 ? (
        <p className="text-gray-600">No orders</p>
      ) : (
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {currentOrders.map((order) => (
            <motion.div
              key={order._id}
              className="bg-white rounded-lg overflow-hidden shadow-md p-4 flex md:flex-col items-center justify-between sm:gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Link to={`/book/${order.bookId}`} > {/* Wrap the image with Link component */}
              <div className=''>
                <img src={order.imageURL} alt={order.bookTitle} className="sm:w-34 h-34 w-24 object-cover mr-4 cursor-pointer" /></div>
              </Link>
              <div className="flex items-center w-full md:p-3">
                <div>
                  <p className="text-sm text-gray-600 font-bold">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600">Date: {new Date(order.date).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      hour12: true,
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric'
                    })}</p>                  
                  
                  { order.username ? (<p className="text-sm text-gray-600">User: {order.username}</p>) : (null) }
                  <p className="text-lg font-bold text-gray-800">{order.bookTitle}</p>
                  <p className="text-sm text-gray-600">Author: {order.authorName}</p>
                  <p className="text-sm text-gray-600">Price: ₹{order.bookPrice}</p>
                  <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                  <p className="text-sm text-gray-600">Total Price: ₹{order.totalPrice}</p>
                  <p className="text-sm text-gray-600">Book URL: <a href={order.bookPDFURL} >{order.bookPDFURL}</a></p>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
    <Pagination setItemsDetails={setItemsDetails} setIndexBook={setIndexBook} itemsPerPage={12} maxPageNumbers={10} inputArrayItems={allOrders}/>

  </div>
  
  );
};

export default AllOrders
