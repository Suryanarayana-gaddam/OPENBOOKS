import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthProvider';
import useUser from '../../hooks/useUser'
import BookCards from './BookCards.jsx'
import Cards from './Cards.jsx';

const Wishlist = () => {

  const [wishlistBooks, setWishlistBooks] = useState([]);
  const user = useContext(AuthContext);
  const headLine = "Wishlist";
  const [userData,refetch] = useUser();
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    if (userData && userData.wishlist) {
      setWishlistBooks(userData.wishlist)
    }
  }, [userData]);

    if(wishlistBooks && wishlistBooks.length === 0){
      return (
        <div className='my-16 px-4 lg:px-10'>
          <h2 className='text-5xl text-center text-bold text-black my-5'>{headLine}</h2>
          <h1 className='px-4 lg:px-10 text-2xl text-center'> Your Wishlist is Empty !</h1>
        </div>
      )
    }else{
      return (
        <div className='my-16 px-4 lg:px-10'>
          <h2 className='text-5xl text-center text-bold text-black my-5'>{headLine}</h2>
          {/* <BookCards books={wishlistBooks} isDynamicPagination={true} user={user?.user} isAutoPlay={true} isNavigation={true}/> */}
          <Cards booksTodisplay={wishlistBooks}/>
        </div>
      )
    }
  
} 

export default Wishlist
