import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import DroneFigure from "./DroneFigure";
import { cn } from "../utils/cn";

/**
 * Drone3D — the hero's realistic product-render UAV (replaces the line-art
 * DroneFigure in the hero stage only; DroneFigure remains the Demonstration
 * banner decoration and this component's no-WebGL fallback).
 *
 * MODEL — the drone is authored procedurally in code (this file): a
 * professional quadcopter in the commercial survey class — a slim charcoal
 * fuselage with a stepped nose and light graphite canopy, four horizontal
 * carbon booms carrying motor pods at their tips, counter-rotating
 * twin-blade propellers with faint motion-sweep discs, a nose-mounted gimbal
 * camera with a clearcoat glass lens, and landing rails. No external asset,
 * no CDN dependency, no license burden — the "asset" is this source file,
 * licensed with the project. Materials are physically based (matte charcoal
 * composites, dark metal, graphite canopy, one restrained signal-gold accent)
 * and lit like a studio product photograph: local RoomEnvironment IBL plus
 * key / rim / fill lights and ACES tone mapping, on a transparent canvas so
 * the existing void stage and edge-light halo stay untouched.
 *
 * MOTION — one rAF loop, zero per-frame React state:
 *   · irregular two-sine station-keeping hover (≈2–8 px at render size)
 *   · soft entrance descent on first paint (skipped under reduced motion)
 *   · pointer parallax on fine-pointer devices only, ±0.16 rad max, eased —
 *     the listener sits on the window and the canvas is pointer-events:none,
 *     so it can never block CTAs, text or keyboard focus
 *   · propellers spin steadily (CW/CCW diagonal pairs, like a real quad);
 *     under `prefers-reduced-motion` the hover, parallax, prop spin, gimbal
 *     micro-stabilization and entrance are all disabled — the drone renders
 *     as a static product shot
 *
 * PERFORMANCE — a few thousand triangles, no textures; DPR is clamped
 * (1.75 desktop / 1.5 mobile); the loop pauses whenever the hero leaves the
 * viewport (IntersectionObserver) and on document hidden; everything
 * (renderer, PMREM, geometries, materials) is disposed on unmount. WebGL
 * failure or a lost context falls back to the static DroneFigure.
 */

type Drone3DProps = {
  className?: string;
};

const GOLD = 0xb4823c;

/** Build the quadcopter once and hand every movable part back. */
function buildDrone() {
  const drone = new THREE.Group();

  /* Materials — one PBR family: charcoal composites + dark metal +
     graphite canopy + one restrained gold accent. */
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x272b31, roughness: 0.48, metalness: 0.36 });
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0x42474f, roughness: 0.34, metalness: 0.52 });
  const carbonMat = new THREE.MeshStandardMaterial({ color: 0x191c21, roughness: 0.32, metalness: 0.55 });
  const motorMat = new THREE.MeshStandardMaterial({ color: 0x33383f, roughness: 0.3, metalness: 0.75 });
  const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.28, metalness: 0.85 });
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.28, metalness: 0.45 });
  const lensMat = new THREE.MeshPhysicalMaterial({
    color: 0x05070a,
    roughness: 0.08,
    metalness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
  });
  const discMat = new THREE.MeshBasicMaterial({
    color: 0x9fb2c8,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const materials = [bodyMat, canopyMat, carbonMat, motorMat, goldMat, bladeMat, lensMat, discMat];

  const disposables: Array<THREE.BufferGeometry> = [];
  const geo = <T extends THREE.BufferGeometry>(g: T): T => {
    disposables.push(g);
    return g;
  };
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) => {
    const me = new THREE.Mesh(geo(g), m);
    me.position.set(x, y, z);
    return me;
  };

  /* Motor stations — the four boom tips. */
  const stations: Array<[number, number]> = [
    [1.04, 0.64],
    [-1.04, 0.64],
    [1.04, -0.64],
    [-1.04, -0.64],
  ];

  /* Fuselage — slim hull, stepped nose, graphite canopy, belly plate. */
  drone.add(mesh(new RoundedBoxGeometry(0.54, 0.26, 1.5, 4, 0.1), bodyMat, 0, 0.02, 0.06));
  drone.add(mesh(new RoundedBoxGeometry(0.4, 0.18, 0.52, 4, 0.08), bodyMat, 0, 0.0, -0.82));
  drone.add(mesh(new RoundedBoxGeometry(0.34, 0.09, 0.86, 4, 0.04), canopyMat, 0, 0.17, 0.14));
  drone.add(mesh(new RoundedBoxGeometry(0.42, 0.05, 1.02, 3, 0.02), bodyMat, 0, -0.13, 0.1));

  /* Booms — horizontal carbon bars from the hull corners to the pods. */
  const boomGeo = geo(new RoundedBoxGeometry(1.0, 0.07, 0.13, 2, 0.03));
  for (const [sx, sz] of stations) {
    const from = new THREE.Vector3(sx * 0.2, 0.02, sz * 0.42);
    const to = new THREE.Vector3(sx * 1.04, 0.12, sz * 0.64);
    const boom = new THREE.Mesh(boomGeo, carbonMat);
    boom.position.copy(from).add(to).multiplyScalar(0.5);
    const dir = to.clone().sub(from);
    boom.rotation.y = -Math.atan2(dir.z, dir.x);
    boom.scale.set(from.distanceTo(to), 1, 1);
    drone.add(boom);
  }

  /* Motor pods + propellers — CW/CCW diagonal pairs, gold accent ring,
     faint motion-sweep disc. */
  const propellers: Array<{ pivot: THREE.Group; dir: 1 | -1 }> = [];
  const podGeo = geo(new THREE.CylinderGeometry(0.085, 0.1, 0.16, 18));
  const bellGeo = geo(new THREE.CylinderGeometry(0.125, 0.135, 0.1, 20));
  const bellCapGeo = geo(new THREE.CylinderGeometry(0.138, 0.138, 0.024, 20));
  const ringGeo = geo(new THREE.TorusGeometry(0.138, 0.008, 10, 28));
  const shaftGeo = geo(new THREE.CylinderGeometry(0.013, 0.013, 0.08, 8));
  const hubGeo = geo(new THREE.CylinderGeometry(0.03, 0.03, 0.028, 12));
  const bladeGeo = geo(new THREE.BoxGeometry(0.56, 0.008, 0.062));
  const discGeo = geo(new THREE.CircleGeometry(0.58, 40));

  for (const [sx, sz] of stations) {
    const mx = sx * 1.04;
    const mz = sz * 0.64;
    const my = 0.12;
    drone.add(mesh(podGeo, carbonMat, mx, my + 0.08, mz));
    drone.add(mesh(bellGeo, motorMat, mx, my + 0.2, mz));
    drone.add(mesh(bellCapGeo, motorMat, mx, my + 0.26, mz));
    const ring = mesh(ringGeo, goldMat, mx, my + 0.22, mz);
    ring.rotation.x = Math.PI / 2;
    drone.add(ring);
    drone.add(mesh(shaftGeo, motorMat, mx, my + 0.31, mz));

    const prop = new THREE.Group();
    prop.position.set(mx, my + 0.35, mz);
    prop.add(mesh(hubGeo, bladeMat));
    const pitch = (sx * sz > 0 ? 1 : -1) * 0.17; // diagonal pairs mirror pitch
    for (const side of [1, -1]) {
      const blade = mesh(bladeGeo, bladeMat, side * 0.29, 0.004, 0);
      blade.rotation.x = pitch * side;
      blade.rotation.z = side * -0.035;
      prop.add(blade);
    }
    const disc = mesh(discGeo, discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 0.002;
    prop.add(disc);
    drone.add(prop);
    // Real quads counter-rotate: diagonal pairs share a direction.
    propellers.push({ pivot: prop, dir: sx * sz > 0 ? 1 : -1 });
  }

  /* Gimbal — mount post under the nose, camera body, glass lens + gold rim. */
  const gimbal = new THREE.Group();
  gimbal.position.set(0, -0.3, -0.82);
  drone.add(gimbal);
  gimbal.add(mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.16, 10), carbonMat, 0, 0.1, 0.02));
  gimbal.add(mesh(new RoundedBoxGeometry(0.24, 0.19, 0.2, 3, 0.05), bodyMat, 0, -0.04, 0));
  const lensBarrel = mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.05, 20), carbonMat, 0, -0.04, -0.11);
  lensBarrel.rotation.x = Math.PI / 2;
  gimbal.add(lensBarrel);
  gimbal.add(mesh(new THREE.SphereGeometry(0.046, 16, 14), lensMat, 0, -0.04, -0.14));
  gimbal.add(mesh(new THREE.TorusGeometry(0.054, 0.007, 8, 22), goldMat, 0, -0.04, -0.135));

  /* Landing rails — two carbon skids on short struts. */
  for (const sx of [1, -1]) {
    const rail = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 10), carbonMat, sx * 0.25, -0.4, 0.08);
    rail.rotation.x = Math.PI / 2;
    drone.add(rail);
    drone.add(mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.18, 8), carbonMat, sx * 0.25, -0.29, -0.16));
    drone.add(mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.18, 8), carbonMat, sx * 0.25, -0.29, 0.32));
  }

  /* Nav lights — tiny gold dots on the front booms (no glow, no bloom). */
  drone.add(mesh(new THREE.SphereGeometry(0.018, 8, 8), goldMat, 0.86, 0.13, -0.5));
  drone.add(mesh(new THREE.SphereGeometry(0.018, 8, 8), goldMat, -0.86, 0.13, -0.5));

  return { drone, propellers, gimbal, materials, disposables };
}

export default function Drone3D({ className }: Drone3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  // Refs (not state) for motion flags read inside the rAF loop.
  const visibleRef = useRef(true);
  const reducedRef = useRef(false);
  const pointerTarget = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }
    if (!renderer.getContext()) {
      setFailed(true);
      return;
    }

    const isSmallViewport = Math.min(window.innerWidth, window.screen.width) < 768;
    const dprCap = isSmallViewport ? 1.5 : 1.75;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Professional three-quarter product view — the drone clearly reads as
    // an aircraft, never a flat logo spin.
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 30);
    camera.position.set(3.15, 1.0, 4.55);
    camera.lookAt(0, -0.06, 0);

    /* Studio IBL (local, no network) + three-point lighting. The rim light is
       deliberately strong so the charcoal airframe separates from the void. */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    scene.environment = pmrem.fromScene(envScene, 0.04).texture;
    envScene.traverse((obj) => {
      const mat = (obj as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
      if (mat) mat.dispose();
    });

    const key = new THREE.DirectionalLight(0xffffff, 1.28);
    key.position.set(2.8, 4.2, 2.4);
    const rim = new THREE.DirectionalLight(0xe6edff, 2.1);
    rim.position.set(-3.2, 2.8, -2.8);
    const edge = new THREE.DirectionalLight(0xdfe8ff, 0.5);
    edge.position.set(0.6, 1.4, -3.4);
    const fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(-2.0, 0.7, 2.6);
    scene.add(key, rim, edge, fill);

    const { drone, propellers, gimbal, materials, disposables } = buildDrone();
    drone.traverse((obj) => {
      const m = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (m && "envMapIntensity" in m) m.envMapIntensity = 1.05;
    });
    const root = new THREE.Group();
    root.add(drone);
    scene.add(root);

    /* Reduced motion — query + live updates. */
    const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = () => {
      reducedRef.current = rmQuery.matches;
    };
    syncReduced();
    rmQuery.addEventListener("change", syncReduced);

    /* Pointer parallax — fine pointers only. The listener sits on the window
       (passive) and computes position relative to the host box, so the canvas
       itself never captures or blocks pointer input for nearby UI. */
    const finePointer = window.matchMedia("(pointer: fine)");
    const onPointerMove = (e: PointerEvent) => {
      if (reducedRef.current || !finePointer.matches || !visibleRef.current) return;
      const rect = host.getBoundingClientRect();
      pointerTarget.current.x = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      pointerTarget.current.y = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
    };
    const onPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) {
        pointerTarget.current.x = 0;
        pointerTarget.current.y = 0;
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });

    /* Sizing — observe the host box; the canvas never drives layout. */
    const applySize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    applySize();
    const resizeObserver = new ResizeObserver(applySize);
    resizeObserver.observe(host);

    /* Render only while the hero is on screen. */
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.02 },
    );
    io.observe(host);

    /* A lost context falls back to the static SVG figure. */
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setFailed(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    /* Animation loop — pure three objects, no React re-renders. */
    const parallax = { x: 0, y: 0 };
    const clock = new THREE.Clock();
    let raf = 0;
    let elapsed = 0;
    const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (document.hidden || !visibleRef.current) return;
      elapsed += dt;
      const reduced = reducedRef.current;

      // Entrance descent (first ~1.3 s), skipped under reduced motion.
      const enter = reduced ? 1 : easeOut(Math.min(elapsed / 1.3, 1));
      const descend = (1 - enter) * 0.5;

      // Irregular station-keeping hover — two summed sines, ~±0.08 u.
      const hover = reduced ? 0 : Math.sin(elapsed * 0.9) * 0.05 + Math.sin(elapsed * 0.47 + 1.3) * 0.03;
      root.position.y = hover - descend;

      // Pointer parallax with soft idle sway; limited range, smooth lerp.
      const idleYaw = Math.sin(elapsed * 0.21) * 0.06;
      const idlePitch = Math.cos(elapsed * 0.16) * 0.03;
      const targetX = reduced ? 0 : pointerTarget.current.x;
      const targetY = reduced ? 0 : pointerTarget.current.y;
      parallax.x += (targetX - parallax.x) * Math.min(1, dt * 3.4);
      parallax.y += (targetY - parallax.y) * Math.min(1, dt * 3.4);
      drone.rotation.y = idleYaw + parallax.x * 0.16;
      drone.rotation.x = idlePitch + parallax.y * 0.09;
      drone.rotation.z = Math.sin(elapsed * 0.13) * 0.012 * (reduced ? 0 : 1);

      // Propellers — steady, counter-rotating; parked when reduced.
      const spin = 11;
      for (const { pivot, dir } of propellers) {
        pivot.rotation.y += dir * spin * dt * (reduced ? 0 : 1);
      }

      // Gimbal micro-stabilization — barely perceptible, never swinging.
      gimbal.rotation.x = reduced ? 0 : Math.sin(elapsed * 0.8 + 0.5) * 0.02;
      gimbal.rotation.y = reduced ? 0 : Math.sin(elapsed * 0.62) * 0.014;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      rmQuery.removeEventListener("change", syncReduced);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      resizeObserver.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      scene.environment?.dispose();
      pmrem.dispose();
      for (const g of disposables) g.dispose();
      for (const m of materials) m.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) {
    // Graceful fallback — the original line-art figure, same slot.
    return <DroneFigure variant="hero" className={cn("w-36 sm:w-48 lg:w-56", className)} />;
  }

  return (
    <div
      ref={hostRef}
      data-drone
      aria-hidden="true"
      className={cn("pointer-events-none relative aspect-square w-40 animate-[drone-fade_1s_ease-out_both] sm:w-56 lg:w-80", className)}
    />
  );
}
