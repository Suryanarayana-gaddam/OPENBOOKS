import React from 'react'
import  { useContext, useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import {FaCartShopping, FaHeart} from 'react-icons/fa6';
import useUser from '../../hooks/useUser'
import { CRUDContext } from '../context/CRUDProvider';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "blue", borderRadius:'10px' }}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "blue", borderRadius:"10px" }}
        onClick={onClick}
      />
    );
  }

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
    ]
};

const BookCardFromReactSlick = ({headLine,books, user}) => {
    
    const [wishlistBooks, setWishlistBooks] = useState([]);
    const [cartBooks, setCartBooks] = useState([]);

    const token = localStorage.getItem('access-token');
    const [userData,refetch] = useUser();
    const [userId,setUserId] = useState();

    const {addToWishlist, removeFromWishlist, addToCart, removeFromCart} = useContext(CRUDContext);

  useEffect(() => {
    if (!user) return;
    if (userData && userData.wishlist) {
      setUserId(userData._id)
      setCartBooks(userData.cart)
      setWishlistBooks(userData.wishlist.reverse())
    }
    
  }, [user,userData]);
  
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

  return (
    <div className="slider-container p-10 w-full">
        <Slider {...settings} >
        {
                    books && books.map(book => <div key={book._id}>
                       <Link to={`/book/${book._id}`}>
                            <div className='relative p-2'>
                                <img src={book.imageURL} alt="" className="object-cover w-full h-full"/>
                                <button onClick={event => handleCart(event, book)} className={`transition-none duration-0 absolute top-3 right-4 bg-white p-2 rounded-full ${
                                  isBookInCart(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
                                } transition-none`}
                                >
                                    <FaCartShopping className='w-5 h-5 '/>
                                </button>
                                <br />
                                <button
                                onClick={event => handleWishlist(event, book)}
                                className={`absolute top-14 right-4 bg-white p-2 rounded-full ${
                                  isBookInWishlist(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
                                } transition-none `}
                              >
                                <FaHeart className=" mt-0 w-5 h-5" />
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
                    </div>)
                }
        </Slider>
    </div>
  );
};
export default BookCardFromReactSlick


