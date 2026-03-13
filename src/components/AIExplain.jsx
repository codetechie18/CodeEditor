import { useState } from 'react'
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
      // Simulate AI explanation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockExplanations = [
        `This code appears to be a JavaScript program that does the following:\n\n1. It initializes or operates with a function\n2. Uses console.log for output\n3. Demonstrates basic programming concepts\n\nThe code is syntactically correct and ready to run. You can click "Run Code" to see the output.`,
        `The provided code snippet shows:\n\n• Variable declarations and assignments\n• Function calls and logic flow\n• Output generation through console methods\n\nThis is a good example of basic JavaScript programming. Feel free to modify it and re-run!`,
        `This JavaScript code:\n• Contains proper syntax\n• Uses standard JavaScript methods\n• Is ready for execution\n\nYou can enhance it by adding more complex logic, functions, or algorithms.`
      ]

      const randomExplanation = mockExplanations[
        Math.floor(Math.random() * mockExplanations.length)
      ]

      setExplanation(randomExplanation)
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
