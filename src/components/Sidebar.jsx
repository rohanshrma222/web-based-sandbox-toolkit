import { useStore, OBJECT_CATEGORIES, MARINE_OBJECT_TYPES } from '../store'

const ASSET_CONFIG = {
  [MARINE_OBJECT_TYPES.FISH_CLOWNFISH]: {
    name: 'Clownfish',
    color: '#ff6b35',
  },
  [MARINE_OBJECT_TYPES.FISH_JELLYFISH]: {
    name: 'Jellyfish',
    color: '#ff69b4',
  },
  [MARINE_OBJECT_TYPES.FISH_SHARK]: {
    name: 'Shark',
    color: '#4a5568',
  },
  [MARINE_OBJECT_TYPES.CORAL_BRAIN]: {
    name: 'Brain Coral',
    color: '#ed8936',
  },
  [MARINE_OBJECT_TYPES.PLANT_SEAWEED]: {
    name: 'Seaweed',
    color: '#48bb68',
  },
  [MARINE_OBJECT_TYPES.CORAL_FAN]: {
    name: 'Sea Fan',
    color: '#fc8181',
  },
  [MARINE_OBJECT_TYPES.TERRAIN_ROCK]: {
    name: 'Rock',
    color: '#718096',
  },
  [MARINE_OBJECT_TYPES.TERRAIN_SAND]: {
    name: 'Sand',
    color: '#d69e2e',
  },
  [MARINE_OBJECT_TYPES.TERRAIN_SHELL]: {
    name: 'Shell',
    color: '#fbd38d',
  },
}

function AssetItem({ type, config }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('objectType', type)
    e.dataTransfer.effectAllowed = 'copy'
  }
  
  return (
    <div
      className="asset-item"
      draggable
      onDragStart={handleDragStart}
    >
      <div 
        className="asset-icon" 
        style={{ 
          background: config.color,
          boxShadow: `0 0 4px ${config.color}40`
        }}
      />
      <span className="asset-name">{config.name}</span>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="sidebar">
      {Object.entries(OBJECT_CATEGORIES).map(([key, category]) => (
        <div key={key} className="sidebar-section">
          <h3 className="sidebar-title">{category.label}</h3>
          <div className="asset-grid">
            {category.types.map(type => (
              <AssetItem 
                key={type} 
                type={type} 
                config={ASSET_CONFIG[type]} 
              />
            ))}
          </div>
        </div>
      ))}
    </aside>
  )
}
