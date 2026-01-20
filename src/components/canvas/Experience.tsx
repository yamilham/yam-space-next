"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import LoadingScreen from "@/components/ui/LoadingScreen";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
import { modalContents, ModalType } from "@/components/config/modalContents";

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

  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
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
          setActiveModal(obj.userData.modal as ModalType);
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
  const currentModalConfig = activeModal ? modalContents[activeModal] : null;
  const ModalIcon = currentModalConfig?.icon;
  return (
    <>
      {!ready && (
        <LoadingScreen progress={progress} onComplete={() => setReady(true)} />
      )}

      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-full w-full outline-none"
      />

      <Dialog open={!!activeModal} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {ModalIcon && <ModalIcon className="w-6 h-6" />}
              {currentModalConfig?.title}
            </DialogTitle>
            <DialogDescription className="text-base">
              {currentModalConfig?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">{currentModalConfig?.content}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
