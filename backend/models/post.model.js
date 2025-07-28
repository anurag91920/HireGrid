import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    body: {
        type: String,
        required: true
    },
    likes: {
        type: Number,  // Number for like count
        default: 0
    },
    
    likedByUsers: {
        type: [mongoose.Schema.Types.ObjectId], // Array to track users who liked the post
        default: []
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    media: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    },
    filetype: {
        type: String,
        default: ''
    },
});



const Post = mongoose.model("Post", postSchema);
export default Post;