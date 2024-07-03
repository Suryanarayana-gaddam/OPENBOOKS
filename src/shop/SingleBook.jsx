//16-04-2024 18:58
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import BookList from '../components/BookList';
import BookCards from '../components/BookCards';
import { AuthContext } from '../context/AuthProvider';
import { FaHeart } from 'react-icons/fa6';
import useUser from '../../hooks/useUser';



const SingleBook = () => {
  const { _id, createrId, bookTitle, imageURL, category, bookDescription, authorName,bookPrice } = useLoaderData();
  const [books, setBooks] = useState([]);
  // const [wishlist, setWishlist] = useState([]);
  // const [cart, setCart] = useState([]);
  const user = useContext(AuthContext);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [cartBooks, setCartBooks] = useState([]);
  const book = { _id, createrId, bookTitle, imageURL, category, bookDescription, authorName,bookPrice };
  const [userId,setUserId] = useState();
  const [userData,refetch] = useUser();

  const token = localStorage.getItem('access-token');
  
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
    if (userData && userData.wishlist && userData.cart ) {
      setUserId(userData._id)
      setCartBooks(userData.cart)
      setWishlistBooks(userData.wishlist)
    }
    refetch()
    fetchBooksByCategory(category); // Fetch books by the category of the current book on component mount
  }, [category,user,userData]); // Re-fetch books when category changes

  const isBookInWishlist = book => {
    return wishlistBooks.some(wishlistBook => wishlistBook._id === book._id);
  };
  const isBookInCart = book => {
    return cartBooks.some(cartBook => cartBook._id === book._id);
  };

  const fetchBooksByCategory = async (category) => {
    try {
      //console.log('Fetching books for category:', category);
      const response = await fetch(`https://book-store-api-theta.vercel.app/all-books/bycategory/?category=${category}`, {
        headers : {
            authorization: `Bearer ${token}`
        }
    });
      if (!response.ok) {
        throw new Error('Error fetching books by category');
      }
      const data = await response.json();
      //console.log('Fetched books:', data);
      // Shuffle the fetched books and select the first 15
      const shuffledBooks = shuffleArray(data).slice(0, 15);
      setBooks(shuffledBooks);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const addToWishlist = (event,book) => {
    event.preventDefault();
    if (!book) {
        console.error("Book object is undefined");
        return;
    }
    const bookId = book._id;
    //console.log(bookId);
    if (!isBookInWishlist(book)) {
      // Add book to the wishlist
      fetch(`https://book-store-api-theta.vercel.app/user/${userId}/wishlist/add`,{
        method:"POST",
        headers:{
          "Content-type": "application/json",
        },
        body: JSON.stringify(book) // Stringify the book object before sending
      }).then(res => res.json()).then(data => {
        //alert("Book Uploaded to wishlist Successfully!!!");
        setWishlistBooks([...wishlistBooks, book]);
        refetch()
      })
      .catch(error => {
        console.error("Error:", error);// Handle unexpected errors
      });
      
    } else {
        // Remove book from wishlist
        //console.log(bookId);
       fetch(`https://book-store-api-theta.vercel.app/user/${userId}/wishlist/remove/${bookId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({bookId: book._id}),
      })
        .then(res => res.json())
        .then(data => {
          //console.log(data);
          //("Book removed from wishlist successfully!");
          setWishlistBooks(wishlistBooks.filter(wishlistBook => wishlistBook._id !== book._id));
          refetch()
        })
        .catch(error => {
          console.error("Error:", error);// Handle unexpected errors
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
      // Add book to the wishlist
      fetch(`https://book-store-api-theta.vercel.app/user/${userId}/cart/add`,{
        method:"POST",
        headers:{
          "Content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify(book) // Stringify the book object before sending
      }).then(res => res.json()).then(data => {
        // alert("Book Uploaded to Cart Successfully!!!");
        setCartBooks([...cartBooks, book]);
        refetch()
      })
      .catch(error => {
        console.error("Error:", error);// Handle unexpected errors
      });
    }
  };

//console.log('cartBooks', cartBooks)
  return (
    <div className="container mx-auto px-4 lg:px-24 mt-16 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
        <div className="max-w-lg mx-auto relative ">
          <img src={imageURL} alt={bookTitle} className="rounded-lg shadow-lg object-cover w-full h-full" />
          <button
            onClick={event => addToWishlist(event,book)}
            className={`absolute top-8 right-3 bg-white p-2 rounded-full ${
              isBookInWishlist(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
            }`}
          >
            <FaHeart className=" mt-0 w-5 h-5" />
          </button>
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
