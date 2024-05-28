//16-04-2024 18:58
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import BookList from '../components/BookList';
import BookCards from '../components/BookCards';
import { AuthContext } from '../context/AuthProvider';
import { FaHeart } from 'react-icons/fa6';
import useCart from '../../hooks/useCart';

const SingleBook = () => {
  const { _id, createrId, bookTitle, imageURL, category, bookDescription, authorName,bookPrice } = useLoaderData();
  const [books, setBooks] = useState([]);
  // const [wishlist, setWishlist] = useState([]);
  // const [cart, setCart] = useState([]);
  const user = useContext(AuthContext);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [cartBooks, setCartBooks] = useState([]);
  const book = { _id, createrId, bookTitle, imageURL, category, bookDescription, authorName,bookPrice };

  const [cart,refetch] = useCart();

  const token = localStorage.getItem('access-token');

  useEffect(() => {

    const userEmail = user?.user?.email;

    // Fetch user data by email
    fetch(`http://localhost:5000/userByEmail/${userEmail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // Set content type header explicitly
          authorization: `Bearer ${token}`
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
          fetch(`http://localhost:5000/user/${userId}/get/wishlist`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`
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

          fetch(`http://localhost:5000/user/${userId}/get/cart`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`
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


    fetchBooksByCategory(category); // Fetch books by the category of the current book on component mount
  }, [category,user]); // Re-fetch books when category changes

  const isBookInWishlist = book => {
    return wishlistBooks.some(wishlistBook => wishlistBook._id === book._id);
  };
  const isBookInCart = book => {
    return cartBooks.some(cartBook => cartBook._id === book._id);
  };

  const fetchBooksByCategory = async (category) => {
    try {
      //console.log('Fetching books for category:', category);
      const response = await fetch(`http://localhost:5000/all-books?category=${category}`, {
        headers : {
            authorization: `Bearer ${token}`
        }
    });
      if (!response.ok) {
        throw new Error('Error fetching books by category');
      }
      const data = await response.json();
      //console.log('Fetched books:', data);
      setBooks(data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const addToWishlist = (event,book) => {
    event.preventDefault();
    const userEmail = user?.user?.email;
    if (!book) {
        console.error("Book object is undefined");
        return;
    }
    // Fetch user data by email
    fetch(`http://localhost:5000/userByEmail/${userEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Set content type header explicitly
        authorization: `Bearer ${token}`
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
      fetch(`http://localhost:5000/user/${userId}/wishlist/add`,{
        method:"POST",
        headers:{
          "Content-type": "application/json",
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
       fetch(`http://localhost:5000/user/${userId}/wishlist/remove/${bookId}`, {
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
  const addToCart = (event,book) => {
    event.preventDefault();
    const userEmail = user?.user?.email;
    if (!book) {
        console.error("Book object is undefined");
        return;
    }
    // Fetch user data by email
    fetch(`http://localhost:5000/userByEmail/${userEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Set content type header explicitly
        authorization: `Bearer ${token}`
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
    //const bookId = book._id;
    //console.log(bookId);
    if (!isBookInCart(book)) {
      // Add book to the wishlist
      fetch(`http://localhost:5000/user/${userId}/cart/add`,{
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
        window.location.href="/cart";
      })
      .catch(error => {
        console.error("Error:", error);// Handle unexpected errors
      });
      
    // } else {
    //     // Remove book from cart
    //     console.log(bookId);
    //    fetch(`http://localhost:5000/user/${userId}/cart/remove/${bookId}`, {
    //     method: "POST",
    //     headers: {
    //       "Content-type": "application/json",
    //     },
    //     body: JSON.stringify({bookId: book._id}),
    //   })
    //     .then(res => res.json())
    //     .then(data => {
    //       console.log(data);
    //       alert("Book removed from Cart successfully!");
    //       setCartBooks(cartBooks.filter(cartBook => cartBook._id !== book._id));
    //     })
    //     .catch(error => {
    //       console.error("Error:", error);// Handle unexpected errors
    //     });
    }
  })
  .catch(error => {
    console.error("Error:", error);// Handle unexpected errors
  });
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





// // import React from 'react'

// // import { useLoaderData } from 'react-router-dom'

// // const SingleBook = () => {
// //     const {_id,bookTitle,imageURL,category,bookDescription,authorName} = useLoaderData();
// //   return (
// //     <div className='mt-28 px-4 lg:px-24'>
// //       <div><img src={imageURL} alt="" className='h-96' /></div>
// //        <div className='float-left'>
// //         <h2 className='font-6xl'>{bookTitle}</h2>
// //         <h2>{authorName}</h2>
// //         <p>{category}</p>
// //         <p>{bookDescription}</p>
// //        </div>
// //     </div>
// //   )
// // }

// // export default SingleBook



// // import React, { useState } from 'react';
// // import { Link, useLoaderData } from 'react-router-dom';
// // import BookList from '../components/BookList';

// // const SingleBook = () => {
// //   const { bookTitle, imageURL, category, bookDescription, authorName } = useLoaderData();
// //   const [books, setBooks] = useState([]);
// //   const [selectedCategory, setSelectedCategory] = useState(null);
// //   const bookCategories = [
// //     "Fiction", "Non-Fiction", "Mystery", "Programming", "Science Fiction", "Fantasy", "Horror", "Bibliography", "Autobiography", "History", "Self-help", "Memoir", "Business", "Children Books", "Travel", "Religion", "Art And Design"
// //   ];

// //   const fetchBooksByCategory = async (category) => {
// //     try {
// //       console.log('Fetching books for category:', category);
// //       const response = await fetch(`http://localhost:5000/all-books?category=${category}`);
// //       if (!response.ok) {
// //         throw new Error('Error fetching books by category');
// //       }
// //       const data = await response.json();
// //       console.log('Fetched books:', data); // Add this line to log the fetched books
// //       setBooks(data);
// //       setSelectedCategory(category);
// //     } catch (error) {
// //       console.error('Error:', error.message);
// //     }
// //   };

// //   const handleClick = (category) => {
// //     fetchBooksByCategory(category);
// //   };

// //   return (
// //     <div className="container mx-auto px-4 lg:px-24 mt-16">
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //         <div className="max-w-lg mx-auto">
// //           <img src={imageURL} alt={bookTitle} className="rounded-lg shadow-lg" />
// //         </div>
// //         <div>
// //           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4 md:mt-0">{bookTitle}</h1>
// //           <h2 className="text-xl font-semibold text-gray-600 mt-2">by {authorName}</h2>
// //           <p className="text-gray-700 text-lg mt-2">{category}</p>
// //           <p className="text-gray-800 text-lg mt-4">{bookDescription}</p>
// //         </div>
// //       </div>
// //       <div>
// //       <ul className='flex flex-wrap justify-center'>
// //         {bookCategories.map(category => (
// //             <Link to="#" key={category}>
// //               {category}
// //             </Link>
// //           return { 
// //             fetchBooksByCategory(category);
// //           )
// //         ))}
// //       </ul>
// //         <h2 className='my-2 mt-5 bg-black text-center text-white text-2xl p-2 h-12'>Books</h2>
// //         <BookList books={books}  /> {/* Pass books state as prop */}
// //       </div>
// //       </div>

    
// //   );
// // };

// // export default SingleBook;


// import React, { useState, useEffect } from 'react';
// import { Link, useLoaderData } from 'react-router-dom';
// import BookList from '../components/BookList';

// const SingleBook = () => {
//   const { _id, bookTitle, imageURL, category, bookDescription, authorName } = useLoaderData();
//   const [books, setBooks] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(category); // Initialize with the category of the current book
//   const bookCategories = [
//     "Fiction", "Non-Fiction", "Mystery", "Programming", "Science Fiction", "Fantasy", "Horror", "Bibliography", "Autobiography", "History", "Self-help", "Memoir", "Business", "Children Books", "Travel", "Religion", "Art And Design"
//   ];

//   useEffect(() => {
//     fetchBooksByCategory(selectedCategory); // Fetch books by the category of the current book on component mount
//   }, [selectedCategory]); // Re-fetch books when selectedCategory changes

//   const fetchBooksByCategory = async (category) => {
//     try {
//       console.log('Fetching books for category:', category);
//       const response = await fetch(`http://localhost:5000/all-books?category=${category}`);
//       if (!response.ok) {
//         throw new Error('Error fetching books by category');
//       }
//       const data = await response.json();
//       console.log('Fetched books:', data);
//       setBooks(data);
//     } catch (error) {
//       console.error('Error:', error.message);
//     }
//   };

//   const handleClick = (category) => {
//     setSelectedCategory(category); // Set selectedCategory state when a category is clicked
//   };

//   return (
//     <div className="container mx-auto px-4 lg:px-24 mt-16">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="max-w-lg mx-auto">
//           <img src={imageURL} alt={bookTitle} className="rounded-lg shadow-lg" />
//         </div>
//         <div>
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4 md:mt-0">{bookTitle}</h1>
//           <h2 className="text-xl font-semibold text-gray-600 mt-2">by {authorName}</h2>
//           <p className="text-gray-700 text-lg mt-2">{category}</p>
//           <p className="text-gray-800 text-lg mt-4">{bookDescription}</p>
//         </div>
//       </div>
//       <div>
//         <h2 className='my-2 mt-5 bg-black text-center text-white text-2xl p-2 h-12'>Books</h2>
//         <ul className='flex flex-wrap justify-center'>
//           {bookCategories.map(cat => (
//             <li key={cat} className={`border-dotted mx-4 my-2 px-4 py-2 rounded-full ${selectedCategory === cat ? 'bg-lime-500 text-white' : 'bg-gray-300 hover:bg-gray-500 hover:text-white transition-colors duration-300'}`}>
//               <Link to="#" onClick={() => handleClick(cat)}>
//                 {cat}
//               </Link>
//             </li>
//           ))}
//         </ul>
//         <BookList headLine="Similar Books" books={books} category={selectedCategory} />
//       </div>
//     </div>
//   );
// };

// export default SingleBook;


//16-04-2024 18:57
// import React, { useState, useEffect } from 'react';
// import { useLoaderData } from 'react-router-dom';
// import BookList from '../components/BookList';

// const SingleBook = () => {
//   const { _id, bookTitle, imageURL, category, bookDescription, authorName } = useLoaderData();
//   const [books, setBooks] = useState([]);

//   useEffect(() => {
//     fetchBooksByCategory(category); // Fetch books by the category of the current book on component mount
//   }, [category]); // Re-fetch books when category changes

//   const fetchBooksByCategory = async (category) => {
//     try {
//       console.log('Fetching books for category:', category);
//       const response = await fetch(`http://localhost:5000/all-books?category=${category}`);
//       if (!response.ok) {
//         throw new Error('Error fetching books by category');
//       }
//       const data = await response.json();
//       console.log('Fetched books:', data);
//       setBooks(data);
//     } catch (error) {
//       console.error('Error:', error.message);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 lg:px-24 mt-16">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="max-w-lg mx-auto">
//           <img src={imageURL} alt={bookTitle} className="rounded-lg shadow-lg" />
//         </div>
//         <div>
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4 md:mt-0">{bookTitle}</h1>
//           <h2 className="text-xl font-semibold text-gray-600 mt-2">by {authorName}</h2>
//           <p className="text-gray-700 text-lg mt-2">{category}</p>
//           <p className="text-gray-800 text-lg mt-4">{bookDescription}</p>
//         </div>
//       </div>
//       <div>
//         <h2 className='my-2 mt-5 bg-black text-center text-white text-2xl p-2 h-12'></h2>
//         <BookList headLine="Similar Books" books={books} category={category} />
//       </div>
//     </div>
//   );
// };

// export default SingleBook;


