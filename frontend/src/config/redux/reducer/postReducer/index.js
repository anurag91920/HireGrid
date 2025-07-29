import { createSlice } from "@reduxjs/toolkit";
import { getAllComments, getAllPosts, togglePostLike } from "../../action/postAction"; // 🔥 yaha import kar togglePostLike

const initialState = {
    posts: [],
    isLoading: false,
    isError: false,
    message: "",
    postFetched: false,
    postId: "",
    loggedIn: false,
    comments: [],
};

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        reset: () => initialState,
        resetPostId: (state) => {
            state.postId = "";
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllPosts.pending, (state) => {
            state.isLoading = true;
            state.message = "Fetching posts...";
        })
        .addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.posts = Array.isArray(action.payload.posts) ? action.payload.posts.reverse() : [];
            state.postFetched = true;
            state.message = "Post fetched successfully";
        })
        .addCase(getAllPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getAllComments.fulfilled, (state, action) => {
            state.postId = action.payload.post_id;
            state.comments = action.payload.comments;
        })
        
        // 🔥 Add ye naya togglePostLike wala:
        .addCase(togglePostLike.fulfilled, (state, action) => {
            const { post_id, likesCount } = action.payload;
        
            // Find the post and update its like count
            const post = state.posts.find((p) => p._id === post_id);
            if (post) {
                post.likes = likesCount;  // Update the like count
            }
        
            state.message = action.payload.message;
        })
        
        
        
        .addCase(togglePostLike.rejected, (state, action) => {
            state.isError = true;
            state.message = action.payload;
        });
    }
});

export const { reset, resetPostId } = postSlice.actions;

export default postSlice.reducer;