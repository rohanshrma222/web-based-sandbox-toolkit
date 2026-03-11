import { useStore, MARINE_OBJECT_TYPES } from '../store'

const MAX_OBJECTS = 50

export function Footer() {
  const addObject  = useStore(state => state.addObject)
  const clearAll   = useStore(state => state.clearAll)
  const objectCount = useStore(state => state.objects.length)

  const handleAddRandom = () => {
    const types = Object.values(MARINE_OBJECT_TYPES)
    const randomType = types[Math.floor(Math.random() * types.length)]
    addObject(randomType)
  }

  const pct = Math.round((objectCount / MAX_OBJECTS) * 100)

  return (
    <footer className="app-footer">
      <div className="footer-stats">
        <div className="stat-item">
          <span>🐠</span>
          <span className="stat-value">{objectCount}</span>
          <span>/ {MAX_OBJECTS} objects</span>
        </div>

        {objectCount > 0 && (
          <div className="stat-item">
            <div style={{
              width: '60px',
              height: '4px',
              background: 'var(--bg-overlay)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                background: pct > 80
                  ? 'var(--warning)'
                  : 'linear-gradient(90deg, var(--brand), var(--accent))',
                borderRadius: 'var(--radius-full)',
                transition: 'width 300ms ease',
              }} />
            </div>
          </div>
        )}
      </div>

      <div className="footer-actions">
        <button
          className="btn btn-sm btn-primary"
          onClick={handleAddRandom}
          disabled={objectCount >= MAX_OBJECTS}
          title="Add a random marine creature"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Random
        </button>

        {objectCount > 0 && (
          <button
            className="btn btn-sm btn-ghost"
            onClick={clearAll}
            title="Remove all objects from scene"
          >
            Clear All
          </button>
        )}
      </div>
    </footer>
  )
}
