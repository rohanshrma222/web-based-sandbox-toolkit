import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { MARINE_OBJECT_TYPES } from "../store";

function Clownfish({ color = "#ff6b35", ...props }) {
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
  );
}

function Jellyfish({ color = "#ff69b4", ...props }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF("/jellyfishR.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        if (color) {
          child.material.color = new THREE.Color(color);
          child.material.emissive = new THREE.Color(color);
          child.material.emissiveIntensity = 0.2;
        }
      }
    });
  }, [scene, color]);

  const { actions, names } = useAnimations(animations, scene);

  useEffect(() => {
    if (names.length > 0) {
      names.forEach((name) => {
        const action = actions[name];
        if (action) {
          action.reset().play();
        }
      });
    }
  }, [actions, names]);

  return (
    <group {...props} ref={groupRef}>
      <primitive object={scene} scale={0.5} position={[0, -0.5, 0]} />
    </group>
  );
}

export function MarineObject({ type, color, ...props }) {
  const objectProps = { color, ...props };

  switch (type) {
    case MARINE_OBJECT_TYPES.FISH_CLOWNFISH:
      return <Clownfish {...objectProps} />;
    case MARINE_OBJECT_TYPES.FISH_JELLYFISH:
      return <Jellyfish {...objectProps} />;
    default:
      return <Clownfish {...objectProps} />;
  }
}
