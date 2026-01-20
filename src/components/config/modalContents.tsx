import { ReactNode } from "react";
import {
  FaEnvelope,
  FaBook,
  FaCheck,
  FaCalendar,
  FaClock,
} from "react-icons/fa6";
import AboutSection from "@/components/content/AboutContent";
import ContactSection from "@/components/content/PersonalContact";
import DailyRoutine from "@/components/content/DailyRoutine";
import PomodoroTimer from "@/components/content/PomodoroTimer";
import TodoList from "@/components/content/ToDo";
import { IconType } from "react-icons";

export type ModalType =
  | "handphone"
  | "book"
  | "notetodo"
  | "noteroutine"
  | "digitalwatch";

interface ModalConfig {
  title: string;
  description: string;
  icon: IconType;
  content: ReactNode;
}

export const modalContents: Record<ModalType, ModalConfig> = {
  handphone: {
    title: "Contact",
    description: "Feel free to discuss for new project",
    icon: FaEnvelope,
    content: <ContactSection />,
  },

  book: {
    title: "About",
    description: "Know more about the project and me 🥲",
    icon: FaBook,
    content: <AboutSection />,
  },

  notetodo: {
    title: "To-Do List",
    description: "Manage your tasks and goals",
    icon: FaCheck,
    content: <TodoList />,
  },

  noteroutine: {
    title: "Daily Routine",
    description: "The routines behind my creative process",
    icon: FaCalendar,
    content: <DailyRoutine />,
  },

  digitalwatch: {
    title: "Pomodoro Timer",
    description: "Track your focus time",
    icon: FaClock,
    content: <PomodoroTimer />,
  },
};
