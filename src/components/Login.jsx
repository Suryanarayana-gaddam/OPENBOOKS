
import React, { useContext, useState } from 'react'
import { Link , useLocation , useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/AuthProvider';
import googleLogo from "../assets/google-logo.svg"

const Login = () => {

  const {login,loginWithGoogle} = useContext(AuthContext);
  const [error,setError] = useState("");
    
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (event) => {
      event.preventDefault();
      const form = event.target;
      const email = form.email.value;
      const password = form.password.value;
      login(email,password).then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // Check if the user already exists in the database
        fetch(`http://localhost:5000/userByEmail/${user.email}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        }).then(res => {
            if (!res.ok) {
            return res.json().then(error => {
                console.error("Error fetching user data:", error);
                // Handle the error (e.g., display a message to the user)
            });
            }
            return res.json(); // Parse valid JSON response
        })
        .then(Userdata => {
            alert(`Welcome back ${Userdata.username}!`);
            // console.log("userdata",Userdata);
            // console.log("Welcome back:", Userdata.username);
            navigate(from, { replace: true });
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
     
  }
  const from = location.state?.from?.pathname || "/";




const handleRegister = () => {
    loginWithGoogle().then((result) => {
        const user = result.user;
        const userObj = {
            username: user.displayName,
            email: user.email,
            password: "", // You can set a default password or leave it empty
            googleSignIn: true // Add a flag to indicate Google sign-in
        };
        //sessionStorage.setItem("username",user.displayName);
        // Check if the user already exists in the database
        fetch(`https://book-store-api-theta.vercel.app/userByEmail/${user.email}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        }).then(res => {
            if (res.status === 404) {
                // User does not exist, proceed with sign-up
                fetch("https://book-store-api-theta.vercel.app/login", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(userObj)
                }).then(res => res.json()).then(data => {
                    // console.log(data);
                    alert("Signed up Successfully!");
                    navigate(from, { replace: true });
                    //sessionStorage.setItem('session-active', 'true');
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

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 lg:pb-2">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div
                className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
            </div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                <div className="max-w-md mx-auto">
                    <div>
                        <h1 className="text-2xl font-semibold">Login Form</h1>
                    </div>
                    <div className="divide-y divide-gray-200">
                        <form onSubmit={handleLogin} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7 transition-4s">
                            <div className="relative">
                                <input  id="email" name="email" type="text" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" />
                                
                            </div>
                            <div className="relative">
                                <input id="password" name="password" type="password" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600" placeholder="Password" />
                                
                            </div>

                            { error ? <p className='text-red-600 text-base'>Email or Password is incorrect !</p> : "" }

                            <p>If you haven&apos;t an account. Please <Link to="/sign-up" className="text-blue-700 underline">Sign Up</Link></p>
                            <div className="relative">
                                <button className="bg-blue-500 text-white rounded-md px-6 py-2">Login</button>
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

export default Login
