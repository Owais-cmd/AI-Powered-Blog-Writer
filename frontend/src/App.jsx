import {Routes, Route, Navigate} from 'react-router-dom'

import  LandingPage  from './pages/LandingPage'
import Feed from "./pages/Feed"
import  Home from './pages/Home'
import PostPage from './components/PostPage'
import CreatePost from './components/CreatePost'
import Profile from './components/Profie'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/home' element={<LandingPage />} />
        <Route path="/" element={<Home />}>
          <Route path="/" element={<Feed />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="myPosts" element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="post/:id" element={<PostPage />} />
        </Route>
      </Routes>
      

    </div>
  )
}

export default App