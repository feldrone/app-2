import { cn } from "../utils/cn";

/**
 * DroneFigure — the animated UAV of the design system.
 *
 * A single line-art quadcopter drawn top-down (X-frame airframe, four rotor
 * disks, front gimbal) in the same restrained voice as the brand mark: thin
 * cool-white structure on the dark stage, two warm signal accents on the front
 * arms (navigation lights), nothing cartoonish — the drawing reads as an
 * engineering diagram that happens to fly.
 *
 * Motion lives in CSS (see index.css): the hero stage runs `drone-enter`
 * (descent out of the void) + `drone-bob` (station-keeping hover) with
 * `rotor` spins on the blade groups; the banner variant is carried by
 * `drone-drift` (a slow crossing flight). Everything is transform/opacity,
 * aria-hidden, inert to pointers and parked entirely under
 * `prefers-reduced-motion` — where the figure simply renders as a static,
 * edge-lit diagram.
 */

type DroneFigureProps = {
  className?: string;
  /** "hero" = edge-lit on the void; "drift" = quieter silhouette for the banner flight. */
  variant?: "hero" | "drift";
};

export default function DroneFigure({ className, variant = "hero" }: DroneFigureProps) {
  const hero = variant === "hero";
  const structure = hero ? "rgba(232,238,246,0.92)" : "rgba(232,238,246,0.6)";
  const disk = hero ? "rgba(232,238,246,0.34)" : "rgba(232,238,246,0.22)";
  const blade = hero ? "rgba(240,244,250,0.78)" : "rgba(240,244,250,0.5)";
  const gold = "#c6934a";

  /** One rotor: thin outer disk, hub cap and the spinning two-blade group. */
  const Rotor = ({ cx, cy, front = false, slow = false }: { cx: number; cy: number; front?: boolean; slow?: boolean }) => (
    <g>
      <circle cx={cx} cy={cy} r={33} fill="none" stroke={disk} strokeWidth={1.4} />
      <circle cx={cx} cy={cy} r={33} fill="none" stroke={front ? gold : structure} strokeWidth={1} opacity={front ? 0.9 : 0.35} />
      <g className={cn("rotor", slow && "rotor-slow")} style={{ animationDelay: `${(cx + cy) % 3}s` }}>
        <rect x={cx - 30} y={cy - 1.6} width={60} height={3.2} rx={1.6} fill={blade} />
        <rect x={cx - 30} y={cy - 1.6} width={60} height={3.2} rx={1.6} fill={blade} transform={`rotate(90 ${cx} ${cy})`} opacity={0.45} />
      </g>
      <circle cx={cx} cy={cy} r={4.5} fill={structure} />
    </g>
  );

  return (
    <svg
      viewBox="0 0 220 220"
      data-drone
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none select-none", className)}
    >
      {/* Arms — body corners to the four rotor hubs (45° X-frame) */}
      <g stroke={structure} strokeWidth={4} strokeLinecap="round" opacity={0.85}>
        <line x1={97} y1={97} x2={66} y2={66} />
        <line x1={123} y1={97} x2={154} y2={66} />
        <line x1={97} y1={123} x2={66} y2={154} />
        <line x1={123} y1={123} x2={154} y2={154} />
      </g>

      {/* Rotors — front pair carries the gold navigation accents */}
      <Rotor cx={66} cy={66} front />
      <Rotor cx={154} cy={66} front slow />
      <Rotor cx={66} cy={154} slow />
      <Rotor cx={154} cy={154} />

      {/* Airframe — central spine body, front toward the top */}
      <rect x={94} y={74} width={32} height={72} rx={13} fill="rgba(7,12,18,0.55)" stroke={structure} strokeWidth={2} />
      <line x1={110} y1={86} x2={110} y2={134} stroke={structure} strokeWidth={1.2} opacity={0.5} />
      {/* Front gimbal hint */}
      <rect x={103} y={62} width={14} height={10} rx={4} fill="none" stroke={structure} strokeWidth={1.6} opacity={0.8} />
      {/* Navigation lights: gold front, dim rear */}
      <circle cx={97} cy={78} r={2.4} fill={gold} />
      <circle cx={123} cy={78} r={2.4} fill={gold} />
      <circle cx={97} cy={142} r={2} fill={structure} opacity={0.6} />
      <circle cx={123} cy={142} r={2} fill={structure} opacity={0.6} />
    </svg>
  );
}
