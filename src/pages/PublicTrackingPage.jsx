import { useState } from 'react'
import { supabase } from '../lib/supabase'
import ShipmentCard from '../components/ShipmentCard'
import ShipmentTimeline from '../components/ShipmentTimeline'

export default function PublicTrackingPage() {
  const [trackingCode, setTrackingCode] = useState('')
  const [shipment, setShipment] = useState(null)
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const statusSteps = [
  'Pedido recibido',
  'En almacén',
  'En tránsito',
  'Llegó al país',
  'En reparto',
  'Entregado'
]

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

  const handleSearch = async () => {
    if (!trackingCode.trim()) {
      setMessage('Escribe un código de tracking')
      setShipment(null)
      setUpdates([])
      return
    }

    setLoading(true)
    setMessage('')
    setShipment(null)
    setUpdates([])

    const { data: shipmentData, error: shipmentError } = await supabase
      .from('shipments')
      .select('*')
      .eq('tracking_code', trackingCode.trim())
      .single()

    if (shipmentError || !shipmentData) {
      setMessage('No se encontró ningún envío con ese código')
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
      console.log('ERROR ACTUALIZACIONES:', updatesError)
      setUpdates([])
    } else {
      setUpdates(updatesData || [])
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial', maxWidth: '800px' }}>
      <h1>Rastrea tu envío</h1>
      <p>Ingresa tu código para conocer el estado de tu paquete</p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Ej: TRK123456789"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Buscar
        </button>
      </div>

      {loading && <p>Buscando...</p>}
      {message && <p>{message}</p>}

      <ShipmentCard shipment={shipment} />

    {shipment && (
  <ShipmentTimeline
    timelineSteps={timelineSteps}
    formatDate={formatDate}
  />
)}
    </div>
  )
}