import React, { useContext, useEffect, useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import {Link} from "react-router-dom";
 
import {FaCartShopping, FaHeart} from 'react-icons/fa6';
import useCart from '../../hooks/useCart';


const BookCards = ({headLine,books, user}) => {
    
    const [wishlistBooks, setWishlistBooks] = useState([]);
    const [cartBooks, setCartBooks] = useState([]);
    const [cart,refetch] = useCart();

    const token = localStorage.getItem('access-token');

  useEffect(() => {
    if (!user) return;
    const userEmail = user.email;
    fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(error => {
              console.error("Error fetching user data:", error);
            });
          }
          return res.json(); 
        })
        .then(userData => {
          const userId = userData._id;
          fetch(`https://book-store-api-theta.vercel.app/user/${userId}/get/wishlist`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          })
          .then(res => {
            if (!res.ok) {
              return res.json().then(error => {
                console.error("Error fetching wishlist books:", error);
              });
            }
            return res.json();
          })
          .then(data => setWishlistBooks(data))
          .catch(error => {
            console.error("Error:", error);
          });

          fetch(`https://book-store-api-theta.vercel.app/user/${userId}/get/cart`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          })
          .then(res => {
            if (!res.ok) {
              return res.json().then(error => {
                console.error("Error fetching cart books:", error);
              });
            }
            return res.json();
          })
          .then(data =>setCartBooks(data))
          .catch(error => {
            console.error("Error:", error);
          });
          
        })
        .catch(error => {
          console.error("Error:", error);
        });
  }, [user,token]);
  
    const isBookInWishlist = book => {
      return wishlistBooks.some(wishlistBook => wishlistBook._id === book._id);
    };
    const isBookInCart = book => {
      return cartBooks.some(cartBook => cartBook._id === book._id);
    };

      const handleWishlist = (event,book) => {
        event.preventDefault();
        const userEmail = user?.email;
        if (!book) {
            console.error("Book object is undefined");
            return;
        }
        fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json", 
            authorization: `Bearer ${token}`,
          },
        })
          .then(res => {
            if (!res.ok) {
              return res.json().then(error => {
                console.error("Error fetching user data:", error);
              });
            }
            return res.json();
          })
          .then(userData => {      
            const userId = userData._id;         
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
            })
            .catch(error => {
              console.error("Error:", error);
            });
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
    };
      const handleCart = (event,book) => {
        event.preventDefault();
        const userEmail = user?.email;
        if (!book) {
            console.error("Book object is undefined");
            return;
        }
        fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json", 
            authorization: `Bearer ${token}`,
          },
        })
          .then(res => {
            if (!res.ok) {
              return res.json().then(error => {
                console.error("Error fetching user data:", error);
              });
            }
            return res.json();
          })
          .then(userData => {      
            const userId = userData._id;        
        const bookId = book._id;
        if (!isBookInCart(book)) {
          fetch(`https://book-store-api-theta.vercel.app/user/${userId}/cart/add`,{
            method:"POST",
            headers:{
              "Content-type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(book)
          }).then(res => res.json()).then(data => {
            setCartBooks([...cartBooks, book]);
            refetch()
            window.location.reload();
          })
          .catch(error => {
            console.error("Error:", error);
          });
          
        } else {
            
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
              
              setCartBooks(cartBooks.filter(cartBook => cartBook._id !== book._id));
              refetch()
            })
            .catch(error => {
              console.error("Error:", error);
            });
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
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
                    books.map(book => <SwiperSlide key={book._id}>
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
                                {/* <button onClick={(event) => handleWishlist(event, book)} className='absolute top-12 right-2 bg-blue-600 hover:bg-white p-2 rounded-full'>
                                    <FaHeart className=' mt-0 w-5 h-5 text-white'/>
                                </button> */}
                                <button
                                onClick={event => handleWishlist(event, book)}
                                className={`absolute top-12 right-2 bg-white p-2 rounded-full ${
                                  isBookInWishlist(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
                                }`}
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


