import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { motion } from 'framer-motion'; // For animations
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import BookCards from './BookCards';

const Cart = () => {
  const [cartBooks, setCartBooks] = useState([]);
  const user = useContext(AuthContext);
  const [bookQuantity, setBookQuantity] = useState(1); // Initialize quantity state
  const [books,setBooks] = useState([]);

  const token = localStorage.getItem('access-token');
  const headLine = "My Cart";
  
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
        //console.log("User Data:", userData);
  
        // Get user ID from userData
        const userId = userData._id;
        //console.log(userId);
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
              console.error("Error fetching cart books:", error);
              // Handle the error
            });
          }
          return res.json();
        })
        .then(data => setCartBooks(data.reverse()))
        
        .catch(error => {
          console.error("Error:", error);
          // Handle unexpected errors
        });
      })
      .catch(error => {
        console.error("Error:", error);
        // Handle unexpected errors
      });


      const fetchBooks = async () => {
        try {
          const response = await fetch("https://book-store-api-theta.vercel.app/all-books", {
            headers: {
              authorization: `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Error fetching books');
          }
          const data = await response.json();
          const shuffledBooks = data.sort(() => 0.5 - Math.random());
          setBooks(shuffledBooks.slice(0, 10));
        } catch (error) {
          console.error('Error:', error.message);
        }
      };
  
      fetchBooks();
  }, [user]);

  //console.log(cartBooks)
  const handleRemoveFromCart = (event,book) => {
    event.preventDefault();
    const userEmail = user.user.email;
    //console.log("User Email:", userEmail);
    
    //console.log("Book:", book); // Log the book object

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
            console.error("Error fetching user data:", error);
            // Handle the error (e.g., display a message to the user)
          });
        }
        return res.json(); // Parse valid JSON response
      })
      .then(userData => {
        //console.log("User Data:", userData);
  
        // Get user ID from userData
        const userId = userData._id;
        const bookId = book._id;
        //delete book from the cart
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
              //alert("Book removed from cart successfully!");
               // Update wishlistBooks state by filtering out the removed book
              setCartBooks(cartBooks.filter(cartBook => cartBook._id !== book._id));
              refetch()
            })
            .catch(error => {
              console.error("Error:", error);
              // Handle unexpected errors
            });
      })
      .catch(error => {
        console.error("Error:", error);
        // Handle unexpected errors
      });
  }
  //      setCartItems(cartItems.filter(item => item._id !== itemId));

  const increaseQuantity = (bookId) => {
    setCartBooks(prevCartBooks =>
      prevCartBooks.map(book =>
        book._id === bookId ? { ...book, quantity: (book.quantity || 1) + 1 } : book
      )
    );
  };

  const decreaseQuantity = (bookId) => {
    setCartBooks(prevCartBooks =>
      prevCartBooks.map(book =>
        book._id === bookId && (book.quantity || 1) > 1 ? { ...book, quantity: (book.quantity || 1) - 1 } : book
      )
    );
  };

  const handleOrderSubmit = (event) => {
    event.preventDefault();
    // Get user from the context
    //console.log("User:", user); // Log user object to check if it's undefined or contains the expected data

    // Check if user exists in the context
    if (!user) {
      console.error("User not found in context");
      // Handle the case where the user is not logged in (e.g., display a message)
      return;
    }
  
    // Get user email directly from the user object (assuming it has an 'email' property)
    const userEmail = user.user.email;
    //console.log("User Email:", userEmail);
  
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
        //console.log("User Data:", userData);
  
        // Get user ID from userData
        const userId = userData._id;
        const username = userData.username;

        // Submit each book in the cart individually
    cartBooks.map(book => {
      const orderObj = {
        userId,
        username,
        bookId: book._id,
        quantity: book.quantity || 1,
        totalPrice: (book.quantity || 1) * book.bookPrice,
        createrId: book.createrId,
        bookTitle: book.bookTitle,
        authorName: book.authorName,
        imageURL: book.imageURL,
        category: book.category,
        bookDescription: book.bookDescription,
        bookPDFURL: book.bookPDFURL,
        bookPrice: book.bookPrice,
        date : new Date()
      };
  
        //console.log(orderObj);
  
        // send data to DataBase
        fetch(`https://book-store-api-theta.vercel.app/user/${userId}/add/orders`,{
          method:"POST",
          headers:{
            "Content-type": "application/json",
            authorization: `Bearer ${token}`
          },
          body: JSON.stringify(orderObj)
        }).then(res => res.json()).then(data => {
          emptyCart();
        });
      })
      .catch(error => {
        console.error("Error:", error);
        // Handle unexpected errors
      });
    });
  };
  const emptyCart = async () => {
    
    // Check if user is logged in
    if (!user || !user.user || !user.user.email) {
      console.error("User not found or not logged in");
      // Display a message to the user indicating that they need to log in
      return;
    }
  
    try {
      // Fetch user data by email
      const userEmail = user.user.email;
      const userDataResponse = await fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
      });
  
      if (!userDataResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      const userData = await userDataResponse.json();
      const userId = userData._id;
  
      // Remove all items from the cart
      const removeCartResponse = await fetch(`https://book-store-api-theta.vercel.app/user/${userId}/cart/removeAll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
  
      if (!removeCartResponse.ok) {
        throw new Error("Failed to empty cart");
      }
  
      // Set cartBooks to empty array
      setCartBooks([]);
      refetch()
      
    } catch (error) {
      console.error("Error emptying cart:", error.message);
      
    } 
};

  

  return (
    <div className="container mx-auto px-4 mt-16">
          <h2 className='text-3xl text-center text-bold text-black my-5'>{headLine}</h2>
      <div>
        {cartBooks.length === 0 ? (
          <div className='lg:px-14'>
          <p className='px-4 lg:px-24 text-1xl text-center my-3'>Your Cart was Empty!</p>
          
          <h1 className='text-center text-3xl relative top-8'>Suggested Books </h1>
          <BookCards books={books} user={user.user} className=''/>
        </div> 
        ) : (
          <div className='p-10 mb-5'>
            {cartBooks.map(book => (
              <motion.div
                key={book._id}
                className="bg-white rounded-lg overflow-hidden shadow-md mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center justify-evenly lg:px-24 sm:px-52">
                <div>
                <Link to={`/book/${book._id}`}> {/* Wrap the image with Link component */}
                <img src={book.imageURL} alt={book.bookTitle} className=" w-32 object-cover cursor-pointer" />
              </Link>
                </div>
                  <div className="flex-grow px-4 ml-32">
                    <h2 className="lg:text-lg font-bold text-gray-800">{book.bookTitle}</h2>
                    <p className="text-sm text-gray-600">Author: {book.authorName}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-600">Price: ₹{book.bookPrice}</p>
                      <div className="flex items-center">
                      <button
                      onClick={() => decreaseQuantity(book._id)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                      disabled={(book.quantity || 1) === 1}
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-semibold">{book.quantity || 1}</span>
                    <button
                      onClick={() => increaseQuantity(book._id)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                    >
                      +
                    </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      onClick={() => handleRemoveFromCart(event, book)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="flex justify-around mt-4">
              {/* Total price */}
              <p className="text-lg font-bold">Total Price: ₹{cartBooks.reduce((total, book) => total + (book.quantity || 1) * book.bookPrice, 0)}</p>
              {/* Proceed to pay button */}
              <button onClick={(event) => handleOrderSubmit(event)} className=" py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition duration-300 px-2">
                Proceed to Pay
              </button>
              {/* <button className=" py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition duration-300 px-2 w-24">
              <Link to={"/process-checkout"}>
                  Payment
              </Link>
              </button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};  

export default Cart;
