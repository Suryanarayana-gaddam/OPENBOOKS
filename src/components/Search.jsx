import { useState } from 'react'
import { BiSearch } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const checkQuery = (e) => {
        if(!searchQuery){
            alert("Search input cant be empty!");
        }
    }
  return (
    <div className='w-full mt-12'>
            <input
              type="search" name='search-input'
              autoComplete='off'
              placeholder='Search a book'
              className='py-2 px-2 rounded-s-sm outline-none xl:w-10/12 lg:w-5/6 md:w-4/6 w-3/6 text-center ml-10'
              value={searchQuery} required
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Link to={`${searchQuery ? `/books/searchedbooks?query=${encodeURIComponent(searchQuery)}` : "#"}`}>
              <button
              onClick={checkQuery} type='button'
                className='bg-blue-700 px-4 py-[9px] relative top-[5px] hover:scale-100  text-white font-medium hover:bg-black transition ease-in duration-200'
              >
                <BiSearch className='size-6 hover:animate-bounce'/> 
              </button>
            </Link>
          </div>
  )
}

export default Search
