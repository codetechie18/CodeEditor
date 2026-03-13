import { useState, useCallback } from 'react'
import '../styles/auth.css'

export default function Auth({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const getPasswordStrength = useCallback((pwd) => {
    if (!pwd) return { level: 0, text: '' }
    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 10) score++
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    if (score <= 1) return { level: 1, text: 'Weak' }
    if (score <= 3) return { level: 2, text: 'Medium' }
    return { level: 3, text: 'Strong' }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    if (!isLogin) {
      if (!username.trim()) {
        setError('Please enter a username.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
    }

    // Simulate success
    setSuccess(true)
    setTimeout(() => {
      const displayName = isLogin ? email.split('@')[0] : username
      onAuth(displayName)
    }, 600)
  }

  const toggleMode = () => {
    setIsLogin((prev) => !prev)
    setError('')
    setSuccess(false)
  }

  const pwdStrength = getPasswordStrength(password)

  return (
    <div className="auth-page">
      {/* Left — Brand Panel */}
      <div className="auth-brand">
        <div className="auth-brand-orb" />
        <div className="auth-brand-content">
          <span className="auth-brand-icon">⚡</span>
          <h1 className="auth-brand-title">Collaborative Code Editor</h1>
          <p className="auth-brand-tagline">
            Code together in real-time with syntax highlighting, multiple
            languages, and instant execution — all in one place.
          </p>
          <div className="auth-brand-features">
            <div className="auth-brand-feature">
              <span className="feature-icon">🔄</span>
              <span>Real-time code synchronization</span>
            </div>
            <div className="auth-brand-feature">
              <span className="feature-icon">👥</span>
              <span>Live multi-user collaboration</span>
            </div>
            <div className="auth-brand-feature">
              <span className="feature-icon">🚀</span>
              <span>Instant code execution</span>
            </div>
            <div className="auth-brand-feature">
              <span className="feature-icon">🤖</span>
              <span>AI-powered explanations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="auth-form-panel">
        <div className={`auth-card${success ? ' auth-success' : ''}`}>
          <div className="auth-card-header">
            <h2 className="auth-card-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="auth-card-subtitle">
              {isLogin
                ? 'Sign in to continue to your workspace'
                : 'Join thousands of developers coding together'}
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Username — signup only */}
            {!isLogin && (
              <div className="auth-input-group">
                <label htmlFor="auth-username">Username</label>
                <input
                  id="auth-username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            )}

            <div className="auth-input-group">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              {!isLogin && password && (
                <>
                  <div className="password-strength">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`password-strength-bar${
                          i <= pwdStrength.level
                            ? ` ${
                                pwdStrength.level === 1
                                  ? 'weak'
                                  : pwdStrength.level === 2
                                  ? 'medium'
                                  : 'strong'
                              }`
                            : ''
                        }`}
                      />
                    ))}
                  </div>
                  <span className="password-strength-text">
                    {pwdStrength.text}
                  </span>
                </>
              )}
            </div>



            {/* Confirm password — signup only */}
            {!isLogin && (
              <div className="auth-input-group">
                <label htmlFor="auth-confirm-password">Confirm Password</label>
                <input
                  id="auth-confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            )}

            <button type="submit" className="auth-submit-btn" id="auth-submit">
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            </button>
          </form>

          <div className="auth-divider">
            <span>{isLogin ? 'New here?' : 'Already a member?'}</span>
          </div>

          <div className="auth-toggle">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={toggleMode} id="auth-toggle-btn">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
