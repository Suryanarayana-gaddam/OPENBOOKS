import React, { useContext, useState } from 'react'
import { Link , useLocation , useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/AuthProvider';
import googleLogo from "../assets/google-logo.svg"
import pica from "pica";

const Signup = () => {
    const {createUser,loginWithGoogle} = useContext(AuthContext);
    const [error,setError] = useState("error");

    const [profilePic, setProfilePic] = useState(null);

    const picaa = pica();

    const location = useLocation();
    const navigate = useNavigate();
    
    const from = location.state?.from?.pathname || "/";

    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const resizedImage = await resizeImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(resizedImage);
        }
    };

    const resizeImage = (file) => {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img');
            const canvas = document.createElement('canvas');
            const reader = new FileReader();

            reader.onload = (event) => {
                img.src = event.target.result;
            };

            img.onload = () => {
                const width = 300; // Set the desired width
                const scaleFactor = width / img.width;
                const height = img.height * scaleFactor;

                canvas.width = width;
                canvas.height = height;

                picaa.resize(img, canvas)
                    .then(result => picaa.toBlob(result, 'image/jpeg', 0.90))
                    .then(blob => resolve(blob))
                    .catch(err => reject(err));
            };

            img.onerror = reject;

            reader.readAsDataURL(file);
        });
    }; 

    const handleRegister = () => {
        loginWithGoogle().then((result) => {
            const user = result.user;
            const userObj = {
                username: user.displayName,
                email: user.email,               
                profilePic: user.photoURL,
                password: "", // You can set a default password or leave it empty
                googleSignIn: true // Add a flag to indicate Google sign-in
            };
    
            // Check if the user already exists in the database
            fetch(`https://book-store-api-theta.vercel.app/userByEmail/${user.email}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                }
            }).then(res => {
                if (res.status === 404) {
                    // User does not exist, proceed with sign-up
                    fetch("https://book-store-api-theta.vercel.app/sign-up", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify(userObj)
                    }).then(res => res.json()).then(data => {
                        // console.log(data);
                        alert("Signed up Successfully!");
                        navigate(from, { replace: true });
                        //sessionStorage.setItem('session-active', JSON.stringify(true));
                    });
                } else {
                    // User already exists
                    alert(`Welcome back , ${user.displayName} `);
                    navigate(from, { replace: true });
                }
            });
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage);
            // Handle error
        });
    }
    
    
    const handleSignup = (event) => {
        event.preventDefault();
        const form = event.target;
      
        const username = form.username.value; 
        const email = form.email.value;
        const password = form.password.value;
      
        // Check if the user already exists in the database
        fetch(`https://book-store-api-theta.vercel.app/userByEmail/${email}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        }).then(res => {
            if (res.status === 404 || res.status === 401) {
                // User does not exist, proceed with sign-up
                const userObj = {
                    username,
                    email,
                    password,
                    profilePic,
                    googleSignIn: false // Indicate non-Google sign-in
                };

                createUser(email,password).then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    alert("Signed up Successfully!");
                    navigate("/");
                    // ...
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setError(errorMessage);
                    // ..
                  });
                
                // Send data to database
                fetch("https://book-store-api-theta.vercel.app/sign-up", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(userObj)
                }).then(res => res.json()).then(data => {
                    alert("Signed up Successfully!");
                    navigate(from, { replace: true });
                    //sessionStorage.setItem('session-active', JSON.stringify(true));
                });
            } else {
                // User already exists
                alert("User already exists!");
            }
        });
    }
    
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div
                className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
            </div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                <div className="max-w-md mx-auto">
                    <div>
                        <h1 className="text-2xl font-semibold">Sign Up Form</h1>
                    </div>
                    <div className="divide-y divide-gray-200">
                        <form onSubmit={handleSignup} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                            <div className="relative">
                                <input  id="username" name="username" type="text" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="User Name" />
                                
                            </div>
                            <div className="relative">
                                <input  id="email" name="email" type="text" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" pattern='/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/'/>
                                
                            </div>
                            <div className="relative">
                                <input id="password" name="password" type="password" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600" placeholder="Password" />
                                
                            </div>
                            <div className="relative">
                                <label htmlFor="profilePic" className="block">Profile Picture:</label>
                                <input id="profilePic" name="profilePic" type="file" accept=".jpeg, .png, .jpg" onChange={handleProfilePicChange} className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600" />
                            </div>
                            <p>If you have an account. Please <Link to="/login" className="text-blue-700 underline">Login</Link></p>
                            <div className="relative">
                                <button className="bg-blue-500 text-white rounded-md px-6 py-2">Sign up</button>
                            </div>
                        </form>
                    </div>

                    <hr />
                    <div className='flex w-full items-center flex-col gap-3'>
                        <button onClick={handleRegister} className='block'><img src={googleLogo} alt="" className='w-12 h-12 inline-block'/>Login with Google</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Signup

