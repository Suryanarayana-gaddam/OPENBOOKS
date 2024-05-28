import React, { useState } from 'react';

const Contact = () => {
  // // State variables to store form data
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   message: ''
  // });

  // // Function to handle input changes
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value
  //   });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // Make a POST request to the backend API endpoint
  //     const response = await axios.post('http://your-backend-api/contact', formData);
  //     console.log('Email sent successfully:', response.data);
  //     // Optionally, display a success message to the user
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //     // Optionally, display an error message to the user
  //   }
  // };

  return (
    <div className='lg:px-24 pt-24 text-center'>
      <h2 className='text-3xl'>Contact Us</h2>
      <br />
      <p>Have questions or feedback? We&apos;d love to hear from you!</p>
      <p>You can reach out to us via <b>email</b> <a href="mailto:suryanarayanagaddam020@gmail.com"  className='text-blue-700 underline font-bold'>Here</a>.</p>
      
    </div>
  );
};

export default Contact;
