"use client";

import { motion } from "motion/react";

export function CTA() {
  return (
    <section className="py-48 md:py-64 px-6 bg-foreground text-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-[14vw] font-bold leading-[0.8] tracking-tighter uppercase mb-24">
            Let&apos;s build <br />
            <span className="opacity-30 italic font-light">an experience</span> <br />
            That moves <br />
            <span className="flex items-center justify-center gap-8">
              <motion.span
                animate={{ x: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
              People
            </span>
          </h2>

          <button className="group relative px-16 py-8 bg-background text-foreground rounded-full text-2xl font-bold overflow-hidden hover:scale-110 transition-transform duration-500">
            <span className="relative z-10">Tell us your story</span>
            <div className="absolute inset-0 bg-[#f5f5f5] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] border border-background/5 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border border-background/5 rounded-full pointer-events-none" />
    </section>
  );
}
