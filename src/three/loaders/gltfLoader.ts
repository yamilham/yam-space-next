import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

export function createGLTFLoader() {
  const draco = new DRACOLoader();
  draco.setDecoderPath("/draco/");

  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  return loader;
}
