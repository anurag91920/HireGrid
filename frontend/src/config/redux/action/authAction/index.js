import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const loginUser = createAsyncThunk("user/login", async (userAgent, thunkAPI) => {
    try {
        const response = await clientServer.post("/login",  {
            email: user.email,
            password: user.password
        });

         if (response.data.token) {
            localStorage.setItem("token", response.data.token)
         }
         else {
            return thunkAPI.rejectWithValue({
                message: "token not provided"
            })
         }

         return thunkAPI.fulfillWithValue(response.data.token)

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    
    }
})

export const registerUser = createAsyncThunk("user/register", async (user, thunkAPI) => {
    try {
        const response = await clientServer.post("/register", user);

        if (response.data.token) {
            localStorage.setItem("token", response.data.token)
        } else {
            return thunkAPI.rejectWithValue({
                message: "token not provided"
            })
        }

        return thunkAPI.fulfillWithValue(response.data.token)

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
})



    