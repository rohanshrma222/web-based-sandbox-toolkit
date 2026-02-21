import { create } from 'zustand'

export const MARINE_OBJECT_TYPES = {
  FISH_CLOWNFISH: 'fish-clownfish',
  FISH_JELLYFISH: 'fish-jellyfish',
  FISH_SHARK: 'fish-shark',
  CORAL_BRAIN: 'coral-brain',
  PLANT_SEAWEED: 'plant-seaweed',
  CORAL_FAN: 'coral-fan',
  TERRAIN_ROCK: 'terrain-rock',
  TERRAIN_SAND: 'terrain-sand',
  TERRAIN_SHELL: 'terrain-shell',
}

export const OBJECT_CATEGORIES = {
  FISH: {
    label: 'Fish',
    types: [MARINE_OBJECT_TYPES.FISH_CLOWNFISH, MARINE_OBJECT_TYPES.FISH_JELLYFISH, MARINE_OBJECT_TYPES.FISH_SHARK],
  },
  CORAL: {
    label: 'Coral',
    types: [MARINE_OBJECT_TYPES.CORAL_BRAIN, MARINE_OBJECT_TYPES.CORAL_FAN],
  },
  PLANTS: {
    label: 'Plants',
    types: [MARINE_OBJECT_TYPES.PLANT_SEAWEED],
  },
  TERRAIN: {
    label: 'Terrain',
    types: [MARINE_OBJECT_TYPES.TERRAIN_ROCK, MARINE_OBJECT_TYPES.TERRAIN_SAND, MARINE_OBJECT_TYPES.TERRAIN_SHELL],
  },
}

export const BEHAVIORS = {
  STATIC: 'static',
  SWIM_HORIZONTAL: 'swim-horizontal',
  SWIM_VERTICAL: 'swim-vertical',
  FLOAT: 'float',
  SWAY: 'sway',
}

export const BEHAVIOR_OPTIONS = [
  { value: BEHAVIORS.STATIC, label: 'Static' },
  { value: BEHAVIORS.SWIM_HORIZONTAL, label: 'Swim Horizontal' },
  { value: BEHAVIORS.SWIM_VERTICAL, label: 'Swim Vertical' },
  { value: BEHAVIORS.FLOAT, label: 'Float' },
  { value: BEHAVIORS.SWAY, label: 'Sway' },
]

export const DEFAULT_COLORS = {
  [MARINE_OBJECT_TYPES.FISH_CLOWNFISH]: '#ff6b35',
  [MARINE_OBJECT_TYPES.FISH_JELLYFISH]: '#ff69b4',
  [MARINE_OBJECT_TYPES.FISH_SHARK]: '#4a5568',
  [MARINE_OBJECT_TYPES.CORAL_BRAIN]: '#ed8936',
  [MARINE_OBJECT_TYPES.PLANT_SEAWEED]: '#48bb68',
  [MARINE_OBJECT_TYPES.CORAL_FAN]: '#fc8181',
  [MARINE_OBJECT_TYPES.TERRAIN_ROCK]: '#718096',
  [MARINE_OBJECT_TYPES.TERRAIN_SAND]: '#d69e2e',
  [MARINE_OBJECT_TYPES.TERRAIN_SHELL]: '#fbd38d',
}

const MAX_OBJECTS = 50

let objectIdCounter = 0

export const useStore = create((set, get) => ({
  objects: [],
  selectedId: null,
  isLoading: false,
  showGrid: true,
  
  addObject: (type, position = null) => {
    const { objects } = get()
    if (objects.length >= MAX_OBJECTS) {
      console.warn(`Maximum object limit (${MAX_OBJECTS}) reached`)
      return null
    }
    
    const id = ++objectIdCounter
    const defaultColor = DEFAULT_COLORS[type] || '#888888'
    
    const newObject = {
      id,
      type,
      position: position || {
        x: (Math.random() - 0.5) * 6,
        y: Math.random() * 1.5,
        z: (Math.random() - 0.5) * 6,
      },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 1,
      color: defaultColor,
      behavior: BEHAVIORS.STATIC,
      speed: 1,
    }
    
    set({ objects: [...objects, newObject] })
    set({ selectedId: id })
    
    return newObject
  },
  
  removeObject: (id) => {
    const { objects, selectedId } = get()
    set({
      objects: objects.filter(obj => obj.id !== id),
      selectedId: selectedId === id ? null : selectedId,
    })
  },
  
  clearAll: () => {
    set({ objects: [], selectedId: null })
  },
  
  selectObject: (id) => {
    set({ selectedId: id })
  },
  
  deselectObject: () => {
    set({ selectedId: null })
  },
  
  updateObject: (id, updates) => {
    const { objects } = get()
    set({
      objects: objects.map(obj => 
        obj.id === id ? { ...obj, ...updates } : obj
      )
    })
  },
  
  updatePosition: (id, axis, value) => {
    const { objects } = get()
    set({
      objects: objects.map(obj => 
        obj.id === id ? { ...obj, position: { ...obj.position, [axis]: value } } : obj
      )
    })
  },
  
  updateRotation: (id, axis, value) => {
    const { objects } = get()
    set({
      objects: objects.map(obj => 
        obj.id === id ? { ...obj, rotation: { ...obj.rotation, [axis]: value } } : obj
      )
    })
  },
  
  toggleGrid: () => {
    set(state => ({ showGrid: !state.showGrid }))
  },
  
  getSelectedObject: () => {
    const { objects, selectedId } = get()
    return objects.find(obj => obj.id === selectedId) || null
  },
  
  exportScene: () => {
    const { objects } = get()
    return {
      objects: objects.map(({ id, ...rest }) => rest),
      metadata: {
        exportedAt: new Date().toISOString(),
        objectCount: objects.length,
      },
    }
  },
  
  importScene: (data) => {
    if (!data?.objects) return false
    
    const importedObjects = data.objects.map((obj, index) => ({
      ...obj,
      id: ++objectIdCounter,
    }))
    
    set({ objects: importedObjects, selectedId: null })
    return true
  },
}))
