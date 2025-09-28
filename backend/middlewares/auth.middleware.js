import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifier = (req, res, next) => {
  const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;

        next();
    } catch (error) {
        return res.status(501).json({ message: "Invalid token" });
    }
}