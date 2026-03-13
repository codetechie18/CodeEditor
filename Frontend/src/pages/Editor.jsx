import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import CodeEditor from '../components/CodeEditor.jsx';
import OutputConsole from '../components/OutputConsole.jsx';
import UsersList from '../components/UsersList.jsx';
import AIExplain from '../components/AIExplain.jsx';
import '../styles/editor.css';

// Yahan apne backend ka URL check kar lein
const BACKEND_URL = 'http://localhost:5000';

export default function Editor({ roomId, onBackToHome, username = 'Anonymous' }) {
  const [code, setCode] = useState('// Start coding here\nconsole.log("Hello, World!");');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [users, setUsers] = useState([]);

  const socketRef = useRef(null);

  // --- 1. SOCKET INITIALIZATION ---
  useEffect(() => {
    // Socket connection setup
    socketRef.current = io(BACKEND_URL);

    // Join Room
    // Editor.jsx ke useEffect mein:
socketRef.current.emit('join-room', { 
    roomId, 
    username: username || 'Anonymous' // Ensure username is never undefined
});

    // Listeners
    socketRef.current.on('room-users', (clients) => {
      setUsers(clients);
    });

    socketRef.current.on('receive-code', (newCode) => {
      setCode(newCode);
    });

    socketRef.current.on('receive-language', (newLang) => {
      setLanguage(newLang);
    });

    socketRef.current.on('user-joined', ({ username: joinedUser }) => {
      console.log(`${joinedUser} joined the room`);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off('room-users');
      socketRef.current.off('receive-code');
      socketRef.current.off('receive-language');
    };
  }, [roomId, username]);

  // --- 2. HANDLERS FOR SYNCING ---
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Dusre users ko code bhejें
    socketRef.current.emit('code-change', { roomId, code: newCode });
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    // Dusre users ko language update bhejें
    socketRef.current.emit('language-change', { roomId, language: newLang });
  };

  // --- 3. REAL CODE EXECUTION (via Backend) ---
  const handleRunCode = useCallback(async () => {
    setIsRunning(true);
    setOutput("Running code...");
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/execute`, {
        language: language,
        code: code
      });

      // Backend se jo output aayega use console mein set karein
      setOutput(response.data.output || "Code executed with no output.");
    } catch (error) {
      console.error("Execution error:", error);
      const errorMsg = error.response?.data?.error || error.message;
      setOutput(`Error: ${errorMsg}`);
    } finally {
      setIsRunning(false);
    }
  }, [code, language]);

  const handleCopyRoomLink = () => {
    const roomLink = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(roomLink);
    alert('Room link copied to clipboard!');
  };

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
              onChange={(e) => handleLanguageChange(e.target.value)}
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
            setCode={handleCodeChange} // Sync ke saath setCode use karein
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
  );
}