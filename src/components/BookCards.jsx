import  { useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

import {Link} from "react-router-dom";
import {FaCartShopping, FaHeart} from 'react-icons/fa6';
import useUser from '../../hooks/useUser'

const BookCards = ({headLine,books, user}) => {
    
    const [wishlistBooks, setWishlistBooks] = useState([]);
    const [cartBooks, setCartBooks] = useState([]);

    const token = localStorage.getItem('access-token');
    const [userData,refetch] = useUser();
    const [userId,setUserId] = useState();
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
      fetch(`https://book-store-api-theta.vercel.app/user/${userId}/wishlist/add`,{
        method:"POST",
        headers:{
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`,
          
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
          "authorization": `Bearer ${token}`,
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

  const handleCart = (event,book) => {
    event.preventDefault();
    if (!book) {
        console.error("Book object is undefined");
        return;
    }
    const bookId = book._id;
    if (!isBookInCart(book)) {
      fetch(`https://book-store-api-theta.vercel.app/user/${userId}/cart/add`,{
        method:"POST",
        headers:{
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(book)
      }).then(res => res.json()).then(data => {
        setCartBooks([...cartBooks, book]);
        refetch()
      })
      .catch(error => {
        console.error("Error:", error);
      });
      
    } else {
        
        fetch(`https://book-store-api-theta.vercel.app/user/${userId}/cart/remove/${bookId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({bookId: book._id}),
      })
        .then(res => res.json())
        .then(data => {
          
          setCartBooks(cartBooks.filter(cartBook => cartBook._id !== book._id));
          refetch()
        })
        .catch(error => {
          console.error("Error:", error);
        });
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
                                {/* <button onClick={(event) => handleWishlist(event, book)} className='absolute top-12 right-2 bg-blue-600 hover:bg-white p-2 rounded-full'>
                                    <FaHeart className=' mt-0 w-5 h-5 text-white'/>
                                </button> */}
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


