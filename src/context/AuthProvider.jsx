import React, { createContext, useEffect, useState } from 'react'
import app from '../firebase/firebase.config';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import axios from 'axios';
import Loading from '../components/Loading';


export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);
    const [load,setLoad] = useState(false);
    const [activeUser,setActiveUser] = useState({});

    const settingActiveUser = (object) => {
      setActiveUser(object);
    }

    const createUser = (email,password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth,email,password)
    }

    const loginWithGoogle = () => {
      setLoading(true);
      return signInWithPopup (auth,googleProvider);
    }

    const login = (email,password) => {
      setLoading(true);
      return signInWithEmailAndPassword(auth,email,password)
    }

    const logOut = () => {
      return signOut(auth);
    }
    
    const settingLoad = (val) => {
      console.log("val :",val)
      setLoad(val);
     }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,currentUser => {
          //console.log(currentUser);
          setUser(currentUser);
          if(currentUser){
            const userInfo = {email: currentUser.email}
            axios.post('https://book-store-api-theta.vercel.app/jwt', userInfo)
            .then( (response) => {
              //console.log(response.data.token);
              if(response.data.token){
                localStorage.setItem("access-token",response.data.token);
              }
            })
          }else{
            localStorage.removeItem("access-token");
          }
          setLoading(false);
        });

        return () => {
          return unsubscribe();
        }
    },[])

    if(loading || load){
      return <Loading/>
    }
    
    const authInfo = {
      user,
      createUser,
      loginWithGoogle,
      loading,
      load,
      settingLoad,
      login,
      logOut,
      activeUser,
      settingActiveUser
    }
  return (
    <AuthContext.Provider value={authInfo}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
