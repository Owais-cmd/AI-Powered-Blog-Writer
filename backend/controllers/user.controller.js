 import User from "../models/user.model.js";
 import { v2 as cloudinary } from "cloudinary";
 import Post from "../models/post.model.js"
 
 export const updateUser = async (req, res) => {
    try {
        const { name,bio} = req.body;
        let {profileImage} = req.body;
        const userId = req.user._id; // Assuming user ID is available in req.user
        if (!name && !profileImage && !bio) {
            return res.status(400).json({ message: 'No data provided for update' });
        }
        if (profileImage) {
			if (req.user.profileImage) {
				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(req.user.profileImage.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImage);
			profileImage = uploadedResponse.secure_url;
		}
        const updatedData = { name, profileImage ,bio};
        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found1' });
        }
        user.password=null;
        req.user = user; // Update req.user with the latest user data
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const name = req.params.name;
        const user = User.find({name}).select('-password')
        const posts = await Post.find({ user: user._id }).populate('user','-password').populate('likes').populate('comments');
        res.status(200).json({posts,user});
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};