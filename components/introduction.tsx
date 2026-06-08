"use client";

import airIndiaLogo from "@/assets/introduction/airindia.png";
import { Briefcase } from "lucide-react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const introLines = ["Hi, I'm Karnik Kanojia"];

const introBody =
  "I'm passionate about using data science 🧠 to solve societal challenges and build real-time products 🚀 that make a positive impact. From predicting diseases ⚕️ to empowering underprivileged communities 🫶, I'm especially focused on specialized ML systems for medical images, including photos, X-rays, CT scans, and MRI scans.";

function BoardingPass() {
  const cardRef = useRef<HTMLElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.45 });

  return (
    <motion.aside
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-xs overflow-hidden rounded-3xl bg-black px-4 py-4 text-white shadow-[0_20px_56px_rgb(0_0_0/0.28)] ring-1 ring-white/10"
      aria-label="Air India flight AI101 from Delhi to New York"
    >
      <div className="flex items-center justify-between gap-4 text-xs text-white/78">
        <div className="flex items-center gap-2">
          <p className="font-mono">AI101</p>
          <div className="flex items-center gap-1.5 rounded-[10px] bg-[#ffb300] px-2.5 py-1.5 text-black">
            <Briefcase aria-hidden="true" className="size-4 stroke-[2.2]" />
            <span className="text-base font-medium leading-none">2</span>
          </div>
        </div>
        <Image
          src={airIndiaLogo}
          alt="Air India"
          width={76}
          height={20}
          className="h-5 w-auto object-contain"
        />
      </div>

      <div className="relative mt-7 grid grid-cols-[auto_1fr_auto] items-start gap-2">
        <div>
          <p className="text-3xl font-medium leading-none tracking-normal">LKO</p>
          <p className="mt-1 font-mono text-[10px] leading-none text-white/55">
            02:20
          </p>
        </div>

        <div className="relative h-9">
          <svg
            aria-hidden="true"
            viewBox="0 0 210 58"
            className="absolute inset-0 h-full w-full overflow-visible"
            fill="none"
          >
            <motion.path
              d="M18 41C61 8 139 8 192 41"
              stroke="#00f5a0"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: isInView ? 1 : 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M151 23C166 27 180 33 192 41"
              stroke="#00f5a0"
              strokeWidth="3"
              strokeDasharray="5 6"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: isInView ? 1 : 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
            />
            <circle cx="18" cy="41" r="10" fill="#00f5a0" />
            <circle cx="192" cy="41" r="10" fill="#00f5a0" />
            <path d="M14 45L22 37M22 37H15M22 37V44" stroke="#02130d" strokeWidth="2.4" />
            <path d="M188 37L196 45M196 45H189M196 45V38" stroke="#02130d" strokeWidth="2.4" />
          </svg>
        </div>

        <div className="text-right">
          <p className="text-3xl font-medium leading-none tracking-normal">JFK</p>
          <p className="mt-1 font-mono text-[10px] leading-none text-white/55">
            07:35<sup className="ml-0.5 text-[7px] leading-none text-white/42">+1</sup>
          </p>
        </div>
      </div>
    </motion.aside>
  );
}

export function Introduction() {
  return (
    <section
      id="about"
      className="flex min-h-screen items-center bg-foreground px-5 py-10 text-background md:py-12"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[0.62fr_1.38fr] lg:items-center lg:gap-10">
        <BoardingPass />
        <div className="relative space-y-5">
          <div className="space-y-2">
            {introLines.map((line, index) => (
              <motion.h2
                key={line}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-2xl font-medium leading-[1.05] tracking-normal md:text-3xl lg:text-4xl"
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
            className="max-w-4xl text-base font-light leading-[1.48] text-background/65 md:text-lg md:leading-[1.35]"
          >
            {introBody}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
