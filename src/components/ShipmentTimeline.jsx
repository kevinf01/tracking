export default function ShipmentTimeline({ timelineSteps, formatDate }) {
  if (!timelineSteps || timelineSteps.length === 0) return null

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '20px',
        padding: 'clamp(18px, 4vw, 28px)',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: '26px',
          color: '#0f172a',
          fontSize: 'clamp(22px, 4vw, 28px)'
        }}
      >
        Historial del envío
      </h2>

      <div style={{ position: 'relative' }}>
        {timelineSteps.map((step, index) => {
          const isLast = index === timelineSteps.length - 1

          return (
            <div
              key={`${step.status}-${index}`}
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
                      height: 'calc(100% + 40px)',
                      minHeight: '80px',
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
                  padding: '16px 16px',
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
                        fontSize: 'clamp(16px, 3vw, 20px)',
                        lineHeight: 1.3
                      }}
                    >
                      {step.status}
                    </h3>

                    {step.location && (
                      <p
                        style={{
                          margin: '0 0 8px 0',
                          color: '#475569',
                          fontSize: 'clamp(14px, 2.5vw, 15px)',
                          lineHeight: 1.5,
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
                        fontSize: 'clamp(14px, 2.5vw, 15px)',
                        lineHeight: 1.6,
                        wordBreak: 'break-word'
                      }}
                    >
                      {step.description}
                    </p>
                  </div>

                  <div
                    style={{
                      color: '#475569',
                      fontSize: 'clamp(13px, 2.3vw, 14px)',
                      textAlign: 'left',
                      width: '100%',
                      paddingTop: '4px'
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
  )
}