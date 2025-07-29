import { AcceptConnection, getMyConnectionRequest } from '@/config/redux/action/authAction';
import DashbordLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/userLayout'
import React, { use, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux';
import style from './style.module.css'
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function  MyConnections() {

  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth)

useEffect(() =>{
  dispatch(getMyConnectionRequest({token:localStorage.getItem("token")}))


  
}, [])

useEffect(() => {
if(authState.connectionRequests.length !=0){
  console.log("Connection Request:", authState.connectionRequests)
}
}, [authState.connectionRequests])


  return (
    
       <UserLayout>
   <DashbordLayout>
<div  style={{display:"flex", flexDirection:"column", gap:"1.7rem"}} >
   

<h4 className={style.sectionTitle}>My Connections</h4>

    {authState.connectionRequests.length ==0 && <h1 style={{textAlign:"center"}} >No Connection Requests  Pending</h1>}

{  authState.connectionRequests.length !=0 && authState.connectionRequests.filter((connection) =>connection.status_accepted === null).map((user, index) => {
  return(
    <div onClick={() =>{
      router.push(`/view_profile/${user.userId.username}`)
    }}
    key={index}  className={style.userCard}  >
      <div style={{display:"flex", alignItems:"center", gap:"1.3rem"}}  >
        <div className={style.profilePicture} >
          <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt={user.name} />

        </div>

        <div className={style.userCardInfo} >

          <h2 >{user.userId.name}</h2>
          <p >{user.userId.username}</p>

        </div>
        <button onClick={(e) =>{
  e.stopPropagation();
  dispatch(AcceptConnection({
    connectionId:user._id,
    token:localStorage.getItem("token"),
    action:"accept"
  }))
        }}
         className={style.connectedButton} >Accept</button>

      </div>
      
    </div>
  )
}
)}

<h4 className={style.sectionTitle}>My Network</h4>


{authState.connectionRequests.filter((connection) =>connection.status_accepted !== null).map((user, index) => {
  return(
  <div onClick={() =>{
    router.push(`/view_profile/${user.userId.username}`)
  }}
  key={index}  className={style.userCard}  >
    <div style={{display:"flex", alignItems:"center", gap:"1.3rem"}}  >
      <div className={style.profilePicture} >
        <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt={user.name} />

      </div>

      <div className={style.userCardInfo} >

        <h2 >{user.userId.name}</h2>
        <p >{user.userId.username}</p>

      </div>
      

    </div>
    
  </div>
  )

})}


</div>


   </DashbordLayout>



    </UserLayout>


    
  )
}