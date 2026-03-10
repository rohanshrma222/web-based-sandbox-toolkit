import { useStore, OBJECT_CATEGORIES, MARINE_OBJECT_TYPES } from "../store";

const ASSET_CONFIG = {
  [MARINE_OBJECT_TYPES.FISH_CLOWNFISH]: {
    name: "Clownfish",
    icon: "🐠",
    color: "#ff6b35",
    gradient: "linear-gradient(135deg, #ff6b35, #ffa500)",
  },
  [MARINE_OBJECT_TYPES.FISH_JELLYFISH]: {
    name: "Jellyfish",
    icon: "🎐",
    color: "#ff69b4",
    gradient: "linear-gradient(135deg, #ff69b4, #da70d6)",
  },
};

function AssetItem({ type, config }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("objectType", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="asset-item" draggable onDragStart={handleDragStart}>
      <div className="asset-icon" style={{ background: config.gradient }}>
        {config.icon}
      </div>
      <span className="asset-name">{config.name}</span>
    </div>
  );
}

export function Sidebar() {
  const objectCount = useStore((state) => state.objects.length);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Asset Library</h2>
      </div>

      {Object.entries(OBJECT_CATEGORIES).map(([key, category]) => (
        <div key={key} className="sidebar-section">
          <h3 className="section-title">{category.label}</h3>
          <div className="asset-grid">
            {category.types.map((type) => (
              <AssetItem key={type} type={type} config={ASSET_CONFIG[type]} />
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
