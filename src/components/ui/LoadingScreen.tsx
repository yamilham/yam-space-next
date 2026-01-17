"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  progress: number;
  onComplete?: () => void;
}

export default function LoadingScreen({
  progress,
  onComplete,
}: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (progress < 100) return;

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      onComplete,
    });
  }, [progress, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="text-center text-white">
        <p className="mb-4 text-sm tracking-widest">LOADING</p>

        <div className="h-1 w-48 overflow-hidden rounded bg-white/20">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-xs">{progress}%</p>
      </div>
    </div>
  );
}
