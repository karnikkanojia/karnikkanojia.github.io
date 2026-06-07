"use client";

import { motion } from "motion/react";

import { scrollToSection } from "@/lib/scroll-to-section";

const STEPS = [
  {
    num: "01",
    title: "We uncover your story",
    desc: "We dig deep into your brand, surface what makes you irreplaceable, and shape it into sharp positioning.",
    video: "https://byhuy.b-cdn.net/Strategy%20Compressed.mp4",
  },
  {
    num: "02",
    title: "We shape your digital presence",
    desc: "With your narrative locked, we design and direct a brand and website that feels premium and signals credibility.",
    video: "https://byhuy.b-cdn.net/Design%20FINAL%20compressed.mp4",
  },
];

export function Process() {
  return (
    <section
      id="process"
      className="py-32 md:py-48 px-6 bg-foreground text-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-32">
          <h2 className="text-7xl md:text-[12vw] font-bold tracking-tighter uppercase leading-[0.8] opacity-10">
            Process
          </h2>
          <div className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40 mb-4">
            The Monolog Way
          </div>
        </div>

        <div className="space-y-48">
          {STEPS.map((step) => (
            <div key={step.num} className="grid lg:grid-cols-2 gap-24 items-center">
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-10"
              >
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] opacity-40">
                  Phase {step.num}
                </div>
                <h3 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xl opacity-50 max-w-md leading-relaxed">{step.desc}</p>
                <div className="pt-6">
                  <a
                    href="#"
                    onClick={(event) => scrollToSection(event, "#")}
                    className="group inline-flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] border-b border-background/20 pb-2 hover:border-background transition-colors"
                  >
                    Explore this phase
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#f5f5f5]/5 shadow-2xl"
              >
                <video
                  src={step.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
