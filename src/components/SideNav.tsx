"use client";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, User, Gamepad2, FolderGit2, Mail, Layers } from "lucide-react";
import { useEffect, useState } from "react";

const items = [
  { id: "home",       label: "Home",     icon: Home       },
  { id: "about",      label: "About",    icon: User       },
  { id: "controller", label: "Gaming",   icon: Gamepad2,  to: "/gaming" },
  { id: "projects",   label: "Projects", icon: FolderGit2 },
  { id: "mystack",    label: "Stack",    icon: Layers     },
  { id: "contact",    label: "Contact",  icon: Mail       },
];

export function SideNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const scroller = document.querySelector("main") as HTMLElement | null;
    if (!scroller) return;

    const onScroll = () => {
      const scrollerTop = scroller.getBoundingClientRect().top;
      const threshold = scroller.clientHeight / 2;
      let current = "home";
      for (const it of items) {
        if (it.to) continue;
        const el = document.getElementById(it.id);
        if (el) {
          const elTop = el.getBoundingClientRect().top - scrollerTop;
          if (elTop < threshold) current = it.id;
        }
      }
      setActive(current);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ---- DESKTOP SIDE NAV — always pinned left, never moves ---- */}
      <motion.nav
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-6 top-[30%] -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 items-start pointer-events-none"
      >
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.id;
          const isController = it.id === "controller";

          return (
            <motion.div
              key={it.id}
              initial="rest"
              whileHover="hover"
              variants={{ rest: { width: 44 }, hover: { width: 140 } }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="group relative flex h-[44px] shrink-0 items-center overflow-hidden rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:bg-white/10 cursor-pointer pointer-events-auto"
            >
              {/* Link overlay */}
              {it.to ? (
                <Link to={it.to} className="absolute inset-0 z-30" aria-label={it.label} />
              ) : (
                <a href={`#${it.id}`} className="absolute inset-0 z-30" aria-label={it.label} />
              )}

              {/* Active pill */}
              {isActive && !it.to && (
                <motion.div
                  layoutId="nav-pill-active"
                  className="absolute inset-0 rounded-full bg-[#a955ff]/10 ring-1 ring-[#a955ff]/40"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Hover gradient fill */}
              <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,#a955ff,#ea51ff)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,#a955ff,#ea51ff)] blur-md opacity-0 -z-10 transition-opacity duration-500 group-hover:opacity-40" />

              {/* Icon */}
              <div
                className={`absolute left-[13px] z-10 flex items-center justify-center transition-colors duration-300 group-hover:text-white ${
                  (isActive && !it.to) || isController
                    ? "text-[#ea51ff] drop-shadow-[0_0_8px_rgba(234,81,255,0.5)]"
                    : "text-muted-foreground"
                }`}
              >
                {isController && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="absolute h-5 w-5 rounded-full bg-[#a955ff]/50 blur-[6px] animate-pulse" />
                    <div className="absolute h-4 w-4 rounded-full border border-[#ea51ff]/60 animate-ping" style={{ animationDuration: "2.5s" }} />
                    <div className="absolute h-4 w-4 rounded-full border border-[#a955ff]/40 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "1.25s" }} />
                  </div>
                )}
                <Icon className="h-[18px] w-[18px] relative z-10" />
              </div>

              {/* Label (slides in on hover) */}
              <motion.span
                variants={{ rest: { opacity: 0, x: -5 }, hover: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.3 }}
                className="absolute left-[44px] text-white text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap pointer-events-none"
              >
                {it.label}
              </motion.span>
            </motion.div>
          );
        })}
      </motion.nav>

      {/* ---- MOBILE BOTTOM TAB BAR (visible only on < md) ---- */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="mx-4 mb-4 flex items-center justify-around rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-[0_-4px_30px_rgba(0,0,0,0.5)] px-2 py-3">
          {items.map((it) => {
            const Icon = it.icon;
            const isActive = active === it.id;
            const isController = it.id === "controller";

            const content = (
              <div className="relative flex flex-col items-center gap-1">
                {isActive && !it.to && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute -inset-2 rounded-xl bg-[#a955ff]/15"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <div className="relative">
                  {isController && (
                    <div className="absolute -inset-1 rounded-full bg-[#a955ff]/40 blur-[5px] animate-pulse pointer-events-none" />
                  )}
                  <Icon
                    className={`h-5 w-5 relative z-10 transition-colors duration-200 ${
                      (isActive && !it.to) || isController
                        ? "text-[#ea51ff] drop-shadow-[0_0_6px_rgba(234,81,255,0.8)]"
                        : "text-white/40"
                    }`}
                  />
                </div>
                <span className={`text-[9px] font-semibold tracking-wider uppercase transition-colors duration-200 ${
                  isActive && !it.to ? "text-[#a955ff]" : "text-white/30"
                }`}>
                  {it.label}
                </span>
              </div>
            );

            return (
              <div key={it.id} className="flex-1 flex justify-center">
                {it.to ? (
                  <Link to={it.to} aria-label={it.label} className="w-full flex justify-center py-1">
                    {content}
                  </Link>
                ) : (
                  <a href={`#${it.id}`} aria-label={it.label} className="w-full flex justify-center py-1">
                    {content}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}