import Link from "next/link";
import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa6";

export default function ContactSection() {
  return (
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
          className="flex items-center gap-3 p-4 rounded-lg border hover:border-orange-500 hover:bg-orange-50 transition-all group"
        >
          <FaEnvelope className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
          <div className="text-left">
            <div className="text-sm font-medium">Email</div>
            <div className="text-xs text-gray-500">Send me a message</div>
          </div>
        </Link>

        <Link
          href="https://linkedin.com/in/yamilham"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-lg border hover:border-orange-500 hover:bg-orange-50 transition-all group"
        >
          <FaLinkedin className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
          <div className="text-left">
            <div className="text-sm font-medium">LinkedIn</div>
            <div className="text-xs text-gray-500">Connect with me</div>
          </div>
        </Link>

        <Link
          href="https://github.com/yamilham"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-lg border hover:border-orange-500 hover:bg-orange-50 transition-all group"
        >
          <FaGithub className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
          <div className="text-left">
            <div className="text-sm font-medium">GitHub</div>
            <div className="text-xs text-gray-500">Check my code</div>
          </div>
        </Link>
      </div>
    </div>
  );
}