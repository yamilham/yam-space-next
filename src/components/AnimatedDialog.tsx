"use client";

import { useEffect, useRef, ReactNode, useState } from "react";
import gsap from "gsap";
import { FaX } from "react-icons/fa6";

interface AnimatedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  children: ReactNode;
}

export default function AnimatedDialog({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  children,
}: AnimatedDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      isClosingRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (!contentRef.current || !overlayRef.current) return;

    if (isVisible && open && !isClosingRef.current) {
      // Animate IN
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 30,
      });

      const tl = gsap.timeline();
      
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
      .to(
        contentRef.current,
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.4)",
        },
        "-=0.15"
      );
    }
  }, [isVisible, open]);

  const handleClose = () => {
    if (!contentRef.current || !overlayRef.current || isClosingRef.current) return;
    
    isClosingRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        isClosingRef.current = false;
        onOpenChange(false);
      },
    });

    tl.to(contentRef.current, {
      scale: 0.85,
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power3.in",
    })
    .to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      },
      "-=0.15"
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-[calc(100%-2rem)] sm:max-w-125 rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none"
        >
          <FaX className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Header */}
        <div className="flex flex-col gap-2 text-left mb-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold leading-none">
            {Icon && <Icon className="w-6 h-6" />}
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}