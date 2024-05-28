// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import BookList from './BookList'; // Import the BookList component
// import Shop from '../shop/Shop';

// const BookCategories = () => {
//   const [books, setBooks] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const bookCategories = [
//     "Fiction", "Non-Fiction", "Mystery", "Programming", "Science Fiction", "Fantasy", "Horror", "Bibliography", "Autobiography", "History", "Self-help", "Memoir", "Business", "Children Books", "Travel", "Religion", "Art And Design"
//   ];

//   const fetchBooksByCategory = async (category) => {
//     try {
//       console.log('Fetching books for category:', category);
//       const response = await fetch(`http://localhost:5000/all-books?category=${category}`);
//       if (!response.ok) {
//         throw new Error('Error fetching books by category');
//       }
//       const data = await response.json();
//       console.log('Fetched books:', data); // Add this line to log the fetched books
//       setBooks(data);
//       setSelectedCategory(category);
//     } catch (error) {
//       console.error('Error:', error.message);
//     }
//   };

//   const handleClick = (category) => {
//     fetchBooksByCategory(category);
//   };

//   return (
//     <div className='pt-12 mx-5'>
//       <h2 className='my-2 mt-5 bg-black text-center text-white text-2xl p-2 h-12'>Categories</h2>
//       <ul className='flex flex-wrap justify-center'>
//         {bookCategories.map(category => (
//           <li key={category} className={` border-dotted mx-4 my-2 px-4 py-2 rounded-full bg-gray-300 hover:bg-gray-500 hover:text-white transition-colors duration-300 ${selectedCategory === category ? ' text-white bg-lime-500' : 'text-black'}`}>
//             <Link to="#" onClick={() => handleClick(category)}>
//               {category}
//             </Link>
//           </li>
//         ))}
//       </ul>
//       <h2 className='my-2 mt-5 bg-black text-center text-white text-2xl p-2 h-12'>Books</h2>
//       <BookList books={books}  /> {/* Pass books state as prop */}
//       {<BookList/> ? <Shop/> : " "}
//     </div>
//   );
// };

// export default BookCategories;














// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import BookList from './BookList'; // Import the BookList component

// const BookCategories = () => {
//   const [books, setBooks] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const bookCategories = [
//     "Fiction", "Non-Fiction", "Mistery", "Programming", "Science Fiction", "Fantasy", "Horror", "Bibliography", "Autobiography", "History", "Self-help", "Memoir", "Business", "Children Books", "Travel", "Religion", "Art And Design"
//   ];

//   const fetchBooksByCategory = async (category) => {
//     try {
//       console.log('Fetching books for category:', category);
//       const response = await fetch(`http://localhost:5000/all-books?category=${category}`);
//       if (!response.ok) {
//         throw new Error('Error fetching books by category');
//       }
//       const data = await response.json();
//       console.log('Fetched books:', data); // Add this line to log the fetched books
//       setBooks(data);
//       setSelectedCategory(category);
//     } catch (error) {
//       console.error('Error:', error.message);
//     }
//   };
  

//   const handleClick = (category) => {
//     fetchBooksByCategory(category);
//   };

//   return (
//     // <div className='pt-12 mx-5'>
//     //   <h2 className=' my-2 mt-5 bg-black text-center text-white text-2xl p-2 h-12'>Categories</h2>
//     //   <ul>
//     //     {bookCategories.map(category => (
//     //       <li key={category} className='bg-gray-400 w-16 p-2'>
//     //         <Link to="#" onClick={() => handleClick(category)}>
//     //           {category}
//     //           <p ></p>
//     //         </Link>
//     //       </li>
//     //     ))}
//     //   </ul>
//     //   <h2 className=' my-2 mt-5 bg-black text-center text-white text-2xl p-2 h-12'>Books</h2>
//     //   <BookList books={books} /> {/* Pass books state as prop */}
//     // </div>
  
  
//     // <div className="container mx-auto px-4 py-8">
//     //   <h2 className="text-2xl font-bold text-center mb-6">Categories</h2>
//     //   <div className="flex flex-wrap justify-center gap-4">
//     //     {bookCategories.map(category => (
//     //       <button
//     //         key={category}
//     //         className={`px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${
//     //           selectedCategory === category ? 'bg-gray-400 text-white' : 'text-gray-700'
//     //         }`}
//     //       >
//     //          <Link to="#" onClick={() => handleClick(category)}>
//     //            {category}
//     //             <p ></p>
//     //          </Link>
//     //         {category}
//     //       </button>
//     //     ))}
//     //   </div>
//     //   <h2 className="text-2xl font-bold text-center mt-8">Books</h2>
//     //   <BookList books={books} />
//     // </div>
  



//   );
// };

// export default BookCategories;
// // import React, { useState } from 'react';
// // import { Link } from 'react-router-dom';

// // const BookCategories = () => {
// //   const [books, setBooks] = useState([]);
// //   const [selectedCategory, setSelectedCategory] = useState(null);
// //   const bookCategories = [
// //     "Fiction", "Non-Fiction", "Mistery", "Programming", "Science Fiction", "Fantasy", "Horror", "Bibliography", "Autobiography", "History", "Self-help", "Memoir", "Business", "Children Books", "Travel", "Religion", "Art And Design"
// //   ];

// //   const fetchBooksByCategory = async (category) => {
// //     try {
// //       console.log('Fetching books for category:', category);
// //       const response = await fetch(`http://localhost:5000/all-books?category=${category}`);
// //       if (!response.ok) {
// //         throw new Error('Error fetching books by category');
// //       }
// //       const data = await response.json();
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
// //     <div>
// //       <h2>Categories</h2>
// //       <ul>
// //         {bookCategories.map(category => (
// //           <li key={category}>
// //             <Link to="#" onClick={() => handleClick(category)}>
// //               {category}
// //             </Link>
// //           </li>
// //         ))}
// //       </ul>
// //       <h2>Books</h2>
// //       <ul>
// //         {selectedCategory && books.map(book => (
// //           <li key={book._id}>
// //             {book.title} by {book.author}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default BookCategories;



// // import React, { useState } from 'react';
// // import { Link } from 'react-router-dom';

// // const BookCategories = () => {
// //   const [books, setBooks] = useState([]);
// //   const [selectedCategory, setSelectedCategory] = useState(null);
// //   const bookCategories = [
// //     "Fiction","Non-Fiction","Mistery","Programming","Science Fiction","Fantasy","Horror","Bibliogarphy","Autobiography","History","Self-help","Memoir","Business","Children Books","Travel","Religion","Art And Design"
// //   ]
// //   const fetchBooksByCategory = async (category) => {
// //     try {
// //       console.log('Fetching books for category:', category);
// //       const response = await fetch(`/books/${category}`);
// //       if (!response.ok) {
// //         throw new Error('Error fetching books by category');
// //       }
// //       const data = await response.json();
// //       setBooks(data);
// //       setSelectedCategory(category);
// //     } catch (error) {
// //       console.error('Error:', error.message);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Categories</h2>
// //       <ul>
// //         {bookCategories.map(category => (
// //           <li key={category}>
// //             <Link to="/" onClick={() => fetchBooksByCategory(category)}>
// //               {category}
// //             </Link>
// //           </li>
// //         ))}
// //       </ul>
// //       <h2>Books</h2>
// //       <ul>
// //         {selectedCategory && books.map(book => (
// //           <li key={book._id}>
// //             {book.title} by {book.author}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default BookCategories;
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
//import BookList from './BookList'; // Import the BookList component
import Shop from '../shop/Shop';
import BookCards from './BookCards';
import { AuthContext } from '../context/AuthProvider';


const BookCategories = () => {

  const user = useContext(AuthContext);

  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const bookCategories = [
    "Fiction", "Non-Fiction", "Mystery", "Programming", "Science Fiction", "Fantasy", "Horror", "Bibliography", "Autobiography", "History", "Self-help", "Memoir", "Business", "Children Books", "Travel", "Religion", "Art And Design"
  ];

  const token = localStorage.getItem('access-token');

  const fetchBooksByCategory = async (category) => {
    try {
      //('Fetching books for category:', category);
      const response = await fetch(`https://book-store-api-theta.vercel.app/all-books/bycategory/?category=${category}`, {
        headers : {
            authorization: `Bearer ${token}`
        }
    });
      if (!response.ok) {
        throw new Error('Error fetching books by category');
      }
      const data = await response.json();
      //console.log('Fetched books:', data); // Add this line to log the fetched books
      setBooks(data);
      setSelectedCategory(category);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleClick = (category) => {
    fetchBooksByCategory(category);
  };

  return (
    <div className='pt-12 mx-5'>
      
      <div className='w-full mt-12'>
            <input
              type="text"
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
      <h2 className='my-2 mt-5 bg-black text-center text-white text-2xl p-2 pb-2 h-12'>Categories</h2>
      <ul className='flex flex-wrap justify-center'>
        {bookCategories.map(category => (
          <li key={category} className={` border-dotted mx-4 my-2 px-4 py-2 rounded-full bg-gray-300 hover:bg-gray-500 hover:text-white transition-colors duration-300 ${selectedCategory === category ? ' text-white bg-lime-500' : 'text-black'}`}>
            <Link to="#" onClick={() => handleClick(category)}>
              {category}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className='my-2 mt-5 bg-black text-center text-white text-2xl p-2 h-12'>Books</h2>
      <p className='text-center font-bold text-gray-500 mt-'>{books.length == 0 && "No Books Available in this category!"}<Shop /></p>
      <BookCards books={books} user={user.user} /> {/* Pass books state as prop */}
      {/* {books.length > 0 && <Shop />} Conditionally render Shop component when books are loaded */}
    </div>
  );
};

export default BookCategories;
