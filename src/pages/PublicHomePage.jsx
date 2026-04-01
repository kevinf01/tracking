import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPinned, ShieldCheck, Truck } from 'lucide-react'
import logo from '../img/logo.png' // ajusta la ruta si está en otra carpeta

export default function PublicHomePage() {
  const [trackingCode, setTrackingCode] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    const cleanCode = trackingCode.trim()
    if (!cleanCode) return
    navigate(`/tracking/${cleanCode}`)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        fontFamily: 'Arial, sans-serif',
        padding: '70px 20px 70px'
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '34px'
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: '200px',
              maxWidth: '70vw',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '42px', marginTop: '8px' }}>
          <h1
            style={{
              fontSize: 'clamp(32px, 6vw, 44px)',
              lineHeight: 1.1,
              margin: 0,
              color: '#0f172a',
              fontWeight: '800'
            }}
          >
            Rastrea tu envío
          </h1>

          <p
            style={{
              fontSize: 'clamp(15px, 2.5vw, 16px)',
              color: '#475569',
              marginTop: '16px',
              marginBottom: 0,
              maxWidth: '700px',
              marginInline: 'auto',
              lineHeight: 1.6
            }}
          >
            Ingresa tu código de tracking para conocer el estado de tu paquete en tiempo real
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            maxWidth: '920px',
            margin: '0 auto 22px auto',
            alignItems: 'stretch',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              flex: '1 1 320px',
              minWidth: '0',
              position: 'relative'
            }}
          >
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }}
            />

            <input
              type="text"
              placeholder="Ej: TRK123456789"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
              style={{
                width: '100%',
                height: '64px',
                borderRadius: '14px',
                border: '1px solid #dbe2ea',
                padding: '0 22px 0 50px',
                fontSize: '18px',
                outline: 'none',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={handleSearch}
            style={{
              flex: '0 0 170px',
              width: '170px',
              height: '64px',
              borderRadius: '14px',
              border: 'none',
              backgroundColor: '#334155',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              margin: '0 auto'
            }}
          >
            <Search size={20} />
            Buscar
          </button>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginBottom: '42px'
          }}
        >
          <span
            style={{
              fontSize: '15px',
              color: '#64748b'
            }}
          >
            Si eres administrador,{' '}
          </span>
          <button
            onClick={() => navigate('/admin')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0,
              color: '#2563eb',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            presiona aquí
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '22px',
            maxWidth: '920px',
            margin: '0 auto'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              padding: '28px 22px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '999px',
                backgroundColor: '#dbeafe',
                margin: '0 auto 16px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MapPinned size={26} color="#2563eb" />
            </div>

            <h3
              style={{
                fontSize: '18px',
                lineHeight: 1.25,
                margin: '0 0 12px 0',
                color: '#0f172a',
                fontWeight: '800'
              }}
            >
              Tracking en tiempo real
            </h3>

            <p
              style={{
                color: '#475569',
                fontSize: '15px',
                lineHeight: 1.6,
                margin: 0
              }}
            >
              Seguimiento actualizado de tu paquete
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              padding: '28px 22px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '999px',
                backgroundColor: '#dcfce7',
                margin: '0 auto 16px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={26} color="#16a34a" />
            </div>

            <h3
              style={{
                fontSize: '18px',
                lineHeight: 1.25,
                margin: '0 0 12px 0',
                color: '#0f172a',
                fontWeight: '800'
              }}
            >
              Envíos seguros
            </h3>

            <p
              style={{
                color: '#475569',
                fontSize: '15px',
                lineHeight: 1.6,
                margin: 0
              }}
            >
              Tu paquete está protegido en todo momento
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              padding: '28px 22px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '999px',
                backgroundColor: '#f3e8ff',
                margin: '0 auto 16px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Truck size={26} color="#9333ea" />
            </div>

            <h3
              style={{
                fontSize: '18px',
                lineHeight: 1.25,
                margin: '0 0 12px 0',
                color: '#0f172a',
                fontWeight: '800'
              }}
            >
              Entrega rápida
            </h3>

            <p
              style={{
                color: '#475569',
                fontSize: '15px',
                lineHeight: 1.6,
                margin: 0
              }}
            >
              Tiempos de entrega optimizados
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}