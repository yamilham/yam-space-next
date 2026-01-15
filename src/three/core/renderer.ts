import * as THREE from "three";

export function createRenderer(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  return renderer;
}
