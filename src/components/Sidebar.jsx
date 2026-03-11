import { useStore, OBJECT_CATEGORIES, MARINE_OBJECT_TYPES } from "../store";

const ASSET_CONFIG = {
  [MARINE_OBJECT_TYPES.FISH_JELLYFISH]: {
    name: "Jellyfish",
    icon: "🎐",
    gradient: "linear-gradient(135deg, #6d28d9 0%, #c026d3 60%, #f43f5e 100%)",
    description: "Bioluminescent drifter",
  },
  [MARINE_OBJECT_TYPES.FISH_ANGLERFISH]: {
    name: "Anglerfish",
    icon: "🎣",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #0ea5e9 100%)",
    description: "Deep-sea predator",
  },
  [MARINE_OBJECT_TYPES.FISH_GOLDFISH]: {
    name: "Goldfish",
    icon: "🐠",
    gradient: "linear-gradient(135deg, #b45309 0%, #f97316 60%, #fbbf24 100%)",
    description: "Curious reef fish",
  },
};

function AssetItem({ type, config }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("objectType", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      className="asset-item"
      draggable
      onDragStart={handleDragStart}
      title={`Drag to add ${config.name} — ${config.description}`}
      role="button"
      aria-label={`Add ${config.name}`}
    >
      <div className="asset-icon" style={{ background: config.gradient }}>
        {config.icon}
      </div>
      <span className="asset-name">{config.name}</span>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Asset Library">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Asset Library</h2>
      </div>

      {Object.entries(OBJECT_CATEGORIES).map(([key, category]) => {
        const available = category.types.filter((t) => ASSET_CONFIG[t]);
        return (
          <div key={key} className="sidebar-section">
            <h3 className="section-title">{category.label}</h3>
            <div className="asset-grid">
              {available.map((type) => (
                <AssetItem key={type} type={type} config={ASSET_CONFIG[type]} />
              ))}
            </div>
          </div>
        );
      })}

      <div style={{
        marginTop: 'auto',
        padding: '0.75rem',
        borderTop: '1px solid var(--border)',
      }}>
        <p style={{
          fontSize: '0.65rem',
          color: 'var(--text-dim)',
          lineHeight: '1.5',
          textAlign: 'center',
        }}>
          Drag creatures onto the canvas to place them in the scene
        </p>
      </div>
    </aside>
  );
}
