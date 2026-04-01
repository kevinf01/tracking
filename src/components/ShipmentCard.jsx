export default function ShipmentCard({ shipment }) {
  if (!shipment) return null

  return (
    <div
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '24px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
        backgroundColor: '#fff'
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          color: '#fff',
          padding: 'clamp(18px, 4vw, 28px)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ minWidth: 0, flex: '1 1 260px' }}>
            <p
              style={{
                margin: '0 0 8px 0',
                opacity: 0.9,
                fontSize: 'clamp(13px, 2.5vw, 15px)'
              }}
            >
              Código de tracking
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(24px, 6vw, 42px)',
                fontWeight: '800',
                lineHeight: 1.1,
                wordBreak: 'break-word'
              }}
            >
              {shipment.tracking_code}
            </h2>
          </div>

          <div
            style={{
              backgroundColor: '#fed7aa',
              color: '#9a3412',
              padding: '8px 14px',
              borderRadius: '999px',
              fontWeight: '700',
              fontSize: '14px',
              maxWidth: '100%',
              wordBreak: 'break-word'
            }}
          >
            {shipment.current_status}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginTop: '28px'
          }}
        >
          <div>
            <p
              style={{
                margin: '0 0 8px 0',
                opacity: 0.9,
                fontSize: 'clamp(13px, 2.5vw, 15px)'
              }}
            >
              Cliente
            </p>

            <h3
              style={{
                margin: 0,
                fontSize: 'clamp(18px, 3vw, 22px)',
                lineHeight: 1.3,
                wordBreak: 'break-word'
              }}
            >
              {shipment.customer_name}
            </h3>
          </div>

          <div>
            <p
              style={{
                margin: '0 0 8px 0',
                opacity: 0.9,
                fontSize: 'clamp(13px, 2.5vw, 15px)'
              }}
            >
              Destino
            </p>

            <h3
              style={{
                margin: 0,
                fontSize: 'clamp(18px, 3vw, 22px)',
                lineHeight: 1.3,
                wordBreak: 'break-word'
              }}
            >
              {shipment.destination}
            </h3>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: 'clamp(18px, 4vw, 28px)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '10px',
            color: '#0f172a',
            flexWrap: 'wrap',
            fontSize: 'clamp(14px, 2.5vw, 16px)'
          }}
        >
          <strong>Progreso del envío</strong>
          <span>{shipment.progress_percent}%</span>
        </div>

        <div
          style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#d1d5db',
            borderRadius: '999px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${shipment.progress_percent}%`,
              height: '100%',
              backgroundColor: '#0f172a'
            }}
          />
        </div>
      </div>
    </div>
  )
}