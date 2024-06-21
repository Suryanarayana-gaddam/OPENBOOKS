import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthProvider';
import { Table } from 'flowbite-react';
//import { Link } from 'react-router-dom';

const Users = () => {
    const [allUsers,setAllUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const user = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;
    const maxPageNumbers = 10;
    const token = localStorage.getItem('access-token');
  
    useEffect (() => {
      fetch("https://book-store-api-theta.vercel.app/admin/all-users",{
        method: "GET",
        headers: {
          "Content-Type" : "application/json",
          authorization: `Bearer ${token}`
        }}).then(res => res.json()).then(data => setAllUsers(data));
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
        // if(userData.role == 'admin'){setIsAdmin(true)}
      })
    },[user]);

    if(isLoading){
      return <div className="flex items-center justify-center h-screen">
      <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
          </div>
      </div>
  </div>
    }
  
  //delete user 
  const handleDeleteUser = (id) => {
    // Display confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this user ?");
    if (isConfirmed) {
      // If confirmed, proceed with the deletion
      fetch(`https://book-store-api-theta.vercel.app/user/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // Set content type header explicitly
          authorization: `Bearer ${token}`
    
        },
      }
    )
      .then(res => res.json())
      .then(data => {
        if (data.modifiedCount === 1) {
          alert("User is now an admin!");
        } else {
          alert("Failed to update user role."); // Display error message if the update failed
        }
      })
      .catch(error => {
        console.error("Error deleting book:", error);
      });
    }
  }


  const handleMakeAdmin = (id,userrole) => {
    const updateUserObj = {role : userrole=='user' ? 'admin' : "user"};
    // Display confirmation dialog
    const isConfirmed = window.confirm("Are you sure , you want to make this user as admin ?");
    if (isConfirmed) {
      // If confirmed, proceed with the deletion
      fetch(`https://book-store-api-theta.vercel.app/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Set content type header explicitly
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateUserObj)
      }).then(res => res.json()).then(data => {
        //console.log(data);
        alert(`This user is admin now !!!`);
        window.location.href = '/admin/dashboard/all-users';
      })
      .catch(error => {
        console.error('Error updating book:', error);
      });
      
    }
  }
    const handleRemoveAdmin = (id,userrole,currentusername) => {
      const updateUserObj = {role : userrole=='admin' ? 'user' : "admin"};
      // Display confirmation dialog
      const isConfirmed = window.confirm("Are you sure , you want to remove this user as admin ?");
      if (isConfirmed) {
        // If confirmed, proceed with the deletion
        fetch(`https://book-store-api-theta.vercel.app/user/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json", // Set content type header explicitly
            authorization: `Bearer ${token}`
      
          },
          body: JSON.stringify(updateUserObj)
        }).then(res => res.json()).then(data => {
          //console.log(data);
          alert(`This person is user now !!!`);
          if(username == currentusername){
            window.location.href = '/';
          }else{
            window.location.href = '/admin/dashboard/all-users';
          }
        })
        .catch(error => {
          console.error('Error updating book:', error);
        });
      }
    }
    const indexOfLastBook = currentPage * booksPerPage;
const indexOfFirstBook = indexOfLastBook - booksPerPage;
const currentBooks = allUsers.slice(indexOfFirstBook, indexOfLastBook);


// Calculate total number of pages
const totalPages = Math.ceil(allUsers.length / booksPerPage);

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
        <h2 className='mb-8 text-3xl font-bold'>Manage Your Users</h2>
        <h2 className='mb-2'>Welcome Mr. &nbsp;<b>{username}</b> &nbsp;you can manage a users here !</h2>
        {/* Table for book data */}
        <Table className='lg:w-[1000px]'>
          <Table.Head>
            <Table.HeadCell>No.</Table.HeadCell>
            <Table.HeadCell>User Name</Table.HeadCell>
            <Table.HeadCell>Email Address</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>
              <span className='ml-10'>Edit or Manage</span>
            </Table.HeadCell>
          </Table.Head>
          {
            allUsers.map( (userInfo,index) => <Table.Body className='divide-y' key={userInfo._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {index + 1} 
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {userInfo.username}
                  </Table.Cell>
                  <Table.Cell>{userInfo.email}</Table.Cell>
                  <Table.Cell>{userInfo.role}</Table.Cell>
                  <Table.Cell>
                    
                    {
                        userInfo.role == "admin" ?
                          (<div className='text-center'>
                            {userInfo.email == "suryanarayanagaddam020@gmail.com" ? 
                            <button className='bg-green-600 px-4 py-1 font-serif font-semibold text-white rounded hover:bg-blue-500 hover:text-white text-center'>Developer </button>
                            : (
                                <button onClick={() => handleRemoveAdmin(userInfo._id,userInfo.role,userInfo.username)} className='bg-red-600 px-4 py-1 font-semibold text-white rounded-full hover:bg-gray-600 hover:text-red ml-5 text-start'>Remove Admin</button>
                              ) 
                            }
                          </div>
                        )
                          : ( 
                            <div>
                                <button onClick={() => handleMakeAdmin(userInfo._id,userInfo.role)} className='bg-blue-600 px-4 py-1 font-semibold text-white rounded-full hover:bg-green-600 ml-5 text-start'>Make Admin</button>
                             <button onClick={() => handleDeleteUser(userInfo._id)} className='bg-red-600 px-4 py-1 font-semibold text-white rounded-full hover:bg-gray-100 hover:text-red-600 ml-5'>Delete</button>
                            </div>
                        ) 
                    }
  
                  </Table.Cell>
                </Table.Row>
            </Table.Body>
          )}
  
  
        </Table>

        {/* Pagination buttons at the bottom */}
      <div className={`flex justify-around mt-8 w-auto ${ allUsers.length>10 ? "block" : "hidden"}`}>
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

export default Users
