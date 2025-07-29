


import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { connection } from "next/server";
import { use } from "react";


export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {

        try{

            const response = await clientServer.post(`/login`,{
                email: user.email,
                password: user.password
            })

            if(response.data.token){
                localStorage.setItem("token", response.data.token)
            }else{
                return thunkAPI.rejectWithValue({message: "token not found"})
            }

return thunkAPI.fulfillWithValue(response.data.token)

        }catch(error){

            return thunkAPI.rejectWithValue({error: error.message})

        }
    }
)

export const registerUser = createAsyncThunk("user/register", async (user, thunkAPI) => {
    try {
        const response = await clientServer.post(`/register`, {
            username: user.username,
            name: user.name,
            email: user.email,
            password: user.password
        });

        const data = response.data;

        // Message ko handle karo, token ko nahi expect karo
        return thunkAPI.fulfillWithValue(data); // 👈 send full response

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});


export const getAboutUser = createAsyncThunk("user/getAboutUser", async (user, thunkAPI) => {
    try {
        const response = await clientServer.get("/get_user_and_profile", {
            params:{
                token: user.token
            }
        })

        return thunkAPI.fulfillWithValue(response.data)
        
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
        
    }
}
)

export const getAllUsers = createAsyncThunk("user/getAllUsers",
    async (_, thunkAPI) =>{
        try {

            const response = await clientServer.get("/user/get_all_users")

            console.log("API Response getAllUsers => ", response.data); 

            return thunkAPI.fulfillWithValue(response.data)
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
            
        }
    }
)


export const sendConnectionRequest = createAsyncThunk("user/sendConnectionRequest",
    async (user, thunkAPI) => {
        try {
           
            const response = await clientServer.post("/user/send_connection_request", {
                token: user.token,
                connectionId: user.user_id
            })

            thunkAPI.dispatch(getConnectionRequest({token: user.token}))

            return thunkAPI.fulfillWithValue(response.data)
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
            
        }
    }
)

export const getConnectionRequest = createAsyncThunk("user/getConnectionRequests",
    async (user, thunkAPI) => {
        try {
            console.log("getConnectionRequest called"); // 👈 Add this
            const response = await clientServer.get("/user/getConnectionRequest", {
                params:{
                    token: user.token
                }
            })
            console.log("API response jhdhs:", response.data);

            return thunkAPI.fulfillWithValue(response.data)
            
        } catch (error) {
            console.log("API error:", error.response?.data);
            return thunkAPI.rejectWithValue(error.response.data)
            
        }
    }
)

export  const getMyConnectionRequest = createAsyncThunk("user/getMyConnectionRequest",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get("/user/user_connection_request", {
                params:{
                    token: user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data)
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
            
        }
    }
)

export const AcceptConnection = createAsyncThunk("user/AcceptConnection",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/user/accept_connection_request", {
                token: user.token,
                requestId: user.connectionId,
                action_type: user.action
            })
            thunkAPI.dispatch(getConnectionRequest({token: user.token}))
            thunkAPI.dispatch(getMyConnectionRequest({token: user.token}))

            return thunkAPI.fulfillWithValue(response.data)
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
            
        }
    }
)