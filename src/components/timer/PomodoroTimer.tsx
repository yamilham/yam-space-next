"use client";

import { useState, useEffect } from "react";
import { FaPlay, FaPause, FaClockRotateLeft } from "react-icons/fa6";

const DEFAULT_TIME = 25 * 60;

export default function PomodoroTimer() {
  const [time, setTime] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const toggleTimer = () => setIsActive((v) => !v);

  const resetTimer = () => {
    setIsActive(false);
    setTime(DEFAULT_TIME);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

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
            strokeDashoffset={2 * Math.PI * 88 * (1 - time / DEFAULT_TIME)}
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

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={toggleTimer}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover-pointer"
        >
          {isActive ? <FaPause /> : <FaPlay />}
          {isActive ? "Pause" : "Start"}
        </button>

        <button
          onClick={resetTimer}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 rounded-lg"
        >
          <FaClockRotateLeft />
          Reset
        </button>
      </div>
    </div>
  );
}
