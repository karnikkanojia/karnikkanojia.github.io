"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const PROJECTS = [
  {
    id: "01",
    title: "OH Architecture",
    desc: "Translating a decade of architectural vision into a digital presence that commands attention.",
    result: "$2M+",
    label: "In new projects within 3 months",
    video: "https://byhuy.b-cdn.net/OH%20Arch%20Compressed.mp4",
  },
  {
    id: "02",
    title: "Supersolid",
    desc: "Shaping the digital identity of Sydney's most disruptive creative agency.",
    result: "58%",
    label: "Increase in average session duration",
    video: "https://byhuy.b-cdn.net/Supersolid%20Thumbnail%20Compressed.mp4",
  },
  {
    id: "03",
    title: "Kontent Studio",
    desc: "A high-performance platform for the next generation of content creators.",
    result: "120k+",
    label: "Monthly active users post-launch",
    video: "https://byhuy.b-cdn.net/Strategy%20Compressed.mp4",
  },
];

export function Works() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section
      id="work"
      className="bg-background py-32 px-6 relative"
      onMouseMove={handleMouseMove}
    >
      <span id="projects" className="absolute -top-24" aria-hidden="true" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
          <h2 className="text-6xl md:text-9xl font-bold tracking-tighter uppercase leading-[0.8]">
            Success <br />
            Stories
          </h2>
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] opacity-40">
            <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
            Selected Works
          </div>
        </div>

        <div className="divide-y divide-foreground/10 border-t border-foreground/10">
          {PROJECTS.map((p) => (
            <div
              key={p.id}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              className="group relative py-16 grid md:grid-cols-[0.5fr_1.5fr_1fr] gap-12 items-center cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-mono opacity-30">SS/{p.id}</span>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight group-hover:translate-x-4 transition-transform duration-500">
                  {p.title}
                </h3>
              </div>

              <p className="text-lg md:text-xl opacity-40 group-hover:opacity-100 transition-opacity duration-500 max-w-md leading-relaxed">
                {p.desc}
              </p>

              <div className="md:text-right">
                <div className="text-4xl md:text-5xl font-bold tracking-tighter mb-1">
                  {p.result}
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">
                  {p.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              x: mousePos.x - 200,
              y: mousePos.y - 150,
            }}
            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 150,
              mass: 0.5,
            }}
            className="fixed top-0 left-0 w-[400px] aspect-[4/3] z-50 pointer-events-none overflow-hidden rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-black"
          >
            <video
              src={PROJECTS.find((p) => p.id === hovered)?.video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
