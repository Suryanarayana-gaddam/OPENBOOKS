import React from 'react'
import { Link } from 'react-router-dom'

const Search = () => {
  return (
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
  )
}

export default Search
