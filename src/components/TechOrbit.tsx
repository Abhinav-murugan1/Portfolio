"use client";
import { memo, useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useTransform, useAnimationFrame } from "framer-motion";
import { SiReact, SiTypescript, SiJavascript, SiHtml5, SiCss, SiTailwindcss, SiFirebase, SiPhp, SiMysql, SiFigma, SiGit, SiGithub, SiExpo } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import type { IconType } from "react-icons";

// ---- Static data: defined outside component so it's never re-created ----
const TECHS = [
  { name: "React",      Icon: SiReact,      color: "#61DAFB" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "Tailwind",   Icon: SiTailwindcss,color: "#38BDF8" },
  { name: "HTML5",      Icon: SiHtml5,      color: "#E34F26" },
  { name: "CSS3",       Icon: SiCss,        color: "#1572B6" },
  { name: "Firebase",   Icon: SiFirebase,   color: "#FFCA28" },
  { name: "PHP",        Icon: SiPhp,        color: "#777BB4" },
  { name: "MySQL",      Icon: SiMysql,      color: "#4479A1" },
  { name: "Figma",      Icon: SiFigma,      color: "#F24E1E" },
  { name: "Git",        Icon: SiGit,        color: "#F05032" },
  { name: "GitHub",     Icon: SiGithub,     color: "#ffffff" },
  { name: "Expo",       Icon: SiExpo,       color: "#ffffff" },
  { name: "VS Code",    Icon: VscVscode,    color: "#007ACC" },
] as const;

// ---- Memoized icon tile: only re-renders when its own props change ----
interface TechIconProps {
  name: string;
  Icon: IconType;
  color: string;
  x: number;
  y: number;
  counterRotation: ReturnType<typeof useTransform<number, number>>;
  index: number;
}
const TechIcon = memo(function TechIcon({ name, Icon, color, x, y, counterRotation, index }: TechIconProps) {
  return (
    <motion.div
      key={name}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      style={{
        x, y,
        rotate: counterRotation,
        width: 100, height: 100,
        marginLeft: -50, marginTop: -50,
      }}
      className="absolute flex flex-col items-center justify-center pointer-events-auto"
    >
      <motion.div
        whileHover={{ scale: 1.12, y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="relative flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl glass-panel backdrop-blur-xl group"
      >
        {/* Icon glow — stagger delay spread evenly so they don't all peak simultaneously */}
        <motion.div
          animate={{
            opacity: [0.35, 0.65, 0.35],
            scale:   [0.92, 1.08, 0.92],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            // Spread 14 icons across the 3 s cycle so CPU doesn't spike all at once
            delay: (index / TECHS.length) * 3,
          }}
          className="absolute -inset-2 rounded-2xl blur-xl pointer-events-none bg-[#A855F7]/50 group-hover:bg-[#A855F7]/80 group-hover:opacity-90 group-hover:scale-115 transition-all duration-300"
        />
        <Icon
          className="relative h-6 w-6 lg:h-8 lg:w-8 pointer-events-none"
          style={{ color }}
        />
      </motion.div>
      <span className="mt-3 text-[10px] lg:text-[12px] uppercase tracking-[0.25em] text-white/60 whitespace-nowrap pointer-events-none">
        {name}
      </span>
    </motion.div>
  );
});

export function TechOrbit() {
  const rotation        = useMotionValue(0);
  const counterRotation = useTransform(rotation, (r) => -r);

  // Flip true once the one-shot intro bloom finishes (inner: 1.0 s delay + 1.6 s = 2.6 s)
  const [glowReady, setGlowReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGlowReady(true), 2600);
    return () => clearTimeout(t);
  }, []);

  // Throttle rotation: max 0.5 deg/frame regardless of monitor refresh rate.
  // Prevents the orbit spinning too fast on 120/144 Hz displays (which also burns GPU).
  useAnimationFrame((_time, delta) => {
    const clamped = Math.min(delta, 32); // cap at ~30 fps equivalent contribution
    rotation.set(rotation.get() + clamped * 0.001);
  });

  // Pre-compute icon positions once — never recalculated during animation
  const iconPositions = useMemo(() =>
    TECHS.map((_, i) => {
      const angle  = (Math.PI * 2 * i) / TECHS.length - Math.PI / 2;
      const radius = 260;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    }),
  []);

  return (
    <div className="relative shrink-0 scale-100 flex items-center justify-center h-[600px] w-[600px] lg:h-[700px] lg:w-[700px] lg:translate-x-[35rem]" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>

      {/* Glow Center */}
      <div className="absolute pointer-events-none w-72 h-72 flex items-center justify-center">
        {/* Outer core glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={
            glowReady
              ? { opacity: [0.25, 0.45, 0.25], scale: [1, 1.18, 1] }
              : { opacity: 0.25, scale: 1 }
          }
          transition={
            glowReady
              ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
              : { duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }
          }
          className="absolute inset-0 rounded-full bg-[#A855F7] blur-3xl"
        />
        {/* Inner core glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.2 }}
          animate={
            glowReady
              ? { opacity: [0.15, 0.3, 0.15], scale: [1.15, 0.95, 1.15] }
              : { opacity: 0.15, scale: 1.15 }
          }
          transition={
            glowReady
              ? { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
              : { duration: 1.6, delay: 1.0, ease: [0.16, 1, 0.3, 1] }
          }
          className="absolute inset-6 rounded-full bg-[#C084FC] blur-3xl"
        />
      </div>

      {/* Interactive Rotating Container */}
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing rounded-full select-none"
        style={{ rotate: rotation, touchAction: "none" }}
        onPan={(_e, info) => rotation.set(rotation.get() + info.delta.x * 0.4 + info.delta.y * 0.4)}
      >
        <div className="absolute left-1/2 top-1/2 w-0 h-0">
          {TECHS.map((tech, i) => (
            <TechIcon
              key={tech.name}
              name={tech.name}
              Icon={tech.Icon}
              color={tech.color}
              x={iconPositions[i].x}
              y={iconPositions[i].y}
              counterRotation={counterRotation}
              index={i}
            />
          ))}
        </div>
      </motion.div>

      {/* Curved Interaction Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 2 }}
        className="absolute inset-0 pointer-events-none overflow-visible"
      >
        <svg viewBox="0 0 700 700" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]">
          <path
            id="orbit-text-path"
            fill="none"
            d="M 340, 670
               a 320,320 0 1,1 0,-640
               a 320,320 0 1,1 0,640"
          />
          <text className="text-[11px] uppercase tracking-[0.5em] fill-[#A855F7]/60 font-medium animate-pulse">
            <textPath href="#orbit-text-path" startOffset="25%" textAnchor="middle">
              • Drag to Interact •
            </textPath>
          </text>
        </svg>
      </motion.div>

    </div>
  );
}