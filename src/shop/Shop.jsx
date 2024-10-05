import { useContext, useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaCartShopping, FaHeart } from "react-icons/fa6";
import { AuthContext } from "../context/AuthProvider";
import useUser from "../../hooks/useUser";
import Pagination from "../components/Pagination";
import { CRUDContext } from "../context/CRUDProvider";
import Search from "../components/Search";

const Shop = ({showSearchBox=true}) => {
  const [books, setBooks] = useState([]);
  const [indexOfFirstBook,setIndexOfFirstBook] = useState(null);
  const [currentBooks,setCurrentBooks] = useState([]); 
  const [userId,setUserId] = useState();
  const [userData,refetch] = useUser();
  const {addToWishlist, removeFromWishlist, addToCart, removeFromCart} = useContext(CRUDContext);
  const user = useContext(AuthContext);
    
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [cartBooks, setCartBooks] = useState([]);
  const token = localStorage.getItem('access-token');

  const setItemsDetails = (x) => {
    setCurrentBooks(x);
  }
  const setIndexBook = (y) => {
    setIndexOfFirstBook(y);
  }

  useEffect(() => {
    fetch("https://book-store-api-theta.vercel.app/all-books", {
      headers : {
          "authorization": `Bearer ${token}`
      }
  })
    .then((res) => res.json())
    .then((data) => setBooks(data));
    if (userData && userData.wishlist && userData.cart ) {
      setUserId(userData._id)
      setCartBooks(userData.cart)
      setWishlistBooks(userData.wishlist.reverse())
    }
    refetch()
    }, [user,userData,token]);
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

  const handleBuyCart = (event,book) => {
    event.preventDefault();
    if (!book) {
        console.error("Book object is undefined");
        return;
    }
    if (!isBookInCart(book)) {
      addToCart(book);
      refetch();
    }
  };

  return (
    <div className={`px-4 lg:px-24 ${showSearchBox ? "mt-24 mb-10" : "relative bottom-12"}`}>
      <h2 className="text-3xl text-center text-bold text-black ">
        All Books Here
      </h2>
      {showSearchBox && (
        <Search/>
      )}

      {/* Cards */}
      {
        books && Array.isArray(books) && books.length > 0 ? (
          <div className={`${!showSearchBox ? "mt-12" : ""}`}>
            <div className="grid gap-4 lg:max-w-[1100px] sm:max-w-[630px] md:max-w-[800px] my-10 lg:grid-cols-6 sm:grid-cols-3 md:grid-cols-4 grid-cols-2 p-0">
              { currentBooks && currentBooks.map((book) => (
                <Card key={book._id} className="p-0 m-0 ">
                  <Link to={`/book/${book._id}`}>
                    <div className='relative text-center'>
                                    <img src={book.imageURL} alt="" className="w-full h-full object-cover"/>
                                    <button onClick={event => handleCart(event, book)} className={`absolute top-2 right-2  bg-white p-2 rounded-full transition-none ${
                                      isBookInCart(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
                                    }`}
                                    >
                                        <FaCartShopping className='w-5 h-5 '/>
                                    </button>
                                    <br />
                                    <button
                                    onClick={event => handleWishlist(event, book)}
                                    className={`absolute top-12 right-2 bg-white hover:bg-white p-2 rounded-full transition-none ${
                                      isBookInWishlist(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
                                    }`}                                 
                                  >
                                    <FaHeart className=" mt-0 w-5 h-5" />
                                  </button>
                                </div>
                    <h3 className=" font-bold w-[140px] h-[15px] text-sm tracking-tight text-gray-900 dark:text-white">
                      {book.bookTitle}
                    </h3><br />
                    <span className="font-medium text-gray-700 dark:text-gray-400">
                      {book.description}
                    </span>
                    <span className="font-normal text-gray-700 dark:text-gray-400">
                      ₹{book.bookPrice}
                    </span>
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
            <Pagination setItemsDetails={setItemsDetails} setIndexBook={setIndexBook} itemsPerPage={24} maxPageNumbers={10} inputArrayItems={books}/>
          </div>
        ) : (
          <p className='text-center mt-20'>Currently No Books Avialable !</p> 
        )
      }
    </div>
  );
};

export default Shop;








