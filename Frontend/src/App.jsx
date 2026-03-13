import { useState } from 'react'
import Auth from './pages/Auth.jsx'
import Home from './pages/Home.jsx'
import Editor from './pages/Editor.jsx'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('auth') === 'true'
  )
  const [username, setUsername] = useState(
    () => localStorage.getItem('username') || ''
  )
  const [currentPage, setCurrentPage] = useState('home')
  const [roomId, setRoomId] = useState(null)

  const handleAuth = (name) => {
    setIsAuthenticated(true)
    setUsername(name)
    localStorage.setItem('auth', 'true')
    localStorage.setItem('username', name)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUsername('')
    localStorage.removeItem('auth')
    localStorage.removeItem('username')
    setCurrentPage('home')
    setRoomId(null)
  }

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(7).toUpperCase()
    setRoomId(newRoomId)
    setCurrentPage('editor')
  }

  const handleJoinRoom = (id) => {
    setRoomId(id)
    setCurrentPage('editor')
  }

  const handleBackToHome = () => {
    setCurrentPage('home')
    setRoomId(null)
  }

  // Gate: show Auth page if not logged in
  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <Auth onAuth={handleAuth} />
      </div>
    )
  }

  return (
    <div className="app-container">
      {currentPage === 'home' ? (
        <Home
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          username={username}
          onLogout={handleLogout}
        />
      ) : (
        <Editor
          roomId={roomId}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  )
}
