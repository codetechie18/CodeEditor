import { useState } from 'react'
import Home from './pages/Home.jsx'
import Editor from './pages/Editor.jsx'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [roomId, setRoomId] = useState(null)

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

  return (
    <div className="app-container">
      {currentPage === 'home' ? (
        <Home
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
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
