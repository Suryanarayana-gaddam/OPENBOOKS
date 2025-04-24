import { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import BookCards from '../components/BookCards';
import { AuthContext } from '../context/AuthProvider';
import { FaHeart } from 'react-icons/fa6';
import useUser from '../../hooks/useUser';
import { CRUDContext } from '../context/CRUDProvider';

const SingleBook = () => {
  const { _id, createrId, bookTitle, imageURL, category, bookDescription, authorName,bookPrice } = useLoaderData();
  const [books, setBooks] = useState([]);
  const user = useContext(AuthContext);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [cartBooks, setCartBooks] = useState([]);
  const book = { _id, createrId, bookTitle, imageURL, category, bookDescription, authorName,bookPrice };
  const [userId,setUserId] = useState();
  const [userData,refetch] = useUser();
  const {addToWishlist, removeFromWishlist, addToCart, removeFromCart} = useContext(CRUDContext);
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
                "authorization": `Bearer ${token}`,
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

  const handleWishlist = (event,book) => {
    event.preventDefault();
    if (!book) {
        console.error("Book object is undefined");
        return;
    }
    const bookId = book._id;
    if (!isBookInWishlist(book)) {
      addToWishlist(book);
      // refetch();
    } else {
       removeFromWishlist(bookId);
      //  refetch();
    }
  };
  const handleCart = (event,book) => {
    event.preventDefault();
    if (!book) {
        console.error("Book object is undefined");
        return;
    }
    if (!isBookInCart(book)) {
      addToCart(book);
      refetch();
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-2 w-full mt-28 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
        <div className="max-w-lg mx-auto relative ">
          <img src={imageURL} alt={bookTitle} className="rounded-lg shadow-lg object-cover w-full h-full" />
          <button
            onClick={event => handleWishlist(event,book)}
            className={`absolute top-8 right-3 bg-white p-2 rounded-full ${
              isBookInWishlist(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
            } transition-none`}
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
              <button onClick={event => handleCart(event,book)} className="flex-1 bg-blue-500 text-white rounded-md px-4 py-2 mr-2">{
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
           : <button onClick={event => handleCart(event,book)} className="flex-1 bg-green-500 text-white rounded-md px-4 py-2 ml-2">Add to Cart</button>
          }
        </div>
      </div>
      <div>
        <h2 className='my-2 mt-5 bg-black text-center text-white text-2xl p-2 h-12'>Similar Books</h2>
        <BookCards books={books} category={category} user={user.user} isNavigation={true} isNumberedPagination={true}/>
      </div>
    </div>
  );
};

export default SingleBook;
