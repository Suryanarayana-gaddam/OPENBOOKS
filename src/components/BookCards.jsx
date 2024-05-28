import React, { useContext, useEffect, useRef, useState } from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
//import 'swiper/css/pagination';

//import './styles.css';

// import required modules
import { Pagination } from 'swiper/modules';
import {Link} from "react-router-dom";
 
import {FaCartShopping, FaHeart} from 'react-icons/fa6';
import useCart from '../../hooks/useCart';


const BookCards = ({headLine,books, user}) => {
    //console.log(books);

    
    const [wishlistBooks, setWishlistBooks] = useState([]);
    const [cartBooks, setCartBooks] = useState([]);
    const [cart,refetch] = useCart();

    const token = localStorage.getItem('access-token');

  useEffect(() => {
    if (!user) return;
    const userEmail = user.email;
    // Fetch user data by email
    fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // Set content type header explicitly
          authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(error => {
              console.error("Error fetching user data:", error);
              // Handle the error (e.g., display a message to the user)
            });
          }
          return res.json(); // Parse valid JSON response
        })
        .then(userData => {
          // Get user ID from userData
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
                // Handle the error
              });
            }
            return res.json();
          })
          .then(data => setWishlistBooks(data))
          .catch(error => {
            console.error("Error:", error);
            // Handle unexpected errors
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
                // Handle the error
              });
            }
            return res.json();
          })
          .then(data => setCartBooks(data))
          .catch(error => {
            console.error("Error:", error);
            // Handle unexpected errors
          });
          
        })
        .catch(error => {
          console.error("Error:", error);
          // Handle unexpected errors
        });
  }, [user]);
  
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
        // Fetch user data by email
        fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json", // Set content type header explicitly
            authorization: `Bearer ${token}`,
          },
        })
          .then(res => {
            if (!res.ok) {
              return res.json().then(error => {
                console.error("Error fetching user data:", error);// Handle the error (e.g., display a message to the user)
              });
            }
            return res.json(); // Parse valid JSON response
          })
          .then(userData => {      
            // // Get user ID from userData
            const userId = userData._id;         
        const bookId = book._id;
        //console.log(bookId);
        if (!isBookInWishlist(book)) {
          // Add book to the wishlist
          fetch(`https://book-store-api-theta.vercel.app/user/${userId}/wishlist/add`,{
            method:"POST",
            headers:{
              "Content-type": "application/json",
              authorization: `Bearer ${token}`,
              
            },
            body: JSON.stringify(book) // Stringify the book object before sending
          }).then(res => res.json()).then(data => {
            //alert("Book Uploaded to wishlist Successfully!!!");
            setWishlistBooks([...wishlistBooks, book]);
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
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({bookId: book._id}),
          })
            .then(res => res.json())
            .then(data => {
              //console.log(data);
              //alert("Book removed from wishlist successfully!");
              setWishlistBooks(wishlistBooks.filter(wishlistBook => wishlistBook._id !== book._id));
            })
            .catch(error => {
              console.error("Error:", error);// Handle unexpected errors
            });
        }
      })
      .catch(error => {
        console.error("Error:", error);// Handle unexpected errors
      });
    };
      const handleCart = (event,book) => {
        event.preventDefault();
        // if (!user) return;
        const userEmail = user?.email;
        if (!book) {
            console.error("Book object is undefined");
            return;
        }
        // Fetch user data by email
        fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json", // Set content type header explicitly
            authorization: `Bearer ${token}`,
          },
        })
          .then(res => {
            if (!res.ok) {
              return res.json().then(error => {
                console.error("Error fetching user data:", error);// Handle the error (e.g., display a message to the user)
              });
            }
            return res.json(); // Parse valid JSON response
          })
          .then(userData => {      
            const userId = userData._id; // Get user ID from userData        
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
            setCartBooks([...cartBooks, book]);
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
      })
      .catch(error => {
        console.error("Error:", error);// Handle unexpected errors
      });
    };

  return (
    <div className='my-16 px-4 lg:px-24 '>
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


// import React, { useContext, useRef, useState } from 'react';

// // Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/pagination';

// // Import required modules
// import { Pagination } from 'swiper/modules';
// import { Link } from 'react-router-dom';
// import { FaCartShopping, FaHeart } from 'react-icons/fa6';
// import { AuthContext } from '../context/AuthProvider';

// const BookCards = ({ headLine, books }) => {
//   const [wishlistClicked, setWishlistClicked] = useState([]);
//   const [cartClicked, setCartClicked] = useState([]);

//   const user = useContext(AuthContext);

//   const handleWishlistClick = (bookId) => {
//     setWishlistClicked([...wishlistClicked, bookId]);
//   };

//   const handleCartClick = (bookId) => {
//     setCartClicked([...cartClicked, bookId]);
//   };

//   return (
//     <div className='my-16 px-4 lg:px-24'>
//       <h2 className='text-5xl text-center text-bold text-black my-5'>{headLine}</h2>

//       {/* cards */}
//       <div className='mt-12'>
//         <Swiper
//           slidesPerView={1}
//           spaceBetween={10}
//           pagination={{
//             clickable: true,
//           }}
//           breakpoints={{
//             640: {
//               slidesPerView: 2,
//               spaceBetween: 20,
//             },
//             768: {
//               slidesPerView: 4,
//               spaceBetween: 40,
//             },
//             1024: {
//               slidesPerView: 5,
//               spaceBetween: 50,
//             },
//           }}
//           modules={[Pagination]}
//           className='mySwiper w-full h-full'
//         >
//           {books.map((book) => (
//             <SwiperSlide key={book._id}>
//               <Link to={`/book/${book._id}`}>
//                 <div className='relative'>
//                   <img src={book.imageURL} alt='' />
//                   <div className='absolute top-2 right-2 bg-red-400 hover:bg-white p-2 rounded'>
//                     <FaCartShopping
//                       className={`w-5 h-5 ${
//                         cartClicked.includes(book._id) ? 'text-white bg-red-500' : 'text-white'
//                       }`}
//                       onClick={() => handleCartClick(book._id)}
//                     />
//                   </div>
//                   <br />
//                   <div className='absolute top-12 right-2 bg-blue-600 hover:bg-white p-2 rounded-full'>
//                     <FaHeart
//                       className={`mt-0 w-5 h-5 ${
//                         wishlistClicked.includes(book._id) ? 'text-white bg-red-500' : 'text-white'
//                       }`}
//                       onClick={() => handleWishlistClick(book._id)}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <div>
//                     <h3>{book.bookTitle}</h3>
//                     <p>{book.authorName}</p>
//                   </div>
//                   <div>
//                     <p>₹{book.bookPrice}</p>
//                   </div>
//                 </div>
//               </Link>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default BookCards;
