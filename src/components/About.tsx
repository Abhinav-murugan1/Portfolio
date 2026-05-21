import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const portrait = `https://res.cloudinary.com/difrz6i2k/image/upload/v1779325006/Gemini_Generated_Image_1rfg961rfg961rfg_albyik.png`;

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Coordinate Motion Values for 3D Tilt (Photo Card)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth Spring Settings
  const springConfig = { damping: 30, stiffness: 220, mass: 0.6 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  // Map mouse positions to rotation degrees (Max tilt is +/- 12 degrees)
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate cursor distance relative to card center (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Independent 3D Mouse Tracking for Academic Foundation Card
  const academicRef = useRef<HTMLDivElement>(null);
  const academicMouseX = useMotionValue(0);
  const academicMouseY = useMotionValue(0);
  const academicXSpring = useSpring(academicMouseX, springConfig);
  const academicYSpring = useSpring(academicMouseY, springConfig);
  const academicRotateX = useTransform(academicYSpring, [-0.5, 0.5], [10, -10]);
  const academicRotateY = useTransform(academicXSpring, [-0.5, 0.5], [-10, 10]);

  const handleAcademicMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!academicRef.current) return;
    const rect = academicRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    academicMouseX.set(x);
    academicMouseY.set(y);
  };

  const handleAcademicMouseLeave = () => {
    academicMouseX.set(0);
    academicMouseY.set(0);
  };

  // Words to rotate (one of the text in purple, rotating the word, not color)
  const rotatingWords = ["logic", "precision", "interfaces", "systems"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="about"
      className="
        relative
        min-h-screen
        overflow-hidden
        snap-start
        px-6
        py-20
        md:px-16
        md:py-32
        lg:px-24
      "
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* LEFT COLUMN: PROFESSIONAL BIO */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-10 order-2 lg:order-1"
          >
            <div>
              {/* Refined Minimalistic My Profile Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="h-[2px] w-12 bg-gradient-to-r from-[#a955ff] to-transparent" />
                <span className="text-xs uppercase tracking-[0.35em] text-[#a955ff]/80 font-semibold font-mono">
                  My Profile
                </span>
              </div>

              <h2 className="mb-8 text-2xl font-bold leading-[1.25] text-gradient-silver md:text-3xl lg:text-4xl">
                Crafting digital experiences,
                <br />
                <span className="flex flex-wrap items-center">
                  <span>engineering&nbsp;</span>
                  <span className="relative inline-flex h-[1.45em] min-w-[160px] sm:min-w-[220px] md:min-w-[280px] text-left align-bottom">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={wordIndex}
                        initial={{ opacity: 0, y: 15, filter: "blur(10px)", scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                        exit={{ opacity: 0, y: -15, filter: "blur(10px)", scale: 1.08 }}
                        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-0 bottom-0 text-[#a955ff] font-extrabold bg-gradient-to-r from-[#a955ff] to-[#ea51ff] bg-clip-text text-transparent pb-2"
                      >
                        {rotatingWords[wordIndex]}.
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </h2>

              <p className="text-[13.5px] leading-[1.8] tracking-wide text-muted-foreground/80 md:text-[14.5px] max-w-2xl">
                I am a detail-obsessed developer currently pursuing a{" "}
                <strong className="text-white font-semibold">Master of Computer Applications (MCA)</strong>. 
                I specialize in bridging the gap between sophisticated creative designs and highly structured, 
                pixel-perfect software engineering.
              </p>
              
              <p className="mt-8 text-[13.5px] leading-[1.8] tracking-wide text-muted-foreground/75 md:text-[14.5px] max-w-2xl">
                I believe that modern applications should not only run flawlessly, but also engage users through 
                immersive visuals, fluid animations, and highly intuitive layouts. With extensive experience spanning 
                cross-platform mobile apps, end-to-end web architectures, and collaborative design pipelines, I bring 
                technical excellence and design sensitivity to every codebase I craft.
              </p>
            </div>

            {/* BCA Academic Highlight Card (Refined Floating Architectural Slab with Sharp Corners) */}
            <div
              ref={academicRef}
              onMouseMove={handleAcademicMouseMove}
              onMouseLeave={handleAcademicMouseLeave}
              className="relative w-full max-w-2xl cursor-pointer select-none group/academic"
              style={{ perspective: 1200 }}
            >
              <motion.div
                style={{
                  rotateX: academicRotateX,
                  rotateY: academicRotateY,
                  transformStyle: "preserve-3d",
                }}
                className="
                  relative
                  w-full
                  rounded-md
                  border
                  border-white/10
                  glass-panel
                  bg-card/20
                  p-6
                  md:p-8
                  flex
                  flex-col
                  transition-shadow
                  duration-500
                  group-hover/academic:shadow-[0_30px_70px_rgba(0,0,0,0.4)]
                "
              >
                {/* Elevated Text Content */}
                <motion.div
                  style={{
                    transform: "translateZ(35px)",
                  }}
                  className="space-y-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-white tracking-wide">
                      Academic Foundation
                    </h3>
                    <span className="text-[11px] font-mono text-[#a955ff] bg-[#a955ff]/10 border border-[#a955ff]/30 px-2.5 py-1 rounded-none uppercase tracking-wider">
                      MCA // Postgraduate
                    </span>
                  </div>
                  
                  <p className="text-[13.5px] leading-[1.8] tracking-wide text-muted-foreground/80 group-hover/academic:text-muted-foreground/95 transition-colors duration-300">
                    Currently pursuing a Master of Computer Applications (MCA), building a strong foundation in Data Structures, Database Management Systems, Object-Oriented Programming, Computer Networks, Operating Systems, and Software Engineering while applying them to scalable modern web development and pixel-perfect frontend engineering.
                  </p>

                  {/* Creative Underline Rail Accent */}
                  <div className="pt-2">
                    <div className="h-[2px] w-1/3 bg-gradient-to-r from-[#a955ff] to-transparent group-hover/academic:w-1/2 transition-all duration-500 ease-out" />
                  </div>
                </motion.div>

                {/* Corner Tech Notches for Sharp Corner Padding Box Style */}
                <motion.div
                  style={{ transform: "translateZ(50px)" }}
                  className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#a955ff]/40 pointer-events-none group-hover/academic:border-[#a955ff]/80 transition-colors duration-300"
                />
                <motion.div
                  style={{ transform: "translateZ(50px)" }}
                  className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#a955ff]/40 pointer-events-none group-hover/academic:border-[#a955ff]/80 transition-colors duration-300"
                />
                <motion.div
                  style={{ transform: "translateZ(50px)" }}
                  className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#a955ff]/40 pointer-events-none group-hover/academic:border-[#a955ff]/80 transition-colors duration-300"
                />
                <motion.div
                  style={{ transform: "translateZ(50px)" }}
                  className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#a955ff]/40 pointer-events-none group-hover/academic:border-[#a955ff]/80 transition-colors duration-300"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: MUSEUM-GRADE MULTI-LAYERED 3D PHOTO CARD */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="flex flex-col items-center gap-10 mt-10 lg:mt-16 lg:translate-x-6">
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full aspect-[4/5] max-w-[280px] sm:max-w-[340px] cursor-pointer select-none group/card -mb-4 -mt-16"
              style={{ perspective: 1200 }}
            >
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="
                  relative
                  w-full
                  h-full
                  rounded-none
                  border
                  border-white/10
                  glass-panel
                  bg-card/25
                  p-5
                  flex
                  flex-col
                  transition-shadow
                  duration-500
                  group-hover/card:shadow-[0_40px_100px_rgba(0,0,0,0.6)]
                "
              >
                {/* LAYER -1: Dynamic Ambient Backglow (Vibrant Neon Purple gradient,translateZ(-50px)) */}
                <motion.div
                  style={{
                    transform: "translateZ(-50px)",
                  }}
                  className="
                    absolute
                    -inset-4
                    rounded-none
                    bg-[linear-gradient(135deg,#a955ff,#ea51ff)]
                    opacity-15
                    blur-3xl
                    -z-10
                    transition-opacity
                    duration-500
                    group-hover/card:opacity-35
                  "
                />

                {/* LAYER 1: Parallax Elevated Portrait Image (translateZ(40px)) */}
                <motion.div
                  style={{
                    transform: "translateZ(40px)",
                    transformStyle: "preserve-3d",
                  }}
                  className="
                    relative
                    w-full
                    h-full
                    rounded-none
                    overflow-hidden
                    border
                    border-white/5
                    shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]
                  "
                >
                  <img
                    src={portrait}
                    alt="Abhinav"
                    className="
                      w-full
                      h-full
                      object-cover
                      scale-[1.08]
                      transition-transform
                      duration-500
                      group-hover/card:scale-110
                    "
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/25 to-transparent opacity-85" />
                </motion.div>

                {/* LAYER 2: Floating elegant metallic bezel border and label overlay (translateZ(60px)) */}
                <motion.div
                  style={{
                    transform: "translateZ(60px)",
                    pointerEvents: "none",
                  }}
                  className="
                    absolute
                    inset-5
                    border
                    border-white/10
                    rounded-none
                    flex
                    items-end
                    p-5
                  "
                >
                  <div className="text-[11px] font-mono text-white/80 tracking-[0.25em] bg-black/40 px-3.5 py-2 rounded-none border border-white/10 backdrop-blur-md uppercase">
                    Abhinav // Developer
                  </div>
                </motion.div>

                {/* LAYER 2: Elevated 3D Minimalistic Corner Notches (translateZ(65px)) */}
                <motion.div
                  style={{ transform: "translateZ(65px)" }}
                  className="absolute top-5 left-5 w-4 h-4 border-t border-l border-white/40 pointer-events-none"
                />
                <motion.div
                  style={{ transform: "translateZ(65px)" }}
                  className="absolute top-5 right-5 w-4 h-4 border-t border-r border-white/40 pointer-events-none"
                />
                <motion.div
                  style={{ transform: "translateZ(65px)" }}
                  className="absolute bottom-5 left-5 w-4 h-4 border-b border-l border-white/40 pointer-events-none"
                />
                <motion.div
                  style={{ transform: "translateZ(65px)" }}
                  className="absolute bottom-5 right-5 w-4 h-4 border-b border-r border-white/40 pointer-events-none"
                />
              </motion.div>
            </div>

            {/* Download CV Button */}
            <motion.a
              href="/cv.pdf"
              download
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover="hover"
              className="group relative flex items-center gap-3 px-6 py-3 text-[12px] font-mono uppercase tracking-[0.25em] text-[#C084FC] cursor-pointer select-none mt-8"
            >
              {/* Corner notches */}
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#a955ff]/60 group-hover:border-[#a955ff] transition-colors duration-300" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#a955ff]/60 group-hover:border-[#a955ff] transition-colors duration-300" />
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#a955ff]/60 group-hover:border-[#a955ff] transition-colors duration-300" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#a955ff]/60 group-hover:border-[#a955ff] transition-colors duration-300" />

              {/* Shimmer fill on hover */}
              <span className="absolute inset-0 bg-[#a955ff]/0 group-hover:bg-[#a955ff]/8 transition-colors duration-500" />

              {/* Animated bottom line */}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#a955ff] to-transparent group-hover:w-full transition-all duration-500 ease-out" />

              {/* Icon — animates down on hover */}
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 relative z-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{ hover: { y: [0, 3, 0], transition: { repeat: Infinity, duration: 1, ease: "easeInOut" } } }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </motion.svg>

              <span className="relative z-10">Download CV</span>
            </motion.a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
