import React, { useContext, useEffect, useState } from 'react'
import { Table } from "flowbite-react";
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';


const ManageBooks = () => {
  const [allBooks,setAllBooks] = useState([]);
  const [username, setUsername] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;
    const maxPageNumbers = 10;
  const user = useContext(AuthContext);

  const token = localStorage.getItem('access-token');

  useEffect (() => {
    fetch("https://book-store-api-theta.vercel.app/all-books",{
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
        authorization: `Bearer ${token}`
      }}).then(res => res.json()).then(data => setAllBooks(data));
    setUsername(user?.user?.displayName);
    //console.log(user);

    const userEmail = user.user.email;
  //console.log("User Email:", userEmail);

  // Fetch user data by email
  fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Set content type header explicitly
      authorization: `Bearer ${token}`

    },
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(error => {
          console.error("Error fetching user data:", error);
          // Handle the error (e.g., display a message to the user)
        });
      }
      return res.json(); // Parse valid JSON response
    })
    .then(userData => {
      //console.log("User Data:", userData);

      // Get user ID from userData
      setUsername(userData.username);
    })
  },[user,currentPage]);

//delete a book 
const handleDelete = (id) => {
  // Display confirmation dialog
  const isConfirmed = window.confirm("Are you sure you want to delete this book?");
  if (isConfirmed) {
    // If confirmed, proceed with the deletion
    fetch(`https://book-store-api-theta.vercel.app/book/delete/${id}`, {
      method: "DELETE",
    }
  )
    .then(res => res.json())
    .then(data => {
      // Update UI or perform any other actions after successful deletion
      alert("Book is deleted successfully!");
      //setAllBooks(data);
    })
    .catch(error => {
      console.error("Error deleting book:", error);
    });
  }
}

const indexOfLastBook = currentPage * booksPerPage;
const indexOfFirstBook = indexOfLastBook - booksPerPage;
const currentBooks = allBooks.slice(indexOfFirstBook, indexOfLastBook);


// Calculate total number of pages
const totalPages = Math.ceil(allBooks.length / booksPerPage);

// Generate array of page numbers to display
const getPageNumbers = () => {
  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  // Adjust startPage when near the end of totalPages
  if (endPage - startPage + 1 < maxPageNumbers) {
    startPage = Math.max(1, endPage - maxPageNumbers + 1);
  }

  

let pageNumbers = Array.from({ length: (endPage - startPage) + 1 }, (_, index) => startPage + index);


// Include multiples of 50
const multiplesOf50 = Array.from({ length: Math.ceil(totalPages / 50)-1 }, (_, index) => (index + 1) * 50);
pageNumbers = [...pageNumbers.filter(num => !multiplesOf50.includes(num)), ...multiplesOf50];

// Add last page if it's not already included
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
    <div className='px-4 my-12 sm:max-w-md md:max-w-lg lg:max-w-full'>
      <h2 className='mb-8 text-3xl font-bold'>Manage All Books</h2>
      <h2 className='mb-2'>Welcome <b>{username}</b> you can manage a book here !</h2>
      {/* Table for book data */}
      <Table className='lg:w-[1000px]'>
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
          currentBooks.map( (book,index) => <Table.Body className='divide-y' key={book._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {indexOfFirstBook + index + 1} 
                </Table.Cell>
                <Table.Cell className=" font-medium text-gray-900 dark:text-white">
                  {book.bookTitle}
                </Table.Cell>
                <Table.Cell>{book.authorName}</Table.Cell>
                <Table.Cell>{book.category}</Table.Cell>
                <Table.Cell>₹{book.bookPrice}</Table.Cell>
                <Table.Cell className='whitespace-nowrap'>
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
      {/* Pagination buttons at the bottom */}
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
