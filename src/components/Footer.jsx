import { useStore, MARINE_OBJECT_TYPES } from '../store'

export function Footer() {
  const addObject = useStore(state => state.addObject)
  const clearAll = useStore(state => state.clearAll)
  
  const handleAddRandom = () => {
    const types = Object.values(MARINE_OBJECT_TYPES)
    const randomType = types[Math.floor(Math.random() * types.length)]
    addObject(randomType)
  }
  
  return (
    <footer className="app-footer">
      <div className="footer-actions">
        <button className="btn btn-sm btn-primary" onClick={handleAddRandom}>
          + Add Random
        </button>
        
        <button className="btn btn-sm btn-secondary" onClick={clearAll}>
          Clear All
        </button>
      </div>
    </footer>
  )
}
