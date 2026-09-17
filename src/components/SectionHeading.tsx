import type { ReactNode } from "react";
import Reveal from "./Reveal";
import { cn } from "../utils/cn";

/**
 * Shared editorial section heading: thin rule + letter-spaced eyebrow,
 * serif display headline, optional lede paragraph. `tone="navy"` inverts
 * it for dark bands so every section header in the system stays cohesive.
 */
export default function SectionHeading({
  id,
  eyebrow,
  title,
  lede,
  tone = "light",
  className,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "light" | "navy";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className={cn("max-w-2xl", className)}>
      <p
        className={cn(
          "mb-5 flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] sm:text-[12px]",
          tone === "navy" ? "text-signal-500" : "text-mute",
        )}
      >
        <span
          className={cn("h-px w-8", tone === "navy" ? "bg-signal-500" : "bg-signal-600")}
          aria-hidden="true"
        />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn(
          "font-display text-[1.9rem] leading-[1.12] font-medium tracking-[-0.01em] sm:text-[2.4rem]",
          tone === "navy" ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-6 text-[16px] leading-relaxed",
            tone === "navy" ? "text-white/70" : "text-ink-soft",
          )}
        >
          {lede}
        </p>
      )}
      {children}
    </Reveal>
  );
}
