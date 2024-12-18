
import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Import CSS for styling
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('access-token');


  
  useEffect(() => {
     fetch("https://book-store-api-theta.vercel.app/all-books",{
        method: "GET",
        headers: {
          "Content-Type" : "application/json",
          "authorization": `Bearer ${token}`
        }}).then(res => res.json()).then(data => setBookCount(data.length));
      fetch("https://book-store-api-theta.vercel.app/admin/all-users",{
        method: "GET",
        headers: {
          "Content-Type" : "application/json",
          "authorization": `Bearer ${token}`
        }}).then(res => res.json()).then(data => setUserCount(data.length));
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
          });
        }
        return res.json();
      })
      .then(data => {
          setOrderCount(data.length);

      })
      .catch(error => {
        console.error("Error:", error); 
      });

      setIsLoading(false);
  }, []);

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
    <div className="dashboard-container">
      <h2 className="dashboard-heading mt-8">Welcome Admin!</h2>
        <div className="dashboard-content">
          <div className="dashboard-card">
            <h3>Book Details</h3>
            <p className='text-blue'>Total Books:<Link to={"/admin/Dashboard/manage"}> {bookCount}</Link></p>
            {/* Add more book details here */}
          </div>
          <div className="dashboard-card">
            <h3>User Details</h3>
            <p className='text-blue'>Total Users:<Link to={"/admin/Dashboard/all-users"}> {userCount}</Link></p>
            {/* Add more user details here */}
          </div>
          <div className="dashboard-card">
            <h3>Order Details</h3>
            <p className='text-blue'>Total Orders:<Link to={"/admin/Dashboard/all-orders"}> {orderCount}</Link></p>
            {/* Add more order details here */}
          </div>
        </div>
    </div>
  );
};

export default Dashboard;

