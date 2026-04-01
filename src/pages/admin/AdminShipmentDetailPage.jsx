import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminShipmentDetailPage() {
  const { id } = useParams()

  const [shipment, setShipment] = useState(null)
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const statusSteps = useMemo(
    () => [
      'Pedido recibido',
      'En almacén',
      'En tránsito',
      'Llegó al país',
      'En reparto',
      'Entregado'
    ],
    []
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)

    return date.toLocaleString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const fetchShipmentDetail = async () => {
    setLoading(true)
    setMessage('')

    const { data: shipmentData, error: shipmentError } = await supabase
      .from('shipments')
      .select('*')
      .eq('id', id)
      .single()

    if (shipmentError || !shipmentData) {
      setMessage('No se encontró el envío')
      setShipment(null)
      setUpdates([])
      setLoading(false)
      return
    }

    setShipment(shipmentData)

    const { data: updatesData, error: updatesError } = await supabase
      .from('shipment_updates')
      .select('*')
      .eq('shipment_id', shipmentData.id)
      .order('sort_order', { ascending: true })

    if (updatesError) {
      setUpdates([])
    } else {
      setUpdates(updatesData || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchShipmentDetail()
  }, [id])

  const timelineSteps = statusSteps.map((step) => {
    const foundUpdate = updates.find((update) => update.status === step)

    return {
      status: step,
      completed: !!foundUpdate,
      location: foundUpdate?.location || '',
      description: foundUpdate?.description || 'Pendiente',
      event_date: foundUpdate?.event_date || null
    }
  })

  if (loading) {
    return <div>Cargando detalle del envío...</div>
  }

  if (message) {
    return (
      <div>
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

        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '18px',
            padding: '24px'
          }}
        >
          <h1 style={{ marginTop: 0 }}>Detalle del Envío</h1>
          <p>{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
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
              fontSize: isMobile ? '32px' : '42px',
              color: '#0f172a',
              lineHeight: 1.1,
              wordBreak: 'break-word'
            }}
          >
            Detalle del Envío
          </h1>
          <p
            style={{
              color: '#475569',
              marginTop: '10px',
              marginBottom: 0,
              wordBreak: 'break-word'
            }}
          >
            {shipment.tracking_code}
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#fed7aa',
            color: '#9a3412',
            padding: '8px 14px',
            borderRadius: '999px',
            fontWeight: '700',
            alignSelf: isMobile ? 'flex-start' : 'auto'
          }}
        >
          {shipment.current_status}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
          gap: '22px',
          alignItems: 'start'
        }}
      >
        <div>
          <div
            style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '18px',
              padding: isMobile ? '18px' : '24px',
              marginBottom: '22px'
            }}
          >
            <h2 style={{ marginTop: 0, color: '#0f172a' }}>Información del Envío</h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '24px',
                marginTop: '18px'
              }}
            >
              <div>
                <div style={infoLabelStyle}>Cliente</div>
                <div style={infoValueStyle}>{shipment.customer_name}</div>
              </div>

              <div>
                <div style={infoLabelStyle}>Email</div>
                <div style={{ ...infoValueStyle, wordBreak: 'break-word' }}>
                  {shipment.customer_email || 'Sin correo'}
                </div>
              </div>

              <div>
                <div style={infoLabelStyle}>Origen</div>
                <div style={infoValueStyle}>{shipment.origin}</div>
              </div>

              <div>
                <div style={infoLabelStyle}>Destino</div>
                <div style={{ ...infoValueStyle, wordBreak: 'break-word' }}>
                  {shipment.destination}
                </div>
              </div>

              <div>
                <div style={infoLabelStyle}>Fecha de Creación</div>
                <div style={infoValueStyle}>{formatDate(shipment.created_at)}</div>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '18px',
              padding: isMobile ? '18px' : '24px'
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#0f172a' }}>
              Historial de Estados
            </h2>

            <div>
              {timelineSteps.map((step, index) => {
                const isLast = index === timelineSteps.length - 1

                return (
                  <div
                    key={step.status}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      marginBottom: isLast ? 0 : '22px'
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '28px',
                        minWidth: '28px',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '999px',
                          backgroundColor: step.completed ? '#2563eb' : '#f8fafc',
                          border: step.completed ? 'none' : '2px solid #cbd5e1',
                          zIndex: 2
                        }}
                      />

                      {!isLast && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '28px',
                            width: '2px',
                            height: isMobile ? '110px' : '95px',
                            backgroundColor: step.completed ? '#2563eb' : '#e2e8f0'
                          }}
                        />
                      )}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        backgroundColor: '#f8fbff',
                        border: '1px solid #dbeafe',
                        borderRadius: '16px',
                        padding: isMobile ? '16px' : '18px 20px',
                        opacity: step.completed ? 1 : 0.72
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '12px',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                          <h3
                            style={{
                              margin: '0 0 10px 0',
                              color: '#0f172a',
                              wordBreak: 'break-word'
                            }}
                          >
                            {step.status}
                          </h3>

                          {step.location && (
                            <p
                              style={{
                                margin: '0 0 8px 0',
                                color: '#475569',
                                wordBreak: 'break-word'
                              }}
                            >
                              {step.location}
                            </p>
                          )}

                          <p
                            style={{
                              margin: 0,
                              color: '#334155',
                              wordBreak: 'break-word',
                              lineHeight: 1.6
                            }}
                          >
                            {step.description}
                          </p>
                        </div>

                        <div
                          style={{
                            color: '#475569',
                            minWidth: isMobile ? '100%' : '170px',
                            textAlign: isMobile ? 'left' : 'right',
                            fontSize: '14px'
                          }}
                        >
                          {step.event_date ? formatDate(step.event_date) : 'Pendiente'}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <AddStatusCard
          shipment={shipment}
          updates={updates}
          onSuccess={fetchShipmentDetail}
          isMobile={isMobile}
        />
      </div>
    </div>
  )
}

function AddStatusCard({ shipment, updates, onSuccess, isMobile }) {
  const [form, setForm] = useState({
    status: '',
    location: '',
    description: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!form.status.trim() || !form.description.trim()) {
      setMessage('Completa el estado y la descripción')
      return
    }

    const alreadyExists = updates.some((update) => update.status === form.status)

    if (alreadyExists) {
      setMessage('Ese estado ya fue agregado a este envío')
      return
    }

    setSaving(true)

    const nextSortOrder = updates.length + 1

    const { error: insertError } = await supabase
      .from('shipment_updates')
      .insert([
        {
          shipment_id: shipment.id,
          status: form.status,
          location: form.location.trim(),
          description: form.description.trim(),
          sort_order: nextSortOrder
        }
      ])

    if (insertError) {
      setMessage(insertError.message)
      setSaving(false)
      return
    }

    const { error: updateShipmentError } = await supabase
      .from('shipments')
      .update({
        current_status: form.status,
        progress_percent: getProgressByStatus(form.status),
        updated_at: new Date().toISOString()
      })
      .eq('id', shipment.id)

    if (updateShipmentError) {
      setMessage(updateShipmentError.message)
      setSaving(false)
      return
    }

    setForm({
      status: '',
      location: '',
      description: ''
    })

    setSaving(false)
    onSuccess()
  }

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '18px',
        padding: isMobile ? '18px' : '24px',
        position: isMobile ? 'static' : 'sticky',
        top: isMobile ? 'auto' : '28px'
      }}
    >
      <h2 style={{ marginTop: 0, color: '#0f172a' }}>Agregar Estado</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Nuevo Estado *</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Selecciona un estado</option>
            <option>Pedido recibido</option>
            <option>En almacén</option>
            <option>En tránsito</option>
            <option>Llegó al país</option>
            <option>En reparto</option>
            <option>Entregado</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Ubicación</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Ej: En vuelo"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Descripción *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe el nuevo estado del envío"
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
              marginBottom: '16px',
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

        <button
          type="submit"
          disabled={saving}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: '#020617',
            color: '#fff',
            fontWeight: '700',
            cursor: 'pointer',
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? 'Guardando...' : 'Agregar Estado'}
        </button>
      </form>

      <div
        style={{
          marginTop: '22px',
          paddingTop: '18px',
          borderTop: '1px solid #e5e7eb'
        }}
      >
        <div style={{ color: '#64748b', marginBottom: '10px' }}>Información</div>
        <div style={{ marginBottom: '8px', color: '#0f172a', wordBreak: 'break-word' }}>
          <strong>ID del envío:</strong> {shipment.id}
        </div>
        <div style={{ marginBottom: '8px', color: '#0f172a' }}>
          <strong>Actualizaciones:</strong> {updates.length} registros
        </div>
        <div style={{ color: '#0f172a', wordBreak: 'break-word' }}>
          <strong>Último estado:</strong> {shipment.current_status}
        </div>
      </div>
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

const infoLabelStyle = {
  color: '#64748b',
  fontSize: '14px',
  marginBottom: '8px'
}

const infoValueStyle = {
  color: '#0f172a',
  fontWeight: '700',
  wordBreak: 'break-word'
}