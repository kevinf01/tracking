import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ShipmentCard from '../components/ShipmentCard'
import ShipmentTimeline from '../components/ShipmentTimeline'

export default function PublicTrackingResultPage() {
  const { trackingCode } = useParams()

  const [shipment, setShipment] = useState(null)
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const fetchTrackingData = async () => {
      setLoading(true)
      setMessage('')
      setShipment(null)
      setUpdates([])

      const { data: shipmentData, error: shipmentError } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_code', trackingCode)
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

      if (!updatesError) {
        setUpdates(updatesData || [])
      }

      setLoading(false)
    }

    fetchTrackingData()
  }, [trackingCode])

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '30px',
        fontFamily: 'Arial'
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginBottom: '20px',
            textDecoration: 'none',
            color: '#2563eb'
          }}
        >
          ← Volver a buscar
        </Link>

        {loading && <p>Cargando información del envío...</p>}

        {!loading && message && (
          <div
            style={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '12px',
              padding: '20px'
            }}
          >
            <h2>No encontrado</h2>
            <p>{message}</p>
          </div>
        )}

        {!loading && shipment && (
          <>
            <ShipmentCard shipment={shipment} />
            <ShipmentTimeline
              timelineSteps={timelineSteps}
              formatDate={formatDate}
            />
          </>
        )}
      </div>
    </div>
  )
}