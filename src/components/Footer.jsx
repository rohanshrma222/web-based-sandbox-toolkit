import { useStore, MARINE_OBJECT_TYPES } from '../store'

export function Footer() {
  const objects = useStore(state => state.objects)
  const addObject = useStore(state => state.addObject)
  const clearAll = useStore(state => state.clearAll)
  
  const handleAddRandom = () => {
    const types = Object.values(MARINE_OBJECT_TYPES)
    const randomType = types[Math.floor(Math.random() * types.length)]
    addObject(randomType)
  }
  
  return (
    <footer className="app-footer">
      <button className="btn btn-primary" onClick={handleAddRandom}>
        + Add Object
      </button>
      
      <button className="btn btn-secondary" onClick={clearAll}>
        Clear
      </button>
      
      <div className="stats">
        <span>OBJECTS:</span>
        <span className="stats-value">{objects.length}</span>
        <span>MAX:</span>
        <span className="stats-value">50</span>
      </div>
    </footer>
  )
}
