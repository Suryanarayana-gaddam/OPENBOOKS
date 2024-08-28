import  { useContext, useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

import {Link} from "react-router-dom";
import {FaCartShopping, FaHeart} from 'react-icons/fa6';
import useUser from '../../hooks/useUser'
import { CRUDContext } from '../context/CRUDProvider';

const BookCards = ({headLine,books, user}) => {
    
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
    <div className='my-16 px-4 lg:px-24 '>
      <h2 className='text-5xl text-center text-bold text-black my-5'>{headLine}</h2>
      
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
                    books && books.map(book => <SwiperSlide key={book._id}>
                       <Link to={`/book/${book._id}`}>
                            <div className='relative'>
                                <img src={book.imageURL} alt="" className="object-cover w-full h-full"/>
                                <button onClick={event => handleCart(event, book)} className={`transition-none duration-0 absolute top-2 right-2  bg-white p-2 rounded-full ${
                                  isBookInCart(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
                                } transition-none`}
                                >
                                    <FaCartShopping className='w-5 h-5 '/>
                                </button>
                                <br />
                                <button
                                onClick={event => handleWishlist(event, book)}
                                className={`absolute top-12 right-2 bg-white p-2 rounded-full ${
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
                    </SwiperSlide>)
                }
            </Swiper>
      </div>
    </div>
  );
};

export default BookCards


