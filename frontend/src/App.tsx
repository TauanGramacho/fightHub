import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import './App.css'
import { supabase } from './supabaseClient'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="loading-screen">Carregando...</div>
  }

  return (
    <BrowserRouter>
      <div className="app-main-layout">
        <Routes>
          <Route 
            path="/" 
            element={
              (session || localStorage.getItem('demo_mode') === 'true') ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/login" 
            element={
              (session || localStorage.getItem('demo_mode') === 'true') ? <Navigate to="/dashboard" replace /> : <AuthPage />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              (session || localStorage.getItem('demo_mode') === 'true') ? <Dashboard /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
