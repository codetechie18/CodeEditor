import { useState } from 'react'
import '../styles/home.css'

export default function Home({ onCreateRoom, onJoinRoom, username, onLogout }) {
  const [roomIdInput, setRoomIdInput] = useState('')

  const handleJoin = () => {
    if (roomIdInput.trim()) {
      onJoinRoom(roomIdInput.toUpperCase())
      setRoomIdInput('')
    }
  }

  return (
    <div className="home-container">
      <button className="btn btn-logout" onClick={onLogout}>
        Logout
      </button>
      
      <div className="home-content">
        <div className="home-header">
          <h1 className="home-title">Real-Time Collaborative Code Editor</h1>
          <p className="home-description">
            Code together in real-time with syntax highlighting, multiple languages, and instant execution.
          </p>
        </div>

        <div className="home-actions">
          <div className="action-card">
            <h2>Create New Room</h2>
            <p>Start a new collaborative coding session</p>
            <button className="btn btn-primary" onClick={onCreateRoom}>
              Create Room
            </button>
          </div>

          <div className="action-card">
            <h2>Join Existing Room</h2>
            <p>Enter a room ID to join an active session</p>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                className="room-input"
              />
              <button className="btn btn-secondary" onClick={handleJoin}>
                Join Room
              </button>
            </div>
          </div>
        </div>
         
        <div className="home-features">
          <h3>Features</h3>
          <ul>
            <li>✨ Real-time code synchronization</li>
            <li>👥 See who's coding with you</li>
            <li>🚀 Execute code instantly</li>
            <li>🤖 AI-powered code explanations</li>
            <li>🎨 Syntax highlighting for multiple languages</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
