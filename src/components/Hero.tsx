"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { TechOrbit } from "./TechOrbit";

export function Hero() {
  return (
    <section
      id="home"
      className="
        relative
        min-h-screen
        snap-start
        overflow-hidden
        px-6
        md:px-16
        lg:px-24
        pt-24
        md:pt-0
      "
    >
      <style dangerouslySetInnerHTML={{__html: `
        .custom-vortex-font {
          font-family: 'Syncopate', sans-serif !important; 
        }

        .smooth-layout-btn {
          /* Matched the bezier curve exactly */
          transition: width 1000ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1000ms ease;
          will-change: width, transform;
          transform: translateZ(0); 
        }
      `}} />

      <div
        className="
          relative
          z-10
          mx-auto
          grid
          min-h-screen
          max-w-7xl
          grid-cols-1
          items-center
          gap-8
          lg:gap-12
          lg:grid-cols-2
          pb-24
          md:pb-0
        "
      >
        {/* LEFT SIDE */}
        <div className="space-y-6 md:space-y-8 text-center lg:text-left pb-20 md:pb-0">
          
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="custom-vortex-font leading-[0.85] tracking-tight font-black"
          >
            <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] text-gradient-silver">
              ABHINAV
            </span>
            <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] text-gradient-neon-purple pt-1">
              MURUGAN
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="max-w-xl mx-auto lg:mx-0 text-[13.5px] leading-[1.8] tracking-wide text-muted-foreground/90 md:text-[14.5px]"
          >
            MCA student crafting modern digital experiences at the intersection of design and code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-6 items-center justify-center lg:justify-start pt-4"
          >
            {/* CTA 1: View Projects — variant propagation from parent to children */}
            <motion.a
              href="#projects"
              initial="rest"
              whileHover="hovered"
              animate="rest"
              variants={{ rest: { width: 56 }, hovered: { width: 190 } }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative h-[56px] bg-white/5 border border-white/10 rounded-full flex items-center justify-center overflow-hidden cursor-pointer select-none"
              style={{ minWidth: 56 }}
            >
              {/* Gradient fill */}
              <motion.span
                variants={{ rest: { opacity: 0 }, hovered: { opacity: 1 } }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,#a955ff,#ea51ff)]"
              />
              {/* Glow */}
              <motion.span
                variants={{ rest: { opacity: 0 }, hovered: { opacity: 0.55 } }}
                transition={{ duration: 0.35 }}
                className="absolute top-2 inset-x-4 h-full rounded-full bg-[linear-gradient(45deg,#a955ff,#ea51ff)] blur-xl -z-10"
              />
              {/* Icon fades out */}
              <motion.span
                variants={{ rest: { scale: 1, opacity: 1 }, hovered: { scale: 0, opacity: 0 } }}
                transition={{ duration: 0.18 }}
                className="absolute z-10 flex items-center justify-center text-purple-400"
              >
                <ArrowUpRight className="h-5 w-5" />
              </motion.span>
              {/* Label fades in */}
              <motion.span
                variants={{ rest: { scale: 0.7, opacity: 0 }, hovered: { scale: 1, opacity: 1 } }}
                transition={{ duration: 0.28, delay: 0.06 }}
                className="absolute z-10 text-white uppercase font-bold tracking-[0.2em] text-xs whitespace-nowrap pointer-events-none"
              >
                View Projects
              </motion.span>
            </motion.a>

            {/* CTA 2: Get In Touch */}
            <motion.a
              href="#contact"
              initial="rest"
              whileHover="hovered"
              animate="rest"
              variants={{ rest: { width: 56 }, hovered: { width: 190 } }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative h-[56px] bg-transparent border border-white/20 rounded-full flex items-center justify-center overflow-hidden cursor-pointer select-none"
              style={{ minWidth: 56 }}
            >
              <motion.span
                variants={{ rest: { opacity: 0 }, hovered: { opacity: 1 } }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,#ea51ff,#a955ff)]"
              />
              <motion.span
                variants={{ rest: { opacity: 0 }, hovered: { opacity: 0.55 } }}
                transition={{ duration: 0.35 }}
                className="absolute top-2 inset-x-4 h-full rounded-full bg-[linear-gradient(45deg,#ea51ff,#a955ff)] blur-xl -z-10"
              />
              <motion.span
                variants={{ rest: { scale: 1, opacity: 1 }, hovered: { scale: 0, opacity: 0 } }}
                transition={{ duration: 0.18 }}
                className="absolute z-10 flex items-center justify-center text-white/70"
              >
                <MessageSquare className="h-5 w-5" />
              </motion.span>
              <motion.span
                variants={{ rest: { scale: 0.7, opacity: 0 }, hovered: { scale: 1, opacity: 1 } }}
                transition={{ duration: 0.28, delay: 0.06 }}
                className="absolute z-10 text-white uppercase font-bold tracking-[0.2em] text-xs whitespace-nowrap pointer-events-none"
              >
                Get In Touch
              </motion.span>
            </motion.a>
          </motion.div>

        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center justify-center">
          <TechOrbit />
        </div>
      </div>
    </section>
  );
}