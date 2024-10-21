import React, { useContext, useEffect, useState } from 'react'
import useUser from '../../hooks/useUser';
import { CRUDContext } from '../context/CRUDProvider';
import { AuthContext } from '../context/AuthProvider';
import { Card } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { FaCartShopping, FaHeart } from 'react-icons/fa6';
import Pagination from './Pagination';

const Cards = ({booksTodisplay}) => {
    const [books, setBooks] = useState([]);
    const [currentBooks,setCurrentBooks] = useState([]); 
    const [userId,setUserId] = useState();
    const [userData,refetch] = useUser();
    const {addToWishlist, removeFromWishlist, addToCart, removeFromCart} = useContext(CRUDContext);
    const user = useContext(AuthContext);
    const [indexOfFirstBook,setIndexOfFirstBook] = useState(null);
    const [wishlistBooks, setWishlistBooks] = useState([]);
    const [cartBooks, setCartBooks] = useState([]);
    const token = localStorage.getItem('access-token');

    const setItemsDetails = (x) => {
        setCurrentBooks(x);
      }
      const setIndexBook = (y) => {
        setIndexOfFirstBook(y);
      }

    useEffect(() => {
        if (userData && userData.wishlist && userData.cart ) {
          setUserId(userData._id)
          setCartBooks(userData.cart)
          setWishlistBooks(userData.wishlist.reverse())
        }
        refetch()
        setBooks(booksTodisplay)
        }, [user,userData,token,booksTodisplay]);
        
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
    <div className='lg:px-14 px-2 sm:px-4'>
        <div className="grid gap-4 lg:max-w-[1100px] sm:max-w-[630px] md:max-w-[800px] w-full my-10 lg:grid-cols-5 sm:grid-cols-3 md:grid-cols-4 grid-cols-2 p-0">
            { currentBooks && currentBooks.map((book) => (
                <Card key={book._id} className="hover:scale-105 duration-700">
                    <Link to={`/book/${book._id}`}>
                        <div className='relative p-0 h-[200px] mb-1'>
                            <img src={book.imageURL} alt="" className="object-cover w-full h-full"/>
                            <button onClick={event => handleCart(event, book)} className={`absolute top-2 right-2  bg-white p-2 rounded-full transition-none ${
                                isBookInCart(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
                            }`}
                            >
                            <FaCartShopping className='w-5 h-5 '/>
                            </button>
                            <br />
                            <button
                            onClick={event => handleWishlist(event, book)}
                            className={`absolute top-12 right-2 bg-white hover:bg-white p-2 rounded-full transition-none ${
                                isBookInWishlist(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
                            }`}                                 
                            >
                            <FaHeart className=" mt-0 w-5 h-5" />
                            </button>
                        </div>
                        <div>
                            <h3 className=" font-bold w-[140px] h-auto text-sm tracking-tight text-gray-900 dark:text-white">
                            {book.bookTitle}
                            </h3><br />
                            
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                            ₹{book.bookPrice}
                            </p>
                            {isBookInCart(book) ? (
                                <button className=" text-blue-700 font-semibold shadow-xl bg-white py-2 rounded w-full border-gray-100 border-2 duration-500">
                                  <Link to={'/cart'}>Go Cart</Link>
                                </button>
                            ) : (
                                <button onClick={event => handleBuyCart(event, book)} className=" bg-blue-700 hover:bg-green-500 hover:text-black duration-500 font-semibold text-white shadow-xl py-2 rounded w-full">
                                  <Link to={'/cart'}>Buy Now</Link>
                                </button>
                            )}
                        </div>
                    </Link>
                </Card>
            ))}
        </div>
        <Pagination setItemsDetails={setItemsDetails} setIndexBook={setIndexBook} itemsPerPage={20} maxPageNumbers={10} inputArrayItems={books}/>
    </div>
  )
}

export default Cards
