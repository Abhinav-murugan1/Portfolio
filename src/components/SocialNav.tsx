"use client";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { useEffect, useState } from "react";

const socials = [
  { id: "github", label: "GitHub", icon: Github, href: "https://github.com/Abhinav-murugan1" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/abhinav-murugan" },
  { id: "instagram", label: "Instagram", icon: Instagram, href: "https://instagram.com/abhinav_murugan" },
  { id: "mail", label: "Email", icon: Mail, href: "mailto:abhinavmurugan848@gmail.com" },
];

export function SocialNav() {
  const scrollY = useMotionValue(0);
  const [vh, setVh] = useState(1000);
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    setVh(window.innerHeight);
    const scrollContainer = document.querySelector("main") || window;

    const handleScroll = (e: Event) => {
      const currentScroll = scrollContainer instanceof Window 
        ? window.scrollY 
        : (e.target as HTMLElement).scrollTop;
      
      scrollY.set(currentScroll);
      setIsVertical(currentScroll > window.innerHeight * 0.2);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll({ target: scrollContainer } as any); 

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  // 1. Calculate raw progress (0 to 1)
  const rawProgress = useTransform(scrollY, (y) => {
    const maxScroll = Math.max(vh * 0.4, 100); 
    return Math.min(Math.max(y / maxScroll, 0), 1);
  });

  // 2. OPTIMIZATION: Wrap the raw progress in a physics spring.
  // This absorbs harsh mouse-wheel ticks and turns them into a liquid glide.
  const progress = useSpring(rawProgress, { 
    stiffness: 150, 
    damping: 25, 
    mass: 0.5 
  });

  const containerLeft = useTransform(progress, [0, 1], ["430%", "28px"]);
  const containerTop = useTransform(progress, [0, 1], ["calc(72vh + 100px)", "75%"]);
  const containerX = useTransform(progress, [0, 1], ["-50%", "0%"]);
  const containerY = useTransform(progress, [0, 1], ["0%", "-50%"]);

  return (
    <motion.nav
      // OPTIMIZATION: Add layout to the container so the bounding box resizes smoothly
      layout
      style={{
        left: containerLeft,
        top: containerTop,
        x: containerX,
        y: containerY,
      }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.15, delayChildren: 0.6 }
        }
      }}
      initial="hidden"
      animate="visible"
      className={`fixed z-40 hidden lg:flex pointer-events-none ${isVertical ? "flex-col" : "flex-row"} gap-4`}
    >
      {socials.map((it) => {
        const Icon = it.icon;

        return (
          <motion.a
            key={it.id}
            href={it.href}
            target="_blank"
            rel="noreferrer"
            // OPTIMIZATION: Add layout so the flip from Row to Column animates smoothly
            layout
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { type: "spring", stiffness: 400, damping: 30 }
              }
            }}
            className="group relative flex h-[44px] w-[44px] shrink-0 items-center overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:w-[130px] hover:bg-white/10 cursor-pointer pointer-events-auto transition-[width,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,#a955ff,#ea51ff)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,#a955ff,#ea51ff)] blur-md opacity-0 -z-10 transition-opacity duration-700 group-hover:opacity-50" />

            <span className={`absolute left-[13px] z-10 flex items-center justify-center transition-colors duration-500 ${isVertical ? "text-muted-foreground" : "text-[#a955ff]"} group-hover:text-white`}>
              <Icon className="h-4 w-4" />
            </span>

            <span className="absolute left-[44px] text-white uppercase font-bold tracking-[0.15em] text-[10px] whitespace-nowrap pointer-events-none opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:delay-100">
              {it.label}
            </span>
          </motion.a>
        );
      })}
    </motion.nav>
  );
}