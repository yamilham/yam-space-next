import * as THREE from "three";
import gsap from "gsap";

type CreateInteractionOptions = {
  camera: THREE.Camera;
  targets: React.RefObject<THREE.Object3D[]>;
  onClickObject?: (object: THREE.Object3D) => void;
};

export function createInteraction({
  camera,
  targets,
  onClickObject,
}: CreateInteractionOptions) {
  /* ----------------------------------
     Core
  ----------------------------------- */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let hoveredObject: THREE.Object3D | null = null;

  /* ----------------------------------
     Pointer
  ----------------------------------- */
  const updatePointer = (x: number, y: number) => {
    pointer.set(x, y);
  };

  /* ----------------------------------
     Hover animation
  ----------------------------------- */
  const applyHover = (object: THREE.Object3D) => {
    if (!object.userData.originalScale) {
      object.userData.originalScale = object.scale.clone();
    }

    gsap.killTweensOf(object.scale);
    gsap.to(object.scale, {
      x: object.userData.originalScale.x * 1.15,
      y: object.userData.originalScale.y * 1.15,
      z: object.userData.originalScale.z * 1.15,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const resetHover = (object: THREE.Object3D) => {
    if (!object.userData.originalScale) return;

    gsap.killTweensOf(object.scale);
    gsap.to(object.scale, {
      x: object.userData.originalScale.x,
      y: object.userData.originalScale.y,
      z: object.userData.originalScale.z,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  /* ----------------------------------
     Raycast update (called per frame)
  ----------------------------------- */
  const updateInteraction = () => {
    if (!targets.current?.length) return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(targets.current, true);

    if (!intersects.length) {
      if (hoveredObject) {
        resetHover(hoveredObject);
        hoveredObject = null;
        document.body.style.cursor = "default";
      }
      return;
    }

    let target: THREE.Object3D | null = intersects[0].object;

    // Walk up the hierarchy to find userData.hover
    while (target && !target.userData?.hover) {
      target = target.parent;
    }

    if (!target || target.userData.hover !== "scale") {
      if (hoveredObject) {
        resetHover(hoveredObject);
        hoveredObject = null;
        document.body.style.cursor = "default";
      }
      return;
    }

    if (hoveredObject !== target) {
      if (hoveredObject) resetHover(hoveredObject);
      applyHover(target);
      hoveredObject = target;
    }

    document.body.style.cursor = "pointer";
  };

  /* ----------------------------------
     Click
  ----------------------------------- */
  const handleClick = () => {
    if (!hoveredObject) return;

    if (onClickObject) {
      onClickObject(hoveredObject);
    }
  };

  /* ----------------------------------
     Cleanup
  ----------------------------------- */
  const dispose = () => {
    if (hoveredObject) {
      resetHover(hoveredObject);
      hoveredObject = null;
    }
    document.body.style.cursor = "default";
  };

  /* ----------------------------------
     Public API
  ----------------------------------- */
  return {
    updatePointer,
    updateInteraction,
    handleClick,
    dispose,
  };
}