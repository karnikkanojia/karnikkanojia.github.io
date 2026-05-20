"use client";

import { motion } from "motion/react";

const text =
  "Great founders changing the world deserve a presence as powerful as what they're building. Most founders we work with are building something significant but their presence doesn't show it yet. That gap costs more than revenue. It costs the certainty that your brand is finally being understood.";

export function Problem() {
  return (
    <section id="about" className="py-32 md:py-48 px-6 bg-foreground text-background">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_2fr] gap-20 md:gap-32">
        <div className="space-y-16">
          <div className="flex flex-col gap-6 border-t border-background/20 pt-10">
            <span className="text-6xl md:text-7xl font-bold tracking-tighter">15+</span>
            <p className="text-[11px] uppercase tracking-[0.2em] opacity-50 leading-relaxed max-w-[200px]">
              Founder-led brands from disruptive creative agencies to consumer brands
            </p>
          </div>
          <div className="flex flex-col gap-6 border-t border-background/20 pt-10">
            <span className="text-6xl md:text-7xl font-bold tracking-tighter">30+</span>
            <p className="text-[11px] uppercase tracking-[0.2em] opacity-50 leading-relaxed max-w-[200px]">
              Globally recognized awards (Awwwards, FWA, CSSDA)
            </p>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-3xl md:text-5xl font-medium leading-[1.2] tracking-tight">
            {text.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.15 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.4, delay: i * 0.01 }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 flex items-center gap-6"
          >
            <img
              src="https://cdn.prod.website-files.com/68b652bbd6c64a44c8fe3e5e/6a092d5259ca7aa33208cde1_DSCF2544%20copy.avif"
              className="w-16 h-16 rounded-full object-cover grayscale"
              alt="Huy Nguyen"
            />
            <div>
              <p className="font-bold text-lg">Huy (By Huy) Nguyen</p>
              <p className="text-[10px] opacity-40 uppercase tracking-[0.2em] mt-1">Founder, MONOLOG</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
