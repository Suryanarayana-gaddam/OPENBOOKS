import React from 'react'
import Banner from '../components/Banner'
import BestSellerBooks from './BestSellerBooks'
import FavBook from './FavBook'
//import PromoBanner from './PromoBanner'
import OtherBooks from './OtherBooks'
//import Review from './Review'


const home = () => {
  const deviceDetails = {
    TimeAndDate :new Date().toISOString(),
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    devicePixelRatio: window.devicePixelRatio,
    timezoneOffset: new Date().getTimezoneOffset(),
    language: navigator.language,
};
console.log(navigator.userAgent)
console.log("deviceDetails: ",deviceDetails);
if ("geolocation" in navigator) {
  // Geolocation is available
  navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      // You can send these coordinates to your server for more detailed location info
  }, error => {
      console.error('Error getting geolocation:', error.message);
  });
} else {
  console.log('Geolocation is not available on this device');
}

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
