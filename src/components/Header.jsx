import { useStore } from '../store'

export function Header() {
  const showGrid = useStore(state => state.showGrid)
  const toggleGrid = useStore(state => state.toggleGrid)
  
  return (
    <header className="app-header">
      <h1 className="app-title">Sonar Control</h1>
      
      <div className="status-bar">
        <div className="status-led">Depth: -42m</div>
        <div className="status-led">Temp: 24°C</div>
        <div className="status-led warning">Pressure: 5.1ATM</div>
      </div>
      
      <button 
        className="btn btn-sm btn-secondary"
        onClick={toggleGrid}
      >
        {showGrid ? '[GRID:ON]' : '[GRID:OFF]'}
      </button>
    </header>
  )
}
