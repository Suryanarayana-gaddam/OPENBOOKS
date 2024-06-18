import React, { useContext, useEffect, useState } from 'react'
import BookCards from '../components/BookCards';
import { AuthContext } from '../context/AuthProvider';
const token = localStorage.getItem('access-token');

const OtherBooks = () => {
    const [books,setBooks] = useState([]);
    const user = useContext(AuthContext);

    // Function to shuffle an array
    function shuffleArray(array) {
    const shuffledArray = array.slice(); // Create a copy of the array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  useEffect(() => {
    const fetchBooks = async () => {
        try {
            let url;
            if (user) {
                url = "https://book-store-api-theta.vercel.app/all-books";
            } else {
                url = "https://book-store-api-theta.vercel.app/all-books/get/other-books";
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: user ? `Bearer ${token}` : undefined
                }
            });

            if (!response.ok) {
                throw new Error('Error fetching books');
            }

            const data = await response.json();
            const shuffledBooks = shuffleArray(data).slice(0, 15);
            setBooks(shuffledBooks);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    fetchBooks();
}, [user]); // Assuming `token` is also a dependency if it changes with user state

    
  return (
        <div>
            <BookCards books={books} headLine="Other Books" user={user.user}/>
        </div>
    )
}

export default OtherBooks
