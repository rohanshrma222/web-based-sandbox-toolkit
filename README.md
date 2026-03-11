# Marine AR Sandbox - Web-Based Sandbox Toolkit

A React + Three.js web-based toolkit for composing marine AR environments. Users can place 3D fish into a dark-ocean scene, customize their properties, and export the resulting composition as JSON.

![Sandbox Demo](./demo-screenshot.png)

## Features

- **Drag-and-Drop 3D Placement**: Easily drop bioluminescent Jellyfish, Anglerfish, or Goldfish from the Sidebar right into the scene.
- **Real-Time Property Editing**: Click on any fish in the scene to open the Properties Panel.
  - **Transform**: Edit X, Y, Z positions and overall scale.
  - **Appearance**: Customize the base color of the fish with a live color picker. Dark ocean contrast is handled automatically.
  - **Behavior**: Choose from pre-programmed animations like `Float`, `Swim Vertical`, or `Sway`, and adjust the speed multiplier.
- **JSON Export**: Click "Export JSON" in the top right to download a clean, structured representation of your scene's state (positions, rotations, colors, scales, and active behaviors) for use in other parts of the pipeline or external AR engines.
- **Premium Dark Ocean UI**: A custom, modern glassmorphism design system built from scratch with CSS variables ensures the controls feel immersive and native to the underwater scene. Features live metrics, dynamic empty states, and animated hover interactions.

## How to Run

1. Make sure Node.js (and `pnpm`/`npm`/`yarn`) is installed.
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

- **React 18** for component architecture and UI state.
- **Three.js** + **React Three Fiber** (`@react-three/fiber`) for declarative 3D rendering.
- **Drei** (`@react-three/drei`) for 3D helpers, lighting, and GLTF model loading.
- **Zustand** for lightweight, decentralized global state management (handles the scene objects array, selected IDs, and UI toggles without prop-drilling).
- **Vanilla CSS** (`index.css`) for the complete custom design system (no Tailwind required).
