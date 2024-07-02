import React, { useContext, useEffect, useState } from 'react'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import Navbar from './Navbar'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

//import './styles.css';

// import required modules
import { Pagination  } from 'swiper/modules';
import {Link} from "react-router-dom";
 
import {FaCartShopping, FaHeart, FaLeftLong} from 'react-icons/fa6';

import { AuthContext } from '../context/AuthProvider';
import useCart from '../../hooks/useCart';
//import BookCards from './BookCards';
import useUser from '../../hooks/useUser'


const token = localStorage.getItem('access-token');

const Wishlist = () => {

  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [cartBooks, setCartBooks] = useState([]);


  const user = useContext(AuthContext);
  const headLine = "My Wishlist";

  const [userData,refetch] = useUser();
  const [userId,setUserId] = useState();
  
  useEffect(() => {

    if (userData) {
      setUserId(userData._id)
      setCartBooks(userData.cart)
      setWishlistBooks(userData.wishlist)
    }
    
  }, [user,userData]);

  const userEmail = user.user.email;
  const handleWishlist = (event,book) => {
    event.preventDefault();
    if (!book) {
        console.error("Book object is undefined");
        return;
    }

    const bookId = book._id;
    //delete book from the wish list
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
          //console.log(data);
          //alert("Book removed from wishlist successfully!");
           // Update wishlistBooks state by filtering out the removed book
          setWishlistBooks(wishlistBooks.filter(wishlistBook => wishlistBook._id !== book._id));
          refetch()
        })
        .catch(error => {
          console.error("Error:", error);
          // Handle unexpected errors
        });
  }

  const isBookInCart = book => {
    return cartBooks.some(cartBook => cartBook._id === book._id);
  };
        
    const handleCart = (event,book) => {
      event.preventDefault();
      if (!book) {
          console.error("Book object is undefined");
          return;
      }
      const bookId = book._id;
      //console.log(bookId);
      if (!isBookInCart(book)) {
        // Add book to the wishlist
        fetch(`https://book-store-api-theta.vercel.app/user/${userId}/cart/add`,{
          method:"POST",
          headers:{
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(book) // Stringify the book object before sending
        }).then(res => res.json()).then(data => {
          //alert("Book Uploaded to Cart Successfully!!!");
          refetch()
        })
        .catch(error => {
          console.error("Error:", error);// Handle unexpected errors
        });
        
      } else {
          // Remove book from cart
          //console.log(bookId);
         fetch(`https://book-store-api-theta.vercel.app/user/${userId}/cart/remove/${bookId}`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({bookId: book._id}),
        })
          .then(res => res.json())
          .then(data => {
            //console.log(data);
            //alert("Book removed from Cart successfully!");
            setCartBooks(cartBooks.filter(cartBook => cartBook._id !== book._id));
            refetch()
          })
          .catch(error => {
            console.error("Error:", error);// Handle unexpected errors
          });
      }
  };

    if(wishlistBooks.length === 0){
      return (
        <div className='my-16 px-4 lg:px-24'>
          <h2 className='text-5xl text-center text-bold text-black my-5'>{headLine}</h2>
          <h1 className='px-4 lg:px-24 text-2xl text-center'> Your Wishlist is Empty !</h1>
        </div>
      )
    }else{
      return (
        <div className='my-16 px-4 lg:px-24'>
          {/* <Link to={"/"}><FaLeftLong className='text-3xl absolute left-4 top-4 border-black bg-gray '/></Link> */}
        <h2 className='text-5xl text-center text-bold text-black my-5'>{headLine}</h2>
        
      {/* cards */}
        <div className='mt-12 ' > 
              <Swiper
                  slidesPerView={1}
                  spaceBetween={10}
                  pagination={{
                  clickable: true,
                  }}
                  breakpoints={{
                  640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                  },
                  768: {
                      slidesPerView: 4,
                      spaceBetween: 40,
                  },
                  1024: {
                      slidesPerView: 5,
                      spaceBetween: 50,
                  },
                  }}
                  modules={[Pagination]}
                  className="mySwiper w-full h-full"
              >
                  
                  {
                      wishlistBooks.map(book => <SwiperSlide key={book._id}>
                        <Link to={`/book/${book._id}`}>
                              <div className='relative'>
                                  <img src={book.imageURL} alt={book.bookTitle} className=' object-cover w-full h-full'/>
                                  <button onClick={event => handleCart(event, book)} className={`absolute top-2 right-2  bg-white p-2 rounded-full ${
                                    isBookInCart(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
                                  }`}
                                  >
                                      <FaCartShopping className='w-5 h-5 '/>
                                  </button>
                                  <br />
                                  <button onClick={(event) => handleWishlist(event, book)} className='absolute top-12 right-2 bg-white p-2 rounded-full'>
                                      <FaHeart className=' mt-0 w-5 h-5 text-red-500'/>
                                  </button>
                              </div>
                              <div>
                                  <div>
                                      <h3>{book.bookTitle}</h3>
                                      <p>{book.authorName}</p>
                                  </div>
                                  <div>
                                      <p>₹{book.bookPrice}</p>
                                  </div>
                              </div>  
                          </Link>
                      </SwiperSlide>)
                  }
              </Swiper>
        </div>
      </div>
      )
    }
  
}

export default Wishlist
