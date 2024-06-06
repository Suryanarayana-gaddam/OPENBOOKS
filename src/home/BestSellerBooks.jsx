import React, { useContext, useEffect, useState } from 'react'
import BookCards from '../components/BookCards';
import { AuthContext } from '../context/AuthProvider';

const BestSellerBooks = () => {
    const user = useContext(AuthContext);

    const [books,setBooks] = useState([]);
    const token = localStorage.getItem("access-token")

    useEffect( () =>  {
            fetch("https://book-store-api-theta.vercel.app/all-books", {
                headers : {
                    authorization: `Bearer ${token}`
                }
            }).then(res => res.json()).then(data => setBooks(data.slice(30,42)))
    },[])
    
  return (
        <div>
            <BookCards books={books} headLine="Best Seller Books" user={user.user}/>
        </div>
    )
}

export default BestSellerBooks
