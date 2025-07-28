import React, { useEffect } from 'react'

import styles from "./index.module.css"
import { useRouter } from 'next/router'
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '@/config/redux/action/authAction';

export default function DashbordLayout({children}) {
 const router = useRouter();
 const dispatch = useDispatch()
 const authState = useSelector((state) => state.auth)

 console.log(authState.all_users); 

 useEffect(() => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      dispatch(setTokenIsThere());
      dispatch(getAllUsers());
    }
  }
}, []);

  return (
    <div>
      <div  className='container'  >

<div className={styles.homeContainer}>

    <div className= {styles.homeContainer_leftBar} >

       

        <div onClick={() => router.push("/dashboard")}
        
  
  className={styles.sideBArOptions} >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>
<p>Scroll</p>

        </div>



        <div   onClick={() => router.push("/Discover")} className={styles.sideBArOptions} >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>

<p>Discover</p>

        </div>


        <div onClick={() => router.push("/my_connections")} className={styles.sideBArOptions} >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
</svg>


<p>My Connections</p>

        </div>


       
    </div>

    <div className={styles.homeContainer_feedContainer}>
    {children}

</div>

<div className={styles.homeContainer_extraContainer}>
  <h3>Top Profiles</h3>

  {!authState.all_profiles_fetched ? (
    <p>Loading profiles...</p>
  ) : (
    Array.isArray(authState.all_users) && authState.all_users.length > 0 ? (
      authState.all_users.map((profile) => (
        <div key={profile._id} className={styles.profileCard}>
          
          <div className={styles.profileDetails}>
            <h4>{profile.userId?.name}</h4>
          
          </div>
        </div>
      ))
    ) : (
      <p>No profiles found.</p>
    )
  )}
</div>




</div>



</div>
    </div>
  )
}