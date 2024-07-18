//16-04-2024 18:58
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import BookList from '../components/BookList';
import BookCards from '../components/BookCards';
import { AuthContext } from '../context/AuthProvider';
import { FaHeart } from 'react-icons/fa6';
import useUser from '../../hooks/useUser';



const SingleBook = () => {
  const { _id, createrId, bookTitle, imageURL, category, bookDescription, authorName,bookPrice } = useLoaderData();
  const [books, setBooks] = useState([]);
  const user = useContext(AuthContext);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [cartBooks, setCartBooks] = useState([]);
  const book = { _id, createrId, bookTitle, imageURL, category, bookDescription, authorName,bookPrice };
  const [userId,setUserId] = useState();
  const [userData,refetch] = useUser();

  const token = localStorage.getItem('access-token');
  
  function shuffleArray(array) {
    const shuffledArray = array.slice(); 
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  useEffect(() => {
    if (userData && userData.wishlist && userData.cart ) {
      setUserId(userData._id)
      setCartBooks(userData.cart)
      setWishlistBooks(userData.wishlist)
    }
  }, [userData]); 

  const isBookInWishlist = book => {
    return wishlistBooks.some(wishlistBook => wishlistBook._id === book._id);
  };
  const isBookInCart = book => {
    return cartBooks.some(cartBook => cartBook._id === book._id);
  };

  useMemo(() =>{ 
    const fetchBookByCategory =  async () => {
        try {
          const response = await fetch(`https://book-store-api-theta.vercel.app/all-books/bycategory/?category=${category}`, {
            headers : {
                authorization: `Bearer ${token}`,
            }
          });
          if (!response.ok) {
            throw new Error('Error fetching books by category');
          }
          const data = await response.json();
          const shuffledBooks = shuffleArray(data).slice(0, 15);
          setBooks(shuffledBooks);
        } catch (error) {
          console.error('Error:', error.message);
        }
    };
    fetchBookByCategory()
  },[category,token])

  const addToWishlist = (event,book) => {
    event.preventDefault();
    if (!book) {
        console.error("Book object is undefined");
        return;
    }
    const bookId = book._id;
    if (!isBookInWishlist(book)) {
      fetch(`https://book-store-api-theta.vercel.app/user/${userId}/wishlist/add`,{
        method:"POST",
        headers:{
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(book) 
      }).then(res => res.json()).then(data => {
        setWishlistBooks([...wishlistBooks, book]);
        refetch()
      })
      .catch(error => {
        console.error("Error:", error);
      });
      
    } else {
       fetch(`https://book-store-api-theta.vercel.app/user/${userId}/wishlist/remove/${bookId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({bookId: book._id}),
      })
        .then(res => res.json())
        .then(data => {
          setWishlistBooks(wishlistBooks.filter(wishlistBook => wishlistBook._id !== book._id));
          refetch()
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }
  };
  const addToCart = (event,book) => {
    event.preventDefault();
    if (!book) {
        console.error("Book object is undefined");
        return;
    }
    if (!isBookInCart(book)) {
      fetch(`https://book-store-api-theta.vercel.app/user/${userId}/cart/add`,{
        method:"POST",
        headers:{
          "Content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify(book) 
      }).then(res => res.json()).then(data => {
        setCartBooks([...cartBooks, book]);
        refetch()
      })
      .catch(error => {
        console.error("Error:", error);
      });
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-24 mt-28 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
        <div className="max-w-lg mx-auto relative ">
          <img src={imageURL} alt={bookTitle} className="rounded-lg shadow-lg object-cover w-full h-full" />
          { isBookInWishlist(book) ?
            (<button onClick={event => addToWishlist(event,book)} className={`absolute top-8 right-3 p-2 rounded-full text-red-500 bg-white transition-none`}><FaHeart className=" mt-0 w-5 h-5" />
            </button>)    
            :
            (<button
              onClick={event => addToWishlist(event,book)}
              className={`absolute top-8 right-3 bg-white p-2 rounded-full text-gray-400 border-collapse transition-none`} 
            >
              <FaHeart className=" mt-0 w-5 h-5" />
            </button>)
          }
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4 md:mt-0">{bookTitle}</h1>
          <h2 className="text-xl font-semibold text-gray-600 mt-2">by {authorName}</h2>
          <p className="text-gray-700 text-lg mt-2">{category}</p>
          <p className="text-gray-800 text-lg mt-4">{bookDescription}</p>
          <h2 className="text-xl font-bold text-black mt-2">₹{bookPrice}</h2>
        </div>
        <div className="flex">
          {
            isBookInCart(book) ? '' : (
              <button onClick={event => addToCart(event,book)} className="flex-1 bg-blue-500 text-white rounded-md px-4 py-2 mr-2">{
                <Link to={"/cart"}>Buy Now</Link>
              }</button>
            )
          }
          {
            isBookInCart(book) ? (
              <button  className="flex-1 bg-green-500 text-white rounded-md px-4 py-2 ml-2">
                <Link to={"/cart"} ><button className='w-full'> Go Cart</button>
              </Link>
              </button>
            )
           : <button onClick={event => addToCart(event,book)} className="flex-1 bg-green-500 text-white rounded-md px-4 py-2 ml-2">Add to Cart</button>
          }
        </div>
      </div>
      <div>
        <h2 className='my-2 mt-5 bg-black text-center text-white text-2xl p-2 h-12'>Similar Books</h2>
        <BookCards books={books} category={category} user={user.user}/>
      </div>
    </div>
  );
};

export default SingleBook;
