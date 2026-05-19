"use client";

import { motion } from "motion/react";

const SERVICES = [
  {
    title: "Brand Strategy",
    items: ["Market Positioning", "Brand Voice", "Visual Identity"],
  },
  {
    title: "Web Experience",
    items: ["UI/UX Design", "Next.js Development", "Motion Design"],
  },
  {
    title: "Creative Direction",
    items: ["Photography", "Video Production", "Content Strategy"],
  },
];

export function Services() {
  return (
    <section id="services" className="py-32 px-6 bg-beige-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-24">
          <div>
            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] opacity-40 mb-10">
              <div className="w-2 h-2 rounded-full bg-foreground" />
              Our Expertise
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.9] mb-12">
              How we <br /> help you <br /> scale.
            </h2>
            <p className="text-xl opacity-60 max-w-sm leading-relaxed">
              We don&apos;t just make things look pretty. We build systems that drive growth and
              command authority.
            </p>
          </div>

          <div className="space-y-12">
            {SERVICES.map((s, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="p-10 bg-background rounded-3xl border border-foreground/5 hover:border-foreground/20 transition-colors group"
              >
                <h3 className="text-3xl font-bold mb-8 group-hover:translate-x-2 transition-transform duration-500">
                  {s.title}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {s.items.map((item, j) => (
                    <span
                      key={j}
                      className="px-4 py-2 rounded-full bg-foreground/5 text-[11px] font-bold uppercase tracking-widest"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
