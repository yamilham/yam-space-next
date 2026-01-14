"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Modal from "../ui/Modal";

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

    const onMouseMove = (event: MouseEvent) => {
      pointer.x = (event.clientX / sizes.width) * 2 - 1;
      pointer.y = -(event.clientY / sizes.height) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    const onClick = () => {
      if (!currentIntersects.length) return;

      const object = currentIntersects[0].object;

      if (object.name.includes("Handphone")) {
        setActiveModal("phone");
      } else if (object.name.includes("Book")) {
        setActiveModal("book");
      } else if (object.name.includes("Todo")) {
        setActiveModal("todo");
      } else if (object.name.includes("Routine")) {
        setActiveModal("routine");
      } else if (object.name.includes("Watch")) {
        setActiveModal("watch");
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

        if (child.name.includes("Raycaster")) {
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

      document.body.style.cursor =
        currentIntersects.length &&
        currentIntersects[0].object.name.includes("Pointer")
          ? "pointer"
          : "default";

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
        <h2 className="text-xl font-bold">Phone</h2>
        <p>This is the phone modal</p>
      </Modal>

      <Modal open={activeModal === "book"} onClose={() => setActiveModal(null)}>
        <h2 className="text-xl font-bold">Book</h2>
        <p>This is the book modal</p>
      </Modal>
      <Modal open={activeModal === "todo"} onClose={() => setActiveModal(null)}>
        <h2 className="text-xl font-bold">ToDo List</h2>
        <p>This is the todo modal</p>
      </Modal>
      <Modal
        open={activeModal === "routine"}
        onClose={() => setActiveModal(null)}
      >
        <h2 className="text-xl font-bold">Daily Routine</h2>
        <p>This is the routine modal</p>
      </Modal>
      <Modal
        open={activeModal === "watch"}
        onClose={() => setActiveModal(null)}
      >
        <h2 className="text-xl font-bold">Set Timer</h2>
        <p>This is the watch modal</p>
      </Modal>
    </>
  );
}
