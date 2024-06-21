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
  const [isLoading, setIsLoading] = useState(true);
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
  }, [user,currentPage]);

  if(isLoading){
    return <div className="flex items-center justify-center h-screen">
    <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
        </div>
    </div>
</div>
  }

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = allOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Calculate total number of pages
  const totalPages = Math.ceil(allOrders.length / ordersPerPage);

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - Math.floor(ordersPerPage / 2));
    let endPage = Math.min(totalPages, startPage + ordersPerPage - 1);

    // Adjust startPage when near the end of totalPages
    if (endPage - startPage + 1 < ordersPerPage) {
      startPage = Math.max(1, endPage - ordersPerPage + 1);
    }

    let pageNumbers = Array.from({ length: (endPage - startPage) + 1 }, (_, index) => startPage + index);

    const multiplesOf50 = Array.from({ length: Math.ceil(totalPages / 50)-1 }, (_, index) => (index + 1) * 50);
    pageNumbers = [...pageNumbers.filter(num => !multiplesOf50.includes(num)), ...multiplesOf50];

    if (!pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
    }
    if (!pageNumbers.includes(1)) {
      pageNumbers.unshift(1);
    }
    return pageNumbers.sort((a, b) => a - b);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

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
                <img src={order.imageURL} alt={order.bookTitle} className="sm:w-34 h-34 w-24 object-cover mr-4 cursor-pointer" />
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
     <div className={`flex justify-around mt-8 w-auto ${ allOrders.length>8 ? "block" : "hidden"}`}>
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
          {getPageNumbers().map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-full ${
                currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'
              } mr-2`}
            >
              {number}
            </button>
          ))}
        </div>
        <div>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 rounded-full bg-blue-500 text-white ml-2"
          >
            Next
          </button>
        </div>
      </div>
  </div>
  
  );
};

export default AllOrders
