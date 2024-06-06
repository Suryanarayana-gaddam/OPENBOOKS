import React , { useContext, useEffect, useState } from 'react'
import { Link, useLoaderData , useParams } from 'react-router-dom';
import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import { FaBackward, FaBackwardFast } from 'react-icons/fa6';
import { AuthContext } from '../context/AuthProvider';

const UserEditBook = () => {
  const {id} = useParams();
  const {bookTitle,authorName,imageURL,category,bookDescription,bookPDFURL,bookPrice} = useLoaderData();
  
  const bookCategories = [
    "Fiction","Non-Fiction","Mistery","Programming","Science Fiction","Fantasy","Horror","Bibliogarphy","Autobiography","History","Self-help","Memoir","Business","Children Books","Travel","Religion","Art And Design"
  ]
  const [selectedBookCategory,setselectedBookCategory] = useState(bookCategories[0]);
  const [username, setUsername] = useState('');
  const user = useContext(AuthContext);
  const token = localStorage.getItem('access-token');

  useEffect (() => {
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
  },[user]);


  const handleChangeSelectedValue = (event) => {
    //console.log(event.target.value);
    setselectedBookCategory(event.target.value);
  }
  //handle book submission
const handleUpdate = (event) => {
  event.preventDefault();
  const form = event.target;

  const bookTitle = form.bookTitle.value; 
  const authorName = form.authorName.value;
  const imageURL = form.imageURL.value;
  const category = form.category.value;
  const bookDescription = form.bookDescription.value;
  const bookPDFURL = form.bookPDFURL.value;
  const bookPrice = form.bookPrice.value;
const updateBookObj = {
  bookTitle,authorName,imageURL,category,bookDescription,bookPDFURL,bookPrice
}

  //console.log(bookObj);
  //update book data
  fetch(`https://book-store-api-theta.vercel.app/book/update/${id}`,{
    method: "PATCH",
    headers: {
      "Content-Type" : "application/json",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updateBookObj)
  }).then(res => res.json()).then(data => {
    //console.log(data);
    alert("Book is Updated Successfully!!!");
    window.location.href = '/shop';
  })
  .catch(error => {
    console.error('Error updating book:', error);
  });
  
}

  return (
    <div className='p-14 my-8'>
        
        <h2 className='mb-8 text-3xl font-bold'>Update the book data</h2>
        <h2 className='mb-2'>Welcome <b>{username}</b> you can update a book here !</h2>
        <form className="flex lg:w-[1180px] flex-col flex-wrap gap-4 " onSubmit={handleUpdate}>
          {/* First Row */}
          {/* Book Name */}
          <div className='flex gap-8'>
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="bookTitle" value="Book Title" />
            </div>
            <TextInput id="bookTitle" name="bookTitle" type="text" placeholder="Enter the Book Name" required defaultValue={bookTitle} />
          </div>
          {/* Author Name */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="authorName" value="Author Name" />
            </div>
            <TextInput id="authorName" name="authorName" type="text" placeholder="Enter the  Author Name" required defaultValue={authorName} />
          </div>
          </div>
          {/* 2 nd Row */}
          {/* Image URL */}
          <div className='flex gap-8'>
            <div className='lg:w-1/2'>
              <div className="mb-2 block"> 
                <Label htmlFor="imageURL" value=" Book Image URL" /> 
              </div>
              <TextInput id="imageURL" name="imageURL" type="text" placeholder="Enter the Book Image URL" required defaultValue={imageURL} />
            </div>
            {/* Category */}
            <div className='lg:w-1/2'>
              <div className="mb-2 block"> 
                <Label htmlFor="category" value=" Book Category" /> 
              </div>

              <Select id='category' name='category' className='w-full rounded' value={category}
              onChange={handleChangeSelectedValue}>
                {
                  bookCategories.map((option) => <option key={option} value={option}>{option}</option>)
                }
              </Select>

            </div>
          </div>
          {/* Thrd Row */}
          {/* Book Description */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="bookDescription" value="Book Description" />
            </div>
            <Textarea id="bookDescription" name='bookDescription' placeholder="Write your Book Description..." required className='w-full' rows={6} defaultValue={bookDescription} />
          </div>
          {/* Book Pdf URL */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="bookPDFURL" value="Book PDF URL" />
            </div>
            <TextInput id="bookPDFURL" name='bookPDFURL' type="text" placeholder="book pdf url" required defaultValue={bookPDFURL} />
          </div>
          {/* Book Price*/}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="bookPrice" value="Book Price" />
            </div>
            <TextInput id="bookPrice" name='bookPrice' type="num" placeholder="book price ..." required defaultValue={bookPrice}/>
          </div>
          <Button type='submit' className='mt-5'>Update Book</Button>
        </form>
    </div>
  )

}

export default UserEditBook

