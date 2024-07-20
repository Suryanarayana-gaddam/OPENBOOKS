import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useUser from '../../hooks/useUser'
import useFetch from '../../hooks/useFetch';


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const user = useContext(AuthContext);
  const token = localStorage.getItem('access-token');
  const [userData,refetch] = useUser();

  const [url1,setUrl1] = useState("")
  const {data : data1} = useFetch(url1);

  useEffect(() => {
    if(userData && userData._id){
      setUserId(userData._id)
    } 
    setUrl1(`https://book-store-api-theta.vercel.app/user/${userId}/get/orders`);
  }, [user,userData,userId]);
  useEffect(() =>{
    setOrders(data1.reverse());
  },[data1])

  return (
    <div className="container mx-auto px-4 lg:px-24 mt-16">
    <h1 className="text-3xl font-bold text-gray-800 mt-4 md:mt-0 text-center">My Orders</h1>
    <div>
      {orders && orders.length === 0 ? (
        <p className="text-gray-600">You have no orders</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {orders && orders.map((order) => (
            <motion.div
              key={order._id}
              className="bg-white rounded-lg overflow-hidden shadow-md p-4 flex items-center justify-between"
              whileHover={{ scale: 1.05 }}
            >
              <Link to={`/book/${order.bookId}`}>
                <img src={order.imageURL} alt={order.bookTitle} className="h-40 w-24 object-cover mr-8 cursor-pointer" />
              </Link>
              <div className="flex items-center">
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
                    })}
                    </p>                  
                  <p className="text-lg font-bold text-gray-800">{order.bookTitle}</p>
                  <p className="text-sm text-gray-600">Author: {order.authorName}</p>
                  <p className="text-sm text-gray-600">Price: ₹{order.bookPrice}</p>
                  <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                  <p className="text-sm text-gray-600">Total Price: ₹{order.totalPrice}</p>
                  <p className="text-sm text-gray-600">Book URL: <a href={order.bookPDFURL} target='_blank'><span className='text-blue-500'>{order.bookPDFURL}</span></a></p>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  </div>
  
  );
};

export default Orders;
