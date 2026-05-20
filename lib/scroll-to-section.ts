import type { MouseEvent } from "react";

const SCROLL_DURATION = 850;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function scrollToPosition(top: number, onComplete?: () => void) {
  const start = window.scrollY;
  const distance = top - start;
  const startedAt = performance.now();

  const step = (now: number) => {
    const elapsed = now - startedAt;
    const progress = Math.min(elapsed / SCROLL_DURATION, 1);

    window.scrollTo(0, start + distance * easeOutCubic(progress));

    if (progress < 1) {
      window.requestAnimationFrame(step);
      return;
    }

    onComplete?.();
  };

  window.requestAnimationFrame(step);
}

export function scrollToSection(
  event: MouseEvent<HTMLElement>,
  href: string
) {
  if (!href.startsWith("#")) return;

  event.preventDefault();

  const id = href.slice(1);
  const target = id ? document.getElementById(id) : document.documentElement;
  if (!target) return;

  const top =
    target === document.documentElement
      ? 0
      : target.getBoundingClientRect().top + window.scrollY;

  scrollToPosition(top, () => {
    target.scrollIntoView({ block: "start" });
    window.history.pushState(null, "", href);
  });
}

export function scrollToPageTop() {
  scrollToPosition(0, () => {
    document.documentElement.scrollIntoView({ block: "start" });
    window.history.pushState(null, "", "#");
  });
}
