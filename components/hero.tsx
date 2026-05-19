"use client";

import { motion, useScroll, useTransform } from "motion/react";

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative h-[110vh] w-full overflow-hidden flex flex-col items-center justify-center text-center px-6 bg-black">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <img
          src="https://cdn.prod.website-files.com/68b652bbd6c64a44c8fe3e5e/69d51282c6041349788c8177_Key%20Visual-2.avif"
          className="w-full h-full object-cover opacity-50 scale-110"
          alt="Hero Visual"
        />
      </motion.div>

      <div className="relative z-10 max-w-4xl mt-[-10vh]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex justify-center mb-12">
            <svg className="w-14 h-auto text-white/40" viewBox="0 0 57 25" fill="none">
              <path
                d="M28.5 0.35C36.3 0.35 43.4 1.74 48.5 3.97C51.1 5.08 53.1 6.4 54.5 7.85C55.9 9.29 56.6 10.8 56.6 12.4C56.6 14 55.9 15.6 54.5 17C53.1 18.5 51.1 19.8 48.5 20.9C43.4 23.1 36.3 24.5 28.5 24.5C20.7 24.5 13.6 23.1 8.5 20.9C5.9 19.8 3.9 18.5 2.5 17C1.1 15.6 0.4 14 0.4 12.4C0.4 10.8 1.1 9.29 2.5 7.85C3.9 6.4 5.9 5.08 8.5 3.97C13.6 1.74 20.7 0.35 28.5 0.35Z"
                stroke="currentColor"
                strokeWidth="0.7"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-medium text-white leading-[1.15] tracking-tight mb-10 max-w-3xl mx-auto">
            We design change-making website and brand experiences that finally match the
            business behind them.
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light">
            For established founder-led brands whose presence hasn&apos;t caught up to what
            they&apos;ve built.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-6 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "15%" }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[1800px] mx-auto text-white/10"
        >
          <svg className="w-full h-auto" viewBox="0 0 986 233" fill="currentColor">
            <path d="M120 230.8C102.4 230.8 87.6 224.4 76.7 213.7C65.7 203 59.1 187.7 59.1 170.1V41.1H91V170.1C91 178.8 94 185.9 99.1 191C104.5 196.4 111.6 199.2 120 199.2C128.4 199.2 135.5 196.4 140.9 191C146 185.9 149 178.8 149 170.1V41.1H180.9V170.1C180.9 187.7 174.3 203 163.3 213.7C152.4 224.4 137.6 230.8 120 230.8Z" />
            <path d="M280 230.8C262.4 230.8 247.6 224.4 236.7 213.7C225.7 203 219.1 187.7 219.1 170.1V41.1H251V170.1C251 178.8 254 185.9 259.1 191C264.5 196.4 271.6 199.2 280 199.2C288.4 199.2 295.5 196.4 300.9 191C306 185.9 309 178.8 309 170.1V41.1H340.9V170.1C340.9 187.7 334.3 203 323.3 213.7C312.4 224.4 297.6 230.8 280 230.8Z" />
            <path d="M440 230.8C422.4 230.8 407.6 224.4 396.7 213.7C385.7 203 379.1 187.7 379.1 170.1V41.1H411V170.1C411 178.8 414 185.9 419.1 191C424.5 196.4 431.6 199.2 440 199.2C448.4 199.2 455.5 196.4 460.9 191C466 185.9 469 178.8 469 170.1V41.1H500.9V170.1C500.9 187.7 494.3 203 483.3 213.7C472.4 224.4 457.6 230.8 440 230.8Z" />
            <path d="M924.8 230.8C907.2 230.8 892.4 224.4 881.5 213.7C870.5 203 863.9 187.7 863.9 170.1V101.8C863.9 84.2 870.5 68.9 881.5 58.2C892.4 47.5 907.2 41.1 924.8 41.1H925.1C942.7 41.1 957.5 47.5 968.4 58.2C979.4 68.9 986 84.2 986 101.8V105.6H954.1V101.8C954.1 93.1 951.1 86 946 80.9C940.6 75.5 933.5 72.7 925.1 72.7H924.8C916.4 72.7 909.3 75.5 903.9 80.9C898.8 86 895.8 93.1 895.8 101.8V170.1C895.8 178.8 898.8 185.9 903.9 191C909.3 196.4 916.4 199.2 924.8 199.2H925.1C933.5 199.2 940.6 196.4 946 191C951.1 185.9 954.1 178.8 954.1 170.1V157.9H925.1V126.3H986V170.1C986 187.7 979.4 203 968.4 213.7C957.5 224.4 942.7 230.8 925.1 230.8H924.8Z" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
