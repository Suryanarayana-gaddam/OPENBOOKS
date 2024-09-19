import { createContext, useState, useEffect } from 'react';
import useUser from '../../hooks/useUser';

export const CRUDContext = createContext();

const CRUDProvider = ({ children }) => {
  const [userData,refetch] = useUser();
  const token = localStorage.getItem('access-token');
  const [userId,setUserId] = useState(userData._id);

  useEffect(() => {
    if (userData && userData.wishlist) {
      setUserId(userData._id)
    }
  }, [userData]);

  const addToCart = (book) => {
        fetch(`https://book-store-api-theta.vercel.app/user/${userId}/cart/add`,{
            method:"POST",
            headers:{
              "Content-type": "application/json",
              "authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(book)
          }).then(res => res.json()).then(data => {
            refetch()
          })
          .catch(error => {
            console.error("Error:", error);
          });
    };
  
  const addToWishlist = (book) => {
    fetch(`https://book-store-api-theta.vercel.app/user/${userId}/wishlist/add`,{
        method:"POST",
        headers:{
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`,
          
        },
        body: JSON.stringify(book) 
      }).then(res => res.json()).then(data => {
        refetch();
      })
      .catch(error => {
        console.error("Error:", error);
      });
    };
  

  const removeFromCart = (bookId) => {
    fetch(`https://book-store-api-theta.vercel.app/user/${userId}/cart/remove/${bookId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({bookId: bookId}),
      })
        .then(res => res.json())
        .then(data => {
          refetch()
        })
        .catch(error => {
          console.error("Error:", error);
        });
  };

  const removeFromWishlist = (bookId) => {
    fetch(`https://book-store-api-theta.vercel.app/user/${userId}/wishlist/remove/${bookId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({bookId: bookId}),
      })
        .then(res => res.json())
        .then(data => {
            refetch()
        })
        .catch(error => {
          console.error("Error:", error);
        });
  };

  const clearCart = () => {
    fetch(`https://book-store-api-theta.vercel.app/user/${userId}/cart/removeAll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
        },
      });
  };

  return (
    <CRUDContext.Provider value={{ addToWishlist, removeFromWishlist, addToCart, removeFromCart, clearCart }}>
      {children}
    </CRUDContext.Provider>
  );
};

export default CRUDProvider;
