import React, { useContext, useState } from 'react'
import { AuthContext } from '../src/context/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../src/components/Loading';

const useSignUp = ({proceed,setError,setLoading,profilePic}) => {

    const {createUser,loginWithGoogle} = useContext(AuthContext);
    const token = localStorage.getItem("access-token");
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

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
                createUser(email,password).then((userCredential) => {
                    const user = userCredential.user;
                    const userObj = {
                        username,
                        email,
                        password,
                        profilePic,
                        userDetails : user,
                        googleSignIn: false
                    };

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

                    navigate("/login");
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode+errorMessage);
                    
                    setError(errorMessage);
                  });
                
            } else {
                setTimeout(() =>setLoading(false),1000)
                alert("User already exists! please login!");
                //navigate("/login")
            }
        }).catch(error => {
            setTimeout(() =>setLoading(false),1000)
            console.log("Error :",error,"err status:",error.status)
        });
    }

  return handleSignup;
}

export default useSignUp


    // const handleSignup = (event) => {
    //     event.preventDefault();
    //     if( !proceed ){
    //         return window.alert("Please enter a valid password!");
    //     }
    //     const form = event.target;
    //     setLoading(true)
    //     const username = form.username.value; 
    //     const email = form.email.value;
    //     const password = form.password.value;
      
    //     fetch(`https://book-store-api-theta.vercel.app/userByEmail/${email}`, {
    //         method: "GET",
    //         headers: {
    //             "Content-type": "application/json",
    //             "authorization" : `Bearer ${token}`
    //         }
    //     }).then(res => {
    //         if (res.status == 404) {

    //             createUser(email,password).then((userCredential) => {
    //                 const user = userCredential.user;
    //                 const userObj = {
    //                     username,
    //                     email,
    //                     password,
    //                     profilePic,
    //                     userDetails : user,
    //                     googleSignIn: false
    //                 };

    //                 fetch("https://book-store-api-theta.vercel.app/sign-up", {
    //                     method: "POST",
    //                     headers: {
    //                         "Content-type": "application/json",
    //                     },
    //                     body: JSON.stringify(userObj)
    //                 }).then(res => res.json()).then(data => {
    //                     alert("Signed up Successfully!");
    //                     navigate(from, { replace: true });
    //                 }).catch(err =>{
    //                     console.log("Error: ",err.error)
    //                 }).finally(
    //                     setTimeout(() => setLoading(false),1000)
    //                 )

    //                 navigate("/login");
    //               })
    //               .catch((error) => {
    //                 const errorCode = error.code;
    //                 const errorMessage = error.message;
    //                 setError(errorMessage);
    //               });
                
    //         } else {
    //             setTimeout(() =>setLoading(false),1000)
    //             alert("User already exists! please login!");
    //             navigate("/login")
    //         }
    //     }).catch(error => {
    //         setTimeout(() =>setLoading(false),1000)
    //         console.log("Error :",error,"err status:",error.status)
    //     });
    // }