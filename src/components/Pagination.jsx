import React, { useEffect, useState } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';

const Pagination =  ({inputArrayItems,setItemsDetails,setIndexBook,itemsPerPage,maxPageNumbers}) => {

  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  useEffect(() => {
      const currentItems =  inputArrayItems?.slice(indexOfFirstItem, indexOfLastItem)
      setItemsDetails(currentItems);
        setIndexBook(indexOfFirstItem)
    },[currentPage])  
  const totalPages = Math.ceil(inputArrayItems && inputArrayItems?.length / itemsPerPage);

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    // Adjust startPage when near the end of totalPages
    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }

  let pageNumbers = Array.from({ length: (endPage - startPage) + 1 }, (_, index) => startPage + index);

  const multiplesOf50 = Array.from({ length: Math.ceil(totalPages / 50)-1 }, (_, index) => (index + 1) * 50);
  pageNumbers = [...pageNumbers.filter(num => !multiplesOf50.includes(num)), ...multiplesOf50];

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
      <div className={`flex justify-around mt-8 w-auto ${ inputArrayItems.length>10 ? "block" : "hidden"}`}>
              <div>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-full bg-blue-500 text-white mr-2 flex"
                >
                  <span className='relative top-[5px] right-1'><FaArrowLeftLong/></span>Previous
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
                    {
                    number === 1 ? (
                       ("First Page 1")
                    ) : (number === totalPages ? `Last Page ${totalPages}` : number)
                    }
                  </button>
                ))}
              </div>
              <div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 rounded-full bg-blue-500 text-white ml-2 flex"
                >
                  Next<span className='relative top-[5px] left-1'><FaArrowRightLong/></span>
                </button>
              </div>
            </div>
    </div>
  )
}

export default Pagination
