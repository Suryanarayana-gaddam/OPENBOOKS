import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { motion } from 'framer-motion'; 
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import BookCards from './BookCards';

const Cart = () => {
  const [cartBooks, setCartBooks] = useState([]);
  const [books,setBooks] = useState([]);
  const [userId,setUserId] = useState(null);
  const [userName,setUserName] = useState(null);
  
  const token = localStorage.getItem('access-token');
  const headLine = "My Cart";
  const [cart,refetch] = useCart();
  
  const user = useContext(AuthContext);
  const userEmail = user?.user?.email;
  console.log("User :",userEmail)

  useEffect(() => {

    fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
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
      setUserId(userData._id);
      setUserName(userData.username);
    })

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

    const GetCart = (() => {
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
          });
        }
        return res.json();
      })
      .then(data => setCartBooks(data.reverse()))
      
      .catch(error => {
        console.error("Error:", error);
      });
    })
    GetCart();

  }, [user,token,userName,userId]);

  const handleRemoveFromCart = (event,book) => {
    event.preventDefault();
    const bookId = book._id;
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

  const increaseQuantity = (bookId) => {
    setCartBooks(prevCartBooks =>
      prevCartBooks.map(book =>
        book._id === bookId ? { ...book, quantity: (book.quantity || 1) + 1 } : book
      )
    );
    refetch();
  };

  const decreaseQuantity = (bookId) => {
    setCartBooks(prevCartBooks =>
      prevCartBooks.map(book =>
        book._id === bookId && (book.quantity || 1) > 1 ? { ...book, quantity: (book.quantity || 1) - 1 } : book
      )
    );
    refetch();
  };

  const handleOrderSubmit = (event) => {
    event.preventDefault();
    cartBooks.map(book => {
      const orderObj = {
        userId:userId,
        username:userName,
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
    });
  };
  
  const emptyCart = async () => {
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
    setCartBooks([]);
    refetch() 
  };

  return (
    <div className="container mx-auto px-4 mt-16">
          <h2 className='text-3xl text-center text-bold text-black my-5'>{headLine}</h2>
      <div>
        {cartBooks.length === 0 ? (
          <div className='lg:px-14 text-center'>
          <p className='px-4 lg:px-24 text-1xl text-center my-3'>Your Cart was Empty!</p>
          <Link to="/orders" className='text-center'><button className='text-white bg-blue-500 border-solid mt-5 p-3'>Go To Orders</button></Link>
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
                <Link to={`/book/${book._id}`}> 
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
              <p className="text-lg font-bold">Total Price: ₹{cartBooks.reduce((total, book) => total + (book.quantity || 1) * book.bookPrice, 0)}</p>
              <button onClick={(event) => handleOrderSubmit(event)} className=" py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition duration-300 px-2">
                Proceed to Pay
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};  

export default Cart;
