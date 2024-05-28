import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const user = useContext(AuthContext);
  const token = localStorage.getItem('access-token');


//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const userEmail = user?.user?.email;
//         const response = await fetch(`http://localhost:5000/user/${userId}/orders`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch orders');
//         }
//         const data = await response.json();
//         setOrders(data);
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//       }
//     };

//     fetchOrders();
//   }, [user]);

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
  
        // Get user ID from userData
        const userId = userData._id;
        //console.log(userId);
        fetch(`http://localhost:5000/user/${userId}/get/orders`, {
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
            setOrders(data.reverse());

        })
        .catch(error => {
          console.error("Error:", error);
          // Handle unexpected errors
        });
      })
      .catch(error => {
        console.error("Error:", error);
        // Handle unexpected errors
      });
  }, [user]);

  return (
    <div className="container mx-auto px-4 lg:px-24 mt-16">
    <h1 className="text-3xl font-bold text-gray-800 mt-4 md:mt-0">My Orders</h1>
    <div>
      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              className="bg-white rounded-lg overflow-hidden shadow-md p-4 flex items-center justify-between"
              whileHover={{ scale: 1.05 }}
            >
              <Link to={`/book/${order.bookId}`}> {/* Wrap the image with Link component */}
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
                    })}</p>                  <p className="text-lg font-bold text-gray-800">{order.bookTitle}</p>
                  <p className="text-sm text-gray-600">Author: {order.authorName}</p>
                  <p className="text-sm text-gray-600">Price: ₹{order.bookPrice}</p>
                  <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                  <p className="text-sm text-gray-600">Total Price: ₹{order.totalPrice}</p>
                  <p className="text-sm text-gray-600">Book URL: <a href={order.bookPDFURL} target='_blank'>{order.bookPDFURL}</a></p>

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
