import { cn } from "../utils/cn";
import { BRAND, type BrandLockup } from "../brand/brandmark";

/**
 * FEL DRONE — V12 "C2 STADIUM-D" lockups (approved final symbol + wordmark).
 *
 * The symbol is ONE drawing from a single geometry source
 * (scripts/brand-gen.mjs → src/brand/brandmark.ts): a D plate — straight left
 * wall, r30 right shoulder, 45° sheared tail — whose own structure is the F.
 * The stem is the plate's left wall (28u), the top band is the F's upper bar
 * and the mid band ends in an exact r14 semicircle: the rotor pod. The F and
 * the D share the same geometry and the same negative space — the D is never
 * drawn beside the F, and the F is never placed inside a letter. One connected
 * ink mass, ink box x12..148 / y4..144 on the 160 canvas, 2u grid, and a 28u
 * stem — the wordmark's own stroke weight (within 1.3u), so symbol and type
 * share one material logic.
 *
 * The wordmark is typeset in LEXEND 700 — the approved final typeface, loaded
 * self-hosted from @fontsource/lexend (latin subset) in src/main.tsx. It is
 * never distorted: each word is set at the measured Lexend advance for a 110u
 * cap height (FEL 294, DRONE 587) and the 50u word space is Lexend's own, so
 * the name can never fuse into "FELDRONE" and no glyph is ever scaled. The
 * exported SVG assets carry the real Lexend outlines for print (see
 * public/brand/ and docs/BRAND.md).
 *
 * Tiers: MASTER (these lockups, >= 40 px), COMPACT (the symbol alone),
 * MICRO (16–32 px favicon: the same C2 drawing — it has no sub-pixel detail to
 * simplify, so the small-size asset is the master geometry).
 */
const { type } = BRAND;

function Wordmark({
  felX,
  droneX,
  baseline,
  ink,
}: {
  felX: number;
  droneX: number;
  baseline: number;
  ink: string;
}) {
  const common = {
    y: baseline,
    fill: ink,
    fontFamily: "var(--font-wordmark, 'Lexend', 'IBM Plex Sans')",
    fontWeight: 700,
    fontSize: type.size,
    lengthAdjust: "spacing" as const,
  };
  return (
    <>
      <text x={felX} {...common} textLength={type.fel}>
        FEL
      </text>
      <text x={droneX} {...common} textLength={type.drone}>
        DRONE
      </text>
    </>
  );
}

function Lockup({ spec, ink, className }: { spec: BrandLockup; ink: string; className?: string }) {
  const stacked = spec.wordX === type.stackFelX;
  return (
    <svg
      viewBox={`0 0 ${spec.w} ${spec.h}`}
      role="img"
      aria-label="FEL DRONE"
      focusable="false"
      // The lockup is a Latin brand mark: it must lay out left-to-right even
      // when the page is RTL (Arabic ships the very same lockup — the logo is
      // never mirrored, so the mark keeps reading F→D in every language).
      style={{ direction: "ltr" }}
      className={cn("w-auto shrink-0", className)}
    >
      <g fill={ink} fillRule="evenodd">
        <g transform={`translate(${spec.markX} ${spec.markY})`}>
          <path d={BRAND.mark} />
        </g>
      </g>
      <Wordmark
        felX={stacked ? type.stackFelX : type.felX}
        droneX={stacked ? type.stackDroneX : type.droneX}
        baseline={spec.baseline}
        ink={ink}
      />
    </svg>
  );
}

export default function Logo({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const ink = dark ? BRAND.colors.dark : BRAND.colors.light;
  return (
    <>
      <Lockup spec={BRAND.stacked} ink={ink} className={cn("block h-[46px] sm:hidden", className)} />
      <Lockup spec={BRAND.lockup} ink={ink} className={cn("hidden h-[30px] sm:block", className)} />
    </>
  );
}
