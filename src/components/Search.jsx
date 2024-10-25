import { useState } from 'react'
import { BiSearch } from 'react-icons/bi';
import { FaX } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Search = ({inputStyles, searchStyles, searchIconStyles, styles, books,setBooksFun,setSearchKeyFun,autofocus}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const checkQuery = (e) => {
        if(!searchQuery){
            alert("Search input cant be empty!");
        }
    }
    
    const filterBooks = (e,key) => {
      e.preventDefault();
      setBooksFun(
        books.filter(item => String(Object.values(item)).toLowerCase().includes(String(key).toLowerCase()))
      )
    }

  return (
    
      books && setBooksFun ? 
        (
          <div className={`${ styles ? styles : 'block '} w-full mt-12`}>
            <input
              type="search" name='search-input'
              autoComplete='off'
              placeholder='Search the items below...'
              className={`${ !inputStyles ? "py-2 px-2 rounded-s-lg outline-none xl:w-[88%] lg:w-[87%] md:w-[85%] w-4/6 text-center md:ml-6 lg:ml-10" : inputStyles}`}
              value={searchQuery} required
              onChange={e => {
                  setSearchQuery(e.target.value);
                  filterBooks(e,e.target.value);
                  setSearchKeyFun(e.target.value);
                }
              }
            />
              <button
                onClick= {(e) => filterBooks(e,searchQuery)}
                type='button'
                className={` ${!searchStyles ? 'bg-blue-700 px-4 py-[9px] relative top-[5px] h-[42px] hover:scale-100  text-white font-medium rounded-e-lg hover:bg-black transition ease-in duration-200' : searchStyles}`}
              >
                <BiSearch className={`${ searchIconStyles ? searchIconStyles : "size-6 hover:animate-bounce"}`}/> 
              </button>
          </div>
        )
        : 
        (
          <div className={`${ styles ? styles : 'hidden md:block '} w-full mt-12`}>
            <input
              type="search" name='search-input'
              autoComplete='off'
              autoFocus={autofocus}
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
            {/* {searchOpen && 
              <button
                  type='button'
                className={` ${!CancelBtnStyles ? 'bg-blue-700 px-4 py-[9px] relative top-[5px] right-[6px] border-l-2 border-black h-[42px] hover:scale-100  text-white font-medium rounded-e-lg hover:bg-black transition ease-in duration-200' : CancelBtnStyles}`}
              >
                <FaX onClick={() => setSearchOpen(false)} className={`${XiconStyles ? XiconStyles : 'size-5 hover:animate-bounce'}`}/>
              </button>
            } */}
          </div>
        )
    
  )
}

export default Search
