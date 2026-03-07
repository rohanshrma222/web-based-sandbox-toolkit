import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { MARINE_OBJECT_TYPES } from '../store'

function Clownfish({ color = '#ff6b35', ...props }) {
  return (
    <group {...props}>
      <mesh castShadow>
        <sphereGeometry args={[0.4, 16, 12]} />
        <meshPhongMaterial color={color} shininess={30} />
      </mesh>
      <mesh castShadow position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.35, 0.06, 8, 16]} />
        <meshPhongMaterial color="#ffffff" />
      </mesh>
      <mesh castShadow position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.32, 0.05, 8, 16]} />
        <meshPhongMaterial color="#ffffff" />
      </mesh>
      <mesh castShadow position={[-0.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.25, 0.5, 3]} />
        <meshPhongMaterial color={color} />
      </mesh>
      <mesh castShadow position={[0, 0.35, 0]}>
        <coneGeometry args={[0.15, 0.35, 3]} />
        <meshPhongMaterial color={color} />
      </mesh>
      <mesh position={[0.35, 0.12, 0.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshPhongMaterial color="#000000" />
      </mesh>
      <mesh position={[0.38, 0.12, 0.2]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshPhongMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.35, 0.12, -0.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshPhongMaterial color="#000000" />
      </mesh>
      <mesh position={[0.38, 0.12, -0.2]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshPhongMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function Jellyfish({ color = '#ff69b4', ...props }) {
  const groupRef = useRef()
  const { scene, animations } = useGLTF('/jellyfish.glb')
  const { actions, names } = useAnimations(animations, groupRef)

  const clonedScene = useMemo(() => {
    const cloned = scene.clone()
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        child.material.color = new THREE.Color(color)
        child.material.emissive = new THREE.Color(color)
        child.material.emissiveIntensity = 0.3
      }
    })
    return cloned
  }, [scene, color])

  useEffect(() => {
    if (actions && names.length > 0) {
      const action = actions[names[0]]
      if (action) {
        action.reset().fadeIn(0.5).play()
      }
    }
  }, [actions, names])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1
    }
  })

  return (
    <group {...props}>
      <primitive
        object={clonedScene}
        ref={groupRef}
        scale={0.5}
        position={[0, -0.5, 0]}
      />
    </group>
  )
}

function Shark({ color = '#4a5568', ...props }) {
  return (
    <group {...props}>
      <mesh castShadow>
        <sphereGeometry args={[0.5, 16, 12]} />
        <meshPhongMaterial args={[color]} />
      </mesh>
      <mesh castShadow position={[-1.1, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.3, 0.7, 3]} />
        <meshPhongMaterial args={[color]} />
      </mesh>
      <mesh castShadow position={[0.15, 0.45, 0]}>
        <coneGeometry args={[0.25, 0.5, 3]} />
        <meshPhongMaterial args={[color]} />
      </mesh>
      <mesh castShadow position={[-0.15, -0.15, 0.35]} rotation={[Math.PI / 4, 0, 0]}>
        <coneGeometry args={[0.15, 0.4, 3]} />
        <meshPhongMaterial args={[color]} />
      </mesh>
      <mesh castShadow position={[-0.15, -0.15, -0.35]} rotation={[-Math.PI / 4, 0, 0]}>
        <coneGeometry args={[0.15, 0.4, 3]} />
        <meshPhongMaterial args={[color]} />
      </mesh>
      <mesh position={[0.7, 0.12, 0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshPhongMaterial color="#000000" />
      </mesh>
      <mesh position={[0.7, 0.12, -0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshPhongMaterial color="#000000" />
      </mesh>
    </group>
  )
}

function BrainCoral({ color = '#ed8936', ...props }) {
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2)
    const positions = geo.attributes.position
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)
      const noise = Math.sin(x * 8) * Math.cos(z * 8) * 0.06
      positions.setX(i, x + noise * x * 0.5)
      positions.setY(i, y + noise * 0.3)
      positions.setZ(i, z + noise * z * 0.5)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <group {...props}>
      <mesh castShadow geometry={geometry}>
        <meshPhongMaterial color={color} flatShading />
      </mesh>
      <mesh castShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.15, 16]} />
        <meshPhongMaterial color={color} />
      </mesh>
    </group>
  )
}

function Seaweed({ color = '#48bb68', ...props }) {
  const bladesRef = useRef([])

  useFrame((state) => {
    bladesRef.current.forEach((blade, i) => {
      if (blade) {
        blade.rotation.z = Math.sin(state.clock.elapsedTime * 1.5 + i * 0.5) * 0.15
        blade.rotation.x = Math.cos(state.clock.elapsedTime * 1.2 + i * 0.3) * 0.05
      }
    })
  })

  return (
    <group {...props}>
      {[...Array(6)].map((_, i) => (
        <group
          key={i}
          position={[(Math.random() - 0.5) * 0.2, 0, (Math.random() - 0.5) * 0.2]}
          ref={el => bladesRef.current[i] = el}
        >
          <mesh castShadow position={[0, 0.3, 0]}>
            <planeGeometry args={[0.06, 0.6, 2, 6]} />
            <meshPhongMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function SeaFan({ color = '#fc8181', ...props }) {
  return (
    <group {...props}>
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.015, 0.03, 0.5, 6]} />
        <meshPhongMaterial color={color} shininess={30} />
      </mesh>
      {[...Array(5)].map((_, i) => {
        const angle = -0.6 + i * 0.3
        return (
          <group key={i} position={[0, 0.45, 0]} rotation={[angle, 0, 0]}>
            <mesh castShadow position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.01, 0.015, 0.3, 5]} />
              <meshPhongMaterial color={color} />
            </mesh>
            <mesh castShadow position={[Math.sin(angle) * 0.15, 0.25, 0]} rotation={[angle * 0.5, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.012, 0.25, 5]} />
              <meshPhongMaterial color={color} />
            </mesh>
          </group>
        )
      })}
      <mesh castShadow position={[0, 0.05, 0]}>
        <coneGeometry args={[0.08, 0.12, 8]} />
        <meshPhongMaterial color={color} />
      </mesh>
    </group>
  )
}

function Rock({ color = '#718096', ...props }) {
  return (
    <group {...props}>
      {[
        { pos: [0, 0.12, 0], r: 0.18 },
        { pos: [0.12, 0.08, 0.08], r: 0.12 },
        { pos: [-0.1, 0.1, -0.06], r: 0.1 },
        { pos: [0.06, 0.16, -0.08], r: 0.08 },
        { pos: [-0.04, 0.04, 0.12], r: 0.06 },
      ].map((item, i) => (
        <mesh key={i} castShadow position={item.pos} rotation={[i * 0.5, i * 0.7, 0]}>
          <icosahedronGeometry args={[item.r, 0]} />
          <meshPhongMaterial color={color} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function SandPatch({ color = '#d69e2e', ...props }) {
  return (
    <group {...props}>
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.1, 24]} />
        <meshPhongMaterial color={color} />
      </mesh>
    </group>
  )
}

function Shell({ color = '#fbd38d', ...props }) {
  return (
    <group {...props}>
      <mesh castShadow rotation={[0, 0, Math.PI / 4]}>
        <sphereGeometry args={[0.12, 12, 8]} />
        <meshPhongMaterial color={color} shininess={60} />
      </mesh>
      <mesh castShadow position={[-0.15, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.06, 0.18, 8]} />
        <meshPhongMaterial color={color} shininess={60} />
      </mesh>
    </group>
  )
}

export function MarineObject({ type, color, ...props }) {
  const objectProps = { color, ...props }

  switch (type) {
    case MARINE_OBJECT_TYPES.FISH_CLOWNFISH:
      return <Clownfish {...objectProps} />
    case MARINE_OBJECT_TYPES.FISH_JELLYFISH:
      return <Jellyfish {...objectProps} />
    case MARINE_OBJECT_TYPES.FISH_SHARK:
      return <Shark {...objectProps} />
    case MARINE_OBJECT_TYPES.CORAL_BRAIN:
      return <BrainCoral {...objectProps} />
    case MARINE_OBJECT_TYPES.PLANT_SEAWEED:
      return <Seaweed {...objectProps} />
    case MARINE_OBJECT_TYPES.CORAL_FAN:
      return <SeaFan {...objectProps} />
    case MARINE_OBJECT_TYPES.TERRAIN_ROCK:
      return <Rock {...objectProps} />
    case MARINE_OBJECT_TYPES.TERRAIN_SAND:
      return <SandPatch {...objectProps} />
    case MARINE_OBJECT_TYPES.TERRAIN_SHELL:
      return <Shell {...objectProps} />
    default:
      return <Clownfish {...objectProps} />
  }
}
