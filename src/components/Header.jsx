import { useStore } from '../store'

export function Header() {
  const showGrid   = useStore(state => state.showGrid)
  const toggleGrid = useStore(state => state.toggleGrid)
  const objects    = useStore(state => state.objects)

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12c.6.3 1.2.6 1.8 1 1.4.9 2.8 1.8 4.2 2.5.7.3 1.3.7 2 .9.7.2 1.4.3 2.1.3.7 0 1.4-.1 2.1-.3.7-.2 1.3-.6 2-.9 1.4-.7 2.8-1.6 4.2-2.5.6-.4 1.2-.7 1.8-1"/>
            <path d="M2 17c.6.3 1.2.6 1.8 1 1.4.9 2.8 1.8 4.2 2.5.7.3 1.3.7 2 .9.7.2 1.4.3 2.1.3.7 0 1.4-.1 2.1-.3.7-.2 1.3-.6 2-.9 1.4-.7 2.8-1.6 4.2-2.5.6-.4 1.2-.7 1.8-1"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
        <div className="brand-text">
          <h1>Marine AR Sandbox</h1>
          <span>Module Builder</span>
        </div>
      </div>

      <div className="header-actions">
        {objects.length > 0 && (
          <div className="header-badge">
            🐠 {objects.length} object{objects.length !== 1 ? 's' : ''}
          </div>
        )}
        <button
          className="btn btn-sm btn-ghost"
          onClick={toggleGrid}
          title={showGrid ? 'Hide reference grid' : 'Show reference grid'}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          Grid {showGrid ? 'On' : 'Off'}
        </button>
      </div>
    </header>
  )
}
