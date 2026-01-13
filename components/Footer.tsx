import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © 2024 Task Manager. Built with Next.js 16
            </p>
            <p className="text-sm font-medium">Pratham</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/PrathamJain2002"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="h-5 w-5" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/pratham-jain-173622214/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-5 w-5" />
              <span className="hidden sm:inline">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

