import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "../utils/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Rendered element — keep it valid within its parent context (e.g. "li"). */
  as?: "div" | "span" | "li";
};

/**
 * Lightweight scroll-reveal wrapper built on IntersectionObserver —
 * a single fade + rise, once per element. No library, no parallax.
 * Fully inert under `prefers-reduced-motion` (handled in index.css).
 */
export default function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag: ElementType = as;
  return (
    <Tag
      // The element type varies ("div" | "span" | "li"); the ref only needs
      // to be observable, so one cast keeps the JSX generic props satisfied.
      ref={ref as never}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
