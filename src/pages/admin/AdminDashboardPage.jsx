import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminDashboardPage() {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchShipments = async () => {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) {
        setShipments(data || [])
      }

      setLoading(false)
    }

    fetchShipments()
  }, [])

  const stats = useMemo(() => {
    const total = shipments.length
    const delivered = shipments.filter((s) => s.current_status === 'Entregado').length
    const inTransit = shipments.filter((s) => s.current_status === 'En tránsito').length
    const warehouse = shipments.filter((s) => s.current_status === 'En almacén').length
    const countryArrived = shipments.filter((s) => s.current_status === 'Llegó al país').length
    const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 0

    return {
      total,
      delivered,
      inTransit,
      warehouse,
      countryArrived,
      deliveryRate
    }
  }, [shipments])

  const recentShipments = shipments.slice(0, 5)

  if (loading) {
    return <div>Cargando dashboard...</div>
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'flex-start',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? '30px' : '38px',
              color: '#0f172a',
              lineHeight: 1.1
            }}
          >
            Dashboard
          </h1>
          <p style={{ color: '#475569', marginTop: '10px', marginBottom: 0 }}>
            Resumen general del sistema de tracking
          </p>
        </div>

        <Link
          to="/admin/shipments/new"
          style={{
            backgroundColor: '#020617',
            color: '#fff',
            padding: '14px 18px',
            borderRadius: '12px',
            fontWeight: '700',
            textDecoration: 'none',
            textAlign: 'center',
            width: isMobile ? '100%' : 'auto',
            boxSizing: 'border-box'
          }}
        >
          + Nuevo Envío
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '18px',
          marginBottom: '22px'
        }}
      >
        <MetricCard title="Total Envíos" value={stats.total} />
        <MetricCard title="En Tránsito" value={stats.inTransit} />
        <MetricCard title="En Almacén" value={stats.warehouse} />
        <MetricCard title="Entregados" value={stats.delivered} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
          gap: '22px',
          alignItems: 'start'
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '18px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '20px 22px',
              borderBottom: '1px solid #e5e7eb'
            }}
          >
            <h2 style={{ margin: 0, color: '#0f172a' }}>Envíos Recientes</h2>
            <p style={{ margin: '8px 0 0 0', color: '#64748b' }}>
              Últimos registros creados en el sistema
            </p>
          </div>

          {recentShipments.length === 0 ? (
            <div style={{ padding: '22px' }}>No hay envíos registrados.</div>
          ) : (
            recentShipments.map((shipment) => (
              <div
                key={shipment.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1.4fr 1.1fr auto',
                  gap: '12px',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  padding: '18px 22px',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: '800',
                      color: '#0f172a',
                      wordBreak: 'break-word'
                    }}
                  >
                    {shipment.tracking_code}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                    ID #{shipment.id}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: '700',
                      color: '#0f172a',
                      wordBreak: 'break-word'
                    }}
                  >
                    {shipment.customer_name}
                  </div>
                  <div
                    style={{
                      color: '#64748b',
                      fontSize: '13px',
                      marginTop: '4px',
                      wordBreak: 'break-word'
                    }}
                  >
                    {shipment.destination}
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: getStatusBadgeBg(shipment.current_status),
                      color: getStatusBadgeText(shipment.current_status),
                      padding: '6px 12px',
                      borderRadius: '999px',
                      fontWeight: '700',
                      fontSize: '13px'
                    }}
                  >
                    {shipment.current_status}
                  </span>
                </div>

                <Link
                  to={`/admin/shipments/${shipment.id}`}
                  style={{
                    color: 'rgb(15, 23, 42)',
                    fontWeight: '700',
                    textDecoration: 'none'
                  }}
                >
                  Ver
                </Link>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'grid', gap: '22px' }}>
          <div
            style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '18px',
              padding: '22px'
            }}
          >
            <h2 style={{ marginTop: 0, color: '#0f172a' }}>Rendimiento</h2>

            <div style={{ marginTop: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  gap: '12px'
                }}
              >
                <strong>Tasa de entrega</strong>
                <span>{stats.deliveryRate}%</span>
              </div>

              <div
                style={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${stats.deliveryRate}%`,
                    height: '100%',
                    backgroundColor: '#111827'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '18px', color: '#475569', lineHeight: 1.7 }}>
              <div><strong>En tránsito:</strong> {stats.inTransit}</div>
              <div><strong>Llegó al país:</strong> {stats.countryArrived}</div>
              <div><strong>Entregados:</strong> {stats.delivered}</div>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              borderRadius: '18px',
              padding: '22px'
            }}
          >
            <h2 style={{ marginTop: 0 }}>Acceso rápido</h2>
            <p style={{ opacity: 0.95, lineHeight: 1.6 }}>
              Crea nuevos envíos, revisa estados y actualiza el historial desde el panel administrativo.
            </p>

            <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
              <Link
                to="/admin/shipments/new"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1d4ed8',
                  fontWeight: '800',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                Crear envío
              </Link>

              <Link
                to="/admin/shipments"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  fontWeight: '700',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.18)',
                  textDecoration: 'none'
                }}
              >
                Ver todos los envíos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value }) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '18px',
        padding: '20px'
      }}
    >
      <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>
        {title}
      </div>
      <div style={{ color: '#0f172a', fontSize: '30px', fontWeight: '800' }}>
        {value}
      </div>
    </div>
  )
}

function getStatusBadgeBg(status) {
  const map = {
    'Pedido recibido': '#dbeafe',
    'En almacén': '#e9d5ff',
    'En tránsito': '#fed7aa',
    'Llegó al país': '#fef3c7',
    'En reparto': '#dcfce7',
    'Entregado': '#dcfce7'
  }

  return map[status] || '#e5e7eb'
}

function getStatusBadgeText(status) {
  const map = {
    'Pedido recibido': '#1d4ed8',
    'En almacén': '#7e22ce',
    'En tránsito': '#9a3412',
    'Llegó al país': '#92400e',
    'En reparto': '#166534',
    'Entregado': '#166534'
  }

  return map[status] || '#334155'
}