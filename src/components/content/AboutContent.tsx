import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AboutSection() {
  return (
    <div className="space-y-4 max-h-120 max-w-150 overflow-y-auto">
      <Tabs defaultValue="project" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="project">Project Overview</TabsTrigger>
          <TabsTrigger value="author">About Me</TabsTrigger>
        </TabsList>

        <TabsContent value="project" className="space-y-4 py-4">
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold mb-1.5">
              Welcome to Yam Space 🙌
            </h3>
            <p className="text-gray-600 leading-normal">
              A cozy tiny space with no fancy setup desk🥲 so you can keep focus
              achieve your daily task. This interactive 3D portfolio explores
              how modern web technologies can create immersive, high-performance
              experiences directly in the browser. Built with Three.js and
              React, the project focuses on smooth interaction, visual clarity,
              and meaningful user engagement.
            </p>
            <p className="text-gray-600 leading-normal">
              Rather than presenting work in a static layout, this portfolio
              invites visitors to navigate a 3D environment, interact with
              objects, and explore content in a more natural and memorable
              way—mirroring how people engage with real spaces.
            </p>

            <h4 className="text-md font-semibold mt-6 mb-1.5">Key Features</h4>
            <ul className="text-gray-600 space-y-2 list-disc list-inside">
              <li>
                Interactive 3D environment with smooth camera controls for
                intuitive navigation
              </li>
              <li>
                Real-time object interactions and animations that respond
                instantly to user input
              </li>
              <li>
                Responsive experience optimized for desktop and mobile devices
              </li>
              <li>
                Persistent data storage to support built-in productivity tools
                such as timers and to-do lists
              </li>
              <li>
                Modal-based navigation system that keeps content accessible
                without breaking immersion
              </li>
            </ul>
            <p className="text-gray-600 leading-normal mt-2">
              Each feature was designed with performance and usability in mind,
              ensuring the experience remains fluid even as interactions become
              more complex.
            </p>

            <h4 className="text-md font-semibold mt-6 mb-1.">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Three.js",
                "Next.js",
                "TypeScript",
                "Tailwind CSS",
                "GSAP",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-orange-200 text-orange-700 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>

            <h4 className="text-md font-semibold mt-6 mb-1.">Project Goals</h4>
            <p className="text-gray-600 leading-normal">
              The primary goal of this project was to create a memorable
              portfolio experience that goes beyond traditional static websites.
              By combining 3D graphics with interactive web technologies, the
              portfolio allows visitors to explore my work in a way that feels
              engaging, intuitive, and immersive.
            </p>
            <p className="text-gray-600 leading-normal">
              This project also serves as a technical showcase—demonstrating how
              modern frontend tools can be used to build interactive,
              performant, and scalable 3D experiences directly in the browser,
              without sacrificing usability or clarity.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="author" className="space-y-4 py-4">
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold mb-1">About Me</h3>
            <p className="text-gray-600">
              I&apos;m an enthusiastic developer who enjoys creating immersive
              3D experiences on the web. With a strong focus on Three.js and
              React, I bring concepts to life through interactive,
              performance-driven digital experiences.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-1">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Three.js",
                "React",
                "TypeScript",
                "TailwindCSS",
                "GSAP",
                "Next.js",
                "WebGL",
                "Blender",
                "Figma",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-orange-200 text-orange-700 text-balance rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
