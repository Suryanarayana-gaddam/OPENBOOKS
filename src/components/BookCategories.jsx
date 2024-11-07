import { useContext, useEffect, useState } from 'react';
import Shop from '../shop/Shop';
import BookCards from './BookCards';
import { AuthContext } from '../context/AuthProvider';
import Cards from './Cards';
import axios from 'axios';
import Loading from './Loading';

const BookCategories = () => {

  const user = useContext(AuthContext);
  const [load,setLoad] = useState(false);
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const bookCategories = [
    "Fiction", "Mystery", "Programming", "Science Fiction", "Fantasy", "Horror", "Bibliography", "Autobiography", "History", "Self-help", "Memoir", "Business", "Children Books", "Travel", "Religion", "Art And Design"
  ];

  const [allBooks,setAllBooks] = useState([]);
  const token = localStorage.getItem('access-token');
  useEffect(() => {
    axios.get("https://book-store-api-theta.vercel.app/all-books", {
      headers : {
          "authorization": `Bearer ${token}`
      }
    })
      .then((response) => {setAllBooks(response.data);})
      .catch((err) =>{
        throw new err;
      })
  }, [token]);

  // const fetchBooksByCategory = (category) => {
  //   setBooks(allBooks.filter(item => item.category === category));
  //   setTimeout(() => setLoad(false),3000)
  // };
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
    } catch (error) {
      console.error('Error:', error.message);
    }finally{
      setTimeout(() => setLoad(false),1000)
    }
  };

  const handleClick = (e,category) => {
    e.preventDefault();
    setLoad(true);
    setSelectedCategory(category);
    fetchBooksByCategory(category);    
  };

  if(load){
    return <Loading />
  }

  return (
    <div className='pt-[70px] pb-10 mx-5'>
      <h2 className='my-2 mt-5 bg-black text-center  text-white text-2xl p-2 pb-2 h-12'>Available Categories</h2>
      <ul className='flex flex-wrap justify-center'>
        {bookCategories.map(category => (
          <li key={category} className={` border-dotted mx-4 my-2 px-4 py-2 rounded-full hover:text-white hover:scale-110 transition-colors duration-300 ${selectedCategory === category ? ' text-white bg-blue-700 scale-110 hover:bg-lime-500 font-semibold' : 'text-black hover:bg-gray-500 bg-gray-300'}`}>
            <button onClick={(e) => handleClick(e,category)}>
              {category}
            </button>
          </li>
        ))}
      </ul>
      <h2 className='my-2 mt-5 bg-black text-center text-white text-2xl p-2 h-12'>Books{selectedCategory && ` in ${selectedCategory}`}</h2>

      {/* <BookCards books={books} user={user.user} isAutoPlay={true} isDynamicPagination={true}/> Pass books state as prop */}
      
      {/* <Shop showSearchBox={false}/> */}
      {selectedCategory ?
          (<div>
            <div className='text-center'>{books.length === 0 && "No Books Available in this category!"}</div>
            <Cards booksTodisplay={books}/>
            <div>
              <h2 className="text-3xl relative bg-red-300 p-1 rounded top-10 text-center text-bold text-black ">
              All Books Here
              </h2>
              <BookCards books={allBooks} user={user.user} isStyles={`lg:px-10 relative top-10 px-0 py-0`} isPadforNav="0px 45px 0px" isAutoPlay={true} isDynamicPagination={true}/>
            </div>
          </div>)
          :
          (<div>
            <br />
            <h4 className='text-center font-serif text-red-500'>Select one category to view the available books !</h4>
          </div>)
      } 
    </div>
  );
};

export default BookCategories;
