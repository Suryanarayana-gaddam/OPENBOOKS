import { useState } from 'react'
import { BiSearch } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const Search = ({inputStyles, searchStyles, searchIconStyles, styles}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const checkQuery = (e) => {
        if(!searchQuery){
            alert("Search input cant be empty!");
        }
    }
  return (
    <div className={`${ styles ? styles : 'hidden md:block '} w-full mt-12`}>
            <input
              type="search" name='search-input'
              autoComplete='off'
              placeholder='Search a book'
              className={`${ !inputStyles ? "py-2 px-2 rounded-s-lg outline-none xl:w-[88%] lg:w-[87%] md:w-[85%] w-4/6 text-center md:ml-6 lg:ml-10" : inputStyles}`}
              value={searchQuery} required
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Link to={`${searchQuery ? `/books/searchedbooks?query=${encodeURIComponent(searchQuery)}` : "#"}`}>
              <button
              onClick={checkQuery} type='button'
                className={` ${!searchStyles ? 'bg-blue-700 px-4 py-[9px] relative top-[5px] h-[42px] hover:scale-100  text-white font-medium rounded-e-lg hover:bg-black transition ease-in duration-200' : searchStyles}`}
              >
                <BiSearch className={`${ searchIconStyles ? searchIconStyles : "size-6 hover:animate-bounce"}`}/> 
              </button>
            </Link>
          </div>
  )
}

export default Search
