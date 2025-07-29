import { BASE_URL } from '@/config'
import { getAllUsers } from '@/config/redux/action/authAction'
import DashbordLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import style from './style.module.css'
import { useRouter } from 'next/router'

export default function Discover() {

const  authState = useSelector((state) => state.auth)
const dispatch = useDispatch();
const router = useRouter();

useEffect(() =>{
    if(!authState.all_profiles_fetched){
        dispatch(getAllUsers());

    }
}, [])

  return (
    <UserLayout>
    <DashbordLayout>
 <div>
 <h1 className={style.discoverHeading}>Discover</h1>

     <div className={style.userProfile}  >

     {authState.all_profiles_fetched && authState.all_users?.map((user) => {
  if (!user?.userId) return null; // <-- safety check

  return (
    <div 
      onClick={() => router.push(`/view_profile/${user.userId.username}`)} 
      key={user._id} 
      className={style.userCard}
    >
      <img 
        className={style.userCard_img} 
        src={`${BASE_URL}/${user.userId.profilePicture}`} 
        alt={user.userId.name || 'User'} 
      />
      <div>
        <h2>{user.userId.name}</h2>
        <p>{user.userId.username}</p>
      </div>
    </div>
  );
})}



</div>
     
 </div>
 
 
    </DashbordLayout>
 
 
 
     </UserLayout>
  )
}