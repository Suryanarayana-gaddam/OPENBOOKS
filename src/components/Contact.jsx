import Pic from "../assets/Pic.jpg"

const Contact = () => {

  return (
    <div className='px-5 md:px-12 pt-16 md:pt-20 lg:pt-24 text-center'>
      <h2 className='text-3xl'>Contact Us</h2>
      <br />
      <p>Have questions or feedback? We&apos;d love to hear from you!</p>
      <p>You can reach out to us via <b>email</b> <a href="mailto:suryanarayanagaddam020@gmail.com"  className='text-blue-700 underline font-bold'>Here</a>.</p>
      <div className='grid justify-end place-content-end  h-[450px] md:h-[310px]'><img src={Pic} alt="" width={100} height={100} className='ml-10 my-3 rounded'/><p style={{fontFamily:"cursive"}}>Surya Narayana Gaddam</p></div>
    </div>
  );
};

export default Contact;
