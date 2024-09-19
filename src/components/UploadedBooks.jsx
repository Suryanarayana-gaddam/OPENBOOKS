import { useEffect, useState } from 'react'
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import Pagination from './Pagination';
import Loading from './Loading';

const UploadedBooks = () => {
  const [uploadedBooks,setUploadedBooks] = useState([]);

  const [userData,refetch] = useUser();
  const token = localStorage.getItem('access-token');
  const [createrId,setCreaterId] = useState(' ');
  const [indexOfFirstBook,setIndexOfFirstBook] = useState(null);
  const [currentBooks,setCurrentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if(userData && userData._id){
      setCreaterId(userData._id)
    }
    const fetchData = () => {
      fetch(`https://book-store-api-theta.vercel.app/user/${createrId}/get/books`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
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
    }
    fetchData()
    setTimeout(() => {
      setLoading(false)
    }, 2000);

    },[createrId,userData,token])

  const setItemsDetails = (x) => {
    setCurrentBooks(x);
  }
  const setIndexBook = (y) => {
    setIndexOfFirstBook(y);
  }

  if(loading){
    return <Loading/>
  }

  const handleDelete = (id) => {
    // Display confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this book?");
    if (isConfirmed) {
    // If confirmed, proceed with the deletion
    fetch(`https://book-store-api-theta.vercel.app/book/delete/${id}`, {
        method: "DELETE",
        headers: {
          "authorization": `Bearer ${token}`,
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
  
  return (
    <div className='p-5 my-24'>
      <h2 className='mb-8 text-3xl font-bold text-center'>Manage Your Books</h2>
      {
        uploadedBooks && Array.isArray(uploadedBooks) && uploadedBooks.length > 0 ? (
          <div>
            <div className='overflow-auto'>
            {/* Table for book data */}
              <Table className='border border-gray-200 sm:max-w-[760px] md:max-w-[1014px] lg:max-w-[1270px]'>
                <Table.Head className='border border-gray-300 lg:max-w-[1260px] md:max-w-[1012px] sm:w-[640px]'>
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
                  currentBooks && Array.isArray(currentBooks) && currentBooks.map( (book,index) => <Table.Body className='divide-y w-full' key={book._id}>
                      <Table.Row className="bg-white w-full border border-gray-100 dark:border-gray-700 dark:bg-gray-800 ">
                        <Table.Cell className=" font-medium text-gray-900 dark:text-white">
                          {indexOfFirstBook + index + 1} 
                        </Table.Cell>
                        <Table.Cell className=" font-medium text-gray-900 dark:text-white">
                        <Link to={`/book/${book._id}`} className='text-blue-600'>{book.bookTitle}</Link>
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
            </div>
            <Pagination setItemsDetails={setItemsDetails} setIndexBook={setIndexBook} itemsPerPage={10} maxPageNumbers={10} inputArrayItems={uploadedBooks}/>
          </div>
        ) : (
          <p className='text-center'>No Books Uploaded By You !</p> 
        )
      }
    </div>
  )
  }

export default UploadedBooks
