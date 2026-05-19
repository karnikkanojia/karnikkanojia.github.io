"use client";

import { motion } from "motion/react";

export function Gap() {
  return (
    <section className="py-48 px-6 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-[10vw] font-bold leading-[0.85] tracking-tighter uppercase mb-16">
            We close <br />
            <span className="italic font-light opacity-40">that gap.</span>
          </h2>

          <div className="max-w-2xl mx-auto">
            <p className="text-xl md:text-2xl font-medium leading-relaxed opacity-80">
              &ldquo;Monolog didn&apos;t just build us a website; they gave us a digital identity
              that finally feels as premium as our work.&rdquo;
            </p>
            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="w-12 h-px bg-foreground/20" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                James Oliver, OH Architecture
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
