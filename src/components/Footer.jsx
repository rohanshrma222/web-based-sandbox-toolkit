import { useStore, MARINE_OBJECT_TYPES } from '../store'

export function Footer() {
  const addObject  = useStore(state => state.addObject)
  const clearAll   = useStore(state => state.clearAll)
  const objectCount = useStore(state => state.objects.length)

  const handleAddRandom = () => {
    const types = Object.values(MARINE_OBJECT_TYPES)
    const randomType = types[Math.floor(Math.random() * types.length)]
    addObject(randomType)
  }

  return (
    <footer className="app-footer">
      <div className="footer-stats">
      </div>

      <div className="footer-actions">
        <button
          className="btn btn-sm btn-primary"
          onClick={handleAddRandom}
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
