import {Routes, Route, Navigate} from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/useAuthStore'
import  LandingPage  from './pages/LandingPage'
import Feed from "./pages/Feed"
import  Home from './pages/Home'
import PostPage from './components/PostPage'
import CreatePost from './components/CreatePost'
import Profile from './components/Profie'
import Signup  from './pages/Signup'
import Login from './pages/Login'
import {Spinner} from "@/components/ui/spinner"
import {Toaster} from 'react-hot-toast'

const App = () => {
  const user = useAuthStore((state)=>state.user)
  const {getMe,isLoading} = useAuthStore();

  useEffect(()=>{
    getMe();
  },[getMe])
  if(isLoading){
    return <div className='w-full h-screen flex items-center justify-center'>
      <Spinner />
    </div>
  }

  return (
    <div>
      <Routes>
        <Route path='/home' element={!user?<LandingPage />:<Navigate to='/'/>} />
        <Route path='/login' element={!user?<Login />:<Navigate to='/'/>} />
        <Route path='/signup' element={!user?<Signup />:<Navigate to='/'/>} />
        <Route path="/" element={user?<Home />:<Navigate to='/home'/>}>
          <Route path="/" element={<Feed />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="myPosts" element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="post/:id" element={<PostPage />} />
        </Route>
      </Routes>
      <Toaster  />
      

    </div>
  )
}

export default App