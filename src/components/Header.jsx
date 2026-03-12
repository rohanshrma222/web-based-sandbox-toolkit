import { useStore } from '../store'

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function Header() {
  const showGrid   = useStore(state => state.showGrid)
  const toggleGrid = useStore(state => state.toggleGrid)
  const objects    = useStore(state => state.objects)
  const studioMode = useStore(state => state.studioMode)
  const toggleStudioMode = useStore(state => state.toggleStudioMode)

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
          <>
            <div className="header-badge">
              🐠 {objects.length} object{objects.length !== 1 ? 's' : ''}
            </div>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => {
                const exportData = objects.map(obj => ({
                  type: obj.type,
                  position: obj.position,
                  rotation: obj.rotation,
                  scale: obj.scale,
                  color: obj.color,
                  behavior: obj.behavior,
                  speed: obj.speed
                }))
                downloadJSON({ scene_objects: exportData }, 'marine-sandbox-scene.json')
              }}
              title="Export scene as JSON"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export JSON
            </button>
          </>
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
        <button
          className={`btn btn-sm ${studioMode ? 'btn-primary' : 'btn-ghost'}`}
          onClick={toggleStudioMode}
          title={studioMode ? 'Exit Studio Mode' : 'Enter Studio Mode (Hide UI)'}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
          Studio
        </button>
      </div>
    </header>
  )
}
