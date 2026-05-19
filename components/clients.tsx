"use client";

const LOGOS = [
  "OH ARCHITECTURE",
  "SUPERSOLID",
  "KONTENT",
  "VIBE",
  "LUMINA",
  "NEXUS",
  "ORBIT",
  "PULSE",
];

export function Clients() {
  return (
    <section className="bg-background py-24 border-y border-foreground/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
          {LOGOS.map((logo, i) => (
            <div
              key={i}
              className="bg-background h-40 flex items-center justify-center group relative overflow-hidden"
            >
              <span className="text-sm font-bold tracking-[0.3em] uppercase opacity-30 group-hover:opacity-100 transition-opacity duration-500">
                {logo}
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 border-dotted-custom" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
