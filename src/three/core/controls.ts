import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";

export function createControls(camera: THREE.Camera, domElement: HTMLElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.minDistance = 2;
  controls.maxDistance = 45;
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI / 2;
  controls.minAzimuthAngle = 0;
  controls.maxAzimuthAngle = Math.PI / 2;
  controls.target.set(0.39, 0.03, -0.11);
  controls.update();
  return controls;
}
