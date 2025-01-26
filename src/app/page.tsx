"use client";

import { ModeToggle } from "@/components/Mode-toggle";
import Link from "next/link";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">NoteMaster</h1>
        <nav className="flex items-center space-x-4">
          <ModeToggle />
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Register
          </Link>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            Capture Your Thoughts, Organize Your Life
          </h2>
          <p className="text-muted-foreground mb-8">
            NoteMaster helps you quickly capture, organize, and manage your
            notes across all your devices.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/register"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/10 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="hidden md:flex justify-center items-center">
          <div className="w-full max-w-md h-96 bg-secondary rounded-lg shadow-lg flex justify-center items-center text-muted-foreground">
            Notes Visualization Placeholder
          </div>
        </div>
      </main>

      <footer className="bg-secondary py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          © {new Date().getFullYear()} NoteMaster. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
