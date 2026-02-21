# Marine AR Sandbox - Entry Task

A minimal web-based sandbox toolkit for creating and testing marine AR modules.

## Features (Entry Task Requirements)

- **Simple UI**: Three-panel layout (Assets | 3D Preview | Properties)
- **Drag-and-Drop**: Drag objects from library to 3D scene
- **Property Editing**: Click objects to edit position, scale, behavior
- **Live Preview**: Real-time 3D visualization with animations

## How to Run

Open `index.html` in a web browser (Chrome/Firefox recommended).

## Usage

| Action | How |
|--------|-----|
| Add object | Drag from left panel to canvas |
| Quick add | Click "+ Add Fish" button |
| Select | Click on object in scene |
| Edit | Use right panel controls |
| Delete | Select object, click Delete |
| Camera | Right-click + drag to rotate |

## Objects Available

- Fish: Clownfish, Jellyfish, Shark

## Behaviors

- Static (no animation)
- Swim (horizontal movement)
- Float (gentle drift)
- Sway (plant-like motion)

## Technology

- HTML5, CSS3
- JavaScript (ES6)
- Three.js (3D rendering)

## Video Demo

[Record a screen capture demonstrating the features]

## Design Notes

This implementation uses:
- Procedural 3D shapes (primitives) as placeholders
- Three.js for WebGL rendering
- Raycasting for object selection
- Local state management (no backend)

Future extensions could include:
- Import Blender models (GLB format)
- WebXR AR mode
- Firebase cloud storage
- Behavior scripting system

---
Built for Entry Task - Marine AR Sandbox Toolkit
