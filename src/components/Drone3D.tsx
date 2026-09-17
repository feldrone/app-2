import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import DroneFigure from "./DroneFigure";
import { cn } from "../utils/cn";

/**
 * Drone3D — the hero's real 3D UAV, loaded from a repository-local GLB and
 * rendered with WebGL. Replaces the line-art DroneFigure as the primary hero
 * drone (DroneFigure remains the loading placeholder, the no-WebGL fallback
 * and the Demonstration banner decoration).
 *
 * MODEL — "Fpv Racing Drone Quadcopter" by eagleanurag, CC-BY-4.0, obtained
 * via njanne19/euas-docs (MIT) and optimized with glTF-Transform (texture
 * resize, weld/dedup/prune, simplify, KHR_mesh_quantization): 3.19 MiB,
 * ~106k triangles, 21 PBR materials, 5 textures, camera-lens detail, and the
 * authored clip "Take 001" which rotates the four propeller nodes
 * (polySurface270–273) and wobbles the antenna. Full attribution ships next
 * to the asset (public/3d/fel-drone-uav-LICENSE.txt) and must be preserved:
 *
 *   This work is based on "Fpv Racing Drone Quadcopter"
 *   (https://sketchfab.com/3d-models/fpv-racing-drone-quadcopter-fa8b1ca2695e4022a9b4c70401f04b05)
 *   by eagleanurag (https://sketchfab.com/eagleanurag), CC-BY-4.0.
 *
 * FRAMING — computed from the model's bounding box (center/radius → camera
 * distance), never a hardcoded scale, so the UAV stays correctly framed from
 * desktop down to mobile.
 *
 * MOTION — one rAF loop, zero per-frame React state: the authored propeller
 * clip plays on an AnimationMixer; the airframe keeps station with a small
 * irregular hover; fine pointers get a clamped, eased parallax; a restrained
 * fade-and-settle entrance runs once. `prefers-reduced-motion` pauses the
 * mixer and disables hover/parallax/entrance — the UAV renders as a static
 * product shot, never removed.
 *
 * PERFORMANCE / RESILIENCE — DPR clamped (1.75 desktop / 1.5 mobile), no
 * post-processing, rendering pauses when the hero leaves the viewport or the
 * tab hides, full disposal on unmount. WebGL failure, a lost context or a
 * model-load error falls back to the static DroneFigure — the hero is never
 * blank and never blocks CTAs (the canvas is pointer-events:none, decorative).
 */

/** Centralized configuration — no scattered magic constants. */
const DRONE_CONFIG = {
  /** Repository-local GLB (prefixed with the Vite base at build time). */
  modelUrl: `${import.meta.env.BASE_URL}3d/fel-drone-uav.glb`,
  /** Longest model dimension after normalization, in scene units. */
  targetSize: 2.9,
  cameraFov: 30,
  /** Camera placement, three-quarter product view (unit sphere direction). */
  cameraDirection: new THREE.Vector3(0.62, 0.34, 1).normalize(),
  /** Framing margin — keeps propeller discs and sway inside the frame. */
  framingMargin: 1.22,
  /** Pointer parallax limits (radians). */
  parallaxYaw: 0.16,
  parallaxPitch: 0.09,
  /** Idle sway amplitude (radians) and hover amplitude (scene units). */
  idleYaw: 0.05,
  hover: 0.045,
  /** Pixel-ratio caps per class of device. */
  maxPixelRatioDesktop: 1.75,
  maxPixelRatioMobile: 1.5,
} as const;

export default function Drone3D({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  // "loading" shows the SVG placeholder in the same slot; "ready" swaps in the
  // canvas with a soft fade; "failed" keeps the placeholder permanently.
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
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
      setStatus("failed");
      return;
    }
    if (!renderer.getContext()) {
      setStatus("failed");
      return;
    }

    const isSmallViewport = Math.min(window.innerWidth, window.screen.width) < 768;
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isSmallViewport ? DRONE_CONFIG.maxPixelRatioMobile : DRONE_CONFIG.maxPixelRatioDesktop),
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.classList.add("opacity-0", "transition-opacity", "duration-700");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(DRONE_CONFIG.cameraFov, 1, 0.05, 60);

    /* Studio IBL (local RoomEnvironment — no network) + three-point lights:
       strong rim so the dark airframe separates from the void stage. */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    scene.environment = pmrem.fromScene(envScene, 0.04).texture;
    envScene.traverse((obj) => {
      const mat = (obj as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
      if (mat) mat.dispose();
    });

    const key = new THREE.DirectionalLight(0xffffff, 1.35);
    key.position.set(2.8, 4.2, 2.4);
    const rim = new THREE.DirectionalLight(0xe6edff, 2.0);
    rim.position.set(-3.2, 2.8, -2.8);
    const edge = new THREE.DirectionalLight(0xdfe8ff, 0.5);
    edge.position.set(0.6, 1.4, -3.4);
    const fill = new THREE.DirectionalLight(0xffffff, 0.38);
    fill.position.set(-2.0, 0.7, 2.6);
    scene.add(key, rim, edge, fill);

    const root = new THREE.Group(); // hover / parallax / entrance
    const pivot = new THREE.Group(); // model centered at origin
    root.add(pivot);
    scene.add(root);

    /* Disposal registry — model geometries, materials, textures. */
    const modelDisposables: Array<{ dispose: () => void }> = [];

    let mixer: THREE.AnimationMixer | null = null;
    let disposed = false;
    let raf = 0;

    /* Reduced motion — query + live updates. */
    const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = () => {
      reducedRef.current = rmQuery.matches;
    };
    syncReduced();
    rmQuery.addEventListener("change", syncReduced);

    /* Pointer parallax — fine pointers only; window-level passive listener,
       relative to the host box. The canvas never captures pointer input. */
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
      setStatus("failed");
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    const disposeModel = (model: THREE.Object3D) => {
      model.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
        for (const m of mats) {
          const rec = m as THREE.MeshStandardMaterial;
          for (const tex of [rec.map, rec.normalMap, rec.roughnessMap, rec.metalnessMap, rec.emissiveMap]) {
            tex?.dispose();
          }
          m.dispose();
        }
      });
    };

    /* Model load — repository-local GLB, framed from its bounding box. */
    new GLTFLoader().load(
      DRONE_CONFIG.modelUrl,
      (gltf: GLTF) => {
        if (disposed) {
          disposeModel(gltf.scene);
          return;
        }
        const model = gltf.scene;

        // Normalize scale + center on the pivot (bounding-box framing).
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = DRONE_CONFIG.targetSize / maxDim;
        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        pivot.add(model);

        // Model geometries/materials/textures join the disposal registry.
        model.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) modelDisposables.push(mesh.geometry);
          const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
          for (const m of mats) {
            modelDisposables.push(m);
            const rec = m as THREE.MeshStandardMaterial;
            for (const tex of [rec.map, rec.normalMap, rec.roughnessMap, rec.metalnessMap, rec.emissiveMap]) {
              if (tex) modelDisposables.push(tex);
            }
          }
        });

        // The authored clip spins the four propellers (+ antenna sway).
        const clip = gltf.animations.find((a) => a.name === "Take 001") ?? gltf.animations[0];
        if (clip) {
          mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(clip).play();
          if (reducedRef.current) mixer.timeScale = 0;
        }

        // Camera — three-quarter product view, distance from the normalized
        // bounding sphere so the whole airframe (props included) stays in
        // frame at every viewport aspect.
        const radius = (DRONE_CONFIG.targetSize / 2) * DRONE_CONFIG.framingMargin;
        const dist = radius / Math.tan((DRONE_CONFIG.cameraFov * Math.PI) / 360);
        camera.position.copy(DRONE_CONFIG.cameraDirection).multiplyScalar(dist);
        camera.lookAt(0, 0, 0);
        applySize();

        setStatus("ready");
        requestAnimationFrame(() => renderer.domElement.classList.remove("opacity-0"));
      },
      undefined,
      () => {
        if (!disposed) setStatus("failed");
      },
    );

    /* Animation loop — pure three objects, no React re-renders. */
    const parallax = { x: 0, y: 0 };
    const clock = new THREE.Clock();
    let elapsed = 0;
    const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (document.hidden || !visibleRef.current) return;
      elapsed += dt;
      const reduced = reducedRef.current;

      if (mixer && !reduced) mixer.update(dt);

      // Entrance: fade handled via CSS opacity; a gentle settle here.
      const enter = reduced ? 1 : easeOut(Math.min(elapsed / 1.4, 1));
      const descend = (1 - enter) * 0.35;

      // Irregular station-keeping hover — two summed slow sines.
      const hover = reduced ? 0 : Math.sin(elapsed * 0.9) * DRONE_CONFIG.hover + Math.sin(elapsed * 0.47 + 1.3) * DRONE_CONFIG.hover * 0.6;
      root.position.y = hover - descend;

      // Pointer parallax + soft idle sway, clamped and eased.
      const targetX = reduced ? 0 : pointerTarget.current.x;
      const targetY = reduced ? 0 : pointerTarget.current.y;
      parallax.x += (targetX - parallax.x) * Math.min(1, dt * 3.4);
      parallax.y += (targetY - parallax.y) * Math.min(1, dt * 3.4);
      root.rotation.y = Math.sin(elapsed * 0.21) * DRONE_CONFIG.idleYaw * (reduced ? 0 : 1) + parallax.x * DRONE_CONFIG.parallaxYaw;
      root.rotation.x = Math.cos(elapsed * 0.16) * 0.025 * (reduced ? 0 : 1) + parallax.y * DRONE_CONFIG.parallaxPitch;
      root.rotation.z = Math.sin(elapsed * 0.13) * 0.01 * (reduced ? 0 : 1);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      rmQuery.removeEventListener("change", syncReduced);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      resizeObserver.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      mixer?.stopAllAction();
      mixer = null;
      pivot.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
        for (const m of mats) m.dispose();
      });
      for (const d of modelDisposables) d.dispose();
      scene.environment?.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      data-drone
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative aspect-square w-40 animate-[drone-fade_0.6s_ease-out_both] sm:w-56 lg:w-80",
        className,
      )}
    >
      {status !== "ready" && (
        // Loading placeholder / fallback — the same slot, same visual family;
        // keeps the hero intentional while the GLB streams (never a blank).
        <DroneFigure variant="hero" className="absolute inset-0 m-auto w-[82%] opacity-90" />
      )}
    </div>
  );
}
