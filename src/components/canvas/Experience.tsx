"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import Modal from "@/components/ui/Modal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { createRenderer } from "@/three/core/renderer";
import { createControls } from "@/three/core/controls";
import { createScene } from "@/three/core/scene";
import { createCamera } from "@/three/core/camera";
import { loadTextures } from "@/three/loaders/textureLoader";
import { createGLTFLoader } from "@/three/loaders/gltfLoader";
import { setupSceneObjects } from "@/three/world/sceneObjects";
import { createLoadingManager } from "@/three/loaders/loadingManager";
import { createInteraction } from "@/three/interactions/interaction";
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
  const raycastTargetsRef = useRef<THREE.Object3D[]>([]);
  const interactionRef = useRef<ReturnType<typeof createInteraction> | null>(
    null,
  );
  const readyRef = useRef(false);
  const { width, height } = useWindowSize();

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    readyRef.current = ready;
    console.log("✅ Ready state changed to:", ready);
  }, [ready]);
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

    interactionRef.current = createInteraction({
      camera,
      targets: raycastTargetsRef,
      onClickObject: (obj) => {
        if (obj.userData?.modal) {
          setActiveModal(obj.userData.modal);
        }
      },
    });

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

    const onPointerMove = (e: PointerEvent) => {
      if (!interactionRef.current) return;

      // Use window dimensions, not renderer size
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      interactionRef.current.updatePointer(x, y);
    };

    window.addEventListener("pointermove", onPointerMove);

    /* ---------- Render loop ---------- */
    let frameId = 0;

    const tick = () => {
      controls.update();

      // if (ready && interactionRef.current) {
      //   interactionRef.current.updateInteraction();
      // }
      if (readyRef.current && interactionRef.current) {
        interactionRef.current.updateInteraction();
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    tick();

    /* ---------- Click ---------- */
    const dom = renderer.domElement;
    let pointerDownTime = 0;
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownTime = Date.now();
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const timeDiff = Date.now() - pointerDownTime;
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only count as click if quick (< 300ms) and minimal movement (< 5px)
      if (timeDiff < 300 && distance < 5) {
        if (readyRef.current && interactionRef.current) {
          interactionRef.current.handleClick();
        }
      }
    };

    dom.addEventListener("pointerdown", onPointerDown);
    dom.addEventListener("pointerup", onPointerUp);

    // Cleanup:
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      dom.removeEventListener("pointerdown", onPointerDown);
      dom.removeEventListener("pointerup", onPointerUp);

      interactionRef.current?.dispose();
      interactionRef.current = null;

      controls.dispose();
      renderer.dispose();
    };
  }, []);

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
