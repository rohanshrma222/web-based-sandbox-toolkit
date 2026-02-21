import { useStore, BEHAVIOR_OPTIONS } from '../store'

export function PropertiesPanel() {
  const selectedId = useStore(state => state.selectedId)
  const objects = useStore(state => state.objects)
  const updateObject = useStore(state => state.updateObject)
  const updatePosition = useStore(state => state.updatePosition)
  const removeObject = useStore(state => state.removeObject)
  
  const selectedObject = objects.find(obj => obj.id === selectedId)
  
  if (!selectedObject) {
    return (
      <aside className="properties">
        <div className="properties-header">
          <h3 className="properties-title">Properties</h3>
        </div>
        <div className="properties-content">
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
  
  const typeName = selectedObject.type.replace('fish-', '').replace('coral-', '').replace('plant-', '').replace('terrain-', '')
  
  return (
    <aside className="properties">
      <div className="properties-header">
        <h3 className="properties-title">Properties</h3>
      </div>
      <div className="properties-content">
        <div className="prop-group">
          <label className="prop-label">Object Type</label>
          <input 
            type="text" 
            className="prop-input" 
            value={typeName.charAt(0).toUpperCase() + typeName.slice(1)} 
            disabled 
          />
        </div>
        
        <div className="prop-group">
          <label className="prop-label">Position (X)</label>
          <input 
            type="number" 
            className="prop-input" 
            value={selectedObject.position.x.toFixed(2)}
            step="0.1"
            onChange={(e) => handlePositionChange('x', e.target.value)}
          />
        </div>
        
        <div className="prop-group">
          <label className="prop-label">Position (Y)</label>
          <input 
            type="number" 
            className="prop-input" 
            value={selectedObject.position.y.toFixed(2)}
            step="0.1"
            onChange={(e) => handlePositionChange('y', e.target.value)}
          />
        </div>
        
        <div className="prop-group">
          <label className="prop-label">Position (Z)</label>
          <input 
            type="number" 
            className="prop-input" 
            value={selectedObject.position.z.toFixed(2)}
            step="0.1"
            onChange={(e) => handlePositionChange('z', e.target.value)}
          />
        </div>
        
        <div className="prop-group">
          <label className="prop-label">Scale</label>
          <input 
            type="number" 
            className="prop-input" 
            value={selectedObject.scale}
            step="0.1"
            min="0.1"
            max="5"
            onChange={(e) => handlePropertyChange('scale', parseFloat(e.target.value) || 1)}
          />
        </div>
        
        <div className="prop-group">
          <label className="prop-label">Color</label>
          <div className="prop-color">
            <input 
              type="color" 
              className="prop-color-input"
              value={selectedObject.color}
              onChange={(e) => handlePropertyChange('color', e.target.value)}
            />
            <input 
              type="text" 
              className="prop-input"
              value={selectedObject.color}
              onChange={(e) => handlePropertyChange('color', e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>
        
        <div className="prop-group">
          <label className="prop-label">Behavior</label>
          <select 
            className="prop-input prop-select"
            value={selectedObject.behavior}
            onChange={(e) => handlePropertyChange('behavior', e.target.value)}
          >
            {BEHAVIOR_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        <div className="prop-group">
          <label className="prop-label">Speed</label>
          <input 
            type="range" 
            className="prop-input"
            style={{ padding: 0, cursor: 'pointer' }}
            value={selectedObject.speed}
            min="0.1"
            max="3"
            step="0.1"
            onChange={(e) => handlePropertyChange('speed', parseFloat(e.target.value))}
          />
        </div>
        
        <button 
          className="btn btn-danger btn-full"
          style={{ marginTop: '0.5rem' }}
          onClick={() => removeObject(selectedObject.id)}
        >
          Delete Object
        </button>
      </div>
    </aside>
  )
}
