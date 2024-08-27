import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Shop from '../shop/Shop';
import BookCards from './BookCards';
import { AuthContext } from '../context/AuthProvider';

const BookCategories = () => {

  const user = useContext(AuthContext);

  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [flag,setFlag] = useState(false);
  const bookCategories = [
    "Fiction", "Mystery", "Programming", "Science Fiction", "Fantasy", "Horror", "Bibliography", "Autobiography", "History", "Self-help", "Memoir", "Business", "Children Books", "Travel", "Religion", "Art And Design"
  ];

  const token = localStorage.getItem('access-token');

  const fetchBooksByCategory = async (category) => {
    try {
      const response = await fetch(`https://book-store-api-theta.vercel.app/all-books/bycategory/?category=${category}`, {
        headers : {
            "authorization": `Bearer ${token}`
        }
    });
      if (!response.ok) {
        throw new Error('Error fetching books by category');
      }
      const data = await response.json();
      setBooks(data);
      setSelectedCategory(category);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleClick = (category) => {
    fetchBooksByCategory(category);
    setFlag(true);
  };

  return (
    <div className='pt-12 mx-5'>
      
      <div className='w-full mt-12'>
            <input
              type="search" name='search-input'
              placeholder='Search a book'
              className='py-2 px-2 rounded-s-sm outline-none xl:w-full lg:w-5/6 md:w-4/6 w-3/6 text-center ml-10'
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
      <h2 className='my-2 mt-5 bg-black text-center text-white text-2xl p-2 pb-2 h-12'>Available Categories</h2>
      <ul className='flex flex-wrap justify-center'>
        {bookCategories.map(category => (
          <li key={category} className={` border-dotted mx-4 my-2 px-4 py-2 rounded-full bg-gray-300 hover:bg-gray-500 hover:text-white transition-colors duration-300 ${selectedCategory === category ? ' text-white bg-lime-500' : 'text-black'}`}>
            <Link to="#" onClick={() => handleClick(category)}>
              {category}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className='my-2 mt-5 bg-black text-center text-white text-2xl p-2 h-12'>Books{selectedCategory && ` in ${selectedCategory}`}</h2>
      {!flag && (
        <div>
          <br />
          <h4 className='text-center font-serif text-red-500'>Select one category to view the available books !</h4>
        </div>
      )}
      <BookCards books={books} user={user.user} /> {/* Pass books state as prop */}
      {flag && (
        <div className="text-center font-bold text-gray-500">
          {books.length === 0 && "No Books Available in this category!"}
          <Shop showSearchBox/>
        </div>
      )}
      {/* {books.length > 0 && <Shop />} Conditionally render Shop component when books are loaded */}
    </div>
  );
};

export default BookCategories;
