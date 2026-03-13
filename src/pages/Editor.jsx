import { useState, useCallback } from 'react'
import CodeEditor from '../components/CodeEditor.jsx'
import OutputConsole from '../components/OutputConsole.jsx'
import UsersList from '../components/UsersList.jsx'
import AIExplain from '../components/AIExplain.jsx'
import '../styles/editor.css'

export default function Editor({ roomId, onBackToHome }) {
  const [code, setCode] = useState('// Start coding here\nconsole.log("Hello, World!");')
  const [language, setLanguage] = useState('javascript')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [users, setUsers] = useState([
    { id: 1, name: 'You', isActive: true }
  ])

  const handleRunCode = useCallback(async () => {
    setIsRunning(true)
    try {
      // Simulate code execution
      if (language === 'javascript') {
        const result = await executeJavaScript(code)
        setOutput(result)
      } else {
        setOutput(`Execution for ${language} not implemented in this demo.`)
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }, [code, language])

  const executeJavaScript = async (jsCode) => {
    return new Promise((resolve) => {
      const logs = []
      const originalLog = console.log
      const originalError = console.error

      console.log = (...args) => {
        logs.push(args.join(' '))
      }
      console.error = (...args) => {
        logs.push('ERROR: ' + args.join(' '))
      }

      try {
        // Create a new function from the code string
        const fn = new Function(jsCode)
        fn()
        resolve(logs.join('\n') || 'Code executed successfully (no output)')
      } catch (error) {
        resolve(`Error: ${error.message}`)
      } finally {
        console.log = originalLog
        console.error = originalError
      }
    })
  }

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
              onChange={(e) => setLanguage(e.target.value)}
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
            setCode={setCode}
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
