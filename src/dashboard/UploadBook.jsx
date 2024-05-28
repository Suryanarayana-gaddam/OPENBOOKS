import React, {useContext, useState} from 'react'
import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import { AuthContext } from '../context/AuthProvider';

const UploadBook = () => {
  const bookCategories = [
    "Fiction","Non-Fiction","Mystery","Programming","Science Fiction","Fantasy","Horror","Bibliogarphy","Autobiography","History","Self-help","Memoir","Business","Children Books","Travel","Religion","Art And Design"
  ]
  const [selectedBookCategory,setselectedBookCategory] = useState(bookCategories[0]);
  const token = localStorage.getItem('access-token');

  const handleChangeSelectedValue = (event) => {
    //console.log(event.target.value);
    setselectedBookCategory(event.target.value);
  }

  const user = useContext(AuthContext);

  // const handleBookClick = (event) => {
  //   event.preventDefault();
  //   const form = event.target;
  
  //   // Get user from the context
  //   console.log("User:", user); // Log user object to check if it's undefined or contains the expected data
  // // Get user object from the outer object
  // const userObject = user.user;

  // // Check if userObject is not null or undefined
  // if (userObject) {
  //   // Get user email
  //   const userEmail = userObject.email;
  //   console.log("User Email:", userEmail);

  //   // Use userEmail for further processing...
  // } else {
  //   console.log("User object is null or undefined");
  // }
  // const userEmail = userObject.email;
  //   fetch(`http://localhost:5000//userByEmail/${userEmail}`,{
  //     method:"GET",
  //     headers:{
  //       "Content-type": "application/json",
  //     },
  //   }).then(res => res.json()).then(data => {
  //     console.log(data);
  //     console.log(user.JSON);

  //   })
  //   // Rest of the function...
  // }

//   const handleBookClick = (event) => {
//     event.preventDefault();
//     const form = event.target;
  
//     // Get user from the context
//     console.log("User:", user); // Log user object to check if it's undefined or contains the expected data
  
//     // Check if user exists in the context
//     if (!user) {
//       console.error("User not found in context");
//       // Handle the case where the user is not logged in (e.g., display a message)
//       return;
//     }
  
//     // Get user email directly from the user object (assuming it has an 'email' property)
//     const userEmail = user.user.email;
//     console.log("User Email:", userEmail);
  
//     // Fetch user data by email
//     fetch(`http://localhost:5000/userByEmail/${userEmail}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json", // Set content type header explicitly
//       },
//     })
//       .then(res => {
//         if (!res.ok) {
//           return res.json().then(error => {
//             console.error("Error fetching user data:", error);
//             // Handle the error (e.g., display a message to the user)
//           });
//         }
//         return res.json(); // Parse valid JSON response
//       })
//       .then(userData => {
//         console.log("User Data:", userData);

//       // Option 1: Access user ID within the .then block
//       const userId = userData._id;
//       console.log("User ID (within .then):", userId);
//         // Process the user data retrieved from the backend
//       })
//       .catch(error => {
//         console.error("Error:", error);
//         // Handle unexpected errors
//       });
  
//     // Rest of the function...
//   };
  
  
// const handleBookSubmit = (event, userId) => {
//   event.preventDefault();
//   const form = event.target;

//   const createrId = userId;
//   const bookTitle = form.bookTitle.value; 
//   const authorName = form.authorName.value;
//   const imageURL = form.imageURL.value;
//   const category = form.category.value;
//   const bookDescription = form.bookDescription.value;
//   const bookPDFURL = form.bookPDFURL.value;
//   const bookPrice = form.bookPrice.value;
// const bookObj = {
//   createrId,bookTitle,authorName,imageURL,category,bookDescription,bookPDFURL,bookPrice
// }

//   console.log(bookObj);
//   // send data to DataBase
//   fetch("http://localhost:5000/upload-book",{
//     method:"POST",
//     headers:{
//       "Content-type": "application/json",
//     },
//     body:JSON.stringify(bookObj)
//   }).then(res => res.json()).then(data => {
//     //console.log(data);
//     alert("Book Uploaded Successfully!!!");
//     form.reset();
//   })
// }

const handleBookSubmit = (event) => {
  event.preventDefault();
  const form = event.target;

  // Get user from the context
  //console.log("User:", user); // Log user object to check if it's undefined or contains the expected data

  // Check if user exists in the context
  if (!user) {
    console.error("User not found in context");
    // Handle the case where the user is not logged in (e.g., display a message)
    return;
  }

  // Get user email directly from the user object (assuming it has an 'email' property)
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
      const userId = userData._id;

      // Extract book data from the form
      const bookTitle = form.bookTitle.value; 
      const authorName = form.authorName.value;
      const imageURL = form.imageURL.value;
      const category = form.category.value;
      const bookDescription = form.bookDescription.value;
      const bookPDFURL = form.bookPDFURL.value;
      const bookPrice = form.bookPrice.value;
      const createrId = userId;
      
      const bookObj = {
        createrId,
        bookTitle,
        authorName,
        imageURL,
        category,
        bookDescription,
        bookPDFURL,
        bookPrice
      };

      //console.log(bookObj);

      // send data to DataBase
      fetch("https://book-store-api-theta.vercel.app/upload-book",{
        method:"POST",
        headers:{
          "Content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bookObj)
      }).then(res => res.json()).then(data => {
        //console.log(data);
        alert("Book Uploaded Successfully!!!");
        form.reset();
      });
    })
    .catch(error => {
      console.error("Error:", error);
      // Handle unexpected errors
    });
};


  return (
    <div className='px-2 my-12'>
        <h2 className='mb-8 text-3xl font-bold'>Upload Book</h2>

        <form className="flex lg:w-[980px] flex-col flex-wrap gap-4 " onSubmit={handleBookSubmit}>
          {/* First Row */}
          {/* Book Name */}
          <div className='flex gap-5'>
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="bookTitle" value="Book Title" />
            </div>
            <TextInput id="bookTitle" name="bookTitle" type="text" placeholder="Enter the Book Name" required />
          </div>
          {/* Author Name */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="authorName" value="Author Name" />
            </div>
            <TextInput id="authorName" name="authorName" type="text" placeholder="Enter the  Author Name" required />
          </div>
          </div>
          {/* 2 nd Row */}
          {/* Image URL */}
          <div className='flex gap-5'>
            <div className='lg:w-1/2'>
              <div className="mb-2 block"> 
                <Label htmlFor="imageURL" value=" Book Image URL" /> 
              </div>
              <TextInput id="imageURL" name="imageURL" type="text" placeholder="Enter the Book Image URL" required />
            </div>
            {/* Category */}
            <div className='lg:w-1/2'>
              <div className="mb-2 block"> 
                <Label htmlFor="category" value=" Book Category" /> 
              </div>

              <Select id='category' name='category' className='w-full rounded' value={selectedBookCategory}
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
            <Textarea id="bookDescription" name='bookDescription' placeholder="Write your Book Description..." required className='w-full' rows={6}/>
          </div>
          {/* Book Pdf URL */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="bookPDFURL" value="Book PDF URL" />
            </div>
            <TextInput id="bookPDFURL" name='bookPDFURL' type="text" placeholder="book pdf url" required />
          </div>
          {/* Book Price*/}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="bookPrice" value="Book Price" />
            </div>
            <TextInput id="bookPrice" name='bookPrice' type="num" placeholder="book price ..." required />
          </div>
          
          <Button type='submit' className='mt-5'>Upload Book</Button>
        </form>
    </div>
  )
}

export default UploadBook
