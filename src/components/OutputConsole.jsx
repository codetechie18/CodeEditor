import '../styles/output-console.css'

export default function OutputConsole({ output }) {
  return (
    <div className="output-console">
      {output ? (
        <pre className="console-output">{output}</pre>
      ) : (
        <div className="console-placeholder">
          Run your code to see output here...
        </div>
      )}
    </div>
  )
}
