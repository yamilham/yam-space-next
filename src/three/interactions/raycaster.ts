import * as THREE from "three";

export function createRaycaster() {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const updatePointer = (x: number, y: number) => {
    pointer.x = x;
    pointer.y = y;
  };

  const cast = (camera: THREE.Camera, targets: THREE.Object3D[]) => {
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(targets);
  };

  return { updatePointer, cast };
}
