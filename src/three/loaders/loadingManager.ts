import * as THREE from "three";

export function createLoadingManager(
  onProgress: (progress: number) => void,
  onComplete: () => void
) {
  const manager = new THREE.LoadingManager();
  manager.onProgress = (_url, loaded, total) => {
    onProgress(Math.round((loaded / total) * 100));
  };
  manager.onLoad = () => {
    onComplete();
  };
  return manager;
}
