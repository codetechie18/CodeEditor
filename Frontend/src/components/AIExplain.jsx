import { useState } from 'react'
import axios from 'axios'
import '../styles/ai-explain.css'

export default function AIExplain({ code }) {
  const [explanation, setExplanation] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleExplainCode = async () => {
    if (!code.trim()) {
      setExplanation('Please write some code first!')
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post('https://code-editor-m6k6.vercel.app/api/explain', { code })
      setExplanation(response.data.explanation)
    } catch (error) {
      setExplanation('Error: Could not generate explanation')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="ai-explain-container">
      <button
        className="btn btn-explain"
        onClick={handleExplainCode}
        disabled={isLoading}
      >
        {isLoading ? '⏳ Analyzing...' : '🤖 Explain Code with AI'}
      </button>

      {explanation && (
        <div className="explanation-box">
          <p className="explanation-text">{explanation}</p>
        </div>
      )}
    </div>
  )
}
