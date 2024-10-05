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
    },[])
    
  return (
        <div>
            <BookCards books={books} headLine="Best Seller Books" user={user.user} isPagination={true} isAutoPlay={true}/>
        </div>
    )
}

export default BestSellerBooks
