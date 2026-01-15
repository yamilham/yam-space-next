"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Modal from "@/components/ui/Modal";
import { createRenderer } from "@/three/core/renderer";
import { createControls } from "@/three/core/controls";
import { createScene } from "@/three/core/scene";
import { createCamera } from "@/three/core/camera";
import { createRaycaster } from "@/three/interactions/raycaster";
import { loadTextures } from "@/three/loaders/textureLoader";
import { createGLTFLoader } from "@/three/loaders/gltfLoader";
import { setupSceneObjects } from "@/three/world/sceneObjects";
import { useWindowSize } from "@/hooks/useWindowSize";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/Addons.js";

type ModalType = "phone" | "book" | "todo" | "routine" | "watch" | null;

export default function Experience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls>(null);

  const { width, height } = useWindowSize();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  useEffect(() => {
    if (!canvasRef.current) return;

    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;

    const scene = createScene();
    const camera = createCamera(initialWidth, initialHeight);
    scene.add(camera);

    const renderer = createRenderer(
      canvasRef.current,
      initialWidth,
      initialHeight
    );
    const controls = createControls(camera, renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    const textureLoader = new THREE.TextureLoader();
    const textures = loadTextures(textureLoader, {
      Base: "/textures/day/TexturePackBase-day.webp",
      Props: "/textures/day/TexturePackProps-day.webp",
      Bed: "/textures/day/TexturePackBed-day.webp",
      Wood: "/textures/day/TexturePackWood-day.webp",
    });

    const { updatePointer, cast } = createRaycaster();
    const raycastTargets: THREE.Object3D[] = [];

    const onPointerMove = (e: PointerEvent) => {
      if (!rendererRef.current) return;

      const { width, height } = rendererRef.current.getSize(
        new THREE.Vector2()
      );

      updatePointer((e.clientX / width) * 2 - 1, -(e.clientY / height) * 2 + 1);
    };

    window.addEventListener("pointermove", onPointerMove);

    const gltfLoader = createGLTFLoader();
    gltfLoader.load("/models/yam-space-v2.glb", (gltf) => {
      setupSceneObjects({
        scene,
        gltf,
        textures,
        raycastTargets,
      });
      console.log(textures);
    });

    let hoveredObject: THREE.Object3D | null = null;

    const applyHover = (object: THREE.Object3D) => {
      if (!object.userData.originalScale) {
        object.userData.originalScale = object.scale.clone();
      }
      gsap.killTweensOf(object.scale);
      gsap.to(object.scale, {
        x: object.userData.originalScale.x * 1.2,
        y: object.userData.originalScale.y * 1.2,
        z: object.userData.originalScale.z * 1.2,
        duration: 0.3,
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
        duration: 0.3,
        ease: "power2.out",
      });
    };

    let frameId: number;
    const tick = () => {
      controls.update();
      const intersects = cast(camera, raycastTargets);

      if (intersects.length) {
        const object = intersects[0].object;

        if (object.userData.hover !== "scale") {
          if (hoveredObject) resetHover(hoveredObject);
          hoveredObject = null;
          document.body.style.cursor = "default";
        } else {
          if (hoveredObject !== object) {
            if (hoveredObject) resetHover(hoveredObject);
            applyHover(object);
            hoveredObject = object;
          }
          document.body.style.cursor = "pointer";
        }
      } else {
        if (hoveredObject) resetHover(hoveredObject);
        hoveredObject = null;
        document.body.style.cursor = "default";
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    const onClick = () => {
      if (!hoveredObject) return;

      const modal = hoveredObject.userData.modal;
      if (modal) {
        setActiveModal(modal);
      }
    };

    window.addEventListener("click", onClick);

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("click", onClick);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!cameraRef.current || !rendererRef.current) return;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [width, height]);

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
