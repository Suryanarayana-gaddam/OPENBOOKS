import { useEffect, useState} from 'react'
import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import useUser from '../../hooks/useUser';

const UploadBook = () => {
  const bookCategories = [
    "Fiction","Mystery","Programming","Science Fiction","Fantasy","Horror","Bibliogarphy","Autobiography","History","Self-help","Memoir","Business","Children Books","Travel","Religion","Art And Design"
  ]
  const [selectedBookCategory,setselectedBookCategory] = useState(bookCategories[0]);
  const token = localStorage.getItem('access-token');

  const handleChangeSelectedValue = (event) => {
    setselectedBookCategory(event.target.value);
  }
  const [userData,refetch] = useUser();
  const [userId, setUserId] = useState(null);

  useEffect (() => {
    setUserId(userData._id);
  },[userData]);
  const handleBookSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

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

    fetch("https://book-store-api-theta.vercel.app/upload-book",{
      method:"POST",
      headers:{
        "Content-type": "application/json",
        "authorization": `Bearer ${token}`
      },
      body: JSON.stringify(bookObj)
    }).then(res => res.json()).then(data => {
      alert("Book Uploaded Successfully!!!");
      form.reset();
    });
  
  };

  return (
    <div className='px-2 my-12'>
        <h2 className='mb-8 text-3xl text-center bg-red-300 font-bold py-1'>Upload Book</h2>

        <form className="flex lg:w-[980px] flex-col flex-wrap gap-4 " onSubmit={handleBookSubmit}>

          <div className='flex gap-5'>
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="bookTitle" value="Book Title" />
            </div>
            <TextInput id="bookTitle" name="bookTitle" type="text" placeholder="Enter the Book Name" required />
          </div>

          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="authorName" value="Author Name" />
            </div>
            <TextInput id="authorName" name="authorName" type="text" placeholder="Enter the  Author Name" required />
          </div>
          </div>

          <div className='flex gap-5'>
            <div className='lg:w-1/2'>
              <div className="mb-2 block"> 
                <Label htmlFor="imageURL" value=" Book Image URL" /> 
              </div>
              <TextInput id="imageURL" name="imageURL" type="text" placeholder="Enter the Book Image URL" required />
            </div>

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

          <div>
            <div className="mb-2 block">
              <Label htmlFor="bookDescription" value="Book Description" />
            </div>
            <Textarea id="bookDescription" name='bookDescription' placeholder="Write your Book Description..." required className='w-full' rows={6}/>
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="bookPDFURL" value="Book PDF URL" />
            </div>
            <TextInput id="bookPDFURL" name='bookPDFURL' type="text" placeholder="book pdf url" required />
          </div>

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
