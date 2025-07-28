import mongoose, {Schema} from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
       type: String,
       required: true,
       unique: true
    },
    email: {
        type: String,
        default: true
    },
    password: {
        type: String,
        default: true
    },
    active: {
        type: Boolean,
        default: true
    },
    profilePicture: {
         type: String,
         default: 'default.jpg'
    },
    createdAt: {
       type: Date,
        default: Date.now
    },
   token: {
  type: String,  // पहले इसे Date के रूप में था, अब इसे String कर दिया गया है
  default: ""    // डिफ़ॉल्ट रूप से एक खाली स्ट्रिंग
}

});

const User = mongoose.model("User", UserSchema);

export default User;