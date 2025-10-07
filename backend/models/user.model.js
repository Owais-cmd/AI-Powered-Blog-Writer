import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type:String,
        default:"",
    },
    profileImage: {
        type: String,
        default: "",
    },
    posts: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: [] }
    ],
},
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;