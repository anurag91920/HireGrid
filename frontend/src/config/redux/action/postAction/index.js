import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";




export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) =>{
        try {

            const response = await clientServer.get('/posts')
            console.log("getAllPosts API Response:", response.data); 

            return thunkAPI.fulfillWithValue(response.data)

            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
            
        }
    }
)

export const createPost = createAsyncThunk("post/createPost", async (userData, thunkAPI) => {
    const {file, body} = userData;

    try {

        const fromData = new FormData();
        fromData.append("token", localStorage.getItem("token"))
        fromData.append("body", body)
        fromData.append("media", file)

        const response = await clientServer.post('/post', fromData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        if(response.status ===200){
            return thunkAPI.fulfillWithValue("Post Uploaded Successfully")
        }else{
            return thunkAPI.rejectWithValue("Post Upload Failed")
        }

        
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
        
    }

}
)


export const deletePost = createAsyncThunk("post/deletePost", async (postId, thunkAPI) => {
    try {
        const response = await clientServer.post('/delete_post', {
            token: localStorage.getItem("token"),
            post_id:   postId 
        });

        if (response.status === 200) {
            return thunkAPI.fulfillWithValue("Post Deleted Successfully");
        } else {
            return thunkAPI.rejectWithValue("Post Deletion Failed");
        }

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
    }
});


export const togglePostLike = createAsyncThunk(
    "post/toggleLike",
    async ({ post_id, user_id }, thunkAPI) => {
        try {
            const response = await clientServer.post('/increment_post_like', {
                post_id,
                user_id,
            });

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue({
                    message: response.data.message,
                    likesCount: response.data.likes,
                    post_id,
                });
            } else {
                return thunkAPI.rejectWithValue("Post Like/Unlike Failed");
            }

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);


export const getAllComments = createAsyncThunk("post/getAllComments", async (postData, thunkAPI) => {
    try {
        const response = await clientServer.get('/get_comments', {
          params:{
            post_id: postData.post_id,
          
          }
        });

        if (response.status === 200) {
            return thunkAPI.fulfillWithValue({
                comments:response.data,
                post_id: postData.post_id
            });
        } else {
            return thunkAPI.rejectWithValue("Failed to fetch comments");
        }

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
    }
}
);

export const postComment = createAsyncThunk("post/postComment", async (commentData, thunkAPI) => {
    try {
        console.log({
            
            post_id: commentData.post_id,
            body: commentData.body
        })
        const response = await clientServer.post('/comment', {
            token: localStorage.getItem("token"),
            post_id: commentData.post_id,
            commentBody: commentData.body
        });

        if (response.status === 200) {
            return thunkAPI.fulfillWithValue("Comment Posted Successfully", response.data);
        } else {
            return thunkAPI.rejectWithValue("Comment Posting Failed");
        }

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
    }
}
);

export const deleteComment = createAsyncThunk("post/deleteComment", async (commentData, thunkAPI) => {
    try {
        console.log({
            token: commentData.token,
            comment_id: commentData.comment_id
        });

        const response = await clientServer.delete(`/delete_comment`, {
            headers: {
                'Authorization': `Bearer ${commentData.token}` // Send token in Authorization header
            },
            data: {
                token: commentData.token,  // Send token in the body
                comment_id: commentData.comment_id  // Send comment_id in the body
            }
        });

        if (response.status === 200) {
            return thunkAPI.fulfillWithValue("Comment Deleted Successfully", response.data);
        } else {
            return thunkAPI.rejectWithValue("Comment Deletion Failed");
        }

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
    }
});
