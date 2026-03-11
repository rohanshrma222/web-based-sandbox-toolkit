import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { MARINE_OBJECT_TYPES } from "../store";


function Jellyfish({ color = "#ff69b4", ...props }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF("/jellyfishR.glb");

  // Per-instance clone so multiple jellyfishes can coexist
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  useEffect(() => {
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        if (color) {
          child.material.color = new THREE.Color(color);
          child.material.emissive = new THREE.Color(color);
          child.material.emissiveIntensity = 0.2;
        }
      }
    });
  }, [cloned, color]);

  // Wire animations to the cloned scene so each instance animates independently
  const { actions, names } = useAnimations(animations, cloned);

  useEffect(() => {
    names.forEach((name) => {
      const action = actions[name];
      if (action) action.reset().play();
    });
  }, [actions, names]);

  return (
    <group {...props} ref={groupRef}>
      <primitive object={cloned} scale={0.5} position={[0, -0.5, 0]} />
    </group>
  );
}

// Shared helper for GLB models.
// Uses useGLTF + SkeletonUtils.clone for per-instance scene graphs.
// Supports animations if the GLB contains them.
// fallbackColor → applied to untextured non-body meshes (teeth, eyes, etc.)
// tintColor     → tints only warm-hued textured meshes (e.g. goldfish body)
// bodyColor     → applied only to the single largest mesh by bounding box
//                 volume (anglerfish body), leaving smaller details alone
function GLBModel({ path, fallbackColor, tintColor, bodyColor, ...props }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(path);

  // Per-instance clone so multiple of the same type can coexist
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Play animations if any exist
  const { actions, names } = useAnimations(animations, cloned);
  useEffect(() => {
    names.forEach((name) => {
      const action = actions[name];
      if (action) action.reset().play();
    });
  }, [actions, names]);

  useEffect(() => {
    if (!cloned || !groupRef.current) return;

    // Update world matrices FIRST so bounding box volumes are correct
    cloned.updateMatrixWorld(true);

    // Collect all meshes
    const meshes = [];
    cloned.traverse((child) => {
      if (child.isMesh || child.isSkinnedMesh) {
        child.visible = true;
        meshes.push(child);
      }
    });

    // Helper: ensure a material is fully opaque after color change
    const makeSolid = (mat) => {
      mat.transparent = false;
      mat.opacity = 1;
      mat.needsUpdate = true;
    };

    // If bodyColor is requested, find the largest mesh by bounding box volume
    let bodyMesh = null;
    if (bodyColor && meshes.length > 0) {
      let maxVol = -Infinity;
      meshes.forEach((mesh) => {
        const b = new THREE.Box3().setFromObject(mesh);
        const s = b.getSize(new THREE.Vector3());
        const vol = s.x * s.y * s.z;
        if (vol > maxVol) { maxVol = vol; bodyMesh = mesh; }
      });
      if (bodyMesh && bodyMesh.material) {
        bodyMesh.material = bodyMesh.material.clone();
        bodyMesh.material.color = new THREE.Color(bodyColor);
        makeSolid(bodyMesh.material);
      }
    }

    // Apply per-mesh color rules for all other meshes
    meshes.forEach((child) => {
      if (child === bodyMesh) return;
      const mat = child.material;
      if (!mat) return;

      if (fallbackColor && !mat.map) {
        child.material = mat.clone();
        child.material.color = new THREE.Color(fallbackColor);
        makeSolid(child.material);
        return;
      }

      if (tintColor && mat.color) {
        const hsl = {};
        mat.color.getHSL(hsl);
        const isWarm = (hsl.h <= 0.11 || hsl.h >= 0.94) && hsl.s > 0.3;
        if (isWarm) {
          child.material = mat.clone();
          child.material.color = new THREE.Color(tintColor);
          makeSolid(child.material);
        }
      }
    });

    // Auto-scale to ~1 unit bounding box
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) groupRef.current.scale.setScalar(1.0 / maxDim);
  }, [cloned, fallbackColor, tintColor, bodyColor]);

  return (
    <group {...props} ref={groupRef}>
      <primitive object={cloned} />
    </group>
  );
}

function Anglerfish({ color, ...props }) {
  // bodyColor → targets only the largest mesh (the body)
  // fallbackColor → gives teeth, eyes, light a neutral near-white shade
  return (
    <GLBModel
      path="/angler.glb"
      bodyColor={color || "#1a2f4c"}
      fallbackColor="#d4d4d4"
      {...props}
    />
  );
}

function Goldfish({ color, ...props }) {
  // Pass the user-chosen color as tintColor so the orange body is recolorable
  return <GLBModel path="/gold.glb" tintColor={color || "#ff6a00"} {...props} />;
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
