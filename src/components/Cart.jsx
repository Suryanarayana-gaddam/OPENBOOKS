import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { motion } from 'framer-motion'; 
import { Link } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import BookCards from './BookCards';
import { CRUDContext } from '../context/CRUDProvider';

const Cart = () => {
  const [cartBooks, setCartBooks] = useState([]);
  const [books,setBooks] = useState([]);
  const [userId,setUserId] = useState(null);
  const [userName,setUserName] = useState(null);
  
  const token = localStorage.getItem('access-token');
  const headLine = "My Cart";
  const [userData,refetch] = useUser();
  
  const user = useContext(AuthContext);
  const {removeFromCart,clearCart} = useContext(CRUDContext);
  useEffect(() => {
      setUserId(userData._id);
      setUserName(userData.username);

      const fetchBooks = async () => {
        try {
          const response = await fetch("https://book-store-api-theta.vercel.app/all-books", {
            headers: {
              "authorization": `Bearer ${token}`
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

      if(userData && userData.cart){
      setCartBooks(userData.cart.reverse())
      }
      
  }, [user,userData,token]);

  const handleRemoveFromCart = (event,book) => {
    event.preventDefault();
    const bookId = book._id;
        removeFromCart(bookId);
        refetch();
  }

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
            "authorization": `Bearer ${token}`
          },
          body: JSON.stringify(orderObj)
        }).then(res => res.json()).then(data => {
          emptyCart();
          refetch();
        })
        .catch(error => {
          console.error("Error:", error);
        });
    })
  };
  
  const emptyCart = () => {
    clearCart()
    setCartBooks([]);
    refetch() 
  };

  return (
    <div className="container mx-auto px-4 mt-16">
          <h2 className='text-3xl text-center text-bold text-black my-5'>{headLine}</h2>
      <div>
        {cartBooks && cartBooks.length === 0 ? (
          <div className='lg:px-14 text-center'>
          <p className='px-4 lg:px-24 text-1xl text-center my-3'>Your Cart was Empty!</p>
          <Link to="/orders" className='text-center'><button className='text-white bg-blue-500 border-solid mt-5 p-3'>Go To Orders</button></Link>
          <h1 className='text-center text-3xl relative top-8'>Suggested Books </h1>
          <BookCards books={books} user={user.user} className=''/>
        </div> 
        ) : (
          <div className='p-10 mb-5'>
            {cartBooks && cartBooks.map(book => (
              <motion.div
                key={book._id}
                className="bg-white rounded-lg overflow-hidden shadow-md mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="md:flex items-center justify-evenly lg:px-24 md:px-36 sm:px-52 p-2">
                <div className='flex justify-center'>
                <Link to={`/book/${book._id}`}> 
                <img src={book.imageURL} alt={book.bookTitle} className="md:w-36 lg:w-32 h-full w-32 object-cover cursor-pointer" />
              </Link>
                </div>
                  <div className="flex-grow px-4 lg:ml-32">
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
                  <div className="flex justify-center pt-1 items-center space-x-2">
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
