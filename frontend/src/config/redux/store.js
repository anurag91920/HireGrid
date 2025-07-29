
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./reducer/authReducer"
import postReducer from "./reducer/postReducer"

// steps for state management 
//  submit action 
//  handele action in reducer 


// register here reducer 

   export  const store = configureStore({
    reducer: {
      auth : authReducer,
      posts: postReducer
    }

 })