import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState([])
  const [filteredShipments, setFilteredShipments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
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
        .order('id', { ascending: false })

      if (!error) {
        setShipments(data || [])
        setFilteredShipments(data || [])
      }

      setLoading(false)
    }

    fetchShipments()
  }, [])

  useEffect(() => {
    const value = searchTerm.trim().toLowerCase()

    if (!value) {
      setFilteredShipments(shipments)
      return
    }

    const result = shipments.filter((shipment) => {
      return (
        shipment.tracking_code?.toLowerCase().includes(value) ||
        shipment.customer_name?.toLowerCase().includes(value) ||
        shipment.destination?.toLowerCase().includes(value) ||
        shipment.current_status?.toLowerCase().includes(value)
      )
    })

    setFilteredShipments(result)
  }, [searchTerm, shipments])

  const stats = useMemo(() => {
    const total = shipments.length
    const delivered = shipments.filter((s) => s.current_status === 'Entregado').length
    const inTransit = shipments.filter((s) => s.current_status === 'En tránsito').length
    const pending = shipments.filter((s) => s.current_status !== 'Entregado').length

    return { total, delivered, inTransit, pending }
  }, [shipments])

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          marginBottom: '24px',
          gap: '18px'
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
            Gestión de Envíos
          </h1>
          <p style={{ marginTop: '10px', color: '#475569', marginBottom: 0 }}>
            Administra y actualiza el estado de todos los envíos
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
            whiteSpace: 'nowrap',
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
        <StatCard title="Total Envíos" value={stats.total} />
        <StatCard title="En Tránsito" value={stats.inTransit} />
        <StatCard title="Pendientes" value={stats.pending} />
        <StatCard title="Entregados" value={stats.delivered} />
      </div>

      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '18px',
          padding: '18px',
          marginBottom: '18px'
        }}
      >
        <input
          type="text"
          placeholder="Buscar por tracking, cliente, destino o estado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '12px',
            border: '1px solid #dbe2ea',
            backgroundColor: '#f8fafc',
            padding: '0 14px',
            fontSize: '15px',
            outline: 'none',
            color: '#0f172a',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '18px',
          overflow: 'hidden'
        }}
      >
        {!isMobile && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.5fr 1.5fr 1fr 1fr',
              padding: '16px 18px',
              borderBottom: '1px solid #e5e7eb',
              fontWeight: '700',
              color: '#0f172a',
              backgroundColor: '#f8fafc'
            }}
          >
            <div>Código Tracking</div>
            <div>Cliente</div>
            <div>Destino</div>
            <div>Estado</div>
            <div>Acciones</div>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '24px 18px' }}>Cargando envíos...</div>
        ) : filteredShipments.length === 0 ? (
          <div style={{ padding: '24px 18px' }}>No hay resultados para esa búsqueda.</div>
        ) : isMobile ? (
          filteredShipments.map((shipment) => (
            <div
              key={shipment.id}
              style={{
                padding: '18px',
                borderBottom: '1px solid #f1f5f9',
                display: 'grid',
                gap: '12px'
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#64748b',
                    marginBottom: '4px'
                  }}
                >
                  Código Tracking
                </div>
                <div
                  style={{
                    fontWeight: '800',
                    color: '#0f172a',
                    wordBreak: 'break-word'
                  }}
                >
                  {shipment.tracking_code}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#64748b',
                    marginBottom: '4px'
                  }}
                >
                  Cliente
                </div>
                <div style={{ fontWeight: '700', color: '#0f172a', wordBreak: 'break-word' }}>
                  {shipment.customer_name}
                </div>
                <div
                  style={{
                    color: '#64748b',
                    fontSize: '14px',
                    marginTop: '4px',
                    wordBreak: 'break-word'
                  }}
                >
                  {shipment.customer_email || 'Sin correo'}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#64748b',
                    marginBottom: '4px'
                  }}
                >
                  Destino
                </div>
                <div style={{ color: '#0f172a', wordBreak: 'break-word' }}>
                  {shipment.destination}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#64748b',
                    marginBottom: '6px'
                  }}
                >
                  Estado
                </div>
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

              <div>
                <Link
                  to={`/admin/shipments/${shipment.id}`}
                  style={{
                    color: '#0f172a',
                    fontWeight: '700',
                    textDecoration: 'none'
                  }}
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))
        ) : (
          filteredShipments.map((shipment) => (
            <div
              key={shipment.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1.5fr 1.5fr 1fr 1fr',
                padding: '18px',
                borderBottom: '1px solid #f1f5f9',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{ fontWeight: '700', color: '#0f172a', wordBreak: 'break-word' }}>
                {shipment.tracking_code}
              </div>

              <div>
                <div style={{ fontWeight: '700', color: '#0f172a', wordBreak: 'break-word' }}>
                  {shipment.customer_name}
                </div>
                <div
                  style={{
                    color: '#64748b',
                    fontSize: '14px',
                    marginTop: '4px',
                    wordBreak: 'break-word'
                  }}
                >
                  {shipment.customer_email || 'Sin correo'}
                </div>
              </div>

              <div style={{ color: '#0f172a', wordBreak: 'break-word' }}>
                {shipment.destination}
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

              <div>
                <Link
                  to={`/admin/shipments/${shipment.id}`}
                  style={{
                    color: '#0f172a',
                    fontWeight: '700',
                    textDecoration: 'none'
                  }}
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value }) {
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