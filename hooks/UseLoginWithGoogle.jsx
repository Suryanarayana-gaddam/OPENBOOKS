import React, { useContext, useState } from 'react'
import { AuthContext } from '../src/context/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../src/components/Loading';

const UseLoginWithGoogle = ({setError}) => {

    const {createUser,loginWithGoogle} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("access-token");
    const navigate = useNavigate();
    const location = useLocation();
    const from = location?.pathname;

    if(loading){
        return <Loading/>
      }

    const handleRegister = () => {
        
        loginWithGoogle().then((result) => {
            const user = result.user;
            const userObj = {
                username: user.displayName,
                email: user.email,               
                profilePic: user.photoURL,
                password: "",
                userDetails : user,
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
                    alert(`Welcome, ${user.displayName} `);
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
            setError(errorCode+errorMessage);
        })
    }
  return handleRegister;
}

export default UseLoginWithGoogle


// const handleRegister = () => {
        
    //     loginWithGoogle().then((result) => {
    //         const user = result.user;
    //         const userObj = {
    //             username: user.displayName,
    //             email: user.email,               
    //             profilePic: user.photoURL,
    //             password: "",
    //             userDetails : user,
    //             googleSignIn: true 
    //         };
    //         setLoading(true);
    //         fetch(`https://book-store-api-theta.vercel.app/userByEmail/${user.email}`, {
    //             method: "GET",
    //             headers: {
    //                 "Content-type": "application/json",
    //             }
    //         }).then(res => {
    //             if (res.status === 404) {
    //                 fetch("https://book-store-api-theta.vercel.app/sign-up", {
    //                     method: "POST",
    //                     headers: {
    //                         "Content-type": "application/json",
    //                         "authorization" : `Bearer ${token}`
    //                     },
    //                     body: JSON.stringify(userObj)
    //                 }).then(res => res.json()).then(data => {
    //                     alert("Signed up Successfully!");
    //                     navigate(from, { replace: true });
    //                 });
    //             } else {
    //                 alert(`Welcome back , ${user.displayName} `);
    //                 navigate(from, { replace: true });
    //             }
    //         }).catch((error) => {
    //             const errorMessage = error.message;
    //             setError(errorMessage || error);
    //         }).finally(
    //             setTimeout(() => setLoading(false),1000)
    //         )
    //     }).catch((error) => {
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         setError(errorMessage);
    //     })
    // }


//from Login

    // const handleRegister = () => {
    //     loginWithGoogle().then((result) => {
    //         const user = result.user;
    //         const userObj = {
    //             username: user.displayName,
    //             email: user.email,
    //             password: "",
    //             userDetais: user,
    //             profilePic: user.photoURL,
    //             googleSignIn: true 
    //         };
    //         setLoading(true);
            
    //         const token = localStorage.getItem('access-token');
    //         fetch(`https://book-store-api-theta.vercel.app/userByEmail/${user.email}`, {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-type": "application/json",
    //                 }
    //         }).then(res => {
    //             if (res.status === 404) {
    //                 fetch("https://book-store-api-theta.vercel.app/sign-up", {
    //                     method: "POST",
    //                     headers: {
    //                         "Content-type": "application/json",
    //                         "authorization" : `Bearer ${token}`
    //                     },
    //                     body: JSON.stringify(userObj)
    //                 }).then(res => res.json()).then(response => {
    //                     if(response.ok){
    //                         alert("Signed up Successfully!");
    //                         navigate(from, { replace: true });
    //                     }
    //                 }).catch(error =>{
    //                     console.error("Error in Signup:",error);
    //                 }).finally(
    //                     setTimeout(() => setLoading(false),1000)
    //                 )
    //             } else {
    //                 setTimeout(() => setLoading(false),1000)                    
    //                 alert(`Welcome back , ${user.displayName} `);
    //                 navigate(from, { replace: true });
    //             }
    //         })
    //     }).catch((error) => {
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         setError(errorMessage);
    //     });
    // }