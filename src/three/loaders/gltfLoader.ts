import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

export function createGLTFLoader(manager?: THREE.LoadingManager) {
  const draco = new DRACOLoader();
  draco.setDecoderPath("/draco/");

  const loader = new GLTFLoader(manager);
  loader.setDRACOLoader(draco);

  return loader;
}
