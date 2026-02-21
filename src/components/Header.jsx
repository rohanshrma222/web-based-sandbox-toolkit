import { useStore } from '../store'

export function Header() {
  const showGrid = useStore(state => state.showGrid)
  const toggleGrid = useStore(state => state.toggleGrid)
  
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12c.6.3 1.2.6 1.8 1 1.4.9 2.8 1.8 4.2 2.5.7.3 1.3.7 2 .9.7.2 1.4.3 2.1.3.7 0 1.4-.1 2.1-.3.7-.2 1.3-.6 2-.9 1.4-.7 2.8-1.6 4.2-2.5.6-.4 1.2-.7 1.8-1" />
            <path d="M2 16c.6.3 1.2.6 1.8 1 1.4.9 2.8 1.8 4.2 2.5.7.3 1.3.7 2 .9.7.2 1.4.3 2.1.3.7 0 1.4-.1 2.1-.3.7-.2 1.3-.6 2-.9 1.4-.7 2.8-1.6 4.2-2.5.6-.4 1.2-.7 1.8-1" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div className="brand-text">
          <h1>Marine AR Sandbox</h1>
          <span>Module Builder</span>
        </div>
      </div>
      
      <div className="header-actions">
        <button className="btn btn-sm btn-ghost" onClick={toggleGrid}>
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </button>
      </div>
    </header>
  )
}
