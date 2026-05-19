"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "How do you communicate and manage work?",
    a: "We keep things simple and transparent with a dedicated Notion portal to manage our project (timelines and deliverables). You'll also have weekly check-in calls on Google Meets to ensure alignment and momentum.",
  },
  {
    q: "How much does a project cost?",
    a: "Project investment starts from $15k with most projects ranging from $18k - $40k depending on scope and project complexity. We provide custom quotes after our initial discovery call.",
  },
  {
    q: "What is the typical timeline?",
    a: "A full brand and web experience typically takes 8-12 weeks. This allows for deep strategy, iterative design, and robust development without compromising on quality.",
  },
];

export function FAQ() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-32 md:py-48 px-6 bg-background">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-24">
        <div>
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] opacity-40 mb-10">
            <div className="w-2 h-2 rounded-full bg-foreground" />
            Common Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-12">
            We&apos;ve heard every concern. Here&apos;s what you really need to know.
          </h2>

          <div className="mt-16 p-10 bg-card rounded-[2rem] text-white relative overflow-hidden group">
            <div className="relative z-10">
              <img
                src="https://cdn.prod.website-files.com/68b652bbd6c64a44c8fe3e5e/6a092d5259ca7aa33208cde1_DSCF2544%20copy.avif"
                className="w-16 h-16 rounded-full mb-8 grayscale group-hover:grayscale-0 transition-all duration-500"
                alt="Huy"
              />
              <p className="text-xl font-medium mb-8 leading-relaxed">
                Got more specific questions? Let&apos;s chat directly.
              </p>
              <button className="w-full py-5 bg-white text-black rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all">
                Book a call with Huy
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          </div>
        </div>

        <div className="divide-y divide-foreground/10 border-t border-foreground/10">
          {FAQS.map((faq, i) => (
            <div key={i} className="py-10">
              <button
                onClick={() => setActive(active === i ? null : i)}
                className="w-full flex justify-between items-center text-left group"
              >
                <span className="text-2xl md:text-3xl font-bold tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                  {faq.q}
                </span>
                <div
                  className={`w-10 h-10 rounded-xl border border-foreground/10 flex items-center justify-center transition-all duration-500 ${active === i ? "bg-foreground text-background rotate-45" : "group-hover:bg-foreground/5"}`}
                >
                  <Plus className="w-5 h-5" />
                </div>
              </button>
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pt-8 text-xl opacity-50 max-w-2xl leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
