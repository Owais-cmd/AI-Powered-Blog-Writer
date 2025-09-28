import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

export const addComment = async (req, res) => {
    try {
        const { content, post , user} = req.body;
        if (!content || !post || !user) {
            return res.status(400).json({ message: "Content, Post ID and User ID are required" });
        }
        const newComment = new Comment({ content, post, user });
        await newComment.save();
        await Post.findByIdAndUpdate(post, { $push: { comments: newComment._id } });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId }).populate('user').sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};