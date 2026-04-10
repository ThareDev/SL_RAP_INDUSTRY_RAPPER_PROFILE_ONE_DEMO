"use client";

import Image from "next/image";
import artist from "@/public/artist.jpg";
import { useEffect, useRef, useState, ReactNode, JSX } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  animate,
  Variants,
  MotionValue,
} from "framer-motion";

/* ─────────────────────────────────────────
   Hook: normalised pointer position [-1, 1]
───────────────────────────────────────── */
function usePointer(): { x: MotionValue<number>; y: MotionValue<number> } {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: PointerEvent): void => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      x.set((e.clientX - cx) / cx);
      y.set((e.clientY - cy) / cy);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return { x, y };
}

/* ─────────────────────────────────────────
   Animated number counter
───────────────────────────────────────── */
interface CounterProps {
  target: number;
  decimals?: number;
}

function Counter({ target, decimals = 0 }: CounterProps): JSX.Element {
  const [val, setVal] = useState<string>("0");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      animate(0, target, {
        duration: 1.6,
        ease: "easeOut",
        onUpdate: (v: number) =>
          setVal(decimals > 0 ? v.toFixed(decimals) : String(Math.round(v))),
      });
      obs.disconnect();
    });

    obs.observe(el);
    return () => obs.disconnect();
  }, [target, decimals]);

  return <span ref={ref}>{val}</span>;
}

/* ─────────────────────────────────────────
   Stat item
───────────────────────────────────────── */
interface StatItem {
  target: number;
  decimals: number;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { target: 2.4, decimals: 1, suffix: "M", label: "Monthly Listeners" },
  { target: 18,  decimals: 0, suffix: "+", label: "Shows This Year"  },
  { target: 3,   decimals: 0, suffix: "",  label: "Albums Dropped"   },
];

/* ─────────────────────────────────────────
   Particle dots
───────────────────────────────────────── */
const PARTICLE_COUNT = 6;

/* ─────────────────────────────────────────
   Framer Motion variants
───────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.3 },
  },
};

const slideUp: Variants = {
  hidden: { y: 60, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
};

const prabaVariants: Variants = {
  hidden: { rotateX: -90, opacity: 0, y: 20 },
  show: {
    rotateX: 0,
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─────────────────────────────────────────
   Spring config
───────────────────────────────────────── */
const SPRING = { stiffness: 60, damping: 20 };

/* ─────────────────────────────────────────
   Hero
───────────────────────────────────────── */
export default function Hero(): JSX.Element {
  const { x: px, y: py } = usePointer();

  /* 3-D tilt for artist image card */
  const rx = useSpring(useTransform(py, [-1, 1], [8, -8]),   SPRING);
  const ry = useSpring(useTransform(px, [-1, 1], [-10, 10]), SPRING);

  /* Parallax layers */
  const imgX = useSpring(useTransform(px, [-1, 1], [-18, 18]), SPRING);
  const imgY = useSpring(useTransform(py, [-1, 1], [-10, 10]), SPRING);
  const bgX  = useSpring(useTransform(px, [-1, 1], [12, -12]), SPRING);
  const bgY  = useSpring(useTransform(py, [-1, 1], [6, -6]),   SPRING);
  const fgX  = useSpring(useTransform(px, [-1, 1], [-6, 6]),   SPRING);

  return (
    <section
      className="relative min-h-screen flex items-center lg:items-end overflow-hidden bg-black"
      id="home"
      style={{ perspective: "1200px" }}
    >
      {/* ── global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow+Condensed:wght@400;600&display=swap');

        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 34px;
          background: #cc0000; color: #fff;
          font-family: 'Oswald', Impact, sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          text-decoration: none; border: none; cursor: pointer;
          position: relative; overflow: hidden;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
          transition: background 0.2s;
        }
        .hero-btn-primary::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(120deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity:0; transition: opacity 0.3s;
        }
        .hero-btn-primary:hover { background:#a80000; }
        .hero-btn-primary:hover::before { opacity:1; }

        .hero-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 34px;
          background: transparent; color: #fff;
          font-family: 'Oswald', Impact, sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          text-decoration: none; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.3);
          clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
          transition: border-color 0.25s, color 0.25s;
        }
        .hero-btn-outline:hover { border-color: #cc0000; color: #cc0000; }

        .scanlines {
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px
          );
        }

        .glitch { position: relative; display: inline-block; }
        .glitch:hover::before,
        .glitch:hover::after {
          content: attr(data-text);
          position: absolute; top: 0; left: 0;
          font-family: inherit; font-size: inherit;
          font-weight: inherit; letter-spacing: inherit;
          text-transform: inherit; line-height: inherit;
        }
        .glitch:hover::before {
          color: #cc0000;
          clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
          animation: glitch-a 0.3s steps(2) infinite;
        }
        .glitch:hover::after {
          color: #00cccc;
          clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
          animation: glitch-b 0.3s steps(2) infinite;
        }
        @keyframes glitch-a {
          0%,100% { transform: translateX(-3px); }
          50%      { transform: translateX( 3px); }
        }
        @keyframes glitch-b {
          0%,100% { transform: translateX( 3px); }
          50%      { transform: translateX(-3px); }
        }

        .chain-line {
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, #cc0000, transparent);
          margin: 0 auto;
        }

        @keyframes pulse-vline {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.7;  }
        }
        .vline-pulse { animation: pulse-vline 3s ease-in-out infinite; }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>

      {/* ── scanlines ── */}
      <div className="scanlines absolute inset-0 pointer-events-none z-0" />

      {/* ── background parallax layer ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ x: bgX, y: bgY }}
      >
        {/* red corner triangle */}
        <div
          style={{
            position: "absolute", top: 0, left: 0,
            width: "40vw", height: "40vw", maxWidth: 420, maxHeight: 420,
            background: "rgba(160,0,0,0.22)",
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
          }}
        />

        {/* dot grid */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(rgba(200,0,0,0.12) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            maskImage: "radial-gradient(ellipse 70% 70% at 80% 50%, black 0%, transparent 100%)",
          }}
        />

        {/* watermark text */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "Impact, 'Arial Black', sans-serif",
              fontSize: "clamp(90px, 20vw, 320px)",
              fontWeight: 900, lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.05)",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            LIL ROME
          </span>
        </div>
      </motion.div>

      {/* ── pulsing vertical accent line (desktop only) ── */}
      <div
        className="vline-pulse absolute left-[13%] top-0 bottom-0 w-px z-10 pointer-events-none hidden lg:block"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(200,0,0,0.55), transparent)" }}
      />

      {/* ── 3-D artist image card ── */}
      <motion.div
        className="absolute inset-0 flex justify-end items-stretch z-[5] pointer-events-none"
        style={{ x: imgX, y: imgY }}
      >
        <motion.div
          className="relative w-[60%] lg:w-[50%] h-full"
          style={{
            rotateX: rx,
            rotateY: ry,
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
        >
          {/* left edge fade */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to right, black 0%, rgba(0,0,0,0.4) 30%, transparent 60%)",
            }}
          />
          {/* bottom fade — mobile */}
          <div
            className="absolute inset-0 z-10 lg:hidden"
            style={{
              background:
                "linear-gradient(to top, black 0%, black 25%, transparent 60%)",
            }}
          />
          {/* bottom fade — desktop */}
          <div
            className="absolute inset-0 z-10 hidden lg:block"
            style={{
              background: "linear-gradient(to top, black 0%, transparent 50%)",
            }}
          />
          {/* red colour cast */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "radial-gradient(ellipse at 65% 55%, rgba(140,0,0,0.25) 0%, transparent 60%)",
            }}
          />
          {/* shimmer sweep */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 6s linear infinite",
            }}
          />
          {/* inner glow */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              boxShadow:
                "inset -2px 0 40px rgba(200,0,0,0.15), inset 0 -2px 40px rgba(0,0,0,0.5)",
            }}
          />

          <Image
            src={artist}
            alt="Lil Rome Praba"
            fill
            className="object-cover object-top"
            style={{
              filter: "contrast(1.2) brightness(0.75) saturate(0.4)",
              mixBlendMode: "luminosity",
            }}
            priority
          />

          {/* floating LIVE badge — desktop only */}
          <motion.div
            className="hidden lg:flex absolute bottom-[18%] right-6 z-30 flex-col items-center"
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                width: 72, height: 72, borderRadius: "50%",
                border: "2px solid #cc0000",
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(4px)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 24px rgba(200,0,0,0.4)",
              }}
            >
              <span
                style={{
                  fontFamily: "Impact, sans-serif",
                  fontSize: 11, color: "#cc0000", letterSpacing: "0.1em",
                }}
              >
                LIVE
              </span>
              <span
                style={{
                  fontFamily: "Impact, sans-serif",
                  fontSize: 18, color: "#fff", lineHeight: 1,
                }}
              >
                2026
              </span>
            </div>
            <div className="chain-line" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 right-0 h-px z-30 pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, #cc0000, transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {/* ── bottom red bar ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-30 pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, #cc0000, transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
      />

      {/* ── main content ── */}
      <motion.div
        className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 pt-24 pb-12 lg:pt-0 lg:pb-24"
        style={{ x: fgX }}
      >
        <motion.div
          className="max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* ── label row ── */}
          <motion.div className="flex items-center gap-3 mb-3" variants={fadeIn}>
            <motion.div
              style={{ width: 32, height: 2, background: "#cc0000", originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <span
              style={{
                fontFamily: "'Oswald', Impact, sans-serif",
                fontSize: 10, letterSpacing: "0.32em",
                color: "#cc0000", textTransform: "uppercase",
              }}
            >
              Official Artist Page
            </span>
          </motion.div>

          {/* ── LIL ROME (glitch on hover) ── */}
          <div className="overflow-hidden mb-1">
            <motion.h1
              variants={slideUp}
              data-text="LIL ROME"
              className="glitch"
              style={{
                fontFamily: "Impact, 'Arial Black', Oswald, sans-serif",
                fontSize: "clamp(52px, 11vw, 160px)",
                fontWeight: 900, lineHeight: 0.88,
                color: "#fff", letterSpacing: "-0.02em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              LIL ROME
            </motion.h1>
          </div>

          {/* ── PRABA (3-D flip-in) ── */}
          <div className="overflow-hidden mb-6" style={{ perspective: 600 }}>
            <motion.h2
              variants={prabaVariants}
              style={{
                fontFamily: "Impact, 'Arial Black', Oswald, sans-serif",
                fontSize: "clamp(44px, 9vw, 128px)",
                fontWeight: 900, lineHeight: 0.88,
                color: "transparent",
                WebkitTextStroke: "2px #cc0000",
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                transformOrigin: "bottom center",
                display: "inline-block",
                textShadow: "4px 4px 0 rgba(150,0,0,0.3)",
                margin: 0,
              }}
            >
              PRABA
            </motion.h2>
          </div>

          {/* ── tagline ── */}
          <motion.p
            variants={slideUp}
            className="mb-8 max-w-xs sm:max-w-sm"
            style={{
              fontFamily: "'Barlow Condensed', Oswald, sans-serif",
              fontSize: "clamp(13px, 2vw, 16px)",
              color: "rgba(170,170,170,0.85)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              lineHeight: 1.65,
              margin: "0 0 2rem",
            }}
          >
            Straight from the streets.{" "}
            <span style={{ color: "#fff" }}>Every bar unfiltered</span>,{" "}
            <span style={{ color: "#cc0000" }}>unapologetic</span>.
          </motion.p>

          {/* ── CTAs ── */}
          <motion.div
            className="flex flex-wrap gap-3 sm:gap-4 items-center mb-10 sm:mb-12"
            variants={slideUp}
          >
            <motion.a
              href="#music"
              className="hero-btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span aria-hidden="true">▶</span>
              Listen Now
            </motion.a>
            <motion.a
              href="#shows"
              className="hero-btn-outline"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Tour Dates
            </motion.a>
          </motion.div>

          {/* ── stats ── */}
          <motion.div className="flex gap-6 sm:gap-10 lg:gap-14" variants={fadeIn}>
            {STATS.map(({ target, decimals, suffix, label }) => (
              <motion.div
                key={label}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div
                  style={{
                    fontFamily: "Impact, Oswald, sans-serif",
                    fontSize: "clamp(26px, 4vw, 42px)",
                    fontWeight: 900,
                    color: "#d4a843",
                    lineHeight: 1,
                  }}
                >
                  <Counter target={target} decimals={decimals} />
                  {suffix}
                </div>
                <div
                  style={{
                    fontFamily: "Oswald, sans-serif",
                    fontSize: 9,
                    textTransform: "uppercase",
                    letterSpacing: "0.22em",
                    color: "rgba(110,110,110,0.9)",
                    marginTop: 4,
                  }}
                >
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── scroll indicator (desktop only) ── */}
      <motion.div
        className="absolute bottom-8 right-6 sm:right-8 z-20 hidden lg:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span
          style={{
            fontFamily: "Oswald, sans-serif",
            fontSize: 9, letterSpacing: "0.3em",
            color: "rgba(90,90,90,0.8)", textTransform: "uppercase",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
        <motion.div
          style={{
            width: 1, height: 48,
            background: "linear-gradient(to bottom, rgba(200,0,0,0.7), transparent)",
          }}
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ── floating red particles ── */}
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none z-10"
          style={{
            width: i % 2 === 0 ? 3 : 2,
            height: i % 2 === 0 ? 3 : 2,
            borderRadius: "50%",
            background: "#cc0000",
            left: `${10 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 2.5 + i * 0.5,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </section>
  );
}