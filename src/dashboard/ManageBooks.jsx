import React, { useContext, useEffect, useState } from 'react'
import { Table } from "flowbite-react";
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import useUser from '../../hooks/useUser';


const ManageBooks = () => {
  const [allBooks,setAllBooks] = useState([]);
  const [username, setUsername] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  const maxPageNumbers = 10;
  const [isLoading, setIsLoading] = useState(true);
  const user = useContext(AuthContext);
  const token = localStorage.getItem('access-token');
  const [userData,refetch] = useUser();

  useEffect (() => {
    fetch("https://book-store-api-theta.vercel.app/all-books",{
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
        authorization: `Bearer ${token}`
      }})
    .then(res => res.json())
    .then(data => setAllBooks(data));
    setIsLoading(false);
    setUsername(userData.username);
  },[user,userData,currentPage,token]);

  if(isLoading){
    return <div className="flex items-center justify-center h-screen">
    <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
        </div>
    </div>
    </div>
  }  

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this book?");
    if (isConfirmed) {
      fetch(`https://book-store-api-theta.vercel.app/book/delete/${id}`, {
          method: "DELETE",
        }
      )
      .then(res => res.json())
      .then(data => {
        alert("Book is deleted successfully!");
      })
      .catch(error => {
        console.error("Error deleting book:", error);
      });
    }
  }

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = allBooks.slice(indexOfFirstBook, indexOfLastBook);


  const totalPages = Math.ceil(allBooks.length / booksPerPage);

  const getPageNumbers = () => {
  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

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
    <div className='px-4 my-12 sm:w-96 w-full lg:w-full'>
      <h2 className='mb-8 text-3xl font-bold text-center'>Manage All Books</h2>
      <h2 className='mb-2'>Welcome <b>{username}</b> you can manage a book here !</h2>
      <Table className='overflow-auto p-3 felx flex-wrap '>
        <Table.Head>
          <Table.HeadCell>No.</Table.HeadCell>
          <Table.HeadCell>Book Name</Table.HeadCell>
          <Table.HeadCell>Author Name</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>
            <span >Edit or Manage</span>
          </Table.HeadCell>
        </Table.Head>
        {
          currentBooks.map( (book,index) => <Table.Body className='divide-y lg:w-[1150px]' key={book._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className=" font-medium text-gray-900 dark:text-white">
                  {indexOfFirstBook + index + 1} 
                </Table.Cell>
                <Table.Cell className=" font-medium text-gray-900 dark:text-white">
                <Link to={`/book/${book._id}`} className='text-blue-600'>{book.bookTitle}</Link>
                </Table.Cell>
                <Table.Cell>{book.authorName}</Table.Cell>
                <Table.Cell>{book.category}</Table.Cell>
                <Table.Cell>₹{book.bookPrice}</Table.Cell>
                <Table.Cell className=''>
                  <Link 
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" 
                    to={`/admin/Dashboard/edit-books/${book._id}`}>
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(book._id)} className='bg-red-600 px-4 py-1 font-semibold text-white rounded-sm hover:bg-sky-600 ml-5'>Delete</button>

                </Table.Cell>
              </Table.Row>
          </Table.Body>
        )}
      </Table>
      <div className={`flex justify-around mt-8 w-auto ${ allBooks.length>10 ? "block" : "hidden"}`}>
        <div>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-full bg-blue-500 text-white mr-2"
          >
            Previous
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
              {number}
            </button>
          ))}
        </div>
        <div>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 rounded-full bg-blue-500 text-white ml-2"
          >
            Next
          </button>
        </div>
      </div>
            
    </div>
  )
}

export default ManageBooks
