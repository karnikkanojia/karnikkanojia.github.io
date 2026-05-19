"use client";

import { Volume2, ArrowUpRight } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 flex justify-between items-center mix-blend-difference text-white">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tighter uppercase">Monolog</span>
      </div>

      <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em]">
        {["About", "Work", "Services", "Process"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="group relative overflow-hidden"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
              {item}
            </span>
            <span className="absolute top-full left-0 inline-block transition-transform duration-300 group-hover:-translate-y-full">
              {item}
            </span>
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
          <Volume2 className="w-4 h-4" />
        </button>
        <a
          href="https://cal.com/byhuy/project-intro-call"
          target="_blank"
          className="bg-white text-black px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
        >
          Start a project
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </nav>
  );
}
