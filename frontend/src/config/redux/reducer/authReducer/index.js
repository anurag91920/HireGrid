import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, getConnectionRequest, getMyConnectionRequest, loginUser, registerUser } from "../../action/authAction";
const initialState ={
    user:undefined,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere: false,
    profileFetched: false,
    connections: [],
    connectionRequests: [],
    all_users: [],
    all_profiles_fetched: false,

}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset:()=> initialState,
        handelLoginUser : (state) => {
            state.message = "hello"

        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setTokenIsThere: (state, action) => {
            state.isTokenThere =true;
        },
        setTokenIsNotThere: (state, action) => {
            state.isTokenThere =false;
        },
    },

    extraReducers:(builder) => {

        builder
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true
            state.message = "knocking the door..."
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.isError = false
            state.loggedIn=true

            state.isSuccess = true
            state.message = "Login is successfull"
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.loggedIn=false
            state.message = action.payload
        })
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true
            state.message = "knocking the door..."
        }
        )
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.loggedIn = false;  // User ko directly login mat karo, pehle register karo
            state.isSuccess = true;
            state.message =  "User registered successfull";
          })
        
        .addCase(registerUser.rejected, (state, action) => {
            console.log("Register rejected payload:", action.payload);
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload.message || "Something went wrong";
        })
        
        .addCase(getAboutUser.fulfilled, (state, action) => {
            console.log("API Payload:", action.payload);
            state.isLoading = false
            state.isError = false
            
            state.profileFetched = true
            state.user = action.payload
            
            
        }
        )
        .addCase(getAllUsers.fulfilled, (state, action) => {
            state.isLoading = false
            state.isError = false
            state.all_profiles_fetched = true
            state.all_users = action.payload
        }
        )
        .addCase(getConnectionRequest.fulfilled, (state, action) => {
            console.log("Payload inside reducer:", action.payload);
            state.connections = action.payload;
            
        }
        )
        .addCase(getConnectionRequest.rejected, (state, action) => {
            
            state.message = action.payload
        }
        )
        .addCase(getMyConnectionRequest.fulfilled, (state, action) => {
            state.connectionRequests = action.payload
        }
        )
        .addCase(getMyConnectionRequest.rejected, (state, action) => {
            state.message = action.payload
        }
        )
    }
})
export const {reset,  emptyMessage, setTokenIsThere, setTokenIsNotThere} = authSlice.actions
export default authSlice.reducer