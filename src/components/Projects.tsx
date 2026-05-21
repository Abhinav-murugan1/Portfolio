"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { useState, useEffect } from "react";
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const projects = [
  {
    index: "01",
    title: "Online Salon Management",
    description:
      "A web-based salon platform for appointment booking, customer management, and service promotions — built end-to-end with a custom PHP backend.",
    tech: ["PHP", "MySQL", "JavaScript", "HTML", "CSS"],
    image: `https://res.cloudinary.com/${cloudName}/image/upload/v1779326009/nebula-navigator/project-salon.png`,
    live: "#",
    github: "#",
    tag: "Full-Stack Web",
  },
  {
    index: "02",
    title: "Pet Adoption App",
    description:
      "Cross-platform pet adoption system with shelter management, role-based access, in-app communication, and clean dashboards.",
    tech: ["React Native", "TypeScript", "Firebase", "Expo"],
    image: `https://res.cloudinary.com/${cloudName}/image/upload/v1779326113/nebula-navigator/project-pet.png`,
    live: "#",
    github: "#",
    tag: "Mobile / Cross-Platform",
  },
  {
    index: "03",
    title: "Sankalpa Events",
    description:
      "Crafting Memorable Experiences — a beautifully designed event management website with interactive sections, animations, gallery, testimonials, and seamless contact options.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Cloudinary", "Prisma"],
    image: `https://res.cloudinary.com/${cloudName}/image/upload/v1779326218/Screenshot_2026-05-21_064639_wvnlvo.png`,
    live: "https://www.sankalpaevents.in/",
    github: "https://github.com/Abhinav-murugan1/sankalpa-events-master",
    tag: "Event Management",
  },
];

export function Projects() {
  const rotatingWords = [
    "an obsession with getting it right.",
    "a conversation between logic and design.",
    "a chance to build something that lasts.",
    "where creativity meets engineering.",
    "a story told in structure and style.",
  ];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 6200);
    return () => clearInterval(interval);
  }, []);
  return (
    <section id="projects" className="relative px-6 py-12 md:px-16 md:py-20 lg:px-24 overflow-hidden">

      {/* Corner glow accent */}
      <div className="pointer-events-none absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-[#a955ff]/5 blur-[120px]" />

      <div className="max-w-7xl mx-auto">

        {/* ── SECTION HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-12 bg-gradient-to-r from-[#a955ff] to-transparent" />
            <span className="text-xs uppercase tracking-[0.35em] text-[#a955ff]/80 font-semibold font-mono">Selected Work</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Featured <span className="text-gradient-neon-purple">Projects</span>
          </h2>
        </motion.div>

        {/* ── PORTRAIT CARD GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative flex flex-col rounded-none border border-white/6 bg-white/[0.02] overflow-hidden hover:border-[#a955ff]/25 transition-colors duration-500"
            >
              {/* ── PORTRAIT IMAGE (3:4 ratio) ── */}
              <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
                />
                {/* Gradient overlay — heavier at bottom for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5" />

                {/* Scanline texture */}
                <div
                  className="absolute inset-0 opacity-[0.035] pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.6) 2px, rgba(255,255,255,0.6) 3px)",
                  }}
                />

                {/* Corner notches */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#a955ff]/50 pointer-events-none" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#a955ff]/50 pointer-events-none" />

                {/* Index badge */}
                <div className="absolute top-4 right-12 font-mono text-[10px] text-white/25 tracking-widest select-none">
                  {p.index}
                </div>

                {/* Tag pill */}
                <div className="absolute bottom-4 left-4">
                  <span className="text-[9px] font-mono text-[#a955ff]/80 border border-[#a955ff]/20 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-none uppercase tracking-widest">
                    {p.tag}
                  </span>
                </div>

                {/* Action links — top-right, always visible */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <motion.a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="h-7 w-7 rounded-none bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors duration-200"
                    aria-label="Source code"
                  >
                    <Github className="h-3 w-3" />
                  </motion.a>
                  <motion.a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="h-7 w-7 rounded-none bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/50 hover:text-[#a955ff] hover:border-[#a955ff]/40 transition-colors duration-200"
                    aria-label="Live preview"
                  >
                    <ArrowUpRight className="h-3 w-3" />
                  </motion.a>
                </div>
              </div>

              {/* ── CONTENT BELOW IMAGE ── */}
              <div className="flex flex-col flex-1 p-4 gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-[#C084FC] transition-colors duration-400">
                  {p.title}
                </h3>

                <p className="text-[12.5px] leading-[1.75] text-muted-foreground/65 flex-1">
                  {p.description}
                </p>

                {/* Tech pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[9.5px] font-mono tracking-wider px-2 py-0.5 rounded-none bg-white/[0.03] text-white/35 border border-white/8"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Bottom rule accent */}
                <div className="h-[1px] w-0 bg-gradient-to-r from-[#a955ff] to-transparent group-hover:w-full transition-all duration-700 ease-out mt-1" />
              </div>
            </motion.article>
          ))}
        </div>

        {/* ── ROTATING QUOTE ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-24 flex items-center justify-center gap-4"
        >
          <p className="text-[13px] font-light tracking-wide text-white/30 font-mono text-center">
            Behind every project is{" "}
            <span className="relative inline-flex h-[1.3em] min-w-[320px] align-bottom justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 bottom-0 text-[#a955ff]/80 font-semibold"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
