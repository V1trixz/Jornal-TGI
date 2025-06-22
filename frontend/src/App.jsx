import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Header } from './components/Header'
import { Home } from './components/Home'
import { Videos } from './components/Videos'
import { Articles } from './components/Articles'
import { Admin } from './components/Admin'
import { Login } from './components/Login'
import { Footer } from './components/Footer'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    // Aplicar tema escuro por padrão
    document.documentElement.classList.add('dark')
    
    // Verificar se existe uma sessão salva no localStorage
    const savedSessionId = localStorage.getItem('sessionId')
    if (savedSessionId) {
      checkAuth(savedSessionId)
    }
  }, [])

  const checkAuth = async (sessionIdToCheck = null) => {
    try {
      const sessionToUse = sessionIdToCheck || sessionId
      if (!sessionToUse) {
        setIsAuthenticated(false)
        setUser(null)
        return
      }

      const response = await fetch(`http://localhost:5000/api/check-auth?session_id=${sessionToUse}`)
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated) {
          setIsAuthenticated(true)
          setUser(data.user)
          setSessionId(sessionToUse)
          localStorage.setItem('sessionId', sessionToUse)
        } else {
          // Sessão inválida, limpar dados
          setIsAuthenticated(false)
          setUser(null)
          setSessionId(null)
          localStorage.removeItem('sessionId')
        }
      } else {
        // Erro na verificação, limpar dados
        setIsAuthenticated(false)
        setUser(null)
        setSessionId(null)
        localStorage.removeItem('sessionId')
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      setIsAuthenticated(false)
      setUser(null)
      setSessionId(null)
      localStorage.removeItem('sessionId')
    }
  }

  const handleLogin = (userData, newSessionId) => {
    setIsAuthenticated(true)
    setUser(userData)
    setSessionId(newSessionId)
    localStorage.setItem('sessionId', newSessionId)
  }

  const handleLogout = async () => {
    try {
      if (sessionId) {
        await fetch('http://localhost:5000/api/logout', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId })
        })
      }
      
      setIsAuthenticated(false)
      setUser(null)
      setSessionId(null)
      localStorage.removeItem('sessionId')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Mesmo com erro, limpar dados locais
      setIsAuthenticated(false)
      setUser(null)
      setSessionId(null)
      localStorage.removeItem('sessionId')
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header 
          isAuthenticated={isAuthenticated} 
          user={user} 
          onLogout={handleLogout} 
        />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/articles" element={<Articles />} />
            <Route 
              path="/admin" 
              element={
                isAuthenticated ? 
                <Admin /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? 
                <Login onLogin={handleLogin} /> : 
                <Navigate to="/admin" replace />
              } 
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App

