import { getAboutUser } from '@/config/redux/action/authAction'
import DashbordLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import style from './style.module.css'
import { BASE_URL, clientServer } from '@/config'
import { getAllPosts } from '@/config/redux/action/postAction'

const ProfilePage = () => {

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);

  const [userProfile, setUserProfile] =useState({})
  const [userPosts, setUserPosts] = useState([])

  const [isOpenModal, setIsOpenModal] = useState(false);

  const[inputData, setInputData] = useState({
    company:"",
    position:"",
    years:""
  })

  const handelWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({...inputData, [name]: value });
   
  };

useEffect(() =>{
 dispatch(getAboutUser({token:localStorage.getItem("token")}))
 dispatch(getAllPosts());
}, [])

useEffect(() => {
  

if(authState.user !=undefined){
  setUserProfile(authState.user)

  let post = postReducer.posts.filter((post) =>{
    return post.userId.username === authState.user.userId.username
  })
  setUserPosts(post);
}
}
, [authState.user,postReducer?.posts])


const updateProfilePicture = async (file) =>{

  const formData = new FormData();
  formData.append("profile_picture", file);
  formData.append("token", localStorage.getItem("token"));

  const response = await clientServer.post("/update_profile_picture", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  dispatch(getAboutUser({token:localStorage.getItem("token")}))


  

}

const updateProfileData = async () =>{

const request = await clientServer.post("/user_update", {
  token:localStorage.getItem("token"),
  name:userProfile.userId.name,
})
  const response = await clientServer.post("/update_profile_data", {
    token:localStorage.getItem("token"),
    currentPost : userProfile.currentPost,
    bio:userProfile.bio,
    postWork:userProfile.postWork,
    education: userProfile.education,
  })
  dispatch(getAboutUser({token:localStorage.getItem("token")}))
  
}




  return (
    
        <UserLayout>
            <DashbordLayout>

              {authState.user && userProfile.userId &&

            <div  className={style.container}  >
      <div className={style.backDropContainer}  >
      <label htmlFor='profilePictureUpload' className={style.backDrop}>

        <p>Edit</p>
        
         </label>
         <input onChange={(e) => updateProfilePicture(e.target.files[0])} 
          hidden type="file" id='profilePictureUpload' />
<img    src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="" />


      </div>

      <div  className={style.profileContainer_details}>

        <div     className={style.profileContainer_flex} > 

          <div style={{flex:"0.8"}} >

            <div style={{display:"flex", gap:"1.2rem", alignItems:"center", width:"fit content"}} >

            

            
<input type="text" className={style.nameEdit} value={userProfile.userId.name} onChange={(e) =>{
  setUserProfile({
    ...userProfile,
    userId:{
      ...userProfile.userId,
      name:e.target.value
    }
  })
}} />

            
            </div>

            <div  style={{display:"flex", alignItems:"center", gap:"1.2rem"}}  >
            <p  style={{color:"gray"}} > @{userProfile.userId.username} </p>

          
           
            </div>
                   
                   <div>
                  <textarea value={userProfile.bio}
                  onChange={(e) =>{
                    setUserProfile({
                      ...userProfile,
                      bio:e.target.value
                    })
                  }
                  }
                  rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}

                  style={{width:"100%"}}
                   ></textarea>
                   </div>

          </div>

          <div style={{flex:"0.2"}} >

            <h3>Recent Activity</h3>
             {userPosts.map((post) => {
              
              

              return(
                <div  key={post._id} className={style.postCard}  >
<div className={style.card}>
  <div className={style.card_profileContainer}  > 
  


    {post.media !=="" ? <img src={`${BASE_URL}/${post.media}`} alt="" />
     :
      <div style={{width:"3.4rem", height:"3.4rem"}}> </div> }

  </div>

  <p>{post.body}</p>

</div>



                </div>
              )
             })}
            

            </div>

        </div>

      </div>

  <div className="workHistory">
    <h4>Work History</h4>
    <div className={style.workHistoryContainer} >
      {
        userProfile.postWork?.map((work,   index) => {
          return(
            <div key={index} className={style.workHistoryCard} >
              <p  style={{fontWeight:"bold", display:"flex", alignItems:"center", gap:"0.8rem", }} > {work.company} - {work.position} </p>
            </div>
          )
        })
      }

      <button className={style.addWorkButton} onClick={() => {
        setIsOpenModal(true)
      }}>
        Add Work
      </button>
      
  </div>
  </div>

  {
    userProfile != authState.user &&
     <div onClick={() =>{
      updateProfileData();
     }}
     className={style.connectionButton} >

Update Profile
      


       </div>

  }

     
    </div>
    }







{
  isOpenModal  && 

  

  <div   onClick = {() =>{
    setIsOpenModal(false)

  }}
   className={style.commentContainer}  >

  <div onClick={(e) =>{
    e.stopPropagation();

  }}
  className={style.allCommnetsContainer}>

<input  onChange={handelWorkInputChange} name='company' type="text" placeholder='Enter Company' className={style.inputField} />
<input  onChange={handelWorkInputChange} name='position'  type="text" placeholder='Enter Work Postion' className={style.inputField} />
<input  onChange={handelWorkInputChange} name='years' type="number" placeholder='Years' className={style.inputField} />

<div
  onClick={() => {
    setUserProfile({
      ...userProfile,
      postWork:[...userProfile.postWork, inputData]
    });
    setIsOpenModal(false);
  }}
  style={{ width: "fit-content" }}
  className={style.connectedBtn}
>
  Add Work
</div>






</div>

  </div>
}




            </DashbordLayout>
        </UserLayout>
      
   
  )
}

export default ProfilePage