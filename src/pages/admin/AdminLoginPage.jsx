import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { LockKeyhole, Mail, ArrowLeft } from 'lucide-react'
import logo from '../../img/logo.png' // ajusta la ruta si hace falta

export default function AdminLoginPage() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  if (!loading && session) {
    const redirectTo = location.state?.from?.pathname || '/admin'
    return <Navigate to={redirectTo} replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!form.email.trim() || !form.password.trim()) {
      setMessage('Completa email y contraseña')
      return
    }

    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password
    })

    if (error) {
      setMessage(error.message)
      setSubmitting(false)
      return
    }

    const redirectTo = location.state?.from?.pathname || '/admin'
    navigate(redirectTo, { replace: true })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '470px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '24px',
          padding: '34px 28px',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.10)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '18px'
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: '170px',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(28px, 5vw, 34px)',
              color: '#0f172a',
              fontWeight: '800'
            }}
          >
            Login Admin
          </h1>

          <p
            style={{
              marginTop: '10px',
              marginBottom: 0,
              color: '#475569',
              lineHeight: 1.6,
              fontSize: '15px'
            }}
          >
            Accede al panel administrativo del tracker
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email</label>

            <div style={inputWrapperStyle}>
              <Mail size={18} color="#64748b" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@tuempresa.com"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Contraseña</label>

            <div style={inputWrapperStyle}>
              <LockKeyhole size={18} color="#64748b" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>
          </div>

          {message && (
            <div
              style={{
                marginBottom: '16px',
                backgroundColor: '#fff7ed',
                border: '1px solid #fdba74',
                color: '#9a3412',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '14px',
                lineHeight: 1.5
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '14px',
              border: 'none',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer',
              opacity: submitting ? 0.7 : 1,
              marginBottom: '12px',
              boxShadow: '0 10px 20px rgba(15, 23, 42, 0.15)'
            }}
          >
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '14px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} />
            Volver al tracking
          </button>
        </form>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontWeight: '700',
  marginBottom: '8px',
  color: '#0f172a',
  fontSize: '14px'
}

const inputWrapperStyle = {
  width: '100%',
  height: '50px',
  borderRadius: '14px',
  border: '1px solid #dbe2ea',
  backgroundColor: '#f8fafc',
  padding: '0 14px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  boxSizing: 'border-box'
}

const inputStyle = {
  flex: 1,
  height: '100%',
  border: 'none',
  backgroundColor: 'transparent',
  fontSize: '15px',
  outline: 'none',
  color: '#0f172a'
}