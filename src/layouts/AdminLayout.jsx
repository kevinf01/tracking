import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import logo from '../img/logo.png'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { session } = useAuth()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const menuItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Envíos', path: '/admin/shipments' }
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '250px 1fr',
        backgroundColor: '#f8fafc',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <aside
        style={{
          backgroundColor: '#ffffff',
          borderRight: isMobile ? 'none' : '1px solid #e5e7eb',
          borderBottom: isMobile ? '1px solid #e5e7eb' : 'none',
          padding: isMobile ? '14px 12px' : '22px 14px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'column',
          justifyContent: 'space-between',
          gap: isMobile ? '14px' : 0
        }}
      >
        <div>
          <div
            style={{
              padding: isMobile ? '0 0 14px 0' : '8px 10px 22px 10px',
              borderBottom: '1px solid #eef2f7',
              marginBottom: '18px',
              display: 'flex',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}
          >
            <Link
              to="/admin"
              style={{
                width: isMobile ? '150px' : '180px',
                height: isMobile ? '52px' : '66px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: isMobile ? '150px' : '186px',
                  height: isMobile ? '46px' : '56px',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </Link>
          </div>

          <nav
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              gap: '8px',
              overflowX: isMobile ? 'auto' : 'visible'
            }}
          >
            {menuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === '/admin/shipments' &&
                  location.pathname.startsWith('/admin/shipments'))

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    padding: '13px 14px',
                    borderRadius: '12px',
                    backgroundColor: isActive ? '#eef4ff' : 'transparent',
                    color: isActive ? '#1d4ed8' : '#0f172a',
                    fontWeight: isActive ? '700' : '600',
                    border: isActive ? '1px solid #dbeafe' : '1px solid transparent',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    flex: isMobile ? '1 0 auto' : 'unset',
                    textAlign: 'center'
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div
          style={{
            display: isMobile ? 'flex' : 'block',
            gap: '10px',
            alignItems: 'stretch',
            marginTop: isMobile ? '4px' : 0
          }}
        >
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              padding: '14px',
              marginBottom: isMobile ? 0 : '14px',
              flex: 1,
              display: isMobile ? 'none' : 'block'
            }}
          >
            <div style={{ fontWeight: '700', color: '#0f172a' }}>Administrador</div>
            <div
              style={{
                color: '#64748b',
                fontSize: '14px',
                marginTop: '6px',
                wordBreak: 'break-word'
              }}
            >
              {session?.user?.email || 'Sin sesión'}
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: isMobile ? '100%' : '100%',
              height: '46px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Salir
          </button>
        </div>
      </aside>

      <main
        style={{
          padding: isMobile ? '16px' : '26px'
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}