import { useStore, OBJECT_CATEGORIES, MARINE_OBJECT_TYPES } from '../store'

const ASSET_CONFIG = {
  [MARINE_OBJECT_TYPES.FISH_CLOWNFISH]: {
    name: 'Clownfish',
    icon: '🐠',
    color: '#ff6b35',
    gradient: 'linear-gradient(135deg, #ff6b35, #ffa500)',
  },
  [MARINE_OBJECT_TYPES.FISH_JELLYFISH]: {
    name: 'Jellyfish',
    icon: '🎐',
    color: '#ff69b4',
    gradient: 'linear-gradient(135deg, #ff69b4, #da70d6)',
  },
  [MARINE_OBJECT_TYPES.FISH_SHARK]: {
    name: 'Shark',
    icon: '🦈',
    color: '#4a5568',
    gradient: 'linear-gradient(135deg, #4a5568, #2d3748)',
  },
  [MARINE_OBJECT_TYPES.CORAL_BRAIN]: {
    name: 'Brain Coral',
    icon: '🪸',
    color: '#ed8936',
    gradient: 'linear-gradient(135deg, #ed8936, #c05621)',
  },
  [MARINE_OBJECT_TYPES.PLANT_SEAWEED]: {
    name: 'Seaweed',
    icon: '🌿',
    color: '#48bb68',
    gradient: 'linear-gradient(135deg, #48bb68, #276749)',
  },
  [MARINE_OBJECT_TYPES.CORAL_FAN]: {
    name: 'Sea Fan',
    icon: '🌸',
    color: '#fc8181',
    gradient: 'linear-gradient(135deg, #fc8181, #e53e3e)',
  },
  [MARINE_OBJECT_TYPES.TERRAIN_ROCK]: {
    name: 'Rock',
    icon: '🪨',
    color: '#718096',
    gradient: 'linear-gradient(135deg, #718096, #4a5568)',
  },
  [MARINE_OBJECT_TYPES.TERRAIN_SAND]: {
    name: 'Sand',
    icon: '🏖️',
    color: '#d69e2e',
    gradient: 'linear-gradient(135deg, #d69e2e, #b7791f)',
  },
  [MARINE_OBJECT_TYPES.TERRAIN_SHELL]: {
    name: 'Shell',
    icon: '🐚',
    color: '#fbd38d',
    gradient: 'linear-gradient(135deg, #fbd38d, #dd6b20)',
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
        style={{ background: config.gradient }}
      >
        {config.icon}
      </div>
      <span className="asset-name">{config.name}</span>
    </div>
  )
}

export function Sidebar() {
  const objectCount = useStore(state => state.objects.length)
  
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Asset Library</h2>
      </div>
      
      {Object.entries(OBJECT_CATEGORIES).map(([key, category]) => (
        <div key={key} className="sidebar-section">
          <h3 className="section-title">{category.label}</h3>
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
