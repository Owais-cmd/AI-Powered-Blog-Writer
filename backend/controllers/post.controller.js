import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";

import { summary, seo } from '../controllers/ai.controller.js'

export const createPost = async (req, res) => {
    try {
        const { title, content, image } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }
        const userId = req.user._id; // Assuming user ID is available in req.user
        const summaryResult = await summary(req, res);
        const seoResult = await seo(req, res);
        const parsedKeywords = seoResult.slice(1, -2).split(',');
        const newPost = new Post({ title, content, image, user: userId, summary: summaryResult, tags: parsedKeywords });
        const user = await User.findById(userId);
        user.posts.push(newPost._id);
        await user.save();
        req.user = user; // Update req.user with the latest user data
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user','-password').populate('likes').populate('comments');
        const filteredPosts = posts.filter(post => post.user._id.toString() !== req.user._id.toString());
        const postsWithSortedComments = filteredPosts.map(post => {
            const sortedComments = post.comments.sort((a, b) => b.createdAt - a.createdAt);
            return { ...post._doc, comments: sortedComments };
        });
        res.status(200).json(postsWithSortedComments);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.user.toString() === userId.toString()) {
            return res.status(403).json({ message: "You cannot like your own post" });
        }
        if (post.likes.includes(userId)) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const myPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const posts = await Post.find({ user: userId }).populate('user','-password').populate('likes').populate('comments');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (!post.user.equals(userId)) {
            return res.status(403).json({ message: "You can only delete your own posts" });
        }
        await Post.findByIdAndDelete(postId);
        const user = await User.findById(userId);
        user.posts.pull(postId);
        await user.save();
        await Comment.deleteMany({ post: postId });
        req.user = user;
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

// GET /api/search/atlas?query=...
export const searchPost = async (req, res) => {
    const { query } = req.body;
    if (!query) return res.json({ posts: [], users: [] });

    try {
        const pipeline = [
            {
                $search: {
                    index: "dynamic", // or "default" if you're using default
                    compound: {
                        should: [
                            // exact phrase (ranks highest)
                            { phrase: { query, path: "title" } },

                            // prefix/typeahead (autocomplete)
                            { autocomplete: { query, path: "title", fuzzy: { maxEdits: 1 } } },

                            {autocomplete: {
                                path: "tags",
                                query,
                                fuzzy: { maxEdits: 1 }
                            }},

                            // fuzzy full-text match in content
                            { text: { query, path: "content", fuzzy: { maxEdits: 1 } } }
                        ]
                    }
                }
            },

            // include score to sort/inspect
            { $addFields: { score: { $meta: "searchScore" } } },

            // Populate user (aggregation-style)
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

            // project only needed fields
            {
                $project: {
                    title: 1,
                    content: 1,
                    "user._id": 1,
                    "user.name": 1,
                    "user.email": 1,
                    score: 1,
                    tags: 1,
                    likes: { $size: "$likes" },
                    comments: 1,
                    summary: 1,
                    createdAt: 1
                }
            },

            { $limit: 5 }
        ];
        const posts = await Post.aggregate(pipeline);

        res.json({ posts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate('user','-password').populate('likes').populate('comments');
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

