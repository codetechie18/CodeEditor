import { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import '../styles/code-editor.css'

export default function CodeEditor({ code, setCode, language }) {
  const editorRef = useRef(null)

  function handleEditorChange(value) {
    setCode(value || '')
  }

  return (
    <div className="code-editor-wrapper">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Courier New', monospace",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 2,
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 0,
        }}
        onMount={(editor) => {
          editorRef.current = editor
        }}
      />
    </div>
  )
}
