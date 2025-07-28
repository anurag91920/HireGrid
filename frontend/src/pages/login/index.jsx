import UserLayout from '@/layout/userLayout'
import { useRouter } from 'next/router'
import React, { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./style.module.css"
import { getAboutUser, loginUser, registerUser } from '@/config/redux/action/authAction'
import { emptyMessage } from '@/config/redux/reducer/authReducer'

function  LoginComponent() {

const authState = useSelector((state) => state.auth)
const router = useRouter();
const dispatch = useDispatch();
const [isLoginMethod, setIsLoginMethod] = useState(false)

const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [username, setUsername] = useState("")
const [name, setName] = useState("")

useEffect(() => {
  if (authState.loggedIn && authState.profileFetched) {
    router.push("/dashboard");
  }
}, [authState.loggedIn, authState.profileFetched]);


  useEffect(() => {
   dispatch(emptyMessage())
  }
  , [isLoginMethod])

  useEffect(() => {
    if(localStorage.getItem("token")){
      router.push("/dashboard")
    }
  }, )

  const handelRegister = async () => {
    try {
      await dispatch(registerUser({ username, email, password, name })).unwrap();
      const token = localStorage.getItem("token");
      if (token) {
        await dispatch(getAboutUser({ token })).unwrap();
      }
    } catch (error) {
      console.log("Register Error:", error);
    }
  };
  

const handelLogin = async () => {
  try {
    await dispatch(loginUser({ email, password })).unwrap();
    const token = localStorage.getItem("token");
    if (token) {
      await dispatch(getAboutUser({ token })).unwrap();
    }
  } catch (error) {
    console.log("Login Error:", error);
  }
};


  return (
    <UserLayout>
<div className={styles.container}>

    <div className={styles.cardContainer} >

      <div className={styles.cardContainer_left}>

        <p className={styles.cardleft_heading}  >{isLoginMethod ? "Sign in" : "Sign Up"}</p>

        <p style={{ color: authState.isError ? "red" : "green" }}>
  {typeof authState.message === "string" 
    ? authState.message 
    : authState.message.message}
</p>

  


<div className={styles.inputContainer}>


  { !isLoginMethod && <div  className={styles.inputRow}  >
        <input  onChange={(e) =>  setUsername(e.target.value)}  type="text" placeholder='Username' className={styles.inputField} />
        <input  onChange={(e) =>  setName(e.target.value)}  type="text" placeholder='Name' className={styles.inputField} />

        </div>}

        <input  onChange={(e) =>  setEmail(e.target.value)}  type="text" placeholder='Email' className={styles.inputField} />


        <input  onChange={(e) =>  setPassword(e.target.value)}  type="text" placeholder='Password' className={styles.inputField} />

        <div  onClick={() =>{
          if(isLoginMethod){
            handelLogin();

          }else{
            handelRegister();
          }
        }}
        className={styles.buttonwithOutline}>

        <p   >{isLoginMethod ? "Sign in" : "Sign Up"}</p>

        </div>

        </div>


      </div>

      <div className={styles.cardContainer_right}>

      <img
    src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7963.jpg?t=st=1746003225~exp=1746006825~hmac=29438af6baec2cd47f8e7d8aa95f2c1ba94620bb9a61958d2a5ab44566519c23&w=740"
    alt="Login Illustration"
    className={styles.authImage}
  />

  {isLoginMethod ?  <p>Don't Have an Account </p> : <p>Already Have an Account?</p>}
        
        <div  onClick={() =>{
          setIsLoginMethod(!isLoginMethod)
        }}
        className={styles.buttonwithOutline} style={{color:"black", textAlign:"center"}}  >

        <p   >{isLoginMethod ? "Sign Up" : "Sign In"}</p>

        
        </div>

        
      </div>
     
    </div>
    </div>
    </UserLayout>
  )
}

export default LoginComponent