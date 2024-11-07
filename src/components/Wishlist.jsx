import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthProvider';
import useUser from '../../hooks/useUser'
import BookCards from './BookCards.jsx'
import Cards from './Cards.jsx';

const Wishlist = () => {

  const [wishlistBooks, setWishlistBooks] = useState([]);
  const user = useContext(AuthContext);
  const [userData,refetch] = useUser();
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    if (userData && userData.wishlist) {
      setWishlistBooks(userData.wishlist.reverse())
    }
  }, [userData]);

  return (
    <div className='my-[90px] px-4 lg:px-10'>
      <h2 className='text-3xl text-center bg-red-300 p-1 rounded text-bold text-black my-5'>Wishlist</h2>
      {(wishlistBooks && wishlistBooks.length === 0)  ? 
        <h1 className='px-4 lg:px-10 text-2xl text-center'> Your Wishlist is Empty !</h1>
        :
        <Cards booksTodisplay={wishlistBooks}/>
      }
      {/* <BookCards books={wishlistBooks} isDynamicPagination={true} user={user?.user} isAutoPlay={true} isNavigation={true}/> */}
    </div>
  )
  
} 

export default Wishlist
