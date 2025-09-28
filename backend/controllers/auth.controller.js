import User from "../models/user.model.js";
import bcrypt from "bcrypt";

import { generateCookie } from "../utils/generateCookie.js";

export const signin = async(req, res) => {
  try {
    const { name, email, password } = req.body;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!name || !email || !password){
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!regex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    generateCookie(res, newUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("logging: ",error);
  }
}

export const login = async(req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
    }
    generateCookie(res, user);
    res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("logging: ",error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("logging: ",error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
    } catch (error) {
        console.error("getting me",error);
    res.status(500).json({ message: "Server error" });
  }
}

export const logout = (req, res) => {
    try { 
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("logging out : ",error);
        res.status(500).json({ message: "Server error" });
    }
}

