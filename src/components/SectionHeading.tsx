import type { ReactNode } from "react";
import Reveal from "./Reveal";
import { cn } from "../utils/cn";

/**
 * Shared editorial section heading: signal tick + letter-spaced eyebrow,
 * light-weight display headline (32px/300, -0.02em), optional lede.
 * `tone="navy"` inverts it for the dark stage so every section header in the
 * system stays cohesive. Headings keep the brand navy as their ink; helpers
 * sit on the graphite/slate ramp of the light canvas.
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
          "mb-5 flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] sm:text-[12px]",
          tone === "navy" ? "text-signal-500" : "text-slate",
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
          "font-display text-[1.6rem] text-balance leading-[1.22] font-light tracking-[-0.02em] sm:text-[2rem]",
          tone === "navy" ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-5 text-[16px] leading-relaxed",
            tone === "navy" ? "text-white/65" : "text-graphite",
          )}
        >
          {lede}
        </p>
      )}
      {children}
    </Reveal>
  );
}
