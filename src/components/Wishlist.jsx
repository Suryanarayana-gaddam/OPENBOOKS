import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthProvider';
import useUser from '../../hooks/useUser'
import BookCards from './BookCards.jsx'

const Wishlist = () => {

  const [wishlistBooks, setWishlistBooks] = useState([]);
  const user = useContext(AuthContext);
  const headLine = "My Wishlist";
  const [userData,refetch] = useUser();
  
  useEffect(() => {

    if (userData && userData.wishlist) {
      setWishlistBooks(userData.wishlist)
    }
  }, [userData]);

    if(wishlistBooks && wishlistBooks.length === 0){
      return (
        <div className='my-16 px-4 lg:px-24'>
          <h2 className='text-5xl text-center text-bold text-black my-5'>{headLine}</h2>
          <h1 className='px-4 lg:px-24 text-2xl text-center'> Your Wishlist is Empty !</h1>
        </div>
      )
    }else{
      return (
        <div className='my-16 px-4 lg:px-14'>
          <h2 className='text-5xl text-center text-bold text-black my-5'>{headLine}</h2>
          <BookCards books={wishlistBooks} user={user?.user}/>
        </div>
      )
    }
  
}

export default Wishlist
