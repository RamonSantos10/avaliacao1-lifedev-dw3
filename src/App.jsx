import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import "./App.css"
import Dashboard from "./pages/Dashboard/Dashboard"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import PublicRoute from "./components/PublicRoute"
import CreatePost from "./pages/CreatePost/CreatePost"
import Post from "./pages/Post/Post"

function App() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Home />} />
                </Route>
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
                <Route path="/post/:id" element={<Post />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/post/new" element={<CreatePost />} />
                </Route>
              </Routes>
            </div>
            <Footer />
          </BrowserRouter>
        </AuthProvider>
      </div>
    </>
  )
}

export default App
