import { useEffect, useState } from 'react'
import { useLoaderData , useParams } from 'react-router-dom';
import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import useUser from '../../hooks/useUser';

const UserEditBook = () => {
  const {id} = useParams();
  const {bookTitle,authorName,imageURL,category,bookDescription,bookPDFURL,bookPrice} = useLoaderData();
  
  const bookCategories = [
    "Fiction","Mistery","Programming","Science Fiction","Fantasy","Horror","Bibliogarphy","Autobiography","History","Self-help","Memoir","Business","Children Books","Travel","Religion","Art And Design"
  ]
  const [selectedBookCategory,setselectedBookCategory] = useState(bookCategories[0]);
  const [username, setUsername] = useState('');
  const token = localStorage.getItem('access-token');
  const [userData,refetch] = useUser();

  useEffect (() => {
    if(userData && userData.username){
      setUsername(userData.username)
    }
  },[userData]);


  const handleChangeSelectedValue = (event) => {
    setselectedBookCategory(event.target.value);
  }
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

  fetch(`https://book-store-api-theta.vercel.app/book/update/${id}`,{
    method: "PATCH",
    headers: {
      "Content-Type" : "application/json",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updateBookObj)
  }).then(res => res.json()).then(data => {
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
          <div className='flex gap-8'>
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="bookTitle" value="Book Title" />
            </div>
            <TextInput id="bookTitle" name="bookTitle" type="text" placeholder="Enter the Book Name" required defaultValue={bookTitle} />
          </div>
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="authorName" value="Author Name" />
            </div>
            <TextInput id="authorName" name="authorName" type="text" placeholder="Enter the  Author Name" required defaultValue={authorName} />
          </div>
          </div>

          <div className='flex gap-8'>
            <div className='lg:w-1/2'>
              <div className="mb-2 block"> 
                <Label htmlFor="imageURL" value=" Book Image URL" /> 
              </div>
              <TextInput id="imageURL" name="imageURL" type="text" placeholder="Enter the Book Image URL" required defaultValue={imageURL} />
            </div>
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

          <div>
            <div className="mb-2 block">
              <Label htmlFor="bookDescription" value="Book Description" />
            </div>
            <Textarea id="bookDescription" name='bookDescription' placeholder="Write your Book Description..." required className='w-full' rows={6} defaultValue={bookDescription} />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="bookPDFURL" value="Book PDF URL" />
            </div>
            <TextInput id="bookPDFURL" name='bookPDFURL' type="text" placeholder="book pdf url" required defaultValue={bookPDFURL} />
          </div>

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

