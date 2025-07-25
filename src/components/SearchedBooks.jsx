import { useContext, useEffect, useState } from 'react';
import { FaCartShopping, FaHeart} from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

import { Card } from 'flowbite-react';
import useUser from '../../hooks/useUser';
import Pagination from './Pagination';
import { CRUDContext } from '../context/CRUDProvider';
import Search from './Search';
import Loading from './Loading';
import { BiArrowBack } from 'react-icons/bi';

const SearchedBooks = () => {
  const {user} = useContext(AuthContext);

  const [userData,refetch] = useUser();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');
  const [userId, setUserId] = useState(null);

  const [searchedBooks, setSearchedBooks] = useState([]);
  const [indexOfFirstBook,setIndexOfFirstBook] = useState(null);
  const [currentBooks,setCurrentBooks] = useState([]);    
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [cartBooks, setCartBooks] = useState([]);
  const {addToWishlist, removeFromWishlist, addToCart, removeFromCart} = useContext(CRUDContext);
  const token = localStorage.getItem('access-token');
  const [loading, setLoading] = useState(true);
  const setItemsDetails = (x) => {
    setCurrentBooks(x);
  }
  const setIndexBook = (y) => {
    setIndexOfFirstBook(y);
  }  

  useEffect(() => {
    if (!user) return;
    if (userData && userData.wishlist && userData.cart) {
      setUserId(userData._id)
      setCartBooks(userData.cart)
      setWishlistBooks(userData.wishlist)
    }
    refetch()
    
    if (query) {
      fetch(`https://book-store-api-theta.vercel.app/all-books/searchedbooks?query=${encodeURIComponent(query)}`, {
        headers : {
            "authorization": `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {
          setSearchedBooks(data);
          
        })
        .catch(error => {
          console.error('Error fetching searched books:', error);
        });
    }
    setTimeout(() => {
      setLoading(false)
    }, 2000);
  }, [query,user,userData,token]);

  if(loading){
    return <Loading/>
  }

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
      // refetch();
    } else {
      removeFromWishlist(bookId);
      // refetch();
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
      <div className=" relative bottom-[76px] px-4 lg:px-14">
        <br />
          <div className='ml-5 md:ml-10  flex'>
            <Link to="/"><BiArrowBack className='text-black border border-black rounded-full p-1 w-7 h-7 relative top-[65px] right-4 text-2xl'/></Link>
            <Search 
              autofocus={true}
              inputStyles={" relative top-3 rounded-s-md h-[34px] outline-none px-1 xl:w-[88%] lg:w-[87%] md:w-[85%] sm:w-11/12 w-5/6 text-center md:ml-6 lg:ml-10"} 
              searchStyles={" bg-blue-700 px-4 py-[10px] relative top-[12px] w-[32px] h-[35px] hover:scale-100  text-white font-medium rounded-e-md hover:bg-black transition ease-in duration-200"}
              searchIconStyles={"relative right-[9px] bottom-[2px] text-xl"}
              styles={"text-xl"}
            />
          </div>
          <br />
          <h2 className="text-2xl text-center text-bold text-black ">
          Searched Results for &quot;{decodeURIComponent(location.search.slice((location.search.indexOf("=")+1)))}&quot;
        </h2>
        {searchedBooks.length > 0 ? (
        <div className="mt-12">
          <div className="grid gap-4 lg:max-w-[1100px] md:max-w-[760px] sm:max-w-[620px] my-10 lg:grid-cols-5 sm:grid-cols-3 md:grid-cols-4 grid-cols-2 p-0">
            {currentBooks && currentBooks.map((book) => (
              <Card key={book._id} className="">
                <Link to={`/book/${book._id}`}>
                  
                  <div className='relative p-0 h-[200px] mb-1'>
                      <img src={book.imageURL} alt="" className="object-cover h-full w-full"/>
                      <button onClick={event => handleCart(event, book)} className={`absolute top-2 right-2  bg-white p-2 rounded-full ${
                        isBookInCart(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
                      }`}
                      >
                          <FaCartShopping className='w-5 h-5 '/>
                      </button>
                      <br />
                      
                      <button
                      onClick={event => handleWishlist(event, book)}
                      className={`absolute top-12 right-2 bg-white hover:bg-white p-2 rounded-full ${
                        isBookInWishlist(book) ? "text-red-500 bg-white" : "text-gray-400 border-collapse"
                      }`}
                    >
                      <FaHeart className=" mt-0 w-5 h-5" />
                    </button>
                  </div>
                  <div className=''>
                    <h3 className=" font-bold w-[140px] h-auto text-sm tracking-tight text-gray-900 dark:text-white">
                      {book.bookTitle}
                    </h3><br />
                    
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                      ₹{book.bookPrice}
                    </p>
                  
                    {isBookInCart(book) ? (
                      <button className=" text-blue-700 font-semibold bg-white py-2 rounded w-full border-red-400">
                      <Link to={'/cart'}>Go Cart</Link>
                    </button>
                    ) : (
                      <button onClick={event => handleBuyCart(event, book)} className=" bg-blue-700 font-semibold text-white py-2 rounded w-full">
                      <Link to={'/cart'}>Buy Now</Link>
                    </button>
                    )}
                  </div>
                </Link>
              </Card>
            ))}
          </div>
          <Pagination setItemsDetails={setItemsDetails} setIndexBook={setIndexBook} itemsPerPage={10} maxPageNumbers={10} inputArrayItems={searchedBooks}/>
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
