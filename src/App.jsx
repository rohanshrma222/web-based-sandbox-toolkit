import { useCallback, useEffect } from 'react'
import { useStore } from './store'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Scene } from './components/Scene'
import { PropertiesPanel } from './components/PropertiesPanel'
import { Footer } from './components/Footer'

export default function App() {
  const objects = useStore(state => state.objects)
  const addObject = useStore(state => state.addObject)
  const deselectObject = useStore(state => state.deselectObject)
  const studioMode = useStore(state => state.studioMode)
  
  const handleDrop = useCallback((position) => {
    const type = window.__droppedObjectType
    if (type) {
      addObject(type, position)
      window.__droppedObjectType = null
    }
  }, [addObject])
  
  useEffect(() => {
    const handleGlobalDrop = (e) => {
      const type = e.dataTransfer.getData('objectType')
      if (type) {
        window.__droppedObjectType = type
      }
    }
    
    window.addEventListener('dragstart', handleGlobalDrop)
    return () => window.removeEventListener('dragstart', handleGlobalDrop)
  }, [])
  
  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      deselectObject()
    }
  }
  
  return (
    <div className={`app ${studioMode ? 'studio-mode' : ''}`}>
      <Header />
      
      <main className="app-main">
        <Sidebar />
        
        <section 
          className="canvas-area"
          onClick={handleCanvasClick}
        >
          <Scene onDrop={handleDrop} />
          {objects.length === 0 && (
            <div className="canvas-hint">
              <span className="canvas-hint-dot" aria-hidden="true" />
              Drag creatures from the sidebar to begin
            </div>
          )}
        </section>
        
        <PropertiesPanel />
      </main>
      
      <Footer />
    </div>
  )
}
