import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaCartShopping } from 'react-icons/fa6';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const token = localStorage.getItem('access-token');

const BookData = ({ headLine }) => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    fetch("https://book-store-api-theta.vercel.app/all-books", {
      headers : {
          "authorization": `Bearer ${token}`
      }
  })
      .then(res => res.json())
      .then(data => setBooks(data.slice(0, 8)))
      .catch(error => console.error('Error fetching books:', error));
  }, []);
 //console.log(books)
  const handleBookClick = (category) => {
    navigate('/books/' + category); // Use navigate to navigate
  }

  return (
    <div>
      <div className='my-[90px] px-4 lg:px-10'>
        <h2 className='text-3xl md:text-4xl lg:text-5xl text-center bg-red-300 p-1 text-bold text-black my-5'>{headLine}</h2>

        {/* cards */}
        <div className='mt-12'>
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 50,
              },
            }}
            modules={[Pagination]}
            className="mySwiper w-full h-full"
          >
            {books.map(book => (
              <SwiperSlide key={book._id}>
                <div className='relative' onClick={() => handleBookClick(book.category)}>
                  <img src={book.imageURL} alt="" />
                  <div className='absolute top-3 right-3 bg-blue-600 hover:bg-black p-2 rounded'>
                    <FaCartShopping className='w-4 h-4 text-white'/>
                  </div>
                </div>
                <div>
                  <div>
                    <h3>{book.bookTitle}</h3>
                    <p>{book.authorName}</p>
                  </div>
                  <div>
                    <p>$10</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default BookData;
