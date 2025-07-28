import React, { useEffect } from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { reset } from '@/config/redux/reducer/authReducer'
import { getAboutUser } from '@/config/redux/action/authAction'

const Navbar = () => {
  const router = useRouter()
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch()


  console.log("authState: ", authState);
console.log("authState.user: ", authState.user);
console.log("authState.user.userId: ", authState.user?.userId);


useEffect(() => {
  const token = localStorage.getItem("token");

  if (token && !authState.profileFetched) {
    dispatch(getAboutUser());  // 👈👈👈 bas yeh call kar dena
  }
}, []);


  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <h1 style={{ cursor: "pointer" }} onClick={() => {
          router.push("/")
        }}>
          Pro Connect
        </h1>

        <div className={styles.navbarOptionContainer}>
          {authState.profileFetched && (
            <div>
              <div style={{ display: "flex", gap: "1.2rem" }}>
              
              <p>Hey, {authState.user?.userId?.name || "Guest"}</p>




                 {/* Corrected */}
                <p onClick={() =>{
                  router.push("/profile")
                }} style={{ fontWeight: "bold", cursor: "pointer" }}> View Profile</p>

                <p onClick={() =>{
                  localStorage.removeItem("token")
                  router.push("/login")
                  dispatch(reset())
                }}  style={{ fontWeight: "bold", cursor: "pointer" }}>Logout</p>
              </div>
            </div>
          )}

          {!authState.profileFetched && (
            <div className={styles.buttonJoin} onClick={() => {
              router.push("/login")
            }}>
              <p>Be a Part</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar