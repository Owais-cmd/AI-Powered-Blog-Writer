 import User from "../models/user.model.js";
 
 export const updateUser = async (req, res) => {
    try {
        const { name, profileImage} = req.body;
        const userId = req.user._id; // Assuming user ID is available in req.user
        if (!name && !profileImage) {
            return res.status(400).json({ message: 'No data provided for update' });
        }
        const updatedData = { name, profileImage };
        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        console.log(user.email);
        if (!user) {
            return res.status(404).json({ message: 'User not found1' });
        }
        req.user = user; // Update req.user with the latest user data
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};