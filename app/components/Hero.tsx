"use client";

import Image from "next/image";
import artist from "@/public/heronew.png";
import { useEffect, useRef, useState, JSX } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  animate,
  useReducedMotion,
  Variants,
  MotionValue,
} from "framer-motion";

/* ─────────────────────────────────────────
   Palette
───────────────────────────────────────── */
const C = {
  bg: "#000000",
  teal: "#cc0000",
  violet: "#a80000",
  blue: "#00cccc",
  lime: "#d4a843",
  text: "#ffffff",
  muted: "rgba(170,170,170,0.85)",
  muted2: "rgba(110,110,110,0.9)",
};

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
   Hook: is mobile / tablet viewport
───────────────────────────────────────── */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
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
        delay: 0.15,
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
   Kinetic per-letter typography reveal
───────────────────────────────────────── */
function KineticText({
  text,
  baseDelay = 0,
  letterDelay = 0.035,
  reduceMotion,
}: {
  text: string;
  baseDelay?: number;
  letterDelay?: number;
  reduceMotion?: boolean | null;
}): JSX.Element {
  const letters = Array.from(text);
  return (
    <>
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: "pre" }}
          initial={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 100, scaleY: 1.25, filter: "blur(10px)" }
          }
          animate={{ opacity: 1, y: 0, scaleY: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.75,
            delay: reduceMotion ? 0 : baseDelay + i * letterDelay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {ch}
        </motion.span>
      ))}
    </>
  );
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
  { target: 18, decimals: 0, suffix: "+", label: "Shows This Year" },
  { target: 3, decimals: 0, suffix: "", label: "Albums Dropped" },
];

/* ─────────────────────────────────────────
   Particles — mixed dots / streaks / squares
───────────────────────────────────────── */
type ParticleKind = "dot" | "streak" | "square";
interface ParticleDef {
  kind: ParticleKind;
  color: string;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
}

const PARTICLES: ParticleDef[] = [
  { kind: "dot", color: C.teal, left: "8%", top: "22%", size: 3, duration: 3.2, delay: 0 },
  { kind: "square", color: C.violet, left: "18%", top: "68%", size: 4, duration: 4.1, delay: 0.3 },
  { kind: "streak", color: C.blue, left: "27%", top: "40%", size: 14, duration: 3.6, delay: 0.6 },
  { kind: "dot", color: C.violet, left: "34%", top: "78%", size: 2, duration: 2.8, delay: 0.15 },
  { kind: "dot", color: C.blue, left: "45%", top: "15%", size: 3, duration: 3.9, delay: 0.5 },
  { kind: "square", color: C.teal, left: "52%", top: "58%", size: 3, duration: 3.3, delay: 0.8 },
  { kind: "streak", color: C.violet, left: "62%", top: "30%", size: 12, duration: 4.4, delay: 0.2 },
  { kind: "dot", color: C.lime, left: "71%", top: "70%", size: 2, duration: 3.0, delay: 0.45 },
];

/* ─────────────────────────────────────────
   Framer Motion variants
───────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.55 },
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

/* ─────────────────────────────────────────
   Spring config
───────────────────────────────────────── */
const SPRING = { stiffness: 60, damping: 20 };

/* ─────────────────────────────────────────
   Hero
───────────────────────────────────────── */
export default function Hero(): JSX.Element {
  const { x: px, y: py } = usePointer();
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  // parallax intensity: full on desktop, dampened on mobile, off if reduced-motion
  const pf = reduceMotion ? 0 : isMobile ? 0.18 : 1;

  const rx = useSpring(useTransform(py, [-1, 1], [8 * pf, -8 * pf]), SPRING);
  const ry = useSpring(useTransform(px, [-1, 1], [-10 * pf, 10 * pf]), SPRING);

  const imgX = useSpring(useTransform(px, [-1, 1], [-18 * pf, 18 * pf]), SPRING);
  const imgY = useSpring(useTransform(py, [-1, 1], [-10 * pf, 10 * pf]), SPRING);
  const bgX = useSpring(useTransform(px, [-1, 1], [10 * pf, -10 * pf]), SPRING);
  const bgY = useSpring(useTransform(py, [-1, 1], [6 * pf, -6 * pf]), SPRING);
  const fgX = useSpring(useTransform(px, [-1, 1], [-5 * pf, 5 * pf]), SPRING);
  const particleX = useSpring(useTransform(px, [-1, 1], [4 * pf, -4 * pf]), SPRING);

  // one-shot glitch burst during the landing sequence + re-triggerable on hover
  const [glitchBurst, setGlitchBurst] = useState(false);
  useEffect(() => {
    if (reduceMotion) return;
    const on = setTimeout(() => setGlitchBurst(true), 1050);
    const off = setTimeout(() => setGlitchBurst(false), 1300);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [reduceMotion]);

  const [listenHover, setListenHover] = useState(false);

  return (
    <section
      className="relative min-h-screen flex items-center lg:items-end overflow-hidden"
      id="home"
      style={{ perspective: "1200px", background: C.bg }}
    >
      {/* ── global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Barlow+Condensed:wght@400;600&display=swap');

        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 13px 34px;
          background: linear-gradient(120deg, ${C.teal} 0%, ${C.violet} 100%);
          color: #ffffff;
          font-family: 'Oswald', Impact, sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          text-decoration: none; border: none; cursor: pointer;
          position: relative; overflow: hidden;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
          box-shadow: 0 0 22px rgba(204,0,0,0.28);
          transition: box-shadow 0.25s;
        }
        .hero-btn-primary::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(120deg, rgba(255,255,255,0.35) 0%, transparent 60%);
          transform: translateX(-120%);
          transition: transform 0.6s ease;
        }
        .hero-btn-primary:hover { box-shadow: 0 0 34px rgba(168,0,0,0.45); }
        .hero-btn-primary:hover::before { transform: translateX(120%); }

        .hero-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 34px;
          background: transparent; color: ${C.text};
          font-family: 'Oswald', Impact, sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          text-decoration: none; cursor: pointer;
          border: 1px solid rgba(204,0,0,0.35);
          clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
          transition: border-color 0.25s, color 0.25s, box-shadow 0.25s;
        }
        .hero-btn-outline:hover {
          border-color: ${C.violet};
          color: ${C.blue};
          box-shadow: 0 0 20px rgba(0,204,204,0.25);
        }

        .scanlines {
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(224,239,255,0.012) 2px, rgba(224,239,255,0.012) 4px
          );
        }

        .glitch { position: relative; display: inline-block; }
        .glitch:hover::before, .glitch.glitch-active::before,
        .glitch:hover::after,  .glitch.glitch-active::after {
          content: attr(data-text);
          position: absolute; top: 0; left: 0;
          font-family: inherit; font-size: inherit;
          font-weight: inherit; letter-spacing: inherit;
          text-transform: inherit; line-height: inherit;
        }
        .glitch:hover::before, .glitch.glitch-active::before {
          color: ${C.teal};
          clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
          animation: glitch-a 0.25s steps(2) infinite;
        }
        .glitch:hover::after, .glitch.glitch-active::after {
          color: ${C.violet};
          clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
          animation: glitch-b 0.25s steps(2) infinite;
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
          background: linear-gradient(to bottom, ${C.lime}, transparent);
          margin: 0 auto;
        }

        @keyframes pulse-vline {
          0%, 100% { opacity: 0.25; }
          50%       { opacity: 0.6;  }
        }
        .vline-pulse { animation: pulse-vline 3s ease-in-out infinite; }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        @keyframes drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(30px, -20px) scale(1.08); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-24px, 26px) scale(1.05); }
        }
        @keyframes drift-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(18px, 18px) scale(1.1); }
        }

        @keyframes streak-travel-1 {
          0%   { transform: translate(-30%, -10%) rotate(-18deg); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.5; }
          100% { transform: translate(30%, 10%) rotate(-18deg); opacity: 0; }
        }
        @keyframes streak-travel-2 {
          0%   { transform: translate(30%, 12%) rotate(14deg); opacity: 0; }
          10%  { opacity: 0.4; }
          90%  { opacity: 0.4; }
          100% { transform: translate(-30%, -12%) rotate(14deg); opacity: 0; }
        }

        @keyframes ambient-float {
          0%, 100% { transform: translateY(0); opacity: 0.55; }
          50%       { transform: translateY(-18px); opacity: 0.95; }
        }

        @keyframes dot-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,168,67,0.45); }
          50%       { box-shadow: 0 0 0 6px rgba(212,168,67,0); }
        }

        @keyframes scroll-pulse {
          0%, 100% { transform: scaleY(1); opacity: 0.5; }
          50%       { transform: scaleY(0.4); opacity: 1; }
        }
      `}</style>

      {/* ── PHASE 01 / 02 — landing ignition overlay ── */}
      {!reduceMotion && (
        <>
          <motion.div
            className="absolute inset-0 z-40 pointer-events-none"
            style={{ background: C.bg }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.35, ease: "easeOut" }}
          />
          {/* energy pulse / bass hit at ~0.35s */}
          <motion.div
            className="absolute inset-0 z-30 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 55% 55% at 70% 55%, rgba(204,0,0,0.35) 0%, rgba(168,0,0,0.22) 40%, transparent 70%)`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1.3, 1.5] }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          />
          {/* brief scanline distortion flash */}
          <motion.div
            className="scanlines absolute inset-0 z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.25, 0] }}
            transition={{ delay: 0.32, duration: 0.3, ease: "easeOut" }}
          />
        </>
      )}

      {/* ── ambient scanlines (persistent, very subtle) ── */}
      <div className="scanlines absolute inset-0 pointer-events-none z-0" />

      {/* ── background parallax layer ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ x: bgX, y: bgY }}
      >
        {/* atmospheric glow blobs */}
        <div
          style={{
            position: "absolute", top: "-10%", left: "-5%",
            width: "48vw", height: "48vw", maxWidth: 520, maxHeight: 520,
            background: `radial-gradient(circle, rgba(204,0,0,0.16) 0%, transparent 70%)`,
            filter: "blur(40px)",
            animation: "drift-a 14s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "-15%", left: "20%",
            width: "38vw", height: "38vw", maxWidth: 460, maxHeight: 460,
            background: `radial-gradient(circle, rgba(168,0,0,0.16) 0%, transparent 70%)`,
            filter: "blur(50px)",
            animation: "drift-b 18s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute", top: "20%", right: "5%",
            width: "30vw", height: "30vw", maxWidth: 380, maxHeight: 380,
            background: `radial-gradient(circle, rgba(0,204,204,0.14) 0%, transparent 70%)`,
            filter: "blur(45px)",
            animation: "drift-c 16s ease-in-out infinite",
          }}
        />

        {/* dot grid */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(rgba(204,0,0,0.08) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
            maskImage: "radial-gradient(ellipse 70% 70% at 80% 50%, black 0%, transparent 100%)",
          }}
        />

        {/* giant watermark typography */}
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
              WebkitTextStroke: "1px rgba(204,0,0,0.08)",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            PRABA
          </span>
        </div>

        {/* oversized diagonal light streaks */}
        {!reduceMotion && (
          <>
            <div
              style={{
                position: "absolute", top: "30%", left: "0", width: "140%", height: "3px",
                background: `linear-gradient(90deg, transparent, ${C.teal}, transparent)`,
                animation: "streak-travel-1 11s ease-in-out infinite",
                animationDelay: "2s",
              }}
            />
            <div
              style={{
                position: "absolute", top: "62%", left: "-10%", width: "140%", height: "2px",
                background: `linear-gradient(90deg, transparent, ${C.violet}, ${C.blue}, transparent)`,
                animation: "streak-travel-2 13s ease-in-out infinite",
                animationDelay: "2.6s",
              }}
            />
          </>
        )}
      </motion.div>

      {/* ── pulsing vertical accent line (desktop only) ── */}
      <div
        className="vline-pulse absolute left-[13%] top-0 bottom-0 w-px z-10 pointer-events-none hidden lg:block"
        style={{ background: `linear-gradient(to bottom, transparent, rgba(204,0,0,0.5), transparent)` }}
      />

      {/* ── artist image ── */}
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
          initial={
            reduceMotion
              ? false
              : { opacity: 0, scale: 1.08, x: 40, filter: "brightness(0.2) contrast(1.4)" }
          }
          animate={{ opacity: 1, scale: 1, x: 0, filter: "brightness(0.75) contrast(1.2)" }}
          transition={{ delay: 0.45, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* asymmetric mask */}
          <div
            className="absolute inset-0 z-10"
            style={{
              clipPath: "polygon(6% 0, 100% 0, 100% 100%, 0 100%)",
              background: `linear-gradient(to right, ${C.bg} 0%, rgba(0,0,0,0.15) 22%, transparent 45%)`,
            }}
          />
          {/* bottom fade — mobile */}
          <div
            className="absolute inset-0 z-10 lg:hidden"
            style={{ background: `linear-gradient(to top, ${C.bg} 0%, ${C.bg} 15%, transparent 45%)` }}
          />
          {/* bottom fade — desktop */}
          <div
            className="absolute inset-0 z-10 hidden lg:block"
            style={{ background: `linear-gradient(to top, ${C.bg} 0%, transparent 35%)` }}
          />
          {/* teal/violet colour cast */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: `radial-gradient(ellipse at 65% 55%, rgba(0,204,204,0.10) 0%, rgba(168,0,0,0.07) 45%, transparent 65%)`,
            }}
          />
          {/* ambient shimmer sweep */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: "linear-gradient(120deg, transparent 30%, rgba(224,239,255,0.06) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 7s linear infinite",
            }}
          />
          {/* one-shot light sweep on reveal */}
          {!reduceMotion && (
            <motion.div
              className="absolute inset-y-0 z-20"
              style={{
                width: "35%",
                background: `linear-gradient(100deg, transparent, rgba(204,0,0,0.5) 35%, rgba(168,0,0,0.55) 55%, rgba(0,204,204,0.4) 70%, transparent)`,
                filter: "blur(2px)",
              }}
              initial={{ left: "-45%", opacity: 0 }}
              animate={{ left: "115%", opacity: [0, 1, 1, 0] }}
              transition={{ delay: 0.75, duration: 1.0, ease: "easeInOut" }}
            />
          )}
          {/* inner glow */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              boxShadow: "inset -1px 0 30px rgba(204,0,0,0.08), inset 0 -1px 30px rgba(0,0,0,0.35)",
            }}
          />

          <Image
            src={artist}
            alt="Lil Rome Praba"
            fill
            className="object-cover object-top"
            style={{
              filter: "contrast(1.05) brightness(1.3) saturate(0.9)",
            }}
            priority
          />

          {/* animated corner frame line */}
          <svg
            className="absolute inset-0 z-20 pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%" }}
          >
            <polyline
              points="88,4 96,4 96,96 55,96"
              fill="none"
              stroke={C.teal}
              strokeOpacity="0.35"
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
            />
            {!reduceMotion && (
              <circle r="1.1" fill={C.lime}>
                <animateMotion
                  dur="4.5s"
                  repeatCount="indefinite"
                  path="M88,4 L96,4 L96,96 L55,96"
                />
              </circle>
            )}
          </svg>

          {/* floating LIVE badge — desktop only */}
          <motion.div
            className="hidden lg:flex absolute bottom-[18%] right-6 z-30 flex-col items-center"
            initial={{ opacity: 0, scale: 0.6, rotate: -8, y: 20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                width: 72, height: 72, borderRadius: "50%",
                border: `2px solid ${C.lime}`,
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(4px)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 24px rgba(212,168,67,0.35)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span
                  style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: C.lime,
                    animation: "dot-pulse 1.6s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontFamily: "Impact, sans-serif",
                    fontSize: 11, color: C.lime, letterSpacing: "0.1em",
                  }}
                >
                  LIVE
                </span>
              </span>
              <span
                style={{
                  fontFamily: "Impact, sans-serif",
                  fontSize: 18, color: C.text, lineHeight: 1,
                }}
              >
                2026
              </span>
            </div>
            <div className="chain-line" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── top hairline ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px z-30 pointer-events-none"
        style={{ background: `linear-gradient(to right, transparent, ${C.teal}, transparent)` }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {/* ── bottom hairline ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-30 pointer-events-none"
        style={{ background: `linear-gradient(to right, transparent, ${C.violet}, transparent)` }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
      />

      {/* ── main content ── */}
      <motion.div
        className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 pt-24 pb-12 lg:pt-0 lg:pb-24"
        style={{ x: fgX }}
      >
        <motion.div className="max-w-2xl" variants={containerVariants} initial="hidden" animate="show">
          {/* ── label row ── */}
          <motion.div className="flex items-center gap-3 mb-3" variants={fadeIn}>
            <motion.div
              style={{ width: 32, height: 2, background: C.teal, originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <span
              style={{
                fontFamily: "'Oswald', Impact, sans-serif",
                fontSize: 10, letterSpacing: "0.32em",
                color: C.teal, textTransform: "uppercase",
              }}
              className="font-bold"
            >
              Official Artist Page · Est. 2026
            </span>
          </motion.div>

          {/* ── LIL ROME (kinetic reveal + glitch on hover / burst) ── */}
          <div className="overflow-hidden mb-1">
            <h1
              data-text="LIL ROME"
              className={`glitch${glitchBurst ? " glitch-active" : ""}`}
              style={{
                fontFamily: "Impact, 'Arial Black', Oswald, sans-serif",
                fontSize: "clamp(52px, 11vw, 160px)",
                fontWeight: 900, lineHeight: 0.88,
                color: C.text, letterSpacing: "-0.02em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              <KineticText text="LIL ROME" baseDelay={0.55} reduceMotion={reduceMotion} />
            </h1>
          </div>

          {/* ── PRABA (kinetic reveal, outlined) ── */}
          <div className="overflow-hidden mb-6" style={{ perspective: 600 }}>
            <h2
              style={{
                fontFamily: "Impact, 'Arial Black', Oswald, sans-serif",
                fontSize: "clamp(44px, 9vw, 128px)",
                fontWeight: 900, lineHeight: 0.88,
                color: "transparent",
                WebkitTextStroke: `2px ${C.teal}`,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                display: "inline-block",
                textShadow: "4px 4px 0 rgba(168,0,0,0.25)",
                margin: 0,
              }}
            >
              <KineticText text="PRABA" baseDelay={0.75} reduceMotion={reduceMotion} />
            </h2>
          </div>

          {/* ── tagline ── */}
          <motion.p
            variants={slideUp}
            className="mb-8 max-w-xs sm:max-w-sm"
            style={{
              fontFamily: "'Barlow Condensed', Oswald, sans-serif",
              fontSize: "clamp(13px, 2vw, 16px)",
              color: C.text,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              lineHeight: 1.65,
              margin: "0 0 2rem",
            }}
          >
            Straight from the underground.{" "}
            <span style={{ color: C.text }}>Every bar unfiltered</span>,{" "}
            <span style={{ color: C.teal }} className="font-bold">no filter, raw energy</span>.
          </motion.p>

          {/* ── CTAs ── */}
          <motion.div className="flex flex-wrap gap-3 sm:gap-4 items-center mb-10 sm:mb-12" variants={slideUp}>
            <motion.a
              href="#music"
              className="hero-btn-primary"
              onHoverStart={() => setListenHover(true)}
              onHoverEnd={() => setListenHover(false)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <span aria-hidden="true">▶</span>
              Listen Now
              <span
                aria-hidden="true"
                style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, height: 14 }}
              >
                {[4, 10, 6, 12, 5].map((h, i) => (
                  <motion.span
                    key={i}
                    style={{ width: 2, borderRadius: 1, background: "#ffffff" }}
                    animate={{ height: listenHover ? [h, h + 6, h] : h }}
                    transition={{
                      duration: 0.5,
                      repeat: listenHover ? Infinity : 0,
                      repeatType: "mirror",
                      delay: i * 0.06,
                    }}
                  />
                ))}
              </span>
            </motion.a>
            <motion.a
              href="#shows"
              className="hero-btn-outline"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              Tour Dates
            </motion.a>
          </motion.div>

          {/* ── stats ── */}
          <motion.div className="flex gap-6 sm:gap-10 lg:gap-14" variants={fadeIn}>
            {STATS.map(({ target, decimals, suffix, label }) => (
              <motion.div key={label} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <div
                  style={{
                    fontFamily: "Impact, Oswald, sans-serif",
                    fontSize: "clamp(26px, 4vw, 42px)",
                    fontWeight: 900,
                    color: C.lime,
                    lineHeight: 1,
                    textShadow: "0 0 18px rgba(212,168,67,0.3)",
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
                    color: C.muted2,
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

      {/* ── floating graphic labels ── */}
      <motion.div
        className="hidden lg:block absolute top-10 right-10 z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: 10,
          letterSpacing: "0.28em",
          color: C.muted2,
          textTransform: "uppercase",
          writingMode: "vertical-rl",
        }}
      >
        Sound / Culture
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
            color: C.muted, textTransform: "uppercase",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1, height: 48,
            background: `linear-gradient(to bottom, ${C.teal}, transparent)`,
            transformOrigin: "top",
            animation: "scroll-pulse 2s ease-in-out infinite",
          }}
        />
      </motion.div>

      {/* ── floating particles ── */}
      <motion.div className="absolute inset-0 pointer-events-none z-10" style={{ x: particleX }}>
        {PARTICLES.map((p, i) => {
          const base =
            p.kind === "square"
              ? { width: p.size, height: p.size, borderRadius: 2, background: p.color }
              : p.kind === "streak"
                ? { width: p.size, height: 2, borderRadius: 1, background: p.color }
                : { width: p.size, height: p.size, borderRadius: "50%", background: p.color };

          return (
            <div
              key={i}
              className="absolute"
              style={{
                ...base,
                left: p.left,
                top: p.top,
                boxShadow: `0 0 8px ${p.color}`,
                animation: reduceMotion
                  ? undefined
                  : `ambient-float ${p.duration}s ease-in-out infinite`,
                animationDelay: `${1.7 + p.delay}s`,
                opacity: reduceMotion ? 0.6 : 0,
              }}
            />
          );
        })}
      </motion.div>
    </section>
  );
}