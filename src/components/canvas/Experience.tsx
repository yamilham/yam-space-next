"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

import Modal from "@/components/ui/Modal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { createRenderer } from "@/three/core/renderer";
import { createControls } from "@/three/core/controls";
import { createScene } from "@/three/core/scene";
import { createCamera } from "@/three/core/camera";
import { createRaycaster } from "@/three/interactions/raycaster";
import { loadTextures } from "@/three/loaders/textureLoader";
import { createGLTFLoader } from "@/three/loaders/gltfLoader";
import { setupSceneObjects } from "@/three/world/sceneObjects";
import { createLoadingManager } from "@/three/loaders/loadingManager";
import { useWindowSize } from "@/hooks/useWindowSize";

type ModalType =
  | "handphone"
  | "book"
  | "notetodo"
  | "noteroutine"
  | "digitalwatch"
  | null;

export default function Experience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const raycastTargetsRef = useRef<THREE.Object3D[]>([]);
  const hoveredObjectRef = useRef<THREE.Object3D | null>(null);

  const { width, height } = useWindowSize();

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  /* ----------------------------------
     INIT (RUNS ONCE)
  ----------------------------------- */
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = createScene();
    const camera = createCamera(window.innerWidth, window.innerHeight);
    scene.add(camera);

    const renderer = createRenderer(
      canvasRef.current,
      window.innerWidth,
      window.innerHeight,
    );

    const controls = createControls(camera, renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    /* ---------- Loading Manager ---------- */
    const loadingManager = createLoadingManager(
      (p) => setProgress(p),
      () => setReady(true),
    );

    /* ---------- Load assets ---------- */
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const textures = loadTextures(textureLoader, {
      Base: "/textures/day/TexturePackBase-day.webp",
      Props: "/textures/day/TexturePackProps-day.webp",
      Bed: "/textures/day/TexturePackBed-day.webp",
      Wood: "/textures/day/TexturePackWood-day.webp",
    });

    const gltfLoader = createGLTFLoader(loadingManager);
    gltfLoader.load("/models/yam-space-v2.glb", (gltf) => {
      setupSceneObjects({
        scene,
        gltf,
        textures,
        raycastTargets: raycastTargetsRef.current,
      });
    });

    /* ---------- Raycaster ---------- */
    const { updatePointer, cast } = createRaycaster();

    const onPointerMove = (e: PointerEvent) => {
      if (!rendererRef.current) return;

      const size = rendererRef.current.getSize(new THREE.Vector2());
      updatePointer(
        (e.clientX / size.x) * 2 - 1,
        -(e.clientY / size.y) * 2 + 1,
      );
    };

    window.addEventListener("pointermove", onPointerMove);

    /* ---------- Hover helpers ---------- */
    const applyHover = (object: THREE.Object3D) => {
      if (!object.userData.originalScale) {
        object.userData.originalScale = object.scale.clone();
      }

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

      gsap.to(object.scale, {
        x: object.userData.originalScale.x,
        y: object.userData.originalScale.y,
        z: object.userData.originalScale.z,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const resolveHoverTarget = (object: THREE.Object3D | null) => {
      let current = object;

      while (current) {
        if (current.userData?.hover === "scale") return current;
        current = current.parent;
      }

      return null;
    };

    /* ---------- Render loop ---------- */
    let frameId = 0;

    const tick = () => {
      controls.update();

      if (ready) {
        const intersects = cast(camera, raycastTargetsRef.current);

        if (intersects.length) {
          const hitObject = intersects[0].object;
          const target = resolveHoverTarget(hitObject);

          if (target) {
            if (hoveredObjectRef.current !== target) {
              if (hoveredObjectRef.current) {
                resetHover(hoveredObjectRef.current);
              }

              applyHover(target);
              hoveredObjectRef.current = target;
            }

            document.body.style.cursor = "pointer";
          } else {
            if (hoveredObjectRef.current) {
              resetHover(hoveredObjectRef.current);
              hoveredObjectRef.current = null;
            }

            document.body.style.cursor = "default";
          }
        } else {
          if (hoveredObjectRef.current) {
            resetHover(hoveredObjectRef.current);
            hoveredObjectRef.current = null;
          }

          document.body.style.cursor = "default";
        }
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    tick();

    /* ---------- Click ---------- */
    const onClick = () => {
      if (!ready) return;

      const obj = hoveredObjectRef.current;
      if (obj?.userData?.modal) {
        setActiveModal(obj.userData.modal);
      }
    };

    window.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("click", onClick);
      controls.dispose();
      renderer.dispose();
    };
  }, [ready]);

  /* ----------------------------------
     RESIZE (REAL-TIME)
  ----------------------------------- */
  useEffect(() => {
    if (!cameraRef.current || !rendererRef.current) return;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [width, height]);

  /* ----------------------------------
     JSX
  ----------------------------------- */
  return (
    <>
      {!ready && (
        <LoadingScreen progress={progress} onComplete={() => setReady(true)} />
      )}

      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-full w-full outline-none"
      />

      <Modal
        open={activeModal === "handphone"}
        onClose={() => setActiveModal(null)}
      >
        <h2 className="text-xl font-bold">Phone</h2>
      </Modal>

      <Modal open={activeModal === "book"} onClose={() => setActiveModal(null)}>
        <h2 className="text-xl font-bold">Manual</h2>
      </Modal>

      <Modal
        open={activeModal === "notetodo"}
        onClose={() => setActiveModal(null)}
      >
        <h2 className="text-xl font-bold">To-do</h2>
      </Modal>

      <Modal
        open={activeModal === "noteroutine"}
        onClose={() => setActiveModal(null)}
      >
        <h2 className="text-xl font-bold">Routine</h2>
      </Modal>

      <Modal
        open={activeModal === "digitalwatch"}
        onClose={() => setActiveModal(null)}
      >
        <h2 className="text-xl font-bold">Timer</h2>
      </Modal>
    </>
  );
}
