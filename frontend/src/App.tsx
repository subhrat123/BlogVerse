import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
// import Signin from './pages/Signin'
import BlogsPage from './pages/Blog'
import Header from './components/Header'
import Login from './pages/Login'
import MyBlogs from './pages/Myblogs'
import ProtectedRoute from './components/ProtectedRoute'
import CreateBlogPage from './pages/CreateBlogPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<BlogsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myblogs" element={<ProtectedRoute><MyBlogs /></ProtectedRoute>} /> 
           <Route path="/signup" element={<Signup />} />
           <Route path="/create" element={<ProtectedRoute><CreateBlogPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
