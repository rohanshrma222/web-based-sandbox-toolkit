import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import * as THREE from 'three'
import { useStore, BEHAVIORS } from '../store'
import { MarineObject } from './MarineObjects'

function Seabed() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(30, 30, 32, 32)
    const positions = geo.attributes.position
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const noise = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 0.1
      positions.setZ(i, noise)
    }
    geo.computeVertexNormals()
    return geo
  }, [])
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <primitive object={geometry} />
      <meshPhongMaterial color="#1a2f1a" shininess={5} />
    </mesh>
  )
}

function Particles() {
  const count = 100
  const mesh = useRef()
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const data = []
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = Math.random() * 10 - 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      data.push({
        speed: 0.1 + Math.random() * 0.15,
        wobble: Math.random() * Math.PI * 2,
      })
    }
    
    return { positions, data }
  }, [])
  
  useFrame((state, delta) => {
    if (!mesh.current) return
    
    const positions = mesh.current.geometry.attributes.position.array
    
    for (let i = 0; i < count; i++) {
      const d = particles.data[i]
      positions[i * 3 + 1] += d.speed * delta
      
      if (positions[i * 3 + 1] > 8) {
        positions[i * 3 + 1] = -2
        positions[i * 3] = (Math.random() - 0.5) * 20
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20
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
      </bufferGeometry>
      <pointsMaterial color="#00ff41" size={0.03} transparent opacity={0.6} />
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
          color="#00ff41"
          intensity={0.4}
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
  
  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    const speed = object.speed || 1
    animTime.current += delta
    
    switch (object.behavior) {
      case BEHAVIORS.SWIM_HORIZONTAL:
        meshRef.current.position.x = initialPos.current.x + Math.sin(animTime.current * speed * 2) * 2
        meshRef.current.rotation.y = Math.sin(animTime.current * speed) * 0.3
        break
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
      
      {isSelected && (
        <>
          <mesh ref={ringRef}>
            <ringGeometry args={[0.8, 0.85, 32]} />
            <meshBasicMaterial 
              color="#00ff41" 
              transparent 
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshBasicMaterial 
              wireframe 
              color="#00ff41" 
              transparent 
              opacity={0.15}
            />
          </mesh>
        </>
      )}
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
      <color attach="background" args={['#050808']} />
      <fogExp2 attach="fog" args={['#0a0f0a', 0.05]} />
      
      <ambientLight intensity={0.3} color="#1a3a1a" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.4}
        color="#00ff41"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 3, -5]} intensity={0.1} color="#003300" />
      
      <CausticLights />
      
      <Seabed />
      <Particles />
      
      {showGrid && (
        <Grid
          position={[0, -1.99, 0]}
          args={[16, 16]}
          cellSize={1}
          cellThickness={0.3}
          cellColor="#1f2f1f"
          sectionSize={4}
          sectionThickness={0.5}
          sectionColor="#2f4f2f"
          fadeDistance={15}
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
        <SceneContent />
      </Canvas>
    </div>
  )
}
