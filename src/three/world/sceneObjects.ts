import * as THREE from "three";
import { GLTF } from "three/addons/loaders/GLTFLoader.js";

type SceneObjectsOptions = {
  scene: THREE.Scene;
  gltf: GLTF;
  textures: Record<string, THREE.Texture>;
  raycastTargets: THREE.Object3D[];
};

export function setupSceneObjects({
  scene,
  gltf,
  textures,
  raycastTargets,
}: SceneObjectsOptions) {
  gltf.scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    if (Array.isArray(child.material)) return;

    /* ---------- INTERACTABLE OBJECTS ---------- */
    if (child.name.startsWith("interact_")) {
      const modalName = child.name.split("_")[1];

      child.userData = {
        ...child.userData,
        type: "interactable",
        modal: modalName,
        hover: "scale",
      };

      raycastTargets.push(child);
    }

    /* ---------- GLASS ---------- */
    if (child.name.toLowerCase().includes("glass")) {
      child.material = new THREE.MeshPhysicalMaterial({
        transmission: 1,
        roughness: 0,
        ior: 1.5,
        transparent: true,
      });
      return;
    }

    /* ---------- TEXTURES ---------- */
    for (const [key, texture] of Object.entries(textures)) {
      if (child.name.includes(key)) {
        child.material = new THREE.MeshBasicMaterial({
          map: texture,
        });
        break;
      }
    }
  });

  scene.add(gltf.scene);
}
