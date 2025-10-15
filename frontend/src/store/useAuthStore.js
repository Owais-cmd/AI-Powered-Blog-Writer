import {create} from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set,get) => ({
    user: null,
    isLoading: false,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdating: false,
    getMe:async()=>{
        set((state)=>({isLoading:true}));
        try {
            const res = await axios.get('/api/auth/me');
            set((state)=>({user:res.data.user,isLoading:false}));
        } catch (error) {
            set((state)=>({isLoading:false}));
            console.log(error);
        }
    },
    signup:async({name,email,password})=>{
        set((state)=>({isSigningIn:true}));
        try {
            const res = await axios.post('/api/auth/signin',{name,email,password});
            set((state)=>({isSigningIn:false}));
            get().getMe();
            return {success:true,message:res.data.message};
        } catch (error) {
            set((state)=>({isSigningIn:false}));
            return {success:false,message:error.response.data.message};
        }
    },
    login:async({email,password})=>{
        set((state)=>({isLoggingIn:true}));
        try {
            const res = await axios.post('/api/auth/login',{email,password});
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
            await axios.post('/api/auth/logout');
            set((state)=>({user:null}));
        } catch (error) {
            console.log(error);
        }
    },
    update:async({name,bio,profileImage})=>{
        set((state)=>({isUpdating:true}));
        try {
            const res = await axios.post('/api/user/update',{name,bio,profileImage});
            set((state)=>({isUpdating:false}));
            set((state)=>({user:res.data.user}));
            console.log( {success:true,message:res.data.message,user:res.data.user});
        } catch (error) {
            set((state)=>({isUpdating:false}));
            return {success:false,message:error.response.data.message};
        }
    },
}));
