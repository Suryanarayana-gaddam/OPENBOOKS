import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { all } from 'axios';
const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const user = useContext(AuthContext);
  const token = localStorage.getItem('access-token');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  useEffect(() => {
        fetch(`https://book-store-api-theta.vercel.app/get/all-orders`, {
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
            setAllOrders(data.reverse());

        })
        .catch(error => {
          console.error("Error:", error); 
          // Handle unexpected errors
        });
  }, [user]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = allOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to previous page
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Go to next page
  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Pagination buttons with page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(allOrders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }


  return (
    <div className="container mx-auto px-4 lg:px-24 mt-16">
    <h1 className="text-3xl font-bold text-gray-800 mt-4 md:mt-0">All Orders</h1>
    <div>
      {currentOrders.length === 0 ? (
        <p className="text-gray-600">No orders</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {currentOrders.map((order) => (
            <motion.div
              key={order._id}
              className="bg-white rounded-lg overflow-hidden shadow-md p-4 flex items-center justify-between"
              whileHover={{ scale: 1.05 }}
            >
              <Link to={`/book/${order.bookId}`}> {/* Wrap the image with Link component */}
                <img src={order.imageURL} alt={order.bookTitle} className="h-34 w-24 object-cover mr-4 cursor-pointer" />
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
     {/* Pagination buttons at the bottom */}
     <div className="flex justify-around mt-8 w-auto">
          <div>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-full bg-blue-500 text-white mr-2"
          >
            Previous
          </button>
          </div>
          <div>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-full ${
                currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200"
              } mr-2`}
            >
              {number}
            </button>
          ))}
          </div>
          <div>
          <button
            onClick={goToNextPage}
            disabled={currentPage === Math.ceil(allOrders.length / ordersPerPage)}
            className="px-3 py-1 rounded-full bg-blue-500 text-white ml-2 "
          >
            Next
          </button>
          </div>
        </div>
  </div>
  
  );
};

export default AllOrders
