import { useEffect, useState } from "react";
import Search from "../components/Search";
import Cards from "../components/Cards";
import Loading from "../components/Loading";

const Shop = ({showSearchBox=true}) => {
  const [books, setBooks] = useState([]);
  const token = localStorage.getItem('access-token');
  const [loading,setLoading] = useState(false)
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
    <div className={`px-4 lg:px-24 ${showSearchBox ? "mt-24 mb-10" : "relative bottom-12"}`}>
      <h2 className="text-3xl text-center text-bold text-black ">
        All Books Here
      </h2>
      {showSearchBox && (
        <Search/>
      )}
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








