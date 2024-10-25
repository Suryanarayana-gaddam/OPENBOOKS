import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
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
    return <Loading/>
  }


  return (
    <div className="container mx-auto px-4 mt-12 mb-5">
    <h1 className="text-3xl font-bold text-gray-800 mt-4 text-center py-1 mb-2 bg-red-300 md:mt-0">All Orders</h1>
    <div className=''>
      {currentOrders.length === 0 ? (
        <p className="text-gray-600">No orders</p>
      ) : (
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-2 gap-6 ">
          {currentOrders.map((order,index) => (
            <div
              key={order._id}
              className="bg-white rounded-lg overflow-hidden shadow-md p-4 md:flex md:flex-col items-center justify-between sm:gap-2 hover:scale-110"
            >
              <Link to={`/book/${order.bookId}`} > {/* Wrap the image with Link component */}
              <div className='flex justify-center w-full'>
                <img src={order.imageURL} alt={order.bookTitle} className="sm:w-34 h-34 w-24 object-cover mr-4 cursor-pointer" />
              </div>
              </Link>
              <div className="flex items-center w-full md:p-3">
                <div>
                  <p className='border border-black rounded-full w-fit px-1'>{index+1+indexOfFirstBook}</p>
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
                  <p className="text-sm text-gray-600">Book URL: <Link href={order.bookPDFURL} ><span className='text-blue-500 cursor-pointer'>{order.bookPDFURL}</span></Link></p>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Pagination setItemsDetails={setItemsDetails} setIndexBook={setIndexBook} itemsPerPage={12} maxPageNumbers={10} inputArrayItems={allOrders}/>

  </div>
  
  );
};

export default AllOrders
