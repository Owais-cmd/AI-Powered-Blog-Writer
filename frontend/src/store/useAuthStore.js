import {create} from 'zustand';
import axios from 'axios';

const backend_url=import.meta.env.VITE_API_URL
axios.defaults.withCredentials = true;


export const useAuthStore = create((set,get) => ({
    user: null,
    isLoading: false,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdating: false,
    getMe:async()=>{
        set((state)=>({isLoading:true}));
        try {
            const res = await axios.get(`${backend_url}/api/auth/me`, {
                withCredentials: true,
            });
            set((state)=>({user:res.data.user,isLoading:false}));
        } catch (error) {
            set((state)=>({isLoading:false}));
            console.log(error);
        }
    },
    signup:async({name,email,password})=>{
        set((state)=>({isSigningUp:true}));
        try {
            const res = await axios.post(`${backend_url}/api/auth/signin`,{name,email,password}, {
                withCredentials: true,
            });
            set((state)=>({isSigningUp:false}));
            get().getMe();
            return {success:true,message:res.data.message};
        } catch (error) {
            set((state)=>({isSigningUp:false}));
            return {success:false,message:error.response.data.message};
        }
    },
    login:async({email,password})=>{
        set((state)=>({isLoggingIn:true}));
        try {
            const res = await axios.post(`${backend_url}/api/auth/login`,{email,password}, {
                withCredentials: true,
            });
            set((state)=>({isLoggingIn:false}));
            get().getMe();
            return {success:true,message:res.data.message};
        } catch (error) {
            set((state)=>({isLoggingIn:false}));
            return {success:false,message:error.response.data.message};
        }
    },
    logout:async()=>{
        try {
            await axios.post(`${backend_url}/api/auth/logout`, null, {
                withCredentials: true,
            });
            set((state)=>({user:null}));
        } catch (error) {
            console.log(error);
        }
    },
    update:async({name,bio,profileImage})=>{
        set((state)=>({isUpdating:true}));
        try {
            const res = await axios.post(`${backend_url}/api/user/update`,{name,bio,profileImage}, {
                withCredentials: true,
            });
            set((state)=>({isUpdating:false}));
            set((state)=>({user:res.data.user}));
            console.log( {success:true,message:res.data.message,user:res.data.user});
        } catch (error) {
            set((state)=>({isUpdating:false}));
            return {success:false,message:error.response.data.message};
        }
    },
}));
