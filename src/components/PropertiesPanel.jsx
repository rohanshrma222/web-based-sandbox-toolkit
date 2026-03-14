import { useStore } from '../store'

function PropSection({ label, children }) {
  return (
    <div className="prop-section">
      <div className="prop-section-label">{label}</div>
      {children}
    </div>
  )
}

export function PropertiesPanel() {
  const selectedId   = useStore(state => state.selectedId)
  const objects      = useStore(state => state.objects)
  const updateObject = useStore(state => state.updateObject)
  const updatePosition = useStore(state => state.updatePosition)
  const removeObject = useStore(state => state.removeObject)

  const selectedObject = objects.find(obj => obj.id === selectedId)

  if (!selectedObject) {
    return (
      <aside className="properties" aria-label="Properties Panel">
        <div className="properties-header">
          <h3 className="properties-title">Properties</h3>
        </div>
        <div className="properties-content">
          <div className="empty-state animate-fade-in">
            <div className="empty-icon">
              <img src="/hook.png" alt="Hook" style={{ width: '40px', height: '40px', opacity: 0.7 }} />
            </div>
            <p className="empty-title">Nothing selected</p>
            <p className="empty-text">Click an object in the scene or drag one from the sidebar</p>
          </div>
        </div>
      </aside>
    )
  }

  const handlePositionChange = (axis, value) => {
    const numValue = parseFloat(value) || 0
    updatePosition(selectedObject.id, axis, numValue)
  }

  const handlePropertyChange = (property, value) => {
    updateObject(selectedObject.id, { [property]: value })
  }

  const typeName = selectedObject.type
    .replace(/^(fish|coral|plant|terrain)-/, '')
  const displayName = typeName.charAt(0).toUpperCase() + typeName.slice(1)

  return (
    <aside className="properties animate-fade-in" aria-label="Properties Panel">
      <div className="properties-header">
        <h3 className="properties-title">Properties</h3>
        <span className="properties-badge">{displayName}</span>
      </div>

      <div className="properties-content">

        {/* Transform */}
        <PropSection label="Transform">
          <div className="prop-group">
            <label className="prop-label">Position</label>
            <div className="prop-row">
              {['x', 'y', 'z'].map(axis => (
                <div key={axis}>
                  <label className="prop-label" style={{ fontSize: '0.6rem', color: 'var(--brand)', opacity: 0.8 }}>
                    {axis.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    className="prop-input"
                    value={selectedObject.position[axis].toFixed(2)}
                    step="0.1"
                    onChange={e => handlePositionChange(axis, e.target.value)}
                    aria-label={`Position ${axis.toUpperCase()}`}
                    style={{ padding: '0 0.4rem', textAlign: 'center' }}
                  />
                </div>
              ))}
            </div>
          </div>

        </PropSection>

        {/* Appearance */}
        <PropSection label="Appearance">
          <div className="prop-group">
            <label className="prop-label" htmlFor="prop-color-text">Color</label>
            <div className="prop-color">
              <input
                type="color"
                className="prop-color-input"
                value={selectedObject.color}
                onChange={e => handlePropertyChange('color', e.target.value)}
                aria-label="Object color"
              />
              <input
                id="prop-color-text"
                type="text"
                className="prop-input"
                value={selectedObject.color}
                onChange={e => handlePropertyChange('color', e.target.value)}
                style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.77rem' }}
              />
            </div>
          </div>
        </PropSection>



        {/* Actions */}
        <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
          <button
            className="btn btn-danger btn-full"
            onClick={() => removeObject(selectedObject.id)}
            aria-label={`Remove ${displayName} from scene`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
            Remove Object
          </button>
        </div>

      </div>
    </aside>
  )
}
