import React, { useContext, useState } from 'react'
import { Link , useLocation , useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/AuthProvider';
import googleLogo from "../assets/google-logo.svg"
import pica from "pica";
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import Loading from './Loading';
import image from "../assets/Open Books.jpg"

const Signup = () => {
    const {createUser,loginWithGoogle} = useContext(AuthContext);
    const [error,setError] = useState("");

    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(false);
    const picaa = pica();

    const location = useLocation();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [strengthMessage, setStrengthMessage] = useState('');
    const [messageColor, setMessageColor] = useState('');
    const [pwdInstruction,setPwdInstruction] = useState(null)
    const [proceed,setProceed] = useState(false)

    const [showPassword, setShowPassword] = useState(false);
    const token = localStorage.getItem("access-token");
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        evaluatePasswordStrength(newPassword);
    };
    const handleFocus = ((e) => {
        evaluatePasswordStrength(e.target.value)
    })

  const evaluatePasswordStrength = (newPassword) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasDigit = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*()_+}{:;'?/.,~[\]-]/.test(newPassword);
    
    if(newPassword.length < minLength){
        setPwdInstruction('* Password should be at least 8 characters long.');
        setStrengthMessage('Weak');
        setMessageColor('red')
    }
    if (newPassword.length >= minLength) {
        setPwdInstruction('* Password should have uppercase, lowercase, numeric and special chars');
        setStrengthMessage('Medium');
        setMessageColor('orange')
    }
    if (hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar) {
        setPwdInstruction("")
        setStrengthMessage('Strong');
        setMessageColor('green')
        setProceed(true)
    }
  }
    const handlePaste = (event) => {
        event.preventDefault();
        window.alert("Paste is not allowed in this field!")
    }
    
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
                const width = 300; 
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
                password: "",
                googleSignIn: true 
            };
            setLoading(true);
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
                    }).then(res => res.json()).then(data => {
                        alert("Signed up Successfully!");
                        navigate(from, { replace: true });
                    });
                } else {
                    alert(`Welcome back , ${user.displayName} `);
                    navigate(from, { replace: true });
                }
            }).catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage || error);
            }).finally(
                setTimeout(() => setLoading(false),1000)
            )
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage);
        })
    }
    
    
    const handleSignup = (event) => {
        event.preventDefault();
        if( !proceed ){
            return window.alert("Please enter a valid password!");
        }
        const form = event.target;
        setLoading(true)
        const username = form.username.value; 
        const email = form.email.value;
        const password = form.password.value;
      
        fetch(`https://book-store-api-theta.vercel.app/userByEmail/${email}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "authorization" : `Bearer ${token}`
            }
        }).then(res => {
            if (res.status == 404) {
                const userObj = {
                    username,
                    email,
                    password,
                    profilePic,
                    googleSignIn: false
                };

                createUser(email,password).then((userCredential) => {
                    const user = userCredential.user;
                    navigate("/login");
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setError(errorMessage);
                  });
                
                fetch("https://book-store-api-theta.vercel.app/sign-up", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(userObj)
                }).then(res => res.json()).then(data => {
                    alert("Signed up Successfully!");
                    navigate(from, { replace: true });
                }).catch(err =>{
                    console.log("Error: ",err.error)
                }).finally(
                    setTimeout(() => setLoading(false),1000)
                )
            } else {
                setTimeout(() =>setLoading(false),1000)
                alert("User already exists! please login!");
                navigate("/login")
            }
        }).catch(error => {
            setTimeout(() =>setLoading(false),1000)
            console.log("Error :",error,"err status:",error.status)
        });
    }

    if(loading){
        return <Loading/>
      }
    
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div
                className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
            </div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                <div className="max-w-md mx-auto">
                <Link to="/" ><img src={image} alt='logo' className={`sm:w-28 sm:h-28 md:w-[120px] md:h-[120px] absolute top-2 right-4 w-[90px] h-[90px] ml-4 rounded-full `}/></Link>
                    <div>
                        <h1 className="text-2xl font-semibold">Sign Up Form</h1>
                    </div>
                    <div className="divide-y divide-gray-200">
                        <form onSubmit={handleSignup} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                            <div className="relative">
                                <input autoComplete='off' autoFocus onChange={(e) => {e.target.value = e.target.value.toUpperCase()}} id="username" name="username" type="text" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="*User Name" required/>
                                
                            </div>
                            <div className="relative">
                                <input  autoComplete='off' onChange={(e) => {e.target.value = e.target.value.toLowerCase()}} id="email" name="email" type="email" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="*Email address" required />
                                
                            </div>
                            <div className="relative">
                                <input onPaste={handlePaste} id="password" name="password" type={showPassword ? 'text' : 'password'} defaultValue={password || null} className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600" placeholder="*Password" 
                                onChange={handlePasswordChange} onFocus={handleFocus} onBlur={() => {setPwdInstruction("")
                                    setStrengthMessage('');}} required/>
                                <button type="button" className='absolute right-3 top-2' onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash title='Hide'/> : <FaEye title='view'/>}
                                </button>
                            <div >
                                <span style={{fontSize:'13px'}}>{pwdInstruction}</span>
                                <p style={{ color: messageColor }}>{strengthMessage}</p>
                                </div>
                            </div>
                            <div className="relative">
                                <label htmlFor="profilePic" className="block">Profile Picture:</label>
                                <input id="profilePic" name="profilePic" type="file" accept=".jpeg, .png, .jpg" onChange={handleProfilePicChange} className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600" />
                            </div>
                            {error && <span className='text-red-500'>{error}</span>}
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

