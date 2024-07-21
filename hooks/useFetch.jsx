import { useEffect, useState } from 'react'

const useFetch = (url) => {
    const [data,setData] = useState([]);
    const token = localStorage.getItem("access-token");

    useEffect(() => {
        const fetchData = async () =>{
            try{
                const response = await fetch(url,{
                    method:"GET",
                    headers:{
                        "Content-type" : "application/json",
                        authorization:`Bearer ${token}`
                    },
                });
                if(!response.ok){
                    return console.error(`Fetch failed for ${url}`)
                }
                const resData = await response.json();
                //console.log("Response:",resData)
                const resDataArray = [resData]
                setData([...data,resDataArray]);
            }catch(error){
                console.log("Error :",error)
            }
        }
        fetchData();
    },[url,token])

   return {data}
  
}

export default useFetch
