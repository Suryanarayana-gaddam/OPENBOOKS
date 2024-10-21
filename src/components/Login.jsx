
import React, { useContext, useState } from 'react'
import { Link , useLocation , useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/AuthProvider';
import googleLogo from "../assets/google-logo.svg"
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { setLogLevel } from 'firebase/app';
import Loading from './Loading';
import image from "../assets/Open Books.jpg"

const Login = () => {
  const {login,loginWithGoogle} = useContext(AuthContext);
  const [error,setError] = useState({status:0,message:""});
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
  };

    const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    };

  const handleLogin = (event) => {
    event.preventDefault();
    setLoading(true)
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    
        fetch("https://book-store-api-theta.vercel.app/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({email,password})
            })
            .then(res => {
                if (res.status === 404 || res.status === 401) {
                    setError(prev => ({...prev,status : res.status}))
                    return res.json().then(data => {
                        console.log("res:", res.status, data.error);
                        setError(dat => ({...dat,message:data.error})); // Return data for further processing if needed
                    });
                }else {
                    return res.json().then(result => {
                        login(email,password).then((userCredential) => {
                            const user = userCredential.user;
                            setError({status:0,message:""})
                            navigate("/",{replace:true})
                            alert("Welcome Back User...")
                        }).catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log("error :",errorMessage)
                        setError(errorMessage);
                        setLogLevel(false)
                        });
                    })
                }
            })
            .catch(error =>{
                console.error("Error in Login:",error)
                setError(error)
            }).finally(
                setTimeout(() => setLoading(false),1000)
            )
        }
  const from = location.state?.from?.pathname || "/";

const handleRegister = () => {
    loginWithGoogle().then((result) => {
        const user = result.user;
        const userObj = {
            username: user.displayName,
            email: user.email,
            password: "",
            googleSignIn: true 
        };
        setLoading(true);
        
        const token = localStorage.getItem('access-token');
        fetch(`https://book-store-api-theta.vercel.app/userByEmail/${user.email}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                }
        }).then(res => {
            if (res.status === 404) {
                fetch("https://book-store-api-theta.vercel.app/sign-up", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "authorization" : `Bearer ${token}`
                    },
                    body: JSON.stringify(userObj)
                }).then(res => res.json()).then(response => {
                    if(response.ok){
                        alert("Signed up Successfully!");
                        navigate(from, { replace: true });
                    }
                }).catch(error =>{
                    console.error("Error in Signup:",error);
                }).finally(
                    setTimeout(() => setLoading(false),1000)
                )
            } else {
                setTimeout(() => setLoading(false),1000)                    
                alert(`Welcome back , ${user.displayName} `);
                navigate(from, { replace: true });
            }
        })
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
    });
}
if(loading){
    return <Loading/>
  }

const handlePaste = (event) => {
    event.preventDefault();
    window.alert("Paste is not allowed in Password!")
}

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 lg:pb-2">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div
                className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
            </div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                <div className="max-w-md mx-auto">
                <Link to="/" ><img src={image} alt='logo' className={`sm:w-28 sm:h-28 md:w-[120px] md:h-[120px] absolute top-2 right-4 w-[90px] h-[90px] ml-4 rounded-full `}/></Link>
                    <div>
                        <h1 className="text-2xl font-semibold">Login Form</h1>
                    </div>
                    <div className="divide-y divide-gray-200">
                        <form onSubmit={handleLogin} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7 transition-4s">
                            <div className="relative">
                                <input  id="email" autoComplete='off' autoFocus={error.status === 404 || error.status === 0} name="email" type="email" onChange={(e) => setEmail(e.target.value)} value={email} className={`${error.status === 404 ? "border-red-700 border-2 focus:border-red-700" : "border-gray-300 focus:border-rose-600 border-b-2"} peer h-10 w-full text-gray-900 focus:outline-none`} placeholder="Email address" required/>
                            </div>
                            <div className="relative">
                                <input id="password" name="password" autoFocus={error.status === 401} type={showPassword ? 'text' : 'password'} onPaste={handlePaste} autoComplete='off' onChange={handlePasswordChange} className={`${error.status === 401 ? "border-red-700 border-2 focus:border-red-700" : "border-gray-300 border-b-2 focus:border-rose-600"} peer h-10 w-full text-gray-900 focus:outline-none `} placeholder="Password" value={password} required />
                                <button type="button" className='absolute right-3 top-2' onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash title='Hide'/> : <FaEye title='view'/>}
                                </button>
                            </div>
                            { error.message ? <p className='text-red-600 text-base '>{error.message}</p> : "" }


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
