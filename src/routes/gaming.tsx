"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Cloudinary Hosted Assets
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const ninja = `https://res.cloudinary.com/difrz6i2k/image/upload/v1779324749/nebula-navigator/download.jpg`;

const song = "https://res.cloudinary.com/difrz6i2k/video/upload/v1779327603/gojo_lrhujj.mp3";
const video = "https://res.cloudinary.com/difrz6i2k/video/upload/v1779327857/sukuna1_zhtjev.mp4";

import {
  IoLogoDiscord,
  IoLogoTwitch,
  IoLogoSteam,
  IoLogoYoutube,
  IoLogoInstagram,
  IoLogoGithub,
} from "react-icons/io5";

export const Route = createFileRoute("/gaming")({
  component: Gaming,
});

const socials = [
  { title: "Steam",     href: "https://steamcommunity.com/profiles/76561199232085514/",        Icon: IoLogoSteam     },
  { title: "Discord",   href: "https://discord.gg/SzWFWk73",        Icon: IoLogoDiscord   },
  { title: "Twitch",    href: "https://www.twitch.tv/n_1nj4_",                   Icon: IoLogoTwitch    },
  { title: "YouTube",   href: "https://www.youtube.com/@N_1NJ4",     Icon: IoLogoYoutube   },
  { title: "Instagram", href: "https://www.instagram.com/ninjavlr/", Icon: IoLogoInstagram },
  { title: "GitHub",    href: "https://github.com/Abhinav-murugan1/",Icon: IoLogoGithub    },
];

const BOOT_LINES = [
  "> INIT NODE_07 ........... OK",
  "> LINKING SATELLITES ..... OK",
  "> DECRYPTING IDENTITY .... OK",
  "> LOADING PLAYER_01 ...... NINJA",
];

function Gaming() {
  const audioRef           = useRef<HTMLAudioElement | null>(null);
  const visualizerAudioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef          = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef        = useRef<AudioContext | null>(null);
  const analyserRef        = useRef<AnalyserNode | null>(null);
  const sourceRef          = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef             = useRef<number | null>(null);
  const isGraphInitialized = useRef(false);

  const [intro, setIntro]       = useState(true);
  const [bootStep, setBootStep] = useState(0);
  const [muted, setMuted]       = useState(false);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setBootStep((s) => (s < BOOT_LINES.length ? s + 1 : s));
    }, 380);
    const finish = setTimeout(() => setIntro(false), 2600);
    return () => { clearInterval(stepInterval); clearTimeout(finish); };
  }, []);

  const initAudioGraph = () => {
    if (!visualizerAudioRef.current || isGraphInitialized.current) return;
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new Ctx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.82;
      const source = ctx.createMediaElementSource(visualizerAudioRef.current);
      source.connect(analyser);
      // Create a gain node with zero volume so we can analyze without hearing it
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0;
      analyser.connect(gainNode);
      gainNode.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
      isGraphInitialized.current = true;
    } catch (e) { console.error(e); }
  };

  const syncAndPlayAudio = async (shouldMute: boolean) => {
    if (!audioRef.current || !visualizerAudioRef.current) return;
    initAudioGraph();
    if (audioCtxRef.current?.state === "suspended") await audioCtxRef.current.resume();
    try {
      audioRef.current.muted = shouldMute;
      visualizerAudioRef.current.muted = shouldMute;
      audioRef.current.volume = 0.4;
      visualizerAudioRef.current.volume = 0.4;
      visualizerAudioRef.current.currentTime = audioRef.current.currentTime;
      if (audioRef.current.paused) await audioRef.current.play();
      if (visualizerAudioRef.current.paused) await visualizerAudioRef.current.play();
    } catch {}
  };

  const toggleMute = async () => {
    const next = !muted;
    setMuted(next);
    await syncAndPlayAudio(next);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) { rafRef.current = requestAnimationFrame(draw); return; }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = cssW, h = cssH;
    ctx.clearRect(0, 0, w, h);
    const bins = analyser.frequencyBinCount;
    const data = new Uint8Array(bins);
    analyser.getByteFrequencyData(data);
    const barCount = 42; 
    const step = Math.floor((bins * 0.45) / barCount); 
    const gapX = 4;
    const barW = (w - gapX * (barCount - 1)) / barCount;
    
    const segments = 5;
    const gapY = 3;
    const segmentH = (h - gapY * (segments - 1)) / segments;

    for (let i = 0; i < barCount; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) sum += data[i * step + j];
      const v = sum / step / 255;
      
      const scaledV = Math.pow(v, 1.2);
      const litCount = Math.floor(scaledV * (segments + 1));
      
      const x = i * (barW + gapX);

      for (let s = 0; s < segments; s++) {
        const y = h - (s + 1) * segmentH - s * gapY;
        
        if (s < litCount) {
          const ratio = s / (segments - 1 || 1);
          const r = Math.round(169 + (234 - 169) * ratio);
          const g = Math.round(85 + (81 - 85) * ratio);
          const b = 255;
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          
          ctx.shadowBlur = 5;
          ctx.shadowColor = `rgb(${r},${g},${b})`;
          ctx.fillRect(x, y, barW, segmentH);
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = "rgba(169,85,255,0.06)";
          ctx.fillRect(x, y, barW, segmentH);
        }
      }
    }
    rafRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    const attemptAutoplay = async () => {
      if (!audioRef.current || !visualizerAudioRef.current) return;
      initAudioGraph();
      if (audioCtxRef.current?.state === "suspended") await audioCtxRef.current.resume();
      try {
        audioRef.current.volume = 0.4;
        audioRef.current.muted = muted;
        visualizerAudioRef.current.volume = 0.4;
        visualizerAudioRef.current.muted = muted;
        await audioRef.current.play();
        visualizerAudioRef.current.currentTime = audioRef.current.currentTime;
        await visualizerAudioRef.current.play();
      } catch {
        const onInteraction = async () => {
          await syncAndPlayAudio(muted);
          window.removeEventListener("pointerdown", onInteraction);
          window.removeEventListener("keydown", onInteraction);
        };
        window.addEventListener("pointerdown", onInteraction);
        window.addEventListener("keydown", onInteraction);
      }
    };
    attemptAutoplay();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
        analyserRef.current = null;
        sourceRef.current = null;
        isGraphInitialized.current = false;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-black text-white"
      style={{ fontFamily: "'Rajdhani', system-ui, sans-serif" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .glitch { position: relative; }
        .glitch::before, .glitch::after {
          content: attr(data-text);
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%; opacity: 0.75;
        }
        .glitch::before {
          left: 2px; text-shadow: -2px 0 #ff00c1;
          clip: rect(44px,450px,56px,0);
          animation: ga 5s infinite linear alternate-reverse;
        }
        .glitch::after {
          left: -2px; text-shadow: -2px 0 #00fff9;
          clip: rect(44px,450px,56px,0);
          animation: gb 5s infinite linear alternate-reverse;
        }
        @keyframes ga {
          0%{clip:rect(21px,9999px,9px,0)} 20%{clip:rect(66px,9999px,66px,0)}
          40%{clip:rect(85px,9999px,5px,0)} 60%{clip:rect(10px,9999px,85px,0)}
          80%{clip:rect(40px,9999px,61px,0)} 100%{clip:rect(98px,9999px,41px,0)}
        }
        @keyframes gb {
          0%{clip:rect(65px,9999px,100px,0)} 20%{clip:rect(3px,9999px,4px,0)}
          40%{clip:rect(15px,9999px,15px,0)} 60%{clip:rect(85px,9999px,5px,0)}
          80%{clip:rect(40px,9999px,61px,0)} 100%{clip:rect(10px,9999px,41px,0)}
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}} />

      {/* Cloudinary Audio Tracks */}
      <audio ref={audioRef} src={song} loop preload="auto" crossOrigin="anonymous" />
      <audio ref={visualizerAudioRef} src={song} loop preload="auto" crossOrigin="anonymous" className="hidden" />

      {/* ── BOOT INTRO ── */}
      <AnimatePresence>
        {intro && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          >
            <div
              className="absolute inset-x-0 h-40 pointer-events-none"
              style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(169,85,255,0.06) 50%, transparent 100%)",
                animation: "scanline 1.8s ease-in-out infinite",
              }}
            />
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(169,85,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(169,85,255,0.3) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-40 h-40 mb-10"
            >
              <span className="absolute top-1/2 left-0 right-0 h-px bg-[#a955ff]/60" />
              <span className="absolute left-1/2 top-0 bottom-0 w-px bg-[#a955ff]/60" />
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-[#a955ff]/40"
              />
              <motion.span
                animate={{ rotate: -360 }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 border border-[#a955ff]/20 rounded-full"
              />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#a955ff]" />
            </motion.div>
            <div
              className="text-[10px] uppercase tracking-[0.35em] space-y-1.5 min-h-[120px]"
              style={{ fontFamily: "'Orbitron', sans-serif", color: "#a955ff", textShadow: "0 0 8px rgba(169,85,255,0.6)" }}
            >
              {BOOT_LINES.slice(0, bootStep).map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                  {line}
                </motion.div>
              ))}
              {bootStep < BOOT_LINES.length && (
                <span className="inline-block w-2 h-3 bg-[#a955ff] animate-pulse align-middle" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CLOUDINARY VIDEO BG ── */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-60"
        style={{ pointerEvents: 'none' }}
      >
        <source src={video} type="video/mp4" />
      </video>
      <div className="fixed inset-0 z-[1] bg-black/40 pointer-events-none" />
      <div className="fixed inset-0 z-[2] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.9) 100%)" }} />
      <div className="fixed inset-0 z-[2] pointer-events-none opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)" }} />

      {/* ── HEADER ── */}
      <header className="fixed top-0 inset-x-0 z-50 px-6 md:px-16 py-5 flex items-center justify-between">
        <Link
          to="/"
          className="group flex items-center gap-2 px-4 py-2 border border-[#a955ff]/30 bg-black/50 backdrop-blur-md text-[10px] uppercase tracking-[0.3em] hover:border-[#a955ff]/70 hover:bg-[#a955ff]/10 transition-all duration-300"
          style={{ fontFamily: "'Orbitron', sans-serif", color: "#a955ff", textShadow: "0 0 8px rgba(169,85,255,0.5)" }}
        >
          <ArrowLeft className="w-3 h-3" />
          Exit
        </Link>

        <div className="flex items-center gap-3">
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-2 border border-[#a955ff]/20 bg-black/50 backdrop-blur-md text-[9px] uppercase tracking-[0.3em]"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#a955ff", textShadow: "0 0 6px rgba(169,85,255,0.4)" }}
          >
            <span className="w-1.5 h-1.5 bg-[#a955ff] animate-pulse" />
            SYS · ONLINE
            <span className="text-white/20">|</span>
            NODE_07
          </div>
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 px-3 py-2 border border-[#a955ff]/20 bg-black/50 backdrop-blur-md text-[9px] uppercase tracking-[0.3em] hover:border-[#a955ff]/50 transition-all duration-300 cursor-pointer"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#a955ff", textShadow: "0 0 6px rgba(169,85,255,0.4)" }}
          >
            {muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            <span className="hidden sm:inline">{muted ? "Muted" : "Audio · On"}</span>
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-32 gap-8 w-full max-w-screen overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3 -mt-8 mb-4"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          <span className="h-px w-8 bg-[#a955ff]/50" />
          <span className="text-[9px] uppercase tracking-[0.5em]" style={{ color: "#a955ff", textShadow: "0 0 8px rgba(169,85,255,0.6)" }}>
            // PLAYER_01 :: GAME_ROOM
          </span>
          <span className="h-px w-8 bg-[#a955ff]/50" />
        </motion.div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 border border-[#a955ff]/50 shadow-[0_0_15px_rgba(169,85,255,0.3)] pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-[#a955ff]/30 shadow-[0_0_10px_rgba(169,85,255,0.2)] pointer-events-none"
          />
          <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#a955ff]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#a955ff]" />
          <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#a955ff]" />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#a955ff]" />
          <span className="absolute -bottom-2 -right-2 w-3 h-3 bg-[#a955ff] animate-pulse" />

          <div className="relative shrink-0 w-48 h-48 sm:w-56 sm:h-56 overflow-hidden border border-[#a955ff]/30 bg-black">
            <img src={ninja} alt="NINJA" className="w-full h-full object-cover" />
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(169,85,255,0.4) 0px, rgba(169,85,255,0.4) 1px, transparent 1px, transparent 3px)" }}
            />
            <div className="absolute inset-0 bg-[#a955ff]/10 pointer-events-none mix-blend-color" />
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          data-text="N I N J A"
          className="glitch mt-6 text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-[0.2em] select-none"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: "#a955ff",
            textShadow: "0 0 20px rgba(169,85,255,0.8), 0 0 40px rgba(169,85,255,0.4), 0 0 80px rgba(169,85,255,0.2)",
          }}
        >
          N I N J A
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="text-[10px] uppercase tracking-[0.5em] text-white/40"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Pick a portal · Jack in
        </motion.p>

        {/* Social links */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-5xl mx-auto">
            {socials.map(({ title, href, Icon }, idx) => (
              <motion.li
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="group relative"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={title}
                  className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 border border-[#a955ff]/20 bg-black/50 backdrop-blur-md hover:border-[#a955ff]/60 hover:bg-[#a955ff]/10 transition-all duration-300"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#a955ff]/0 group-hover:border-[#a955ff] transition-colors duration-300" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#a955ff]/0 group-hover:border-[#a955ff] transition-colors duration-300" />
                  <Icon
                    className="text-xl text-[#a955ff]/60 group-hover:text-[#a955ff] transition-colors duration-300"
                    style={{ filter: "drop-shadow(0 0 4px rgba(169,85,255,0.4))" }}
                  />
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] text-white/40 group-hover:text-[#a955ff] transition-colors duration-300"
                  >
                    {title}
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      </section>

      {/* ── VISUALIZER BAR (fixed bottom) ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8 }}
        className="fixed bottom-0 inset-x-0 z-40 px-6 md:px-16 pb-5 pointer-events-none"
      >
        <div className="mx-auto max-w-3xl border border-[#a955ff]/20 bg-black/70 backdrop-blur-md">
          <div
            className="flex items-center justify-between border-b border-[#a955ff]/10 px-4 py-2 text-[9px] uppercase tracking-[0.35em]"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#a955ff", textShadow: "0 0 6px rgba(169,85,255,0.4)" }}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#a955ff] animate-pulse" />
              <span>Now Playing</span>
              <span className="text-white/20">|</span>
              <span className="text-white/50">IMMORTAL.MP3</span>
            </div>
            <span className="hidden sm:block text-white/30">CH_01 · 44.1kHz</span>
          </div>
          <div className="px-4 py-3">
            <canvas ref={canvasRef} className="h-12 w-full block" />
          </div>
        </div>
      </motion.div>
    </main>
  );
}