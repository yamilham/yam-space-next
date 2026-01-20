import { ReactNode } from "react";
import Link from "next/link";
import {
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaBook,
  FaCheck,
  FaCalendar,
  FaClock,
} from "react-icons/fa6";
import PomodoroTimer from "@/components/timer/PomodoroTimer";
import TodoList from "../todo-list/ToDo";
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
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">
          I&apos;m always open to new opportunities and collaborations.
          Let&apos;s connect!
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="mailto:yamilham96@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <FaEnvelope className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            <div className="text-left">
              <div className="text-sm font-medium">Email</div>
              <div className="text-xs text-gray-500">Send me a message</div>
            </div>
          </Link>

          <Link
            href="https://linkedin.com/in/yamilham"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <FaLinkedin className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            <div className="text-left">
              <div className="text-sm font-medium">LinkedIn</div>
              <div className="text-xs text-gray-500">Connect with me</div>
            </div>
          </Link>

          <Link
            href="https://github.com/yamilham"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 hover:bg-gray-50 transition-all group"
          >
            <FaGithub className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            <div className="text-left">
              <div className="text-sm font-medium">GitHub</div>
              <div className="text-xs text-gray-500">Check my code</div>
            </div>
          </Link>
        </div>
      </div>
    ),
  },

  book: {
    title: "About Me",
    description: "Learn more about me and my work",
    icon: FaBook,
    content: (
      <div className="space-y-4 max-h-120 max-w-150 overflow-y-auto">
        <div className="prose prose-sm max-w-none">
          <h3 className="text-lg font-semibold mb-1">About Me</h3>
          <p className="text-gray-600">
            I&apos;m a passionate developer specializing in creating immersive
            3D web experiences. With expertise in Three.js, React, and modern
            web technologies, I bring ideas to life through interactive digital
            experiences.
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-1">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Three.js",
              "React",
              "TypeScript",
              "GSAP",
              "Next.js",
              "WebGL",
              "Blender",
              "Figma",
            ].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-gray-200 text-balance text-gray-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mt-4 mb-1">
              Selected Projects
            </h3>
            <p className="text-sm font-medium text-gray-600">
              View all projects
            </p>
          </div>
          <div></div>
          <p className="text-gray-600">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam
            aliquam enim dolore, voluptate rem alias recusandae unde ea
            laudantium vero magni illo sint, consequuntur facilis aliquid facere
            itaque? Dignissimos, incidunt? Numquam obcaecati deleniti officia
            aliquam ex fuga itaque. Sint enim veniam laboriosam incidunt
            accusamus unde sequi cumque officia quaerat iure. Ipsam repellat
            quasi voluptate non eum sed dolore officiis incidunt? Tempora
            explicabo neque exercitationem laudantium dolores voluptatem
            doloribus magni ea? Vero nulla eaque adipisci ab placeat accusamus
            deserunt veniam sint impedit perferendis? Veniam deleniti quis
            mollitia asperiores voluptates consequuntur dolore. Unde nostrum,
            veniam molestiae architecto impedit doloribus dignissimos iste
            adipisci mollitia aperiam veritatis accusantium harum ipsum dolor
            enim quae. Maxime unde amet placeat! Alias, modi ullam! Fugiat odio
            consectetur laudantium.
          </p>
        </div>
      </div>
    ),
  },

  notetodo: {
    title: "To-Do List",
    description: "Current tasks and goals",
    icon: FaCheck,
    content: <TodoList />,
  },

  noteroutine: {
    title: "Daily Routine",
    description: "My typical workday schedule",
    icon: FaCalendar,
    content: (
      <div className="space-y-2">
        {[
          { time: "08:00", activity: "☕ Morning coffee & planning" },
          { time: "09:00", activity: "💻 Deep work session" },
          { time: "12:00", activity: "🍱 Lunch break" },
          { time: "13:00", activity: "📧 Meetings & collaboration" },
          { time: "15:00", activity: "🎨 Creative work & experiments" },
          { time: "18:00", activity: "📚 Learning & side projects" },
          { time: "20:00", activity: "🎮 Personal time" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div className="text-sm font-mono font-semibold text-blue-600 min-w-15">
              {item.time}
            </div>
            <div className="text-sm text-gray-700">{item.activity}</div>
          </div>
        ))}
      </div>
    ),
  },

  digitalwatch: {
    title: "Pomodoro Timer",
    description: "Track your focus time",
    icon: FaClock,
    content: <PomodoroTimer />,
  },
};
