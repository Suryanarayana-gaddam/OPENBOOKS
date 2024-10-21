import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';

const Pagination =  ({inputArrayItems,setItemsDetails,setIndexBook,itemsPerPage,maxPageNumbers}) => {

  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  useEffect(() => {
      const currentItems =  inputArrayItems?.slice(indexOfFirstItem, indexOfLastItem)
      setItemsDetails(currentItems);
    },[currentPage,setItemsDetails])  

    useEffect(() =>{
      setIndexBook(indexOfFirstItem)
  },[indexOfFirstItem])

  const maxPNums = useRef(0);
  const [width, setWidth] = useState(window.innerWidth);

  const updateWidth = () => {
      setWidth(window.innerWidth);
  };

  useEffect(() => {
      // Update maxPNums based on the current width
      if (width > 1024) {
          maxPNums.current = 12;
      } else if (width > 768) {
          maxPNums.current = 10;
      } else if (width > 640) {
          maxPNums.current = 8;
      } else {
          maxPNums.current = 5;
      }
  }, [width]);

  useEffect(() => {
      // event listener for window resize
      window.addEventListener('resize', updateWidth);
      
      // Cleanup the event listener on component unmount
      return () => {
          window.removeEventListener('resize', updateWidth);
      };
  }, []);

  const totalPages = Math.ceil(inputArrayItems && inputArrayItems?.length / itemsPerPage);
  
  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxPNums.current / 2));
    let endPage = Math.min(totalPages, startPage + maxPNums.current - 1);

    // Adjust startPage when near the end of totalPages
    if (endPage - startPage + 1 < maxPNums.current) {
      startPage = Math.max(1, endPage - maxPNums.current + 1);
    }

    let pageNumbers = Array.from({ length: (endPage - startPage) + 1 }, (_, index) => startPage + index);

    

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
    <div>
      {/* Pagination buttons at the bottom */}
      <div className={`flex justify-around mt-8 w-auto ${ inputArrayItems.length > itemsPerPage ? "block" : "hidden"}`}>
              <div className='grid'>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-full bg-blue-500 text-white text-lg flex disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-gray-500`}
                >
                  <span><FaArrowLeftLong className='text-lg relative top-[2px] '/></span>
                </button>
              </div>
              <div className='relative top-[0px] '>
                {getPageNumbers().map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 text-lg rounded-full ${
                      currentPage === number ? 'bg-blue-500 text-white text-xl' : 'bg-gray-200'
                    } mr-1`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              <div className='grid'>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-3 py-1 rounded-full bg-blue-500 text-white text-lg flex disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-gray-500`}
                >
                  <span><FaArrowRightLong className='text-lg relative top-[6px] '/></span>
                </button>
              </div>
            </div>
    </div>
  )
}

export default Pagination
