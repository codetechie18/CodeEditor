import { useState, useCallback, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import CodeEditor from '../components/CodeEditor.jsx'
import OutputConsole from '../components/OutputConsole.jsx'
import UsersList from '../components/UsersList.jsx'
import AIExplain from '../components/AIExplain.jsx'
import '../styles/editor.css'

export default function Editor({ roomId, onBackToHome, username = 'Anonymous' }) {
  const [code, setCode] = useState('// Start coding here\nconsole.log("Hello, World!");')
  const [language, setLanguage] = useState('javascript')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [users, setUsers] = useState([])
  const socketRef = useRef(null)

  useEffect(() => {
    socketRef.current = io('http://localhost:5000')

    socketRef.current.emit('join-room', { roomId, username })

    socketRef.current.on('room-users', (clients) => {
      setUsers(clients.map(c => ({ id: c.socketId, name: c.name, isActive: true })))
    })

    socketRef.current.on('user-joined', ({ socketId, name }) => {
      console.log(`${name} joined`)
    })

    socketRef.current.on('user-left', ({ socketId, name }) => {
      setUsers((prev) => prev.filter((u) => u.id !== socketId))
    })

    socketRef.current.on('receive-code', (newCode) => {
      setCode(newCode)
    })
    
    socketRef.current.on('receive-language', (newLanguage) => {
      setLanguage(newLanguage)
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [roomId, username])

  const handleCodeChange = (newCode) => {
    setCode(newCode)
    if (socketRef.current) {
      socketRef.current.emit('code-change', { roomId, code: newCode })
    }
  }
  
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (socketRef.current) {
      socketRef.current.emit('language-change', { roomId, language: newLang })
    }
  }

  const handleRunCode = useCallback(async () => {
    setIsRunning(true)
    setOutput('Running...')
    try {
      const response = await axios.post('http://localhost:5000/api/execute', {
        language,
        code
      })
      setOutput(response.data.output)
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.error || error.message}`)
    } finally {
      setIsRunning(false)
    }
  }, [code, language])

  const handleCopyRoomLink = () => {
    const roomLink = `${window.location.origin}?room=${roomId}`
    navigator.clipboard.writeText(roomLink)
    alert('Room link copied to clipboard!')
  }

  return (
    <div className="editor-container">
      {/* Top Bar */}
      <div className="editor-topbar">
        <div className="topbar-left">
          <button className="btn btn-back" onClick={onBackToHome}>
            ← Back
          </button>
          <span className="room-info">Room: <strong>{roomId}</strong></span>
        </div>
        <div className="topbar-center">
          <h2 className="editor-title">Collaborative Code Editor</h2>
        </div>
        <div className="topbar-right">
          <span className="users-count">👥 {users.length} online</span>
          <button className="btn btn-copy" onClick={handleCopyRoomLink}>
            📋 Copy Link
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="editor-main">
        <div className="editor-left">
          <div className="editor-toolbar">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="language-select"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>
            <button
              className="btn btn-run"
              onClick={handleRunCode}
              disabled={isRunning}
            >
              {isRunning ? '⏳ Running...' : '▶ Run Code'}
            </button>
          </div>

          <CodeEditor
            code={code}
            setCode={handleCodeChange}
            language={language}
          />
        </div>

        <div className="editor-right">
          <UsersList users={users} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="editor-bottom">
        <div className="bottom-left">
          <div className="output-section">
            <h3>Output Console</h3>
            <OutputConsole output={output} />
          </div>
        </div>
        <div className="bottom-right">
          <div className="ai-section">
            <h3>AI Assistant</h3>
            <AIExplain code={code} />
          </div>
        </div>
      </div>
    </div>
  )
}
