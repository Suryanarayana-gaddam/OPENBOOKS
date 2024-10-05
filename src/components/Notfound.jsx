import React from 'react'
import { Link } from 'react-router-dom'
import picture from "../assets/Open Books.jpg"
import { FaArrowLeft } from 'react-icons/fa'
const Notfound = () => {
  return (
    <div >
        <img src={picture} alt="" className='z-0 opacity-50 w-full h-screen absolute'/>
        <Link to={"/"} className='bg-green-400 px-3 text-white absolute py-2 rounded-full flex md:text-xl'> <span className='relative lg:top-[3px]'><FaArrowLeft/></span> <span className='relative bottom-[2px] left-1'>Go Home</span></Link>
        <div className='grid place-items-center h-screen text-black font-bold text-2xl md:text-3xl lg:text-5xl'>        
            Page Not Found
        </div>      
    </div>
  )
}

export default Notfound
