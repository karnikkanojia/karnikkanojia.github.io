"use client";

import { motion } from "motion/react";

const introLines = [
  "Hi, my name is",
  "Karnik Kanojia.",
  "I build things with ML.",
];

const introBody =
  "As a software engineer with expertise in crafting outstanding digital experiences, I am currently dedicated to building automation and tools to ensure large-scale systems are highly available, scalable, and resilient against failures at Oracle.";

export function Introduction() {
  return (
    <section id="about" className="px-6 py-32 text-background bg-foreground md:py-48">
      <div className="grid max-w-7xl grid-cols-1 gap-16 mx-auto lg:grid-cols-[0.75fr_2fr] md:gap-24">
        <div className="flex flex-col justify-between gap-10 border-t border-background/20 pt-8">
          <p className="max-w-55 text-[11px] uppercase leading-relaxed tracking-[0.2em] text-background/45">
            Introduction
          </p>
          <p className="max-w-70 text-sm leading-6 text-background/55">
            Software engineer working across ML, automation, digital products, and
            reliability-focused systems.
          </p>
        </div>

        <div className="relative space-y-14">
          <div className="space-y-3">
            {introLines.map((line, index) => (
              <motion.h2
                key={line}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl font-medium leading-[1.05] tracking-tight md:text-7xl"
              >
                {line}
              </motion.h2>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl text-xl font-light leading-[1.55] text-background/65 md:text-3xl md:leading-[1.45]"
          >
            {introBody}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
