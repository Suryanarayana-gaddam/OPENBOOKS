import React, { useContext, useEffect, useState } from 'react';
import { FaCartShopping, FaHeart } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';


import { Card } from 'flowbite-react';
import useCart from '../../hooks/useCart';

const SearchedBooks = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');
  const [searchQuery, setSearchQuery] = useState('');

  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  const [searchedBooks, setSearchedBooks] = useState([]);
  const user = useContext(AuthContext);
    
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [cartBooks, setCartBooks] = useState([]);

  const token = localStorage.getItem('access-token');

  const [cart,refetch] = useCart();


  useEffect(() => {

    const userEmail = user?.user?.email;
    // Fetch user data by email
    fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
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
          fetch(`https://book-store-api-theta.vercel.app/user/${userId}/get/wishlist`, {
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

          fetch(`https://book-store-api-theta.vercel.app/user/${userId}/get/cart`, {
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

    if (query) {
      fetch(`https://book-store-api-theta.vercel.app/all-books/searchedbooks?query=${encodeURIComponent(query)}`, {
        headers : {
            authorization: `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {
          //console.log("Filtered books:", data);
          setSearchedBooks(data);
          
        })
        .catch(error => {
          console.error('Error fetching searched books:', error);
        });
    }
  }, [query,user]);

  const isBookInWishlist = book => {
    return wishlistBooks.some(wishlistBook => wishlistBook._id === book._id);
  };
  const isBookInCart = book => {
    return cartBooks.some(cartBook => cartBook._id === book._id);
  };

    const handleWishlist = (event,book) => {
      event.preventDefault();
      const userEmail = user?.user?.email;
      if (!book) {
          console.error("Book object is undefined");
          return;
      }
      // Fetch user data by email
      fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
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
      const userEmail = user?.user?.email;
      if (!book) {
          console.error("Book object is undefined");
          return;
      }
      // Fetch user data by email
      fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
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

  // handling buy cart
const handleBuyCart = (event,book) => {
  event.preventDefault();
  const userEmail = user?.user?.email;
  if (!book) {
      console.error("Book object is undefined");
      return;
  }
  // Fetch user data by email
  fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
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
      //("Book Uploaded to Cart Successfully!!!");
      setCartBooks([...cartBooks, book]);
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

    // Logic to paginate books
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = searchedBooks.slice(indexOfFirstBook, indexOfLastBook);
  
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    // Go to previous page
    const goToPreviousPage = () => {
      setCurrentPage((prevPage) => prevPage - 1);
    };
  
    // Go to next page
    const goToNextPage = () => {
      setCurrentPage((prevPage) => prevPage + 1);
    };
  
    // Pagination buttons with page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(searchedBooks.length / booksPerPage); i++) {
      pageNumbers.push(i);
    }
  
  return (
      <div className="my-16 px-4 lg:px-24">
        <h2 className="text-3xl text-center text-bold text-black ">
          Searched Books
        </h2><br />
        <div className=' flex'>
            <input
              type="text" name='search-input'
              placeholder='Search a book'
              className='py-2 px-2 rounded-s-sm outline-none lg:w-5/6 sm:w-4 text-center ml-10'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Link to={`/books/searchedbooks?query=${encodeURIComponent(searchQuery)}`}>
              <button
                className='bg-blue-700 px-6 py-2 text-white font-medium hover:bg-black transition-all ease-in duration-200'
              >
                Search
              </button>
            </Link>            
          </div>
        {/* Cards */}
        {currentBooks.length > 0 ? (
        <div className="mt-12">
          <div className="grid gap-4 lg:w-[1100px] sm:w-[220px] my-10 lg:grid-cols-5 sm:grid-cols-2 md:grid-cols-3 grid-cols-2 p-0">
            {currentBooks.map((book) => (
              <Card key={book._id} className="p-0 ">
                <Link to={`/book/${book._id}`}>
                  {/* <img
                    src={book.imageURL}
                    alt=""
                    className="w-full max-w-full h-auto"
                  /> */}
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
          {/* Pagination buttons at the bottom */}
        <div className="flex justify-around mt-8 w-auto">
          <div>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-full bg-blue-500 text-white mr-2"
          >
            Previous
          </button>
          </div>
          <div>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-full ${
                currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200"
              } mr-2`}
            >
              {number}
            </button>
          ))}
          </div>
          <div>
          <button
            onClick={goToNextPage}
            disabled={currentPage === Math.ceil(searchedBooks.length / booksPerPage)}
            className="px-3 py-1 rounded-full bg-blue-500 text-white ml-2 "
          >
            Next
          </button>
          </div>
        </div>
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
