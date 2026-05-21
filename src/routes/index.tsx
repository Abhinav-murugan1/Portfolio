import { createFileRoute } from "@tanstack/react-router";
import { ParticleField } from "../components/ParticleField";
import { SideNav } from "../components/SideNav";
import { SocialNav } from "../components/SocialNav"; 
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Projects } from "../components/Projects";
import { MyStack } from "../components/MyStack";
import { Contact } from "../components/Contact";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      {/* 1. Background Layer (z-0) - Fixed to the screen */}
      <ParticleField />
      
      {/* 2. Navigation Layer (Global Overlays) */}
      <SideNav />
      <SocialNav />

      {/* 3. Content Layer (z-10) - Scrolls over the background */}
      <main
        className="
          relative
          z-10
          h-screen
          w-full
          overflow-y-auto
          overflow-x-hidden
          scroll-smooth
          snap-y
          snap-proximity
          bg-transparent
          hide-scrollbar
        "
      >
        <section id="home" className="snap-start min-h-screen">
          <Hero />
        </section>

        <section id="about" className="snap-start min-h-screen">
          <About />
        </section>

        <section id="projects" className="snap-start min-h-screen">
          <Projects />
        </section>

        <section id="mystack" className="snap-start min-h-screen">
          <MyStack />
        </section>

        <section id="contact" className="snap-start min-h-screen">
          <Contact />
        </section>

        {/* Site-wide footer — always at page bottom */}
        <footer className="px-6 py-8 border-t border-white/5">
          <p className="text-center text-[10px] font-mono text-white/20 tracking-[0.3em] uppercase">
            © {new Date().getFullYear()} Abhinav Murugan — Crafted with care.
          </p>
        </footer>
      </main>
    </>
  );
}