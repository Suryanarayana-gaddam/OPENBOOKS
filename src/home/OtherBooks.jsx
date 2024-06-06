import React, { useContext, useEffect, useState } from 'react'
import BookCards from '../components/BookCards';
import { AuthContext } from '../context/AuthProvider';
const token = localStorage.getItem('access-token');

const OtherBooks = () => {
    const [books,setBooks] = useState([]);
    const user = useContext(AuthContext);

    useEffect( () =>  {
            fetch("https://book-store-api-theta.vercel.app/all-books", {
                headers : {
                    authorization: `Bearer ${token}`
                }
            }).then(res => res.json()).then(data => setBooks(data.slice(15,35).reverse()))
    },[])
    
  return (
        <div>
            <BookCards books={books} headLine="Other Books" user={user.user}/>
        </div>
    )
}

export default OtherBooks
