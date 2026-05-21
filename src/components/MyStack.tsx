"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  SiReact, SiTypescript, SiJavascript, SiHtml5, SiCss,
  SiTailwindcss, SiFirebase, SiPhp, SiMysql, SiFigma,
  SiGit, SiGithub, SiExpo,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

const categories = [
  {
    label: "Languages",
    items: [
      { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
      { name: "PHP",        Icon: SiPhp,        color: "#777BB4" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "React",    Icon: SiReact,      color: "#61DAFB" },
      { name: "HTML5",    Icon: SiHtml5,      color: "#E34F26" },
      { name: "CSS3",     Icon: SiCss,        color: "#1572B6" },
      { name: "Tailwind", Icon: SiTailwindcss,color: "#38BDF8" },
    ],
  },
  {
    label: "Mobile",
    items: [
      { name: "Expo", Icon: SiExpo, color: "#ffffff" },
    ],
  },
  {
    label: "Databases & Cloud",
    items: [
      { name: "MySQL",    Icon: SiMysql,    color: "#4479A1" },
      { name: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
    ],
  },
  {
    label: "Tools & Design",
    items: [
      { name: "Git",     Icon: SiGit,    color: "#F05032" },
      { name: "GitHub",  Icon: SiGithub, color: "#ffffff" },
      { name: "Figma",   Icon: SiFigma,  color: "#F24E1E" },
      { name: "VS Code", Icon: VscVscode,color: "#007ACC" },
    ],
  },
];

const allItems = categories.flatMap((c) => c.items);

// One full rotation duration in ms
const SPIN_MS = 8000;
// Crossfade overlap duration in ms
const FADE_MS = 800;

function GlowBorder({ spinMs }: { spinMs: number }) {
  return (
    <>
      <style>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes borderSpin {
          from { --angle: 0deg; }
          to   { --angle: 360deg; }
        }
        .glow-spin {
          animation: borderSpin ${spinMs}ms linear forwards;
          background: conic-gradient(
            from var(--angle),
            transparent 0%,
            transparent 65%,
            rgba(169, 85, 255, 0.08) 75%,
            rgba(169, 85, 255, 0.4) 87%,
            rgba(234, 81, 255, 0.85) 94%,
            rgba(234, 81, 255, 1) 100%
          );
          border-radius: 2px;
        }
      `}</style>
      {/* Blurred glow halo */}
      <div
        className="glow-spin absolute -inset-[1px] rounded-none pointer-events-none"
        style={{
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
          filter: "blur(3px)",
          opacity: 0.7,
        }}
      />
      {/* Sharp crisp line on top */}
      <div
        className="glow-spin absolute -inset-[1px] rounded-none pointer-events-none"
        style={{
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />
    </>
  );
}

export function MyStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fadingIndex, setFadingIndex] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function advance() {
      setActiveIndex((prev) => {
        const next = (prev + 1) % allItems.length;
        // Start fading out current pill FADE_MS before switching
        setFadingIndex(prev);
        setTimeout(() => setFadingIndex(null), FADE_MS);
        return next;
      });
      timerRef.current = setTimeout(advance, SPIN_MS);
    }

    timerRef.current = setTimeout(advance, SPIN_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  let globalIdx = 0;
  const indexMap: number[][] = categories.map((cat) =>
    cat.items.map(() => globalIdx++)
  );

  return (
    <section
      id="mystack"
      className="relative min-h-screen px-6 py-10 md:px-16 md:py-16 lg:px-24 border-t border-white/5 overflow-hidden"
    >
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#a955ff]/5 blur-[120px]" />

      <div className="mx-auto max-w-5xl">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-12 bg-gradient-to-r from-[#a955ff] to-transparent" />
            <span className="text-xs uppercase tracking-[0.35em] text-[#a955ff]/80 font-semibold font-mono">
              Expertise
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            My <span className="text-gradient-neon-purple">Stack</span>
          </h2>
          <p className="mt-3 max-w-xl text-xs text-muted-foreground/70">
            Tools and technologies I work with across the full development lifecycle.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-col gap-10">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: ci * 0.08 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#a955ff]/60">
                  {cat.label}
                </span>
                <span className="flex-1 h-[1px] bg-white/5" />
              </div>

              {/* Tech pills */}
              <div className="flex flex-wrap gap-3 flex-1">
                {cat.items.map((tech, ti) => {
                  const gIdx = indexMap[ci][ti];
                  const isActive = activeIndex === gIdx;
                  const isFading = fadingIndex === gIdx;

                  return (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: ci * 0.08 + ti * 0.05 }}
                      whileHover={{ y: -3 }}
                      className="group relative flex items-center gap-3 px-5 py-3.5 rounded-none border border-white/6 bg-white/[0.02] hover:border-[#a955ff]/20 hover:bg-[#a955ff]/5 transition-all duration-300 cursor-default"
                    >
                      {/* Active — fades in, spins full circle */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            key={`active-${gIdx}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: FADE_MS / 1000 } }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 rounded-none pointer-events-none"
                          >
                            <GlowBorder spinMs={SPIN_MS} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Fading out — crossfades with the next pill's fade-in */}
                      <AnimatePresence>
                        {isFading && (
                          <motion.div
                            key={`fading-${gIdx}`}
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: FADE_MS / 1000, ease: "easeOut" }}
                            className="absolute inset-0 rounded-none pointer-events-none"
                          >
                            <GlowBorder spinMs={SPIN_MS} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="relative flex items-center justify-center">
                        <tech.Icon
                          className="relative h-6 w-6 transition-colors duration-300"
                          style={{ color: tech.color }}
                        />
                      </div>
                      <span className="text-[13px] font-mono tracking-wider text-white/60 group-hover:text-white/90 transition-colors duration-300 uppercase">
                        {tech.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
