"use client";

import { useState, useEffect } from "react";
import { FaPlay, FaPause, FaClockRotateLeft } from "react-icons/fa6";

const DEFAULT_TIME = 25 * 60;
const STORAGE_KEY = "pomodoro-timer";

interface TimerState {
  time: number;
  isActive: boolean;
  lastUpdate: number;
}

export default function PomodoroTimer() {
  const [time, setTime] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state: TimerState = JSON.parse(saved);
        // Calculate elapsed time if timer was active
        if (state.isActive) {
          const elapsed = Math.floor((Date.now() - state.lastUpdate) / 1000);
          const remaining = Math.max(0, state.time - elapsed);
          return remaining;
        }
        return state.time;
      }
    }
    return DEFAULT_TIME;
  });

  const [isActive, setIsActive] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state: TimerState = JSON.parse(saved);
        // Only restore active state if time is still remaining
        const elapsed = Math.floor((Date.now() - state.lastUpdate) / 1000);
        const remaining = Math.max(0, state.time - elapsed);
        return state.isActive && remaining > 0;
      }
    }
    return false;
  });

  // Save timer state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const state: TimerState = {
        time,
        isActive,
        lastUpdate: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [time, isActive]);

  // Timer countdown logic
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          // Optional: Show notification when timer completes
          if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
              new Notification("Pomodoro Timer", {
                body: "Time's up! Take a break.",
                icon: "/favicon.ico",
              });
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const toggleTimer = () => {
    // Request notification permission on first start
    if (!isActive && typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
    setIsActive((v) => !v);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(DEFAULT_TIME);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const progress = time / DEFAULT_TIME;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Timer Display */}
      <div className="relative">
        <svg className="transform -rotate-90 w-48 h-48">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={2 * Math.PI * 88 * (1 - progress)}
            className="text-orange-500 transition-all duration-1000 ease-linear"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl font-mono font-bold text-gray-800">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      {isActive && (
        <div className="flex items-center gap-2 text-sm text-orange-600">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          Timer is running...
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={toggleTimer}
          disabled={time === 0 && !isActive}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isActive ? <FaPause /> : <FaPlay />}
          {isActive ? "Pause" : "Start"}
        </button>

        <button
          onClick={resetTimer}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <FaClockRotateLeft />
          Reset
        </button>
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-500 text-center max-w-xs">
        Timer persists across page refreshes and dialog closures
      </p>
    </div>
  );
}