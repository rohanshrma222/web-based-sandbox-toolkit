import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, useFBX } from "@react-three/drei";
import * as THREE from "three";
import { MARINE_OBJECT_TYPES } from "../store";


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

// Shared helper for FBX models.
// Renders the raw FBX directly and auto-scales to fit ~1 unit bounding box.
function FBXModel({ path, color, materialColor, ...props }) {
  const groupRef = useRef();
  const fbx = useFBX(path);

  useEffect(() => {
    if (!fbx) return;

    // Ensure all meshes are visible (some FBX exporters set hidden by default)
    fbx.traverse((child) => {
      if (child.isMesh || child.isSkinnedMesh) {
        child.visible = true;
      }
    });

    // Auto-scale: fit the loaded model to ~1 unit so it sits inside the selection ring
    fbx.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(fbx);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0 && groupRef.current) {
      groupRef.current.scale.setScalar(1.0 / maxDim);
    }
  }, [fbx]);

  return (
    <group {...props} ref={groupRef}>
      <primitive object={fbx} />
    </group>
  );
}

function Anglerfish({ color, ...props }) {
  return <FBXModel path="/angler.fbx" color={color} materialColor="#1a2f4c" {...props} />;
}

function Goldfish({ color, ...props }) {
  return <FBXModel path="/fish2.fbx" color={color} materialColor="#ffa500" {...props} />;
}

export function MarineObject({ type, color, ...props }) {
  const objectProps = { color, ...props };

  switch (type) {
    case MARINE_OBJECT_TYPES.FISH_JELLYFISH:
      return <Jellyfish {...objectProps} />;
    case MARINE_OBJECT_TYPES.FISH_ANGLERFISH:
      return <Anglerfish {...objectProps} />;
    case MARINE_OBJECT_TYPES.FISH_GOLDFISH:
      return <Goldfish {...objectProps} />;
    default:
      return <Jellyfish {...objectProps} />;
  }
}
