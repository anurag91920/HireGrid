import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import Profile from '../models/profile.model.js'
import crypto from 'crypto'
import exp from "constants"
import PDFDocument from 'pdfkit'
import fs from 'fs'
import ConnectionRequest from "../models/connections.model.js"
import Post from "../models/post.model.js"
import Comment from "../models/comments.model.js"

const convertUserDataToPDF = async (userData) => {
    const doc = new PDFDocument({ margin: 50 });
    const outputPath = crypto.randomBytes(12).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);
    doc.pipe(stream);
  
    // Header with Name and Image
    if (userData.userId?.profilePicture) {
      const imagePath = `uploads/${userData.userId.profilePicture}`;

      
      try {
        if (fs.existsSync(imagePath)) {
          doc.image(imagePath, 400, 50, { width: 100 });
        }
      } catch (err) {
        console.error("Error adding image:", err);
      }
      



    }
  
    doc.fontSize(22).font("Helvetica-Bold").text(userData.userId.name, 50, 50);
    doc.moveDown(0.3);
    doc.fontSize(12).font("Helvetica").fillColor('gray')
       .text(userData.userId.email)
       .text(userData.userId.username)
       .moveDown(1.5);
  
    // Bio & Current Post
    doc.fillColor('black').fontSize(14).font("Helvetica-Bold").text("Bio:");
    doc.font("Helvetica").fontSize(12).text(userData.bio || "N/A").moveDown(1);
  
    doc.font("Helvetica-Bold").text("Current Position:");
    doc.font("Helvetica").fontSize(12).text(userData.currentPost || "N/A").moveDown(1);
  
    // Past Work Experience
    doc.font("Helvetica-Bold").fontSize(14).text("Work Experience", { underline: true }).moveDown(0.5);
  
    if (Array.isArray(userData.postWork) && userData.postWork.length > 0) {
      userData.postWork.forEach((work, i) => {
        doc.font("Helvetica-Bold").fontSize(12).text(`${i + 1}. ${work.company}`);
        doc.font("Helvetica").text(`Position: ${work.position}`);
        doc.text(`Years: ${work.years}`).moveDown(0.8);
      });
    } else {
      doc.font("Helvetica").text("No past work experience listed.").moveDown(1);
    }
  
    // Footer Line
    doc.moveTo(50, 750).lineTo(550, 750).strokeColor('gray').stroke();
    doc.fontSize(10).fillColor('gray').text("Generated via LinkedIn Clone", 50, 760, { align: "center" });
  
    doc.end();
    return outputPath;
  };
  

  

  export const register = async (req, res) => {
    try {
      const { name, email, password, username } = req.body;
      console.log("Register request body:", req.body);
  
      if (!name || !password || !username || !email)
  return res.status(400).json({ message: "All fields Required" });

  
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User Already Exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        username,
      });
  
      await newUser.save();
  
      const profile = new Profile({ userId: newUser._id });
      await profile.save();
  
      // Abhi token generate nahi kar rahe hain
  
      return res.json({
        message: "User registered successfully",
        // Token ko abhi response me nahi bhejna hai
      });
  
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

export const login = async(req, res)=>{

    try {
        const {email, password} = req.body;
        console.log("Login request body:", req.body);
        if(!email || !password) return res.status(400).json({message:"All field required"});
        const user = await User.findOne({
            email
        })

        if(!user) return res.status(404).json({message:"User does not exist"})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(401).json({message:"invalid credintials"})

                const token = crypto.randomBytes(32).toString("hex")

                await User.updateOne({_id:user._id}, {token})

                return res.json({token:token}) ;

        
    } catch (error) {

        return res.status(500).json({message:error.message})
        
    }

}

export const uploadProfilePicture = async(req, res)=>{

    const {token} = req.body;

    try {

        const user = await User.findOne({token:token})

        if(!user)return res.status(404).json({message:"User not found"})

            user.profilePicture = req.file.filename;

            await user.save();

            return res.json({message:"profile picture updated"})
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

export const updateUserProfile = async (req, res) => {
    try {
      const { token, ...newUserData } = req.body;
  
      const user = await User.findOne({ token });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { username, email } = newUserData;
  
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  
      if (existingUser && String(existingUser._id) !== String(user._id)) {
        return res.status(409).json({ message: "Username or email already in use" });
      }
  
      Object.assign(user, newUserData);
      await user.save();
  
      return res.status(200).json({ message: "Profile updated successfully", user });
  
    } catch (error) {
      console.error("Error in updateUserProfile:", error);
      return res.status(500).json({ message: error.message });
    }
  };
  

export const getUserAndProfile = async(req, res)=>{
    try {

        const {token} = req.query;

        const user =await User.findOne({token:token})


        if(!user){
            return res.status(404).json({message:"user not found"});

        }

        const userProfile = await Profile.findOne({userId:user._id}).populate('userId', 'name email username profilePicture')

        return res.json(userProfile)

        
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const updateProfileData = async(req, res)=>{

    try {
        const {token, ...newProfileData} = req.body;
        const userProfile = await User.findOne({token:token});
        if(!userProfile){
            return res.status(404).json({message:"user not found"});
        }
        const profile_to_update = await Profile.findOne({userId:userProfile._id});
        Object.assign(profile_to_update, newProfileData);
        await profile_to_update.save();
        return res.status(200).json({message:"Profile updated successfully", profile_to_update});
    

}catch(error){
    return res.status(500).json({message:error.message})
}
}


export const getAllUserProfile = async (req, res) => {
    try {
      const profiles = await Profile.find()
        .populate('userId', 'name email username profilePicture');
  
      //  Filter out profiles where userId is null (i.e., deleted user)
      const validProfiles = profiles.filter(profile => profile.userId !== null);
  
      return res.json(validProfiles);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

export const downloadProfile = async (req, res) => {
    try {
      const user_id = req.query.id;
      const userProfile = await Profile.findOne({ userId: user_id }).populate('userId', 'name email username profilePicture');
  
      // Null check
      if (!userProfile || !userProfile.userId) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const outputPath = await convertUserDataToPDF(userProfile);
      return res.json({ message: outputPath });
  
    } catch (error) {
      console.error("Download resume error:", error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  };

export const sendConnectionRequest = async(req, res)=>{

    const {token, connectionId} = req.body;

    try {

        const user = await
        User.findOne({token:token});

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const connectionUser = await User.findOne({_id:connectionId});

        if(!connectionUser){
            return res.status(404).json({message:"Connection user not found"});
        }

        const existingRequest = await ConnectionRequest.findOne({userId:user._id, connectionId:connectionUser._id});

        if(existingRequest){
            return res.status(400).json({message:"Request already sent"});
        }

        const request = new ConnectionRequest({
            userId:user._id,
            connectionId:connectionUser._id,
            
        });
         await request.save();
         return res.json({message:"Request sent successfully"});
        
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}


export const getMyConnectionsRequests = async(req, res)=>{
    const {token} = req.query;

    try {
        const user  = await User.findOne({token:token});

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const connection = await ConnectionRequest.find({userId:user._id}).populate('connectionId', 'name email username profilePicture');

        return res.json(connection);

    }catch(error){
        return res.status(500).json({message:error.message})
    }
}


export const whatAreMyConnections = async(req, res)=>{
    const {token} = req.query;

    try {
        const user = await User
        .findOne({token:token});

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const connections = await ConnectionRequest.find({connectionId:user._id}).populate('userId', 'name email username profilePicture');

        return res.json(connections);

    }catch(error){
        return res.status(500).json({message:error.message})
    }   
}


export const acceptConnectionRequest = async (req, res) => {
    const { token, requestId, action_type } = req.body;

    try {
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connection = await ConnectionRequest.findOne({ _id: requestId });

        if (!connection) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        if (action_type === "accept") {
            connection.status_accepted = true;
            await connection.save();
            return res.json({ message: "Connection request accepted" });
        } else {
            connection.status_accepted = false;
            await connection.save();
            return res.json({ message: "Connection request rejected" });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const commentPost = async(req, res)=>{
    const {token, post_id, commentBody} = req.body;

    try {
        const user = await User
        .findOne({token:token}).select("_id");

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const post = await Post.findOne({_id:post_id});

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        const comment = new Comment({
            userId:user._id,
            postId:post_id,
            body:commentBody
        });


        await comment.save();
        return res.json({message:"Comment added successfully"});


    }catch(error){
        return res.status(500).json({message:error.message})
    }
}


export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
    let { username } = req.query;
  
    console.log("Received username in backend:", username); //  First log
  
    try {
      // Trim and make case-insensitive
      username = username?.trim();
      console.log("Looking for user:", username); //  After trimming
  
      const user = await User.findOne({ 
        username: new RegExp(`^${username}$`, 'i') // case-insensitive exact match
      });
  
      console.log("User found:", user); // After fetching user
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      console.log("Looking for profile of:", user._id); //  Before fetching profile
  
      const userProfile = await Profile.findOne({ userId: user._id })
        .populate('userId', 'name email username profilePicture');
  
      console.log("Profile found:", userProfile); //  After fetching profile
  
      if (!userProfile) {
        return res.status(404).json({ message: "Profile not found for this user" });
      }
  
      return res.json({ profile: userProfile });
  
    } catch (error) {
      console.error("Error in getUserProfileAndUserBasedOnUsername:", error);
      return res.status(500).json({ message: error.message });
    }
  };
  
  