import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FurnitureModel({
  modelPath,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  autoRotate = false,
  color,
  onClick,
}) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();

  useEffect(() => {
    if (scene && scale !== 1) {
      scene.scale.set(scale, scale, scale);
    }

    // Make all meshes in the scene interactive
    scene.traverse((child) => {
      if (child.isMesh) {
        // Store original material for reset if not already stored
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material.clone();
        }

        // Apply new color if specified, otherwise restore original material
        if (color) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            metalness: child.userData.originalMaterial.metalness || 0.5,
            roughness: child.userData.originalMaterial.roughness || 0.5,
          });
        } else {
          // Restore original material if no color is specified
          child.material = child.userData.originalMaterial.clone();
        }

        // Make the mesh interactive
        child.raycast = new THREE.Mesh().raycast;
      }
    });

    // Cleanup function to restore original materials
    return () => {
      scene.traverse((child) => {
        if (child.isMesh && child.userData.originalMaterial) {
          child.material = child.userData.originalMaterial.clone();
        }
      });
    };
  }, [scene, scale, color]);

  useFrame((_, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      ref={modelRef}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(e);
      }}
    />
  );
}
