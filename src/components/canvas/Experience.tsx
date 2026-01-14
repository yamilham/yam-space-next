"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Modal from "../ui/Modal";
import gsap from "gsap";

type ModalType = "phone" | "book" | "todo" | "routine" | "watch" | null;

export default function Experience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    /* ------------------ Sizes ------------------ */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    /* ------------------ Scene ------------------ */
    const scene = new THREE.Scene();

    /* ------------------ Camera ------------------ */
    const camera = new THREE.PerspectiveCamera(
      25,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.set(6.66, 2.16, 7.72);
    scene.add(camera);

    /* ------------------ Renderer ------------------ */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    /* ------------------ Controls ------------------ */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 2;
    controls.maxDistance = 45;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = 0;
    controls.maxAzimuthAngle = Math.PI / 2;
    controls.target.set(0.39, 0.03, -0.11);
    controls.update();

    /* ------------------ Raycaster ------------------ */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const raycastTargets: THREE.Object3D[] = [];
    let currentIntersects: THREE.Intersection[] = [];
    let hoveredObject: THREE.Object3D | null = null;
    const hoverScale = 1.05;

    const onMouseMove = (event: MouseEvent) => {
      pointer.x = (event.clientX / sizes.width) * 2 - 1;
      pointer.y = -(event.clientY / sizes.height) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    const onClick = () => {
      if (!currentIntersects.length) return;

      const object = currentIntersects[0].object as THREE.Object3D & {
        userData: { modal?: string };
      };

      if (object.userData.modal) {
        setActiveModal(object.userData.modal as ModalType);
      }
    };

    window.addEventListener("click", onClick);

    /* ------------------ Loaders ------------------ */
    const textureLoader = new THREE.TextureLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    /* ------------------ Textures ------------------ */
    const textureMap: Record<string, string> = {
      Props: "/textures/day/TexturePackProps-day.webp",
      Base: "/textures/day/TexturePackBase-day.webp",
      Bed: "/textures/day/TexturePackBed-day.webp",
      Wood: "/textures/day/TexturePackWood-day.webp",
    };

    const textures: Record<string, THREE.Texture> = {};

    Object.entries(textureMap).forEach(([key, path]) => {
      const tex = textureLoader.load(path);
      tex.flipY = false;
      tex.minFilter = THREE.LinearFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      textures[key] = tex;
    });

    /* ------------------ Model ------------------ */
    gltfLoader.load("/models/yam-space-v2.glb", (glb) => {
      glb.scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;

        if (child.name.includes("Handphone")) {
          child.userData.modal = "phone";
        } else if (child.name.includes("Book")) {
          child.userData.modal = "book";
        } else if (child.name.includes("Todo")) {
          child.userData.modal = "todo";
        } else if (child.name.includes("Routine")) {
          child.userData.modal = "routine";
        } else if (child.name.includes("Watch")) {
          child.userData.modal = "watch";
        }

        if (child.userData.modal) {
          raycastTargets.push(child);
        }

        if (child.name.toLowerCase().includes("glass")) {
          child.material = new THREE.MeshPhysicalMaterial({
            transmission: 1,
            roughness: 0,
            ior: 1.5,
            transparent: true,
          });
          return;
        }

        Object.entries(textures).forEach(([key, tex]) => {
          if (child.name.includes(key)) {
            child.material = new THREE.MeshBasicMaterial({
              map: tex,
            });
          }
        });
      });

      scene.add(glb.scene);
    });

    /* ------------------ Resize ------------------ */
    const onResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", onResize);

    /* ------------------ Render Loop ------------------ */
    let frameId: number;

    const tick = () => {
      controls.update();

      raycaster.setFromCamera(pointer, camera);
      currentIntersects = raycaster.intersectObjects(raycastTargets);

      // if (
      //   currentIntersects.length > 0 &&
      //   currentIntersects[0].object.userData.modal
      // ) {
      //   document.body.style.cursor = "pointer";
      // } else {
      //   document.body.style.cursor = "default";
      // }

      if (currentIntersects.length) {
        const object = currentIntersects[0].object;

        if (hoveredObject !== object) {
          // restore previous hovered object
          if (hoveredObject) {
            gsap.killTweensOf(hoveredObject.scale);
            gsap.to(hoveredObject.scale, {
              x: hoveredObject.userData.originalScale.x,
              y: hoveredObject.userData.originalScale.y,
              z: hoveredObject.userData.originalScale.z,
              duration: 0.25,
              ease: "power2.out",
            });
          }

          // store original scale once
          if (!object.userData.originalScale) {
            object.userData.originalScale = object.scale.clone();
          }

          // scale up
          gsap.killTweensOf(object.scale);
          gsap.to(object.scale, {
            x: object.userData.originalScale.x * hoverScale,
            y: object.userData.originalScale.y * hoverScale,
            z: object.userData.originalScale.z * hoverScale,
            duration: 0.25,
            ease: "power2.out",
          });

          hoveredObject = object;
        }

        document.body.style.cursor = "pointer";
      } else {
        // hover out
        if (hoveredObject) {
          gsap.killTweensOf(hoveredObject.scale);
          gsap.to(hoveredObject.scale, {
            x: hoveredObject.userData.originalScale.x,
            y: hoveredObject.userData.originalScale.y,
            z: hoveredObject.userData.originalScale.z,
            duration: 0.25,
            ease: "power2.out",
          });

          hoveredObject = null;
        }

        document.body.style.cursor = "default";
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    tick();

    /* ------------------ Cleanup ------------------ */
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-full w-full outline-none"
      />
      <Modal
        open={activeModal === "phone"}
        onClose={() => setActiveModal(null)}
      >
        <h2 className="text-xl text-gray-700 font-bold">Phone</h2>
        <p className="text-gray-400">This is the phone modal</p>
      </Modal>

      <Modal open={activeModal === "book"} onClose={() => setActiveModal(null)}>
        <h2 className="text-xl text-gray-700 font-bold">Manual</h2>
        <p className="text-gray-400">This is the book modal</p>
      </Modal>
      <Modal open={activeModal === "todo"} onClose={() => setActiveModal(null)}>
        <h2 className="text-xl text-gray-700 font-bold">To-Do List</h2>
        <p className="text-gray-400">This is the todo modal</p>
      </Modal>
      <Modal
        open={activeModal === "routine"}
        onClose={() => setActiveModal(null)}
      >
        <h2 className="text-xl text-gray-700 font-bold">Daily Routine</h2>
        <p className="text-gray-400">This is the routine modal</p>
      </Modal>
      <Modal
        open={activeModal === "watch"}
        onClose={() => setActiveModal(null)}
      >
        <h2 className="text-xl text-gray-700 font-bold">Set Timer</h2>
        <p className="text-gray-400">This is the watch modal</p>
      </Modal>
    </>
  );
}
