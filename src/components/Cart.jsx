import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { motion } from 'framer-motion'; // For animations
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';

const Cart = () => {
  const [cartBooks, setCartBooks] = useState([]);
  const user = useContext(AuthContext);
  const [bookQuantity, setBookQuantity] = useState(1); // Initialize quantity state

  const token = localStorage.getItem('access-token');
  const headLine = "My Cart";
  
  const [cart,refetch] = useCart();

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
        //console.log("User Data:", userData);
  
        // Get user ID from userData
        const userId = userData._id;
        //console.log(userId);
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
        //console.log("User Data:", userData);
  
        // Get user ID from userData
        const userId = userData._id;
        const bookId = book._id;
        //delete book from the cart
        fetch(`http://localhost:5000/user/${userId}/cart/remove/${bookId}`, {
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
        //console.log("User Data:", userData);
  
        // Get user ID from userData
        const userId = userData._id;
        const username = userData.username;
  
        // // Extract book data from the form
        // const bookId = book._id; 
        // const bookTitle = book.bookTitle; 
        // const authorName = book.authorName;
        // const imageURL = book.imageURL;
        // const category = book.category;
        // const bookDescription = book.bookDescription;
        // const bookPDFURL = book.bookPDFURL;
        // const bookPrice = book.bookPrice;
        // const createrId = book.createrId;
        // const quantity = book.quantity;
        // const totalPrice = cartBooks.reduce((total, book) => total + (book.quantity || 1) * book.bookPrice, 0);

        // Submit each book in the cart individually
    cartBooks.forEach(book => {
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
        fetch(`http://localhost:5000/user/${userId}/add/orders`,{
          method:"POST",
          headers:{
            "Content-type": "application/json",
            authorization: `Bearer ${token}`
          },
          body: JSON.stringify(orderObj)
        }).then(res => res.json()).then(data => {
          //console.log(data);
           //alert("Order Uploaded Successfully!!!");
          // const pdfBlob = book.bookPDFURL.blob();
          // const pdfUrl = URL.createObjectURL(pdfBlob);
          // const a = document.createElement("a");
          // a.href = pdfUrl;
          // a.download = `${book.bookTitle}.pdf`;
          // a.click();
          // URL.revokeObjectURL(pdfUrl);
          //form.reset();
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
  
    // Display loading indicator
    // Optionally, you can use a loading state to indicate that the operation is in progress
  
    try {
      // Fetch user data by email
      const userEmail = user.user.email;
      const userDataResponse = await fetch(`http://localhost:5000/userByEmail/${userEmail}`, {
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
      const removeCartResponse = await fetch(`http://localhost:5000/user/${userId}/cart/removeAll`, {
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
      // Display success message to the user
      //alert("Cart was emptied successfully!");
      
    } catch (error) {
      console.error("Error emptying cart:", error.message);
      // Display an error message to the user indicating that something went wrong
      // Optionally, you can log the error for debugging purposes
    } finally {
      // Hide loading indicator
      // Optionally, you can remove the loading state here
    }
};

  

  return (
    <div className="container mx-auto px-4 lg:px-24 mt-16">
          <h2 className='text-5xl text-center text-bold text-black my-5'>{headLine}</h2>
      <div>
        {cartBooks.length === 0 ? (
          <p className='px-4 lg:px-24 text-2xl text-center my-3'>Your Cart was Empty!</p>
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
