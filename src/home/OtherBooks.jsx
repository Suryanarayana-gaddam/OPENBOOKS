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

    useEffect( () =>  {
        if(!user){
            const fetchOtherBooks = async () =>  {
                try{
                    const response= await fetch("https://book-store-api-theta.vercel.app/all-books/get/other-books", {
                 });
                 if (!response.ok) {
                     throw new Error('Error fetching books by category');
                   }
                   const data = await response.json();
                   setBooks(data);
                 } catch (error) {
                     console.error('Error:', error.message);
                   }
            }
            fetchOtherBooks();
        }
        else{
            console.log("user :",user);
            const fetchOtherBooksuser = async () =>  {
                try{
                 const response= await fetch("https://book-store-api-theta.vercel.app/all-books", {
                     headers : {
                         authorization: `Bearer ${token}`
                     }
                 });
                 if (!response.ok) {
                     throw new Error('Error fetching books by category');
                   }
                   const data = await response.json();
                   // Shuffle the fetched books and select the first 15
                   const shuffledBooksuser = shuffleArray(data).slice(0, 15);
                   setBooks(shuffledBooksuser);
                 } catch (error) {
                     console.error('Error:', error.message);
                   }
            }
            fetchOtherBooksuser();
        
        }
    },[user])
    
  return (
        <div>
            <BookCards books={books} headLine="Other Books" />
        </div>
    )
}

export default OtherBooks
