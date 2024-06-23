import React from 'react'
import Banner from '../components/Banner'
import BestSellerBooks from './BestSellerBooks'
import FavBook from './FavBook'
//import PromoBanner from './PromoBanner'
import OtherBooks from './OtherBooks'
//import Review from './Review'


const home = () => {
  const deviceDetails = {
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    devicePixelRatio: window.devicePixelRatio,
    timezoneOffset: new Date().getTimezoneOffset(),
    language: navigator.language,
};
console.log(navigator.userAgent)
console.log("deviceDetails: ",deviceDetails);
  return (
    <div>
      <Banner/>
      <BestSellerBooks/> 
      <FavBook/>
      <OtherBooks/>
    </div>
  )
}

export default home
