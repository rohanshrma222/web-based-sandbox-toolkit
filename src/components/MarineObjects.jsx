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
// bodyColor     → applied only to the single largest mesh by bounding box volume
// fallbackColor → applied to untextured non-body meshes (teeth, eyes, etc.)
// tintColor     → tints only warm-hued textured meshes
// paintAllColor → applied to EVERY mesh whose base material has saturation > 0.1
//                 (all colored parts), skipping neutral grey/white meshes
function GLBModel({ path, fallbackColor, tintColor, bodyColor, paintAllColor, ...props }) {
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

  // Auto-scale ONCE when the model first loads.
  // Must be separate from the color effect — setFromObject returns world-space
  // bounds, so if scale + color ran together, every color change would re-read
  // the already-scaled bounds (~1 unit) and reset scale back to 1.0, making
  // the object jump to 5× its intended size and disappear off-camera.
  useEffect(() => {
    if (!cloned || !groupRef.current) return;
    cloned.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) groupRef.current.scale.setScalar(1.0 / maxDim);
  }, [cloned]); // cloned only — never re-runs when color changes

  // Apply colors whenever bodyColor / tintColor / fallbackColor change.
  // Scale is intentionally NOT recalculated here.
  useEffect(() => {
    if (!cloned) return;

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

    // paintAllColor: apply to every mesh whose material has saturation > 0.1.
    // This covers all colored body parts uniformly while leaving neutral
    // white/grey meshes (eyes, teeth) at their original colors.
    if (paintAllColor) {
      meshes.forEach((child) => {
        const mat = child.material;
        if (!mat || !mat.color) return;
        const hsl = {};
        mat.color.getHSL(hsl);
        if (hsl.s > 0.1) {
          child.material = mat.clone();
          child.material.color = new THREE.Color(paintAllColor);
          makeSolid(child.material);
        }
      });
      return; // skip bodyColor / tintColor paths when paintAllColor is set
    }

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
  }, [cloned, fallbackColor, tintColor, bodyColor, paintAllColor]);

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
  // paintAllColor paints every colored mesh (saturation > 0.1) uniformly —
  // bodyColor only hit the largest single mesh, leaving other parts unchanged.
  return <GLBModel path="/gold.glb" paintAllColor={color || "#ff6a00"} {...props} />;
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

// Preload all models when this module is imported.
// Without this, the first drag of each species triggers useGLTF to suspend,
// which unmounts the entire SceneContent via the <Suspense> boundary —
// causing existing objects (e.g. anglerfish) to disappear while the new
// model loads. Preloading makes useGLTF synchronous from the start.
useGLTF.preload('/jellyfishR.glb')
useGLTF.preload('/angler.glb')
useGLTF.preload('/gold.glb')

