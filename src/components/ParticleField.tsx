"use client";
import { useEffect, useRef } from "react";

interface StarParticle {
  angle: number;
  radius: number;
  rotationSpeed: number;
  z: number;
  baseSize: number;
  alpha: number;
}

interface CloudParticle {
  angle: number;
  radius: number;
  rotationSpeed: number;
  z: number;
  baseSize: number;
  alpha: number;
  colorStr: string;
  // Pre-rendered offscreen sprite so we never call createRadialGradient per frame
  sprite: HTMLCanvasElement;
}

// Pre-render a radial gradient onto a small offscreen canvas once.
// We reuse it for every cloud of that color — hugely cheaper than per-frame gradients.
function buildCloudSprite(colorStr: string, size: number): HTMLCanvasElement {
  const dim = Math.ceil(size * 2);
  const oc = document.createElement("canvas");
  oc.width = dim;
  oc.height = dim;
  const oc2d = oc.getContext("2d")!;
  const g = oc2d.createRadialGradient(dim / 2, dim / 2, 0, dim / 2, dim / 2, dim / 2);
  g.addColorStop(0,   `rgba(${colorStr}, 1)`);
  g.addColorStop(0.3, `rgba(${colorStr}, 0.4)`);
  g.addColorStop(1,   `rgba(${colorStr}, 0)`);
  oc2d.fillStyle = g;
  oc2d.fillRect(0, 0, dim, dim);
  return oc;
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let stars: StarParticle[] = [];
    let clouds: CloudParticle[] = [];
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    // ---- TUNED CONSTANTS ----
    const STAR_COUNT  = 7000;
    const CLOUD_COUNT = 70;
    const MAX_DEPTH    = 3000;
    const FOCAL_LENGTH = 150;
    const BASE_SPEED   = 1.5;
    const ORBIT_SPEED  = 0.001;

    const TILT_X =  0.4;
    const TILT_Y = -0.5;

    const CLOUD_COLORS = [
      "168, 85, 247",
      "236, 72, 153",
      "99, 102, 241",
      "139, 92, 246",
    ];

    // Cap DPR at 2 to prevent massive framebuffers on retina/4 K screens
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    // Pre-built sprite cache keyed by colorStr — built once, reused forever
    const spriteCache = new Map<string, HTMLCanvasElement>();
    function getSprite(colorStr: string, size: number): HTMLCanvasElement {
      if (!spriteCache.has(colorStr)) {
        spriteCache.set(colorStr, buildCloudSprite(colorStr, size));
      }
      return spriteCache.get(colorStr)!;
    }

    const initParticles = (width: number, height: number) => {
      stars  = [];
      clouds = [];
      const maxRadius = Math.max(width, height) * 4;
      const spriteSize = 700; // fixed sprite size; scaled at draw time

      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          angle:         Math.random() * Math.PI * 2,
          radius:        Math.random() * maxRadius,
          rotationSpeed: ORBIT_SPEED + Math.random() * 0.0005,
          z:             Math.random() * MAX_DEPTH,
          baseSize:      Math.random() * 1.5 + 0.5,
          alpha:         Math.random() * 0.6 + 0.2,
        });
      }

      for (let i = 0; i < CLOUD_COUNT; i++) {
        const colorStr = CLOUD_COLORS[Math.floor(Math.random() * CLOUD_COLORS.length)];
        clouds.push({
          angle:         Math.random() * Math.PI * 2,
          radius:        Math.random() * (maxRadius * 0.35),
          rotationSpeed: ORBIT_SPEED * 0.5,
          z:             Math.random() * MAX_DEPTH,
          baseSize:      Math.random() * 600 + 600,
          alpha:         Math.random() * 0.06 + 0.04,
          colorStr,
          sprite:        getSprite(colorStr, spriteSize),
        });
      }
    };

    // Debounced resize: wait 200 ms idle before re-init to avoid thrashing
    const resize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvas.width  = window.innerWidth  * DPR;
        canvas.height = window.innerHeight * DPR;
        canvas.style.width  = window.innerWidth  + "px";
        canvas.style.height = window.innerHeight + "px";
        initParticles(window.innerWidth, window.innerHeight);
      }, 200);
    };

    // Precompute trig once (values never change between frames)
    const cosX = Math.cos(TILT_X);
    const sinX = Math.sin(TILT_X);
    const cosY = Math.cos(TILT_Y);
    const sinY = Math.sin(TILT_Y);

    const render = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width  / 2;
      const cy = canvas.height / 2;

      // ---- PASS 1: CLOUDS (drawn with pre-cached sprites via drawImage) ----
      ctx.save();
      for (const p of clouds) {
        p.z     -= BASE_SPEED;
        p.angle += p.rotationSpeed;

        if (p.z <= 0) {
          p.z     = MAX_DEPTH;
          p.angle = Math.random() * Math.PI * 2;
        }

        const x = Math.cos(p.angle) * p.radius;
        const y = Math.sin(p.angle) * p.radius;

        const zPivot = p.z - (MAX_DEPTH / 2);
        const y1     = y * cosX - zPivot * sinX;
        const z1     = y * sinX + zPivot * cosX;
        const x2     = x * cosY - z1     * sinY;
        const z2     = x * sinY + z1     * cosY;
        const finalZ = z2 + (MAX_DEPTH / 2);

        if (finalZ <= 1) continue;

        const scale = FOCAL_LENGTH / (FOCAL_LENGTH + finalZ);
        const px    = x2 * scale * DPR + cx;
        const py    = y1 * scale * DPR + cy;
        const size  = Math.max(1, p.baseSize * scale * DPR);

        const distAlpha = 1 - (p.z / MAX_DEPTH);
        const edgeFade  = Math.min(1, p.z / 300);
        const alpha     = p.alpha * distAlpha * edgeFade;

        // drawImage is GPU-accelerated; far cheaper than per-frame createRadialGradient
        ctx.globalAlpha = alpha;
        ctx.drawImage(p.sprite, px - size, py - size, size * 2, size * 2);
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // ---- PASS 2: STARS ----
      ctx.fillStyle = "rgba(255,255,255,1)"; // override per-star below
      for (const p of stars) {
        p.z     -= BASE_SPEED;
        p.angle += p.rotationSpeed;

        if (p.z <= 0) {
          p.z     = MAX_DEPTH;
          p.angle = Math.random() * Math.PI * 2;
        }

        const x = Math.cos(p.angle) * p.radius;
        const y = Math.sin(p.angle) * p.radius;

        const zPivot = p.z - (MAX_DEPTH / 2);
        const y1     = y * cosX - zPivot * sinX;
        const z1     = y * sinX + zPivot * cosX;
        const x2     = x * cosY - z1     * sinY;
        const z2     = x * sinY + z1     * cosY;
        const finalZ = z2 + (MAX_DEPTH / 2);

        if (finalZ <= 1) continue;

        const scale  = FOCAL_LENGTH / (FOCAL_LENGTH + finalZ);
        const px     = x2 * scale * DPR + cx;
        const py     = y1 * scale * DPR + cy;
        const size   = Math.max(0.1, p.baseSize * scale * DPR);

        const distAlpha = 1 - (p.z / MAX_DEPTH);
        const edgeFade  = Math.min(1, p.z / 150);
        const alpha     = p.alpha * distAlpha * edgeFade;

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(px, py, size * 2, size * 2);
      }

      raf = requestAnimationFrame(render);
    };

    // Initial sync resize (no debounce on first load)
    canvas.width  = window.innerWidth  * DPR;
    canvas.height = window.innerHeight * DPR;
    canvas.style.width  = window.innerWidth  + "px";
    canvas.style.height = window.innerHeight + "px";
    initParticles(window.innerWidth, window.innerHeight);

    window.addEventListener("resize", resize);
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 bg-black"
      style={{ willChange: "transform" }}
    >
      {/* Starfield canvas — fades in smoothly over 1.2s instead of popping in */}
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{
          animation: "nebula-fadein 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          opacity: 0,
          willChange: "opacity",
        }}
      />
    </div>
  );
}