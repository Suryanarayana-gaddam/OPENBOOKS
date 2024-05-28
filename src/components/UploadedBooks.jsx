import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthProvider';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

const UploadedBooks = () => {
    const user= useContext(AuthContext);
    const [uploadedBooks,setUploadedBooks] = useState([]);
    //console.log(user)

    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;

    const token = localStorage.getItem('access-token');

    useEffect(() => {
        const userEmail = user?.user?.email;
  
        if(userEmail){
          fetchData(userEmail);
        }
      }, [user]);


      const fetchData = (userEmail) => {
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
            const createrId = userData._id;
            //console.log(createrId);
            fetch(`https://book-store-api-theta.vercel.app/user/${createrId}/get/books`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`
              },
            })
            .then(res => {
              if (!res.ok) {
                return res.json().then(error => {
                  console.error("Error fetching uploaded books:", error);
                  // Handle the error
                });
              }
              return res.json();
            })
            .then(data => setUploadedBooks(data))
            .catch(error => {
              console.error("Error:", error);
              // Handle unexpected errors
            });
          })
          .catch(error => {
            console.error("Error:", error);
            // Handle unexpected errors
          });
      }



    //delete a book 
    const handleDelete = (id) => {
        // Display confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete this book?");
        if (isConfirmed) {
        // If confirmed, proceed with the deletion
        fetch(`https://book-store-api-theta.vercel.app/book/${id}`, {
            method: "DELETE",
            headers: {
              authorization: `Bearer ${token}`,
            },
        })
        .then(res => res.json())
        .then(data => {
            // Update UI or perform any other actions after successful deletion
            alert("Book is deleted successfully!");
            setUploadedBooks(data);
        })
        .catch(error => {
            console.error("Error deleting book:", error);
        });
        }
    }
  
    const indexOfLastBook = currentPage * booksPerPage;
const indexOfFirstBook = indexOfLastBook - booksPerPage;
const currentBooks = uploadedBooks? uploadedBooks.slice(indexOfFirstBook, indexOfLastBook) : ""


const paginate = pageNumber => setCurrentPage(pageNumber);

  
    return (
      <div className='pl-20 my-24 sm:w-96 lg:w-full'>
        <h2 className='mb-8 text-3xl font-bold'>Manage Your Books</h2>
        {
          uploadedBooks && Array.isArray(uploadedBooks) && uploadedBooks.length > 0 ? (
            <div className=''>
              {/* Table for book data */}
        <Table className='lg:w-[1180px] '>
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
            currentBooks && Array.isArray(currentBooks) && currentBooks.map( (book,index) => <Table.Body className='divide-y lg:w-[1080px]' key={book._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {indexOfFirstBook + index + 1} 
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {book.bookTitle}
                  </Table.Cell>
                  <Table.Cell>{book.authorName}</Table.Cell>
                  <Table.Cell>{book.category}</Table.Cell>
                  <Table.Cell>₹{book.bookPrice}</Table.Cell>
                  <Table.Cell>
                    <Link 
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" 
                      to={`/user/edit-book/${book._id}`}>
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(book._id)} className='bg-red-600 px-4 py-1 font-semibold text-white rounded-sm hover:bg-sky-600 ml-5'>Delete</button>
  
                  </Table.Cell>
                </Table.Row>
            </Table.Body>
          )}
  
  
        </Table>

        <div className="flex justify-between my-4 ">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className='px-4 py-2 rounded-2xl bg-blue-500 text-white'>Previous</button>
                <div>
                    {Array.from({ length: Math.ceil(uploadedBooks.length / booksPerPage) }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`mx-1 px-3 py-1 rounded-full ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentBooks.length < booksPerPage} className='px-4 py-2 rounded-2xl bg-blue-500 text-white'>Next</button>
            </div>

            </div>
          ) : (
            <p>No Books Uploaded By You !</p>
            
          )
        }
      </div>
    )
  }

export default UploadedBooks
