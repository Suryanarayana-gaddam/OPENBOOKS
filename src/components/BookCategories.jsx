import { useContext, useState } from 'react';
import Shop from '../shop/Shop';
import BookCards from './BookCards';
import { AuthContext } from '../context/AuthProvider';
import Search from './Search';

const BookCategories = () => {

  const user = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
       
      <Search/>
      <h2 className='my-2 mt-5 bg-black text-center  text-white text-2xl p-2 pb-2 h-12'>Available Categories</h2>
      <ul className='flex flex-wrap justify-center'>
        {bookCategories.map(category => (
          <li key={category} className={` border-dotted mx-4 my-2 px-4 py-2 rounded-full hover:text-white hover:scale-110 transition-colors duration-300 ${selectedCategory === category ? ' text-white bg-blue-700 scale-110 hover:bg-lime-500 font-semibold' : 'text-black hover:bg-gray-500 bg-gray-300'}`}>
            <button onClick={() => handleClick(category)}>
              {category}
            </button>
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
      <BookCards books={books} user={user.user} isAutoPlay={true} isDynamicPagination={true}/> {/* Pass books state as prop */}
      {flag && (
        <div className="text-center font-bold text-gray-500">
          <div className='relative bottom-16'>{books.length === 0 && "No Books Available in this category!"}</div>
          <Shop showSearchBox={false}/>
        </div>
      )}
    </div>
  );
};

export default BookCategories;
