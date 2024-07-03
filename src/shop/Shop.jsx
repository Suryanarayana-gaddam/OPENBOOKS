import React, { useContext, useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaCartShopping, FaHeart } from "react-icons/fa6";
import { AuthContext } from "../context/AuthProvider";
import useUser from "../../hooks/useUser";

const Shop = ({showSearchBox}) => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  const maxPageNumbers = 10; 
  const [userId,setUserId] = useState();
  const [userData,refetch] = useUser();

  const [searchQuery, setSearchQuery] = useState('');

  const user = useContext(AuthContext);
    
    const [wishlistBooks, setWishlistBooks] = useState([]);
    const [cartBooks, setCartBooks] = useState([]);
    const token = localStorage.getItem('access-token');

  useEffect(() => {
    fetch("https://book-store-api-theta.vercel.app/all-books", {
      headers : {
          authorization: `Bearer ${token}`
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
    }, [user,userData,currentPage,token]);
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
    //console.log(bookId);
    if (!isBookInWishlist(book)) {
      // Add book to the wishlist
      fetch(`https://book-store-api-theta.vercel.app/user/${userId}/wishlist/add`,{
        method:"POST",
        headers:{
          "Content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify(book) // Stringify the book object before sending
      }).then(res => res.json()).then(data => {
        //alert("Book Uploaded to wishlist Successfully!!!");
        setWishlistBooks([...wishlistBooks, book]); // Update wishlistBooks state
        refetch()
      })
      .catch(error => {
        console.error("Error:", error);
        // Handle unexpected errors
      });
      
    } else {
        // Remove book from wishlist
        //console.log(bookId);
        fetch(`https://book-store-api-theta.vercel.app/user/${userId}/wishlist/remove/${bookId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({bookId: book._id}),
      })
      .then(res => res.json())
      .then(data => {
        //console.log(data);
        //alert("Book removed from wishlist successfully!");
          // Update wishlistBooks state by filtering out the removed book
        setWishlistBooks(wishlistBooks.filter(wishlistBook => wishlistBook._id !== book._id));
        refetch()
      })
      .catch(error => {
        console.error("Error:", error);
        // Handle unexpected errors
      });
    }
  };

  const handleCart = (event,book) => {
    event.preventDefault();
    if (!book) {
        console.error("Book object is undefined");
        return;
    }
    const bookId = book._id;
    //console.log(bookId);
    if (!isBookInCart(book)) {
      // Add book to the wishlist
      fetch(`https://book-store-api-theta.vercel.app/user/${userId}/cart/add`,{
        method:"POST",
        headers:{
          "Content-type": "application/json",
          authorization: `Bearer ${token}`
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
          authorization: `Bearer ${token}`
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
  };

  const handleBuyCart = (event,book) => {
    event.preventDefault();
    if (!book) {
        console.error("Book object is undefined");
        return;
    }
    if (!isBookInCart(book)) {
      // Add book to the wishlist
      fetch(`https://book-store-api-theta.vercel.app/user/${userId}/cart/add`,{
        method:"POST",
        headers:{
          "Content-type": "application/json",
          authorization: `Bearer ${token}`
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
    }
  };

  // Logic to paginate books
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // Calculate total number of pages
  const totalPages = Math.ceil(books.length / booksPerPage);

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    // Adjust startPage when near the end of totalPages
    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }

  let pageNumbers = Array.from({ length: (endPage - startPage) + 1 }, (_, index) => startPage + index);


  // Include multiples of 50
  const multiplesOf50 = Array.from({ length: Math.ceil(totalPages / 50)-1 }, (_, index) => (index + 1) * 50);
  pageNumbers = [...pageNumbers.filter(num => !multiplesOf50.includes(num)), ...multiplesOf50];

  // Add last page if it's not already included
  if (!pageNumbers.includes(totalPages)) {
    pageNumbers.push(totalPages);
  }
  if (!pageNumbers.includes(1)) {
    pageNumbers.unshift(1);
  }

  return pageNumbers.sort((a, b) => a - b);
};

const paginate = (pageNumber) => {
  setCurrentPage(pageNumber);
};

const goToPreviousPage = () => {
  setCurrentPage((prevPage) => prevPage - 1);
};

const goToNextPage = () => {
  setCurrentPage((prevPage) => prevPage + 1);
};

  return (
    <div className="px-4 my-24 lg:px-24">
      <h2 className="text-3xl text-center text-bold text-black ">
        All Books Here
      </h2><br />
      {showSearchBox && (
        <div className='w-full text-center'>
        <input
          type="search" name="search-input"
          placeholder='Search a book'
          className='py-2 px-2 rounded-s-sm outline-none lg:w-5/6 md:w-4/6 sm:w-4 text-center ml-10'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Link to={`/books/searchedbooks?query=${encodeURIComponent(searchQuery)}`}>
          <button
            className='bg-blue-700 px-6 py-2 text-white lg:w-24 md:w-24 sm:w-8 font-medium hover:bg-black transition-all ease-in duration-200'
          >
            Search
          </button>
        </Link>
      </div>
      )}

      {/* Cards */}
      <div className="mt-12">
        <div className="grid gap-4 lg:w-[1100px] sm:w-[220px] md:w-[800px] my-10 lg:grid-cols-5 sm:grid-cols-2 md:grid-cols-4 grid-cols-2 p-0">
          { currentBooks && currentBooks.map((book) => (
            <Card key={book._id} className="p-0 m-0 ">
              <Link to={`/book/${book._id}`}>
                {/* <img
                  src={book.imageURL}
                  alt=""
                  className="w-full max-w-full h-auto"
                /> */}
                <div className='relative text-center'>
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
      </div>


      {/* Pagination buttons at the bottom */}
      <div className={`flex justify-around mt-8 w-auto ${ books.length>10 ? "block" : "hidden"}`}>
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
          {getPageNumbers().map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-full ${
                currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'
              } mr-2`}
            >
              {number}
            </button>
          ))}
        </div>
        <div>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 rounded-full bg-blue-500 text-white ml-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shop;









// import React, { useEffect, useState } from "react";
// import { Card } from "flowbite-react";
// import { Link } from "react-router-dom";

// const Shop = () => {
//   const [books, setBooks] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/all-books")
//       .then(res => res.json())
//       .then(data => setBooks(data));
//   }, []);

//   return (
//     <div className="mt-20 px-4 lg:px-24">
//       <h2 className="text-5xl font-bold text-center">All Books are Here</h2>

//       <div className="grid gap-4 w-[1100px] my-10 lg:grid-cols-5 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 p-0">
//         {books.map(book => (
//           <Card key={book._id} className="p-0 w-fit">
//             <Link to={`/book/${book._id}`}>
//               <img src={book.imageURL} alt="" className="w-full" />
//               <h3 className=" font-bold tracking-tight text-gray-900 dark:text-white">
//                 {book.bookTitle}
//               </h3>
//               <p className="font-medium text-gray-700 dark:text-gray-400">
//                 {book.description}
//               </p>
//               <p className="font-normal text-gray-700 dark:text-gray-400">
//                 ₹{book.bookPrice}
//               </p>
//               <button className="bg-blue-700 font-semibold text-white py-2 rounded w-full">
//                 Buy Now
//               </button>
//             </Link>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Shop;




// // import React, { useEffect, useState } from "react";
// // import { Card } from "flowbite-react";

// // const shop = () => {
// //   const [books, setBooks] = useState([]);

// //   useEffect( () => {
// //     fetch("http://localhost:5000/all-books").then (res => res.json()).then(data => setBooks(data));
// //   },[])
// //   return (
// //     <div className="mt-28 px-4 lg:px-24">
// //       <h2 className="text-5xl font-bold text-center">All Books are Here</h2>

// //       <div className="grid gap-8 my-12 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1">
// //         {
// //           books.map(book => <Card
// //             >
// //               <img src={book.imageURL} alt="" className='h-96'/>
// //               <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
// //                 <p> {book.bookTitle}</p>
// //               </h5>
// //               <p className="font-normal text-gray-700 dark:text-gray-400">
// //                 Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
// //               </p>
// //               <button className='bg-blue-700 font-semibold text-white py-2 rounded'>Buy Now</button>
// //             </Card>
// //             )
// //         }
// //       </div>

// //     </div>
// //   )
// // }

// // export default Shop