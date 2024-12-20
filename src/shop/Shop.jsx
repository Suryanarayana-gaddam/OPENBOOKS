import { useEffect, useState } from "react";
import Search from "../components/Search";
import Cards from "../components/Cards";
import Loading from "../components/Loading";

const Shop = ({showSearchBox=true}) => {
  const [books, setBooks] = useState([]);
  const [loading,setLoading] = useState(false)
  const token = localStorage.getItem('access-token');
  useEffect(() => {
    setLoading(true)
    fetch("https://book-store-api-theta.vercel.app/all-books", {
      headers : {
          "authorization": `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) =>{
        throw new err;
      })
      .finally(() =>{
        setLoading(false)
      })
  }, [token]);

  if(loading){
    return <Loading/>
  }

  return (
    <div className={`px-2 lg:px-14 ${showSearchBox ? "mt-24 mb-10" : "relative bottom-12"}`}>
      <h2 className="text-3xl text-center text-bold bg-red-300 p-1 rounded text-black ">
        All Books Here
      </h2>
      
      {/* Cards */}
      {
        books && Array.isArray(books) && books.length > 0 ? (
          <div className={`${!showSearchBox ? "mt-12" : ""}`}>
            <Cards booksTodisplay={books}/>
          </div>
        ) : (
          <p className='text-center mt-20'>Currently No Books Avialable !</p> 
        )
      }
    </div>
  );
};

export default Shop;








