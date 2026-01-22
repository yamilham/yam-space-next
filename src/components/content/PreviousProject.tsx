import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

export default function ProjectCard({
  title,
  description,
  image,
  href,
}: ProjectCardProps) {
  return (
    <Card className="flex flex-col sm:flex-row gap-4 p-4">
      {/* Thumbnail */}
      <div className="relative w-full sm:w-40 h-32 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between">
        <CardHeader className="p-0">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <p className="text-sm text-gray-600 leading-snug">
            {description}
          </p>

          <Link
            href={href}
            target="_blank"
            className="mt-2 inline-block text-sm font-medium text-orange-600 hover:underline"
          >
            Visit project →
          </Link>
        </CardContent>
      </div>
    </Card>
  );
}
