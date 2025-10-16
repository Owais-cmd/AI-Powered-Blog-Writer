import { create } from "zustand";
import axios from "axios";

const backend_url=import.meta.env.VITE_API_URL

export const useCommentStore = create((set, get) => ({
    comments: [],
    isLoadingComments: false,
    isAdding: false,
    getCommentsByPost: async (postId) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${backend_url}/api/comments/${postId}`);
            set({ comments: response.data, isLoading: false });
            return response.data;
        }
        catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    },
    addComment: async (commentData) => {
        set({ isAdding: true });
        try {
            const newComment = await axios.post(`${backend_url}/api/comments`, commentData);
            set((state) => ({ comments: [newComment.data, ...state.comments], isAdding: false }));
            return newComment.data;
        }
        catch (error) {
            console.error("Failed to add comment:", error);
            set({ isAdding: false });
        }
    },
}));
