# Marine AR Sandbox - Web-Based Sandbox Toolkit

A React + Three.js web-based toolkit for composing marine AR environments. Users can place 3D fish into a dark-ocean scene, customize their properties, and export the resulting composition as JSON.

![Sandbox Demo](./demo-screenshot.png)

## Features

- **Drag-and-Drop 3D Placement**: Easily drop bioluminescent Jellyfish, Anglerfish, Goldfish, or Coral from the Sidebar right into the scene.
- **Real-Time Property Editing**: Click on any object in the scene to open the Properties Panel.
  - **Transform**: Edit X, Y, Z positions.
  - **Appearance**: Customize the base color with a live color picker. Dark ocean contrast is handled automatically.
- **Default Float Animation**: All objects have a gentle floating animation by default.
- **JSON Export**: Click "Export JSON" in the top right to download your scene's state (positions, rotations, colors, and behaviors).
- **Premium Dark Ocean UI**: A custom, modern glassmorphism design system built from scratch with CSS variables ensures the controls feel immersive and native to the underwater scene.

## How to Run

1. Make sure Node.js is installed.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm run dev
   ```
4. Open the displayed URL in Chrome, Edge, or Firefox.

## Tech Stack

- **React 19** for component architecture and UI state.
- **Three.js** + **React Three Fiber** (`@react-three/fiber`) for declarative 3D rendering.
- **Drei** (`@react-three/drei`) for 3D helpers, lighting, and GLTF model loading.
- **Zustand** for lightweight, decentralized global state management.
- **Vanilla CSS** (`index.css`) for the complete custom design system.
