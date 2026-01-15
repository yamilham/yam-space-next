import * as THREE from "three";

export function createCamera(width: number, height: number) {
  const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
  camera.position.set(6.66, 2.16, 7.72);
  return camera;
}
