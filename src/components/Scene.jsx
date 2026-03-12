import { useRef, useMemo, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useStore, BEHAVIORS } from '../store'
import { MarineObject } from './MarineObjects'

function Particles() {
  const count = 250
  const mesh = useRef()

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)      // per-particle size
    const origins = new Float32Array(count * 2)  // original X/Z to wobble around
    const data = []

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 24
      const z = (Math.random() - 0.5) * 24
      positions[i * 3] = x
      positions[i * 3 + 1] = Math.random() * 12 - 2  // spread full water column
      positions[i * 3 + 2] = z

      origins[i * 2] = x   // anchor X
      origins[i * 2 + 1] = z   // anchor Z

      // Vary size: small tight bubbles (0.04) to larger ones (0.18)
      sizes[i] = 0.04 + Math.random() * 0.14

      data.push({
        speed: 0.08 + Math.random() * 0.18,      // rise speed
        wobble: Math.random() * Math.PI * 2,       // initial phase offset
        drift: 0.15 + Math.random() * 0.25,       // horizontal drift amplitude
        freq: 0.4 + Math.random() * 0.6,        // horizontal drift frequency
      })
    }

    return { positions, sizes, origins, data }
  }, [])

  useFrame((state, delta) => {
    if (!mesh.current) return

    const pos = mesh.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const d = particles.data[i]

      // Rise
      pos[i * 3 + 1] += d.speed * delta

      // Horizontal sine drift around origin — uses wobble for unique phase
      pos[i * 3] = particles.origins[i * 2] + Math.sin(t * d.freq + d.wobble) * d.drift
      pos[i * 3 + 2] = particles.origins[i * 2 + 1] + Math.cos(t * d.freq * 0.7 + d.wobble) * d.drift * 0.5

      // Reset when bubble reaches surface — re-seed a new random origin
      if (pos[i * 3 + 1] > 9) {
        const nx = (Math.random() - 0.5) * 24
        const nz = (Math.random() - 0.5) * 24
        pos[i * 3 + 1] = -2
        particles.origins[i * 2] = nx
        particles.origins[i * 2 + 1] = nz
        pos[i * 3] = nx
        pos[i * 3 + 2] = nz
      }
    }

    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a5d8ff"
        size={0.08}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function CausticLights() {
  const lightsRef = useRef([])

  useFrame((state) => {
    lightsRef.current.forEach((light, i) => {
      if (light) {
        light.position.x = Math.sin(state.clock.elapsedTime * 0.5 + i * 2) * 4
        light.position.z = Math.cos(state.clock.elapsedTime * 0.3 + i * 2) * 4
      }
    })
  })

  return (
    <>
      {[0, 1, 2].map((i) => (
        <pointLight
          key={i}
          ref={el => lightsRef.current[i] = el}
          color="#7dd3fc"
          intensity={0.5}
          position={[0, 6, 0]}
          distance={12}
        />
      ))}
    </>
  )
}

function AnimatedObject({ object, isSelected, onClick }) {
  const meshRef = useRef()
  const ringRef = useRef()
  const initialPos = useRef({ x: object.position.x, y: object.position.y, z: object.position.z })
  const animTime = useRef(Math.random() * Math.PI * 2)

  // Sync initialPos when the user edits position in the Properties Panel
  useEffect(() => {
    initialPos.current = { x: object.position.x, y: object.position.y, z: object.position.z }
  }, [object.position.x, object.position.y, object.position.z])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const speed = object.speed || 1
    animTime.current += delta

    switch (object.behavior) {

      case BEHAVIORS.SWIM_VERTICAL:
        meshRef.current.position.y = initialPos.current.y + Math.sin(animTime.current * speed * 1.5) * 0.5
        meshRef.current.rotation.z = Math.sin(animTime.current * speed * 0.5) * 0.1
        break
      case BEHAVIORS.FLOAT:
        meshRef.current.position.y = initialPos.current.y + Math.sin(animTime.current * speed * 0.8) * 0.3
        meshRef.current.rotation.y += delta * 0.2 * speed
        break
      case BEHAVIORS.SWAY:
        meshRef.current.rotation.z = Math.sin(animTime.current * speed * 2) * 0.1
        meshRef.current.rotation.x = Math.cos(animTime.current * speed * 1.5) * 0.05
        break
      default:
        break
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5
    }
  })

  const scale = object.scale || 1

  return (
    <group
      ref={meshRef}
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation()
        onClick(object.id)
      }}
    >
      <MarineObject type={object.type} color={object.color} />
    </group>
  )
}

function SceneContent() {
  const objects = useStore(state => state.objects)
  const selectedId = useStore(state => state.selectedId)
  const selectObject = useStore(state => state.selectObject)
  const showGrid = useStore(state => state.showGrid)

  return (
    <>
      <color attach="background" args={['#0c4a6e']} />
      <fogExp2 attach="fog" args={['#164e63', 0.025]} />

      <ambientLight intensity={0.7} color="#e0f2fe" />
      <directionalLight
        position={[5, 12, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#bae6fd" />

      <CausticLights />

      <Particles />

      {showGrid && (
        <Grid
          position={[0, -1.99, 0]}
          args={[16, 16]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#234674ff"
          sectionSize={4}
          sectionThickness={1}
          sectionColor="#2d4a6f"
          fadeDistance={20}
          fadeStrength={1}
          infiniteGrid
        />
      )}

      {objects.map(obj => (
        <AnimatedObject
          key={obj.id}
          object={obj}
          isSelected={obj.id === selectedId}
          onClick={selectObject}
        />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2 + 0.3}
        target={[0, 0, 0]}
      />

      {/* Cinematic Post-Processing */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.2} 
          mipmapBlur 
          intensity={1.2} 
        />
        <Vignette eskil={false} offset={0.01} darkness={1.1} />
      </EffectComposer>
    </>
  )
}


export function Scene({ onDrop }) {
  const canvasRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    onDrop({ x: x * 4, y: Math.max(0.5, 1.5 + y), z: 0 })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div
      className="canvas-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 3, 8], fov: 60, near: 0.1, far: 1000 }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
