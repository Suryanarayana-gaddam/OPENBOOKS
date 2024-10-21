import React, { useContext, useEffect, useState } from 'react'
import BookCards from '../components/BookCards';
import { AuthContext } from '../context/AuthProvider';

const BestSellerBooks = () => {
    const user = useContext(AuthContext);

    const [books,setBooks] = useState([]);
    const token = localStorage.getItem("access-token")

    useEffect( () =>  {
            fetch("https://book-store-api-theta.vercel.app/all-books/get/bestSellerBooks", {
                headers : {
                    "Content-Type" : "application/json",
                    "authorization": `Bearer ${token}`
                }
            }).then(res => res.json()).then(data => setBooks(data))
    },[token])
    
  return (
        <div>
            <h1 className='text-center mt-5 text-3xl md:text-4xl lg:text-5xl'>Best Seller Books</h1>
            <BookCards 
                books={books} 
                user={user.user} 
                isAutoPlay={true} 
                isDynamicPagination={true} 
                isNavigation={true}
            />
        </div>
    )
}

export default BestSellerBooks;
