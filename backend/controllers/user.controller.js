 import User from "../models/user.model.js";
 
 export const updateUser = async (req, res) => {
    try {
        const { name, profileImage} = req.body;
        const userId = req.user.id; // Assuming user ID is available in req.user
        const updatedData = { name, profileImage };
        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};