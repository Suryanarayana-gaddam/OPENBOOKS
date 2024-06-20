import React, { useState, useEffect } from 'react';
import useBooks from '../../hooks/useBooks';

const About = () => {
  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('access-token');
  const [allBooks,refetch] = useBooks();
  console.log(allBooks);

  useEffect(() => {
    // Fetch book count here
    fetch("https://book-store-api-theta.vercel.app/all-books-count", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setBookCount(data.booksCount))
      .catch(error => console.error("Error fetching book count:", error));

    // Fetch user count
    fetch("https://book-store-api-theta.vercel.app/admin/all-users-count", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUserCount(data.usercount))
      .catch(error => console.error("Error fetching user count:", error));

    // Fetch order count
    fetch("https://book-store-api-theta.vercel.app/get/all-orders-count", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setOrderCount(data.ordersCount))
      .catch(error => console.error("Error fetching order count:", error))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className='pt-24 mx-5'>
      <h1 className='text-3xl'>About ReadIt Bookstore</h1><br />
      <p>Welcome to ReadIt Bookstore! We are passionate about providing a wide range of books to cater to every reader&apos;s taste and interest. Whether you&apos;re a fiction enthusiast, a history buff, or someone exploring self-help and personal development, we have something for you.</p>
      <p>Our bookstore offers a seamless browsing and shopping experience, with an extensive collection of books across various genres, including fiction, non-fiction, romance, mystery, science fiction, and more. With our user-friendly interface and intuitive search features, finding your next favorite read is just a few clicks away.</p>
      <p>At ReadIt, we prioritize user satisfaction and aim to create a community of book lovers where readers can discover new titles, share recommendations, and engage in meaningful discussions. Join us on our journey to celebrate the joy of reading and explore the vast world of literature!</p>
      {isLoading ? (
         <div className="flex items-center justify-center h-screen">
        <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
            </div>
        </div>
    </div>
      ) : (
        
        <div className='flex justify-around mt-10 '>
          <div className='inline-block bg-red'>Total Books: {allBooks.length}</div>
          <div>Total Users: {userCount}</div>
          <div>Total Orders: {orderCount}</div>
        </div>
      )}
    </div>
  );
};

export default About;
