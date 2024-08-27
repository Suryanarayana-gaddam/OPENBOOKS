import React, { useContext, useEffect, useState } from 'react'
import { Table } from "flowbite-react";
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import useUser from '../../hooks/useUser';
import Pagination from '../components/Pagination';


const ManageBooks = () => {
  const [allBooks,setAllBooks] = useState([]);
  const [username, setUsername] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const user = useContext(AuthContext);
  const token = localStorage.getItem('access-token');
  const [userData,refetch] = useUser();

  const [indexOfFirstBook,setIndexOfFirstBook] = useState(null);
  const [currentBooks,setCurrentBooks] = useState([]);

  const setItemsDetails = (x) => {
    setCurrentBooks(x);
  }
  const setIndexBook = (y) => {
    setIndexOfFirstBook(y);
  }

  useEffect (() => {
    fetch("https://book-store-api-theta.vercel.app/all-books",{
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
        "authorization": `Bearer ${token}`
      }})
    .then(res => res.json())
    .then(data => setAllBooks(data));
    setIsLoading(false);
    setUsername(userData.username);
  },[userData,token]);

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

  return (
    <div className='px-4 my-12'>
      <h2 className='mb-8 text-3xl font-bold text-center'>Manage All Books</h2>
      <h2 className='mb-2'>Welcome <b>{username}</b> you can manage a book here !</h2>
      {
        allBooks && Array.isArray(allBooks) && allBooks.length > 0 ? (
          <div>
            <div className='overflow-auto w-full'>
              <Table className=' border border-collapse sm:max-w-[760px] md:max-w-[1014px] lg:max-w-[1270px] xl:max-w-[1300px] '>
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
                  currentBooks.map( (book,index) => <Table.Body className='divide-y sm:max-w-[760px] md:max-w-[1014px] lg:max-w-[1270px] w-auto' key={book._id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 w-auto">
                        <Table.Cell className=" w-auto font-medium text-gray-900 dark:text-white">
                          {indexOfFirstBook + index + 1} 
                        </Table.Cell>
                        <Table.Cell className="w-auto font-medium text-gray-900 dark:text-white">
                        <Link to={`/book/${book._id}`} className='text-blue-600'>{book.bookTitle}</Link>
                        </Table.Cell>
                        <Table.Cell className='w-auto'>{book.authorName}</Table.Cell>
                        <Table.Cell className='w-auto'>{book.category}</Table.Cell>
                        <Table.Cell className='w-auto'>₹{book.bookPrice}</Table.Cell>
                        <Table.Cell className='w-auto'>
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
            </div>
            <Pagination setItemsDetails={setItemsDetails} setIndexBook={setIndexBook} itemsPerPage={10} maxPageNumbers={10} inputArrayItems={allBooks}/>
          </div>
        ) : (
          <p className='text-center'>No Books Available !</p>
        )
      }
    </div>
  )
}

export default ManageBooks
