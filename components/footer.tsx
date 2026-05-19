"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const NAV_LINKS = [
  { label: "About", href: "#about", soon: false },
  { label: "Experience", href: "#experience", soon: false },
  { label: "Projects", href: "#projects", soon: false },
  { label: "Contact", href: "#contact", soon: false },
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/karnikkanojia" },
  { label: "LinkedIn", href: "https://linkedin.com/in/karnikkanojia" },
  { label: "Twitter", href: "https://twitter.com/karnikkanojia" },
];

function HoverHeading({ children }: { children: string }) {
  return (
    <span className="relative inline-block overflow-hidden">
      <span className="inline-block transition-transform duration-500 ease-out group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute inset-0 inline-block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );
}

function FooterTime() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      const p = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      setTime(`${h12}:${m}:${s}`);
      setPeriod(p);
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-foreground/40 text-[11px] font-mono uppercase tracking-wider">
        {date} (GMT +05:30)
      </span>
      <span className="text-foreground/60 text-sm font-mono">
        {time.split("").map((ch, i) =>
          ch === ":" ? (
            <span key={i} className="animate-pulse">
              :
            </span>
          ) : (
            <span key={i}>{ch}</span>
          )
        )}{" "}
        <span className="text-foreground/40">{period}</span>
      </span>
    </div>
  );
}

export function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const svgX = useTransform(scrollYProgress, [0, 1], ["60%", "-20%"]);
  const textX = useTransform(scrollYProgress, [0, 1], ["-60%", "20%"]);
  const darkOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.6]);
  const footerY = useTransform(scrollYProgress, [0, 1], ["0px", "-80px"]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={sectionRef} className="relative overflow-hidden">
      <motion.div
        style={{ y: footerY }}
        className="relative z-10 bg-background"
      >
        <div className="px-6 lg:px-12 py-20 lg:py-32 border-t border-border-light">
          <div className="max-w-7xl mx-auto">
            {/* Top: Eyebrow + Nav */}
            <div className="flex flex-col lg:flex-row justify-between gap-16 mb-24">
              <div className="lg:max-w-xs">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/30">
                    Navigation
                  </span>
                </div>
                <nav>
                  <ul className="flex flex-col gap-2">
                    {NAV_LINKS.map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          className="group relative flex items-center gap-4 py-2"
                        >
                          <span className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground/80 group-hover:text-accent transition-colors duration-300">
                            <HoverHeading>{l.label}</HoverHeading>
                          </span>
                          <span className="text-3xl lg:text-4xl font-bold text-accent opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                            →
                          </span>
                          {l.soon && (
                            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-foreground/20 ml-2">
                              (SOON)
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Aside: Studio details + Socials */}
              <div className="flex flex-col gap-12 lg:gap-16">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/20 mb-6">
                    Connect
                  </div>
                  <ul className="flex flex-col gap-4">
                    {SOCIALS.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2"
                        >
                          <span className="text-lg font-bold tracking-tight text-foreground/60 group-hover:text-accent transition-colors">
                            <HoverHeading>{s.label}</HoverHeading>
                          </span>
                          <span className="text-sm text-foreground/30 group-hover:text-accent transition-colors">
                            ↗
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/20 mb-6">
                    Location
                  </div>
                  <span className="text-sm text-foreground/50 leading-relaxed block">
                    India
                  </span>
                  <a
                    href="mailto:karnik@example.com"
                    className="group inline-flex items-center gap-2 mt-4"
                  >
                    <span className="text-sm font-bold tracking-wider text-foreground/60 group-hover:text-accent transition-colors">
                      <HoverHeading>karnik@example.com</HoverHeading>
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-12 border-t border-border-light">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <FooterTime />

                <div className="flex flex-wrap items-center gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/30">
                  <button
                    onClick={scrollToTop}
                    className="group flex items-center gap-2 hover:text-accent transition-colors"
                  >
                    <span>Back to top</span>
                    <span className="inline-block group-hover:-translate-y-1 transition-transform">
                      ↑
                    </span>
                  </button>
                  <span>Open to opportunities</span>
                </div>

                <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/20">
                  <span>© {new Date().getFullYear()} </span>
                  <span className="text-foreground/40">Karnik Kanojia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Parallax Canvas */}
      <div className="relative h-[45vh] lg:h-[50vh] overflow-hidden bg-background border-t border-border-light">
        <motion.div
          style={{ opacity: darkOpacity }}
          className="absolute inset-0 bg-black z-10 pointer-events-none"
        />

        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <motion.svg
            style={{ x: svgX }}
            className="w-full max-w-[1200px] h-auto text-foreground/5 absolute"
            viewBox="0 0 986 233"
            fill="currentColor"
          >
            <path d="M924.823 230.784C907.234 230.784 892.449 224.411 881.488 213.705C870.527 202.999 863.9 187.705 863.9 170.116V101.801C863.9 84.2125 870.527 68.9181 881.488 58.2121C892.449 47.506 907.234 41.1333 924.823 41.1333H925.077C942.666 41.1333 957.451 47.506 968.412 58.2121C979.373 68.9181 986 84.2125 986 101.801V105.625H954.137V101.801C954.137 93.1343 951.078 85.9969 945.98 80.8987C940.627 75.5457 933.489 72.7417 925.077 72.7417H924.823C916.411 72.7417 909.273 75.5457 903.92 80.8987C898.822 85.9969 895.763 93.1343 895.763 101.801V170.116C895.763 178.783 898.822 185.92 903.92 191.018C909.273 196.371 916.411 199.175 924.823 199.175H925.077C933.489 199.175 940.627 196.371 945.98 191.018C951.078 185.92 954.137 178.783 954.137 170.116V157.881H925.077V126.272H986V170.116C986 187.705 979.373 202.999 968.412 213.705C957.451 224.411 942.666 230.784 925.077 230.784H924.823Z" />
            <path d="M771.576 230.852C753.056 230.852 738.784 224.472 728.76 211.713C718.905 198.781 713.978 181.022 713.978 158.435C713.978 143.606 715.847 129.295 719.585 115.502C723.493 101.708 729.1 89.466 736.406 78.7759C743.882 67.9133 752.972 59.3785 763.676 53.1713C774.38 46.7917 786.528 43.6019 800.121 43.6019C818.641 43.6019 832.828 50.0677 842.682 62.9993C852.537 75.7585 857.464 93.4317 857.464 116.019C857.464 131.02 855.51 145.417 851.602 159.211C847.865 172.832 842.258 185.074 834.782 195.936C827.476 206.626 818.471 215.161 807.767 221.541C797.232 227.748 785.169 230.852 771.576 230.852ZM774.125 205.247C783.13 205.247 791.116 202.747 798.082 197.747C805.048 192.746 810.825 186.108 815.412 177.832C820.17 169.383 823.738 160.245 826.116 150.417C828.495 140.417 829.685 130.502 829.685 120.674C829.685 103.949 826.966 91.2764 821.529 82.6554C816.092 73.8619 808.106 69.4651 797.572 69.4651C788.567 69.4651 780.581 71.9652 773.615 76.9655C766.649 81.9657 760.787 88.6039 756.03 96.8801C751.272 105.156 747.704 114.295 745.326 124.295C742.947 134.296 741.758 144.21 741.758 154.038C741.758 170.59 744.561 183.263 750.168 192.057C755.775 200.85 763.761 205.247 774.125 205.247Z" />
            <path d="M605.055 227.982V43.9392H636.918V179.55C636.918 184.903 638.702 188.981 641.506 191.785C644.31 194.589 648.389 196.373 653.742 196.373H708.547V227.982H605.055Z" />
            <path d="M458.291 200.064V71.9503H483.946V200.064H458.291ZM483.946 225.686V200.064H560.909V225.686H483.946ZM483.946 71.9503V46.3276H560.909V71.9503H483.946ZM560.909 200.064V71.9503H586.563V200.064H560.909Z" />
            <path d="M586.563 71.9503H560.909V200.064H483.946V225.686H560.909V200.064H586.563V71.9503Z" />
            <path d="M314.352 227.982V43.9392H356.157L396.432 141.823C397.706 144.882 398.981 146.921 402.295 146.921C405.609 146.921 407.903 144.882 407.903 140.804V43.9392H439.511V227.982H397.707L357.431 130.098C356.157 127.039 354.882 125 351.568 125C348.255 125 345.96 127.039 345.96 131.117V227.982H314.352Z" />
            <path d="M0 227.982V43.9392H49.9617L65.7659 133.666C66.2757 136.725 68.0601 138.764 71.1189 138.764C74.1778 138.764 75.9622 136.725 76.472 133.666L92.2762 43.9392H142.238V227.982H111.139V139.274C111.139 135.706 108.845 133.411 105.786 133.411C102.472 133.411 100.688 135.706 100.178 138.51L84.3741 227.982H57.8638L42.0596 138.51C41.5498 135.706 39.7654 133.411 36.4516 133.411C33.3928 133.411 31.0986 135.706 31.0986 139.274V227.982H0Z" />
          </motion.svg>

          <motion.span
            style={{ x: textX }}
            className="text-[8vw] lg:text-[5vw] font-bold tracking-tighter text-foreground/5 absolute whitespace-nowrap"
          >
            Refuse to be underestimated.
          </motion.span>
        </div>
      </div>

      {/* Dark overlay for scroll effect */}
      <motion.div
        style={{ opacity: darkOpacity }}
        className="absolute inset-0 bg-black pointer-events-none z-[5]"
      />
    </footer>
  );
}
