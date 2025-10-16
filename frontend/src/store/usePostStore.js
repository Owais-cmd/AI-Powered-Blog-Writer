import {create} from 'zustand';
import axios from 'axios';

const backend_url=import.meta.env.VITE_API_URL

export const usePostStore = create((set,get) => ({
    myposts: [],
    post:null,
    feed: [],
    isLoadingPost: false,
    isLoadingPosts: false,
    isLoadingFeed: false,
    isCreatingPost: false,
    isLikingPost: false,
    isDeleting: false,
    isSearching: false,
    getMyPosts: async () => {
        set({ isLoadingPosts: true });
        try {
            const response = await axios.get(`${backend_url}/api/posts/myposts`, {
                withCredentials: true,
            });
            set({ myposts: response.data, isLoadingPosts: false });
        } catch (error) {
            console.error('Error fetching my posts:', error);
            set({ isLoadingPosts: false });
        }
    },
    getFeed: async () => {
        set({ isLoadingFeed: true });
        try {
            const response = await axios.get(`${backend_url}/api/posts/all`, {
                withCredentials: true,
            });
            set({ feed: response.data, isLoadingFeed: false });
        } catch (error) {
            console.error('Error fetching feed:', error);
            set({ isLoadingFeed: false });
        }
    },
    createPost: async (postData) => {
        set({ isCreatingPost: true });
        try {
            const response = await axios.post(`${backend_url}/api/posts/create`, postData, {
                withCredentials: true,
            });
            set((state) => ({ myposts: [response.data, ...state.myposts], isCreatingPost: false }));
        } catch (error) {
            console.error('Error creating post:', error);
            set({ isCreatingPost: false });
        }
    },
    likePost: async (postId,userId) => {
        set({ isLikingPost: true });
        console.log("Liking post:", postId, userId);
        try {
            set((state) => ({
                feed: state.feed.map((post) =>
                    post._id === postId?{
              ...post,
              likes: post.likes.includes(userId)
                ? post.likes.filter((id) => id !== userId) // unlike if already liked
                : [...post.likes, userId], // like if not already
            }: post
                ),
                
            }));
            await axios.post(`${backend_url}/api/posts/like/${postId}`, null, {
                withCredentials: true,
            });
            set({ isLikingPost: false });
        } catch (error) {
            console.error('Error liking post:', error);
            set({ isLikingPost: false });
        }
    },
    deletePost: async (postId) => {
        set({ isDeleting: true });
        try {
            set((state) => ({
                myposts: state.myposts.filter((post) => post._id !== postId),
            }));
            await axios.delete(`${backend_url}/api/posts/delete/${postId}`, {
                withCredentials: true,
            });
            set({ isDeleting: false });
        } catch (error) {
            console.error('Error deleting post:', error);
            set({ isDeleting: false });
        }
    },
    getPostById: async (postId) => {
        set({ isLoadingPost: true });
        try {
            const response = await axios.get(`${backend_url}/api/posts/post/${postId}`,null ,{
                withCredentials: true,
            });
            set({ isLoadingPost: false });
            set({post:response.data})
        } catch (error) {
            console.error('Error fetching post by ID:', error);
            set({ isLoadingPost: false });
            return null;
        }
    },
    searchPosts: async (query) => {
        try {
            if(!query || query==''){
                get().getFeed();
                return;
            }
            set({ isSearching: true });    
            const response = await axios.post(`${backend_url}/api/posts/search`, { query }, {
                withCredentials: true,
            });
            set({ feed: response.data.posts, isSearching: false });
        }
        catch (error) {
            console.error('Error searching posts:', error);
            set({ isSearching: false });
        }
    },
}));
