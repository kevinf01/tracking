import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminNewShipmentPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    tracking_code: '',
    customer_name: '',
    customer_email: '',
    origin: '',
    destination: '',
    status: 'Pedido recibido',
    location: '',
    description: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const generateTrackingCode = () => {
    const random = Math.floor(100000000 + Math.random() * 900000000)
    setForm((prev) => ({
      ...prev,
      tracking_code: `TRK${random}`
    }))
  }

  const getProgressByStatus = (status) => {
    const progressMap = {
      'Pedido recibido': 15,
      'En almacén': 30,
      'En tránsito': 50,
      'Llegó al país': 70,
      'En reparto': 90,
      'Entregado': 100
    }

    return progressMap[status] || 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (
      !form.tracking_code.trim() ||
      !form.customer_name.trim() ||
      !form.origin.trim() ||
      !form.destination.trim() ||
      !form.status.trim() ||
      !form.description.trim()
    ) {
      setMessage('Completa los campos obligatorios')
      return
    }

    setLoading(true)

    const progressPercent = getProgressByStatus(form.status)

    const { data: shipmentData, error: shipmentError } = await supabase
      .from('shipments')
      .insert([
        {
          tracking_code: form.tracking_code.trim(),
          customer_name: form.customer_name.trim(),
          customer_email: form.customer_email.trim(),
          origin: form.origin.trim(),
          destination: form.destination.trim(),
          current_status: form.status,
          progress_percent: progressPercent
        }
      ])
      .select()
      .single()

    if (shipmentError) {
      setMessage(shipmentError.message)
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from('shipment_updates')
      .insert([
        {
          shipment_id: shipmentData.id,
          status: form.status,
          location: form.location.trim(),
          description: form.description.trim(),
          sort_order: 1
        }
      ])

    if (updateError) {
      setMessage(updateError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    navigate('/admin/shipments')
  }

  return (
    <div style={{ maxWidth: '980px' }}>
      <Link
        to="/admin/shipments"
        style={{
          display: 'inline-block',
          marginBottom: '18px',
          color: '#0f172a',
          fontWeight: '600',
          textDecoration: 'none'
        }}
      >
        ← Volver a Envíos
      </Link>

      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: isMobile ? '32px' : '42px',
            color: '#0f172a',
            lineHeight: 1.1
          }}
        >
          Crear Nuevo Envío
        </h1>
        <p style={{ color: '#475569', marginTop: '10px', marginBottom: 0 }}>
          Registra un nuevo paquete en el sistema
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '20px',
          padding: isMobile ? '18px' : '24px'
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>
            Código de Tracking *
          </label>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexDirection: isMobile ? 'column' : 'row'
            }}
          >
            <input
              type="text"
              name="tracking_code"
              value={form.tracking_code}
              onChange={handleChange}
              placeholder="Ej: TRK123456789"
              style={inputStyle}
            />

            <button
              type="button"
              onClick={generateTrackingCode}
              style={{
                ...secondaryButtonStyle,
                width: isMobile ? '100%' : 'auto'
              }}
            >
              Generar
            </button>
          </div>

          <p style={{ marginTop: '8px', color: '#64748b', fontSize: '14px' }}>
            Código único para rastrear el envío
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '18px'
          }}
        >
          <div>
            <label style={labelStyle}>Nombre del Cliente *</label>
            <input
              type="text"
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              placeholder="Ej: María García"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Email del Cliente</label>
            <input
              type="email"
              name="customer_email"
              value={form.customer_email}
              onChange={handleChange}
              placeholder="cliente@email.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Origen *</label>
            <input
              type="text"
              name="origin"
              value={form.origin}
              onChange={handleChange}
              placeholder="Ej: Miami, FL, USA"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Destino *</label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              placeholder="Ej: Buenos Aires, Argentina"
              style={inputStyle}
            />
          </div>
        </div>

        <hr style={{ border: 0, borderTop: '1px solid #e5e7eb', margin: '28px 0' }} />

        <h2 style={{ marginTop: 0, color: '#0f172a' }}>Estado Inicial del Envío</h2>

        <div style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>Estado Inicial *</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option>Pedido recibido</option>
            <option>En almacén</option>
            <option>En tránsito</option>
            <option>Llegó al país</option>
            <option>En reparto</option>
            <option>Entregado</option>
          </select>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>Ubicación Actual</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Ej: Miami Warehouse"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>Descripción *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe el estado actual del paquete..."
            rows="4"
            style={{
              ...inputStyle,
              height: 'auto',
              minHeight: '110px',
              paddingTop: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        {message && (
          <div
            style={{
              marginBottom: '18px',
              backgroundColor: '#fff7ed',
              border: '1px solid #fdba74',
              color: '#9a3412',
              padding: '12px 14px',
              borderRadius: '12px'
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row'
          }}
        >
          <button
            type="submit"
            disabled={loading}
            style={{
              ...primaryButtonStyle,
              flex: 1,
              width: isMobile ? '100%' : 'auto',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creando...' : 'Crear Envío'}
          </button>

          <Link
            to="/admin/shipments"
            style={{
              ...secondaryButtonStyle,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: isMobile ? '100%' : '120px',
              width: isMobile ? '100%' : 'auto',
              textDecoration: 'none',
              color: '#0f172a',
              boxSizing: 'border-box'
            }}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontWeight: '700',
  marginBottom: '8px',
  color: '#0f172a'
}

const inputStyle = {
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
}

const primaryButtonStyle = {
  height: '48px',
  borderRadius: '12px',
  border: 'none',
  backgroundColor: '#020617',
  color: '#fff',
  fontWeight: '700',
  cursor: 'pointer',
  padding: '0 18px'
}

const secondaryButtonStyle = {
  height: '48px',
  borderRadius: '12px',
  border: '1px solid #d1d5db',
  backgroundColor: '#fff',
  fontWeight: '600',
  cursor: 'pointer',
  padding: '0 18px'
}