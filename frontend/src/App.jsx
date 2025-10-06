import {Routes, Route, Navigate} from 'react-router-dom'

import  LandingPage  from './pages/LandingPage'
import  Home from './pages/Home'
import PostPage from './components/PostPage'
import CreatePost from './components/CreatePost'
import Profile from './components/Profie'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/home' element={<Home />} />\
        <Route path='/post/:id' element={<PostPage />} />
        <Route path='*' element={<Navigate to='/' />} />
        <Route path='/create' element={<CreatePost />}/>
        <Route path='/profile' element={<Profile />}/>
      </Routes>
      

    </div>
  )
}

export default App