import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import Auth from './pages/Auth.jsx'
import Home from './pages/Home.jsx'
import Editor from './pages/Editor.jsx'

function RequireAuth({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/auth" />
  }
  return children
}

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('auth') === 'true'
  )
  const [username, setUsername] = useState(
    () => localStorage.getItem('username') || ''
  )
  const [token, setToken] = useState(
    () => localStorage.getItem('token') || ''
  )
  const navigate = useNavigate()

  const handleAuth = (name, jwt) => {
    setIsAuthenticated(true)
    setUsername(name)
    setToken(jwt)
    localStorage.setItem('auth', 'true')
    localStorage.setItem('username', name)
    localStorage.setItem('token', jwt)
    navigate('/')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUsername('')
    setToken('')
    localStorage.removeItem('auth')
    localStorage.removeItem('username')
    localStorage.removeItem('token')
    navigate('/auth')
  }

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(7).toUpperCase()
    navigate(`/room/${newRoomId}`)
  }

  const handleJoinRoom = (id) => {
    navigate(`/room/${id}`)
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <div className="app-container">
      <Routes>
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? <Navigate to="/" /> : <Auth onAuth={handleAuth} />
          } 
        />
        <Route 
          path="/" 
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <Home 
                onCreateRoom={handleCreateRoom}
                onJoinRoom={handleJoinRoom}
                username={username}
                onLogout={handleLogout}
              />
            </RequireAuth>
          } 
        />
        <Route 
          path="/room/:id" 
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <EditorWrapper 
                onBackToHome={handleBackToHome} 
                username={username} 
              />
            </RequireAuth>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

function EditorWrapper({ onBackToHome, username }) {
  const { id } = useParams()
  return <Editor roomId={id} onBackToHome={onBackToHome} username={username} />
}

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  )
}
