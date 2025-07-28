import e from "express";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comments.model.js";


export const activeCheck = async(req, res) =>{
    return res.status(200).json({message:"RUNING"})
}


export const createPost = async(req, res) =>{
    const {token} = req.body;

    try {
const user = await User.findOne({token:token});
if(!user){
    return res.status(400).json({message:"Invalid Token"})
}

const post = new Post({
    userId:user._id,
    body:req.body.body,
    media:req.file != undefined ? req.file.filename : '',
    filetype:req.file != undefined ? req.file.mimetype.split("/")[1] : ''
})

await post.save();
return res.status(200).json({message:"Post Created"})

        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getAllPosts = async(req, res) =>{
    try{
        const posts = await Post.find().populate("userId", "name username email profilePicture")
        return res.status(200).json({posts})
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}


export const deletePost = async(req, res) =>{
    const {token, post_id} = req.body;
    try {
        const user = await User.findOne({token:token}).select("_id");
        if(!user){
            return res.status(400).json({message:"Invalid Token"})
        }

        const post = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(400).json({message:"Invalid Post"})
        }

        if(post.userId.toString() !== user._id.toString()){
            return res.status(400).json({message:"You are not authorized to delete this post"})
        }

        await Post.deleteOne({_id:post_id});
        return res.status(200).json({message:"Post Deleted"})

    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}



export const get_comments_by_post= async(req, res) =>{
    const {post_id} = req.query;
    try {
        const post = await Post.findOne({_id:post_id})
        if(!post){
            return res.status(400).json({message:"Invalid Post"})
        }

const comments = await Comment.find({postId:post._id}).populate("userId", "name username ");

        return res.status(200).json(comments.reverse())
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


 export  const delete_comment_of_user =  async(req, res)=>{

const {token, comment_id} = req.body;
try {
    const  user = await User.findOne
    ({token:token}).select("_id");
    if(!user){
        return res.status(400).json({message:"User not found"})
    }

    const comment = await Comment.findOne({_id:
    comment_id});
    if(!comment){
        return res.status(400).json({message:"Invalid Comment"})
    }

    if(comment.userId.toString() !== user._id.toString()){
        return res.status(400).json({message:"You are not authorized to delete this comment"})
    }

    await Comment.deleteOne({_id:comment_id});
    return res.status(200).json({message:"Comment Deleted"})



 }catch(error){
     return res.status(500).json({message:error.message})
 }
 }

   // mongoose import karo agar nahi kiya hai

   export const toggle_like = async (req, res) => {
    const { post_id, user_id } = req.body;

    try {
        const post = await Post.findById(post_id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Initialize likedByUsers properly if missing
        if (!Array.isArray(post.likedByUsers)) {
            post.likedByUsers = [];
        } else {
            // Remove any accidental null/undefined inside array
            post.likedByUsers = post.likedByUsers.filter(id => id !== null && id !== undefined);
        }

        // Now safely work
        const userIdStr = user_id?.toString();
        const likedUsersStr = post.likedByUsers.map(id => id.toString());

        if (!userIdStr) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (likedUsersStr.includes(userIdStr)) {
            // Unlike
            post.likes = Math.max(0, post.likes - 1);
            post.likedByUsers = post.likedByUsers.filter(id => id.toString() !== userIdStr);
        } else {
            // Like
            post.likes += 1;
            post.likedByUsers.push(user_id);
        }

        await post.save();

        return res.status(200).json({
            message: "Post Like Toggled",
            likes: post.likes
        });

    } catch (error) {
        console.error("Toggle Like Error:", error);
        return res.status(500).json({ message: error.message });
    }
};