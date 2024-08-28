import React, { useContext, useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { FaCartShopping, FaHeart} from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';


import { Card } from 'flowbite-react';
import useUser from '../../hooks/useUser';
import Pagination from './Pagination';
import { CRUDContext } from '../context/CRUDProvider';

const SearchedBooks = () => {
  const user = useContext(AuthContext);
  const [userData,refetch] = useUser();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState(null);

  const [searchedBooks, setSearchedBooks] = useState([]);
  const [indexOfFirstBook,setIndexOfFirstBook] = useState(null);
  const [currentBooks,setCurrentBooks] = useState([]);    
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [cartBooks, setCartBooks] = useState([]);
  const {addToWishlist, removeFromWishlist, addToCart, removeFromCart} = useContext(CRUDContext);
  const token = localStorage.getItem('access-token');

  const setItemsDetails = (x) => {
    setCurrentBooks(x);
  }
  const setIndexBook = (y) => {
    setIndexOfFirstBook(y);
  }  

  useEffect(() => {

    if (!user) return;
    if (userData && userData.wishlist && userData.cart) {
      setUserId(userData._id)
      setCartBooks(userData.cart)
      setWishlistBooks(userData.wishlist)
    }
    refetch()

    if (query) {
      fetch(`https://book-store-api-theta.vercel.app/all-books/searchedbooks?query=${encodeURIComponent(query)}`, {
        headers : {
            "authorization": `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {
          setSearchedBooks(data);
          
        })
        .catch(error => {
          console.error('Error fetching searched books:', error);
        });
    }
  }, [query,user,userData,token]);

  const isBookInWishlist = book => {
    return wishlistBooks.some(wishlistBook => wishlistBook._id === book._id);
  };
  const isBookInCart = book => {
    return cartBooks.some(cartBook => cartBook._id === book._id);
  };

  const handleWishlist = (event,book) => {
    event.preventDefault();
    if (!book) {
        console.error("Book object is undefined");
        return;
    }
    const bookId = book._id;
    if (!isBookInWishlist(book)) {
      addToWishlist(book);
      refetch();
    } else {
      removeFromWishlist(bookId);
      refetch();
    }
  };

  const handleCart = (event,book) => {
    event.preventDefault();
    if (!book) {
        console.error("Book object is undefined");
        return;
    }
    const bookId = book._id;
    if (!isBookInCart(book)) {
      addToCart(book);
      refetch();
    } else {
      removeFromCart(bookId);
      refetch();
    }
  };

  const handleBuyCart = (event,book) => {
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
      <div className="my-16 px-4 lg:px-24">
        <br /><br />
        <div className=' flex '>
            <input
              type="search" name='search-input'
              placeholder='Search a book'
              className='py-2 px-2  rounded-s-sm outline-none xl:w-full lg:w-5/6 md:w-4/6 w-3/6 text-center ml-10'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Link to={`/books/searchedbooks?query=${encodeURIComponent(searchQuery)}`}>
              <button
                className='bg-blue-700 px-3 py-3 text-white font-medium hover:bg-black transition-all ease-in duration-200'
              >
                <HiSearch style={{maxWidth:'100%'}}/>
                </button>
            </Link>            
          </div>
          <br />
          <h2 className="text-3xl text-center text-bold text-black ">
          Searched Books
        </h2>
        {searchedBooks && searchedBooks.length > 0 ? (
        <div className="mt-12">
          <div className="grid gap-4 lg:max-w-[1100px] md:max-w-[760px] sm:max-w-[620px] my-10 lg:grid-cols-5 sm:grid-cols-3 md:grid-cols-4 grid-cols-2 p-0">
            {currentBooks && currentBooks.map((book) => (
              <Card key={book._id} className="p-0 ">
                <Link to={`/book/${book._id}`}>
                  
                  <div className='relative'>
                                  <img src={book.imageURL} alt="" className="w-full h-full object-cover"/>
                                  <button onClick={event => handleCart(event, book)} className={`absolute top-2 right-2  bg-white p-2 rounded-full ${
                                    isBookInCart(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
                                  }`}
                                  >
                                      <FaCartShopping className='w-5 h-5 '/>
                                  </button>
                                  <br />
                                  
                                  <button
                                  onClick={event => handleWishlist(event, book)}
                                  className={`absolute top-12 right-2 bg-white hover:bg-white p-2 rounded-full ${
                                    isBookInWishlist(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
                                  }`}
                                >
                                  <FaHeart className=" mt-0 w-5 h-5" />
                                </button>
                              </div>
                  <h3 className=" font-bold w-[140px] h-[15px] text-sm tracking-tight text-gray-900 dark:text-white">
                    {book.bookTitle}
                  </h3><br />
                  <p className="font-medium text-gray-700 dark:text-gray-400">
                    {book.description}
                  </p>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    ₹{book.bookPrice}
                  </p>
                  
                </Link>
                {isBookInCart(book) ? (
                  <button className=" text-blue-700 font-semibold bg-white py-2 rounded w-full border-red-400">
                  <Link to={'/cart'}>Go Cart</Link>
                </button>
                ) : (
                  <button onClick={event => handleBuyCart(event, book)} className=" bg-blue-700 font-semibold text-white py-2 rounded w-full">
                  <Link to={'/cart'}>Buy Now</Link>
                </button>
                )}
              </Card>
            ))}
          </div>
          <Pagination setItemsDetails={setItemsDetails} setIndexBook={setIndexBook} itemsPerPage={10} maxPageNumbers={10} inputArrayItems={searchedBooks}/>
        </div>
        
        
      )
      : (
        <p className="text-center text mt-12 text-gray-700">No books matched your search.</p>

      )
    }

    </div>
    );
  };
export default SearchedBooks;
