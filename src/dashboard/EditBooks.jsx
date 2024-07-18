import { useState } from 'react'
import { Link, useLoaderData , useParams } from 'react-router-dom';
import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import { FaBackwardFast } from 'react-icons/fa6';

const EditBooks = () => {
  const {id} = useParams();
  const {bookTitle,authorName,imageURL,category,bookDescription,bookPDFURL,bookPrice} = useLoaderData();
  const token = localStorage.getItem('access-token');
  
  const bookCategories = [
    "Fiction","Mistery","Programming","Science Fiction","Fantasy","Horror","Bibliogarphy","Autobiography","History","Self-help","Memoir","Business","Children Books","Travel","Religion","Art And Design"
  ]
  const [selectedBookCategory,setselectedBookCategory] = useState(bookCategories[0]);

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
    window.location.href = '/admin/manage';
  })
  .catch(error => {
    console.error('Error updating book:', error);
  });
  
}

  return (
    <div className='px-4 my-8'>
        <Link to="/admin/Dashboard/manage" className="flex items-center">
          <FaBackwardFast />
          <span className="ml-2">Back</span>
        </Link>
        <h2 className='mb-8 text-3xl font-bold'>Update the book data</h2>
        <div className=' sm:max-w-[760px] md:max-w-[1014px] lg:max-w-[1270px]'>
        <form className=" inline-block" onSubmit={handleUpdate}>
          {/* First Row */}
          {/* Book Name */}
          <div className='flex gap-8 sm:max-w-[750px] md:max-w-[1004px] lg:max-w-[1260px]'>
          <div className='w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="bookTitle" value="Book Title" />
            </div>
            <TextInput id="bookTitle" name="bookTitle" type="text" placeholder="Enter the Book Name" required defaultValue={bookTitle} />
          </div>
          {/* Author Name */}
          <div className='w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="authorName" value="Author Name" />
            </div>
            <TextInput id="authorName" name="authorName" type="text" placeholder="Enter the  Author Name" required defaultValue={authorName} />
          </div>
          </div>
          {/* 2 nd Row */}
          {/* Image URL */}
          <div className='flex gap-8 sm:max-w-[750px] md:max-w-[1004px] lg:max-w-[1260px]'>
            <div className='w-1/2'>
              <div className="mb-2 block"> 
                <Label htmlFor="imageURL" value=" Book Image URL" /> 
              </div>
              <TextInput id="imageURL" name="imageURL" type="text" placeholder="Enter the Book Image URL" required defaultValue={imageURL} />
            </div>
            {/* Category */}
            <div className='w-1/2'>
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
          <div className=' sm:max-w-[750px] md:max-w-[1004px] lg:max-w-[1260px]'>
            <div className="mb-2 block">
              <Label htmlFor="bookDescription" value="Book Description" />
            </div>
            <Textarea id="bookDescription" name='bookDescription' placeholder="Write your Book Description..." required className='w-full' rows={6} defaultValue={bookDescription} />
          </div>
          {/* Book Pdf URL */}
          <div className=' sm:max-w-[750px] md:max-w-[1004px] lg:max-w-[1260px]'>
            <div className="mb-2 block">
              <Label htmlFor="bookPDFURL" value="Book PDF URL" />
            </div>
            <TextInput id="bookPDFURL" name='bookPDFURL' type="text" placeholder="book pdf url" required defaultValue={bookPDFURL} />
          </div>
          {/* Book Price*/}
          <div className=' sm:max-w-[750px] md:max-w-[1004px] lg:max-w-[1260px]'>
            <div className="mb-2 block">
              <Label htmlFor="bookPrice" value="Book Price" />
            </div>
            <TextInput id="bookPrice" name='bookPrice' type="num" placeholder="book price ..." required defaultValue={bookPrice}/>
          </div>
          <Button type='submit' className='mt-5 w-auto'>Update Book</Button>
        </form>
        </div>
        
    </div>
  )

}

export default EditBooks
