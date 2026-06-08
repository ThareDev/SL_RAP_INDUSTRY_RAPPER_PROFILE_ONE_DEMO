"use client";

import Image from "next/image";
import bannerImg from "@/public/banners/banner.jpeg";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  trail: { x: number; y: number; alpha: number }[];
}

type Origin = "bl" | "br" | "bm-left" | "bm-right";

function FireworksCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const launchRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const originIdx = useRef<number>(0);

  // Crimson / ember / ash palette matching the Karalilla poster
  const COLORS = [
    "#cc0000", "#ff2200", "#ff4400",
    "#ff8800", "#ffaa00", "#ffcc44",
    "#ffffff", "#ffddcc",
    "#880000", "#ff1111",
  ];

  const getOriginXY = useCallback((origin: Origin, w: number, h: number): [number, number] => {
    const yBase = h - 8;
    switch (origin) {
      case "bl":       return [14 + Math.random() * 20,           yBase];
      case "br":       return [w - 14 - Math.random() * 20,       yBase];
      case "bm-left":  return [w * 0.28 + Math.random() * w * 0.08, yBase];
      case "bm-right": return [w * 0.64 + Math.random() * w * 0.08, yBase];
    }
  }, []);

  const getAngleRange = (origin: Origin): [number, number] => {
    switch (origin) {
      case "bl":       return [-Math.PI * 0.85, -Math.PI * 0.15];
      case "br":       return [-Math.PI * 0.85, -Math.PI * 0.15];
      case "bm-left":  return [-Math.PI * 0.9,  -Math.PI * 0.1];
      case "bm-right": return [-Math.PI * 0.9,  -Math.PI * 0.1];
    }
  };

  const burst = useCallback((origin: Origin) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const [cx, cy] = getOriginXY(origin, canvas.width, canvas.height);
    const [aMin, aMax] = getAngleRange(origin);

    const count = 42 + Math.random() * 20;
    for (let i = 0; i < count; i++) {
      const angle = aMin + Math.random() * (aMax - aMin);
      const speed = 1.6 + Math.random() * 4.2;
      particlesRef.current.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 0.9 + Math.random() * 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 1.2 + Math.random() * 2.0,
        decay: 0.009 + Math.random() * 0.007,
        trail: [],
      });
    }

    // ember ring
    for (let i = 0; i < 14; i++) {
      const angle = aMin + (i / 14) * (aMax - aMin);
      particlesRef.current.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * (5.0 + Math.random() * 1.5),
        vy: Math.sin(angle) * (5.0 + Math.random() * 1.5),
        alpha: 0.8,
        color: "#ff6600",
        size: 1.0,
        decay: 0.012,
        trail: [],
      });
    }
  }, [getOriginXY]); // eslint-disable-line

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = particlesRef.current.filter(p => p.alpha > 0.02);

    for (const p of particlesRef.current) {
      p.trail.push({ x: p.x, y: p.y, alpha: p.alpha });
      if (p.trail.length > 9) p.trail.shift();

      for (let t = 1; t < p.trail.length; t++) {
        const ratio = t / p.trail.length;
        ctx.globalAlpha = p.trail[t].alpha * ratio * 0.45;
        ctx.beginPath();
        ctx.moveTo(p.trail[t - 1].x, p.trail[t - 1].y);
        ctx.lineTo(p.trail[t].x, p.trail[t].y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * ratio * 0.75;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      ctx.globalAlpha = p.alpha * 0.22;
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
      grd.addColorStop(0, p.color);
      grd.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      ctx.globalAlpha = 1;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.045;
      p.vx *= 0.987;
      p.vy *= 0.987;
      p.alpha -= p.decay;
    }

    frameRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const SEQUENCE: Origin[] = ["bl", "br", "bm-left", "bm-right"];

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(frameRef.current);
      if (launchRef.current) clearInterval(launchRef.current);
      return;
    }

    frameRef.current = requestAnimationFrame(draw);

    const t1 = setTimeout(() => burst("bl"),       0);
    const t2 = setTimeout(() => burst("br"),       400);
    const t3 = setTimeout(() => burst("bm-left"),  900);
    const t4 = setTimeout(() => burst("bm-right"), 1400);

    launchRef.current = setInterval(() => {
      const origin = SEQUENCE[originIdx.current % SEQUENCE.length];
      originIdx.current++;
      burst(origin);
    }, 1800);

    return () => {
      cancelAnimationFrame(frameRef.current);
      if (launchRef.current) clearInterval(launchRef.current);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, [active, burst, draw]); // eslint-disable-line

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
}

/* ─────────────────────────────────────
   Framer variants
───────────────────────────────────── */
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.35, delay: 0.1 } },
};

const panelVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0, y: 40 },
  show: {
    scale: 1, opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    scale: 0.85, opacity: 0, y: 24,
    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ─────────────────────────────────────
   Main Component
───────────────────────────────────── */
export default function EventBannerPopup() {
  const [open, setOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');

        .popup-close {
          position: absolute; top: 12px; right: 12px;
          width: 32px; height: 32px;
          background: rgba(0,0,0,0.78);
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.85);
          font-size: 14px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px);
          transition: background 0.2s, border-color 0.2s;
          z-index: 60;
          backdrop-filter: blur(4px);
        }
        .popup-close:hover { background: rgba(180,0,0,0.65); border-color: #cc0000; }

        .corner-accent {
          position: absolute; width: 20px; height: 20px;
          border-color: #aa0000; border-style: solid;
          z-index: 55; pointer-events: none;
        }

        .popup-ticket-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 14px 0;
          background: linear-gradient(135deg, #aa0000 0%, #cc1100 60%, #ff2200 100%);
          color: #fff;
          font-family: 'Oswald', Impact, sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          text-decoration: none;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
          position: relative; overflow: hidden; transition: filter 0.2s;
        }
        .popup-ticket-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0.18) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.3s;
        }
        .popup-ticket-btn:hover { filter: brightness(1.15); }
        .popup-ticket-btn:hover::before { opacity: 1; }

        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-inner { animation: ticker-scroll 16s linear infinite; white-space: nowrap; display: inline-block; }

        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(180,0,0,0.8); }
          50%       { box-shadow: 0 0 0 5px rgba(180,0,0,0); }
        }
        .live-dot { animation: badge-pulse 1.8s ease-in-out infinite; }

        .popup-scanlines {
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px
          );
        }

        /* subtle red inner glow on panel */
        .panel-glow {
          box-shadow:
            0 0 80px rgba(180,0,0,0.35),
            0 0 160px rgba(180,0,0,0.14),
            inset 0 0 40px rgba(100,0,0,0.18);
        }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .img-skeleton {
          background: linear-gradient(90deg, #0d0000 25%, #1a0505 50%, #0d0000 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
      `}</style>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6"
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={close}
          >
            {/* backdrop */}
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)" }}
            />

            {/* panel */}
            <motion.div
              className="relative overflow-hidden panel-glow"
              style={{
                width: "100%",
                maxWidth: 420,
                background: "#050000",
                border: "1px solid rgba(180,0,0,0.5)",
              }}
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* scanlines */}
              <div className="popup-scanlines absolute inset-0 pointer-events-none z-[6]" />

              {/* Fireworks — ember/crimson palette */}
              <FireworksCanvas active={open && imgLoaded} />

              {/* corner brackets */}
              <div className="corner-accent" style={{ top: 0, left: 0, borderWidth: "2px 0 0 2px" }} />
              <div className="corner-accent" style={{ top: 0, right: 0, borderWidth: "2px 2px 0 0" }} />
              <div className="corner-accent" style={{ bottom: 0, left: 0, borderWidth: "0 0 2px 2px" }} />
              <div className="corner-accent" style={{ bottom: 0, right: 0, borderWidth: "0 2px 2px 0" }} />

              {/* top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px z-[56]"
                style={{ background: "linear-gradient(to right, transparent, #cc0000, #ff4400, transparent)" }}
              />

              {/* close */}
              <button className="popup-close" onClick={close} aria-label="Close">✕</button>

              {/* ── Banner Image ── */}
              <div
                className="relative w-full"
                style={{ aspectRatio: "1/1", zIndex: 20 }}
              >
                {!imgLoaded && (
                  <div className="img-skeleton absolute inset-0 z-10" />
                )}

                <Image
                  src={bannerImg}
                  alt="කැරැල්ල — දකුණු රටේ Hip-Hop ආගමනය"
                  fill
                  className="object-cover object-top"
                  priority
                  onLoad={() => setImgLoaded(true)}
                  style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}
                />

                {/* COMING SOON badge */}
                <div
                  className="live-dot absolute top-3 left-3 flex items-center gap-2 px-3 py-1 z-30"
                  style={{
                    background: "rgba(0,0,0,0.85)",
                    border: "1px solid #aa0000",
                    backdropFilter: "blur(4px)",
                    opacity: imgLoaded ? 1 : 0,
                    transition: "opacity 0.4s ease 0.3s",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#cc0000", display: "inline-block" }} />
                  <span style={{ fontFamily: "'Oswald', Impact, sans-serif", fontSize: 9, letterSpacing: "0.28em", color: "#cc0000", textTransform: "uppercase" }}>
                    June 2026
                  </span>
                </div>

                {/* bottom fade */}
                <div
                  className="absolute inset-x-0 bottom-0 h-10 z-[25]"
                  style={{ background: "linear-gradient(to top, #050000, transparent)" }}
                />
              </div>

              {/* ── CTA ── */}
              <motion.div
                className="relative px-5 pt-3 pb-5 z-40"
                variants={ctaVariants}
                initial="hidden"
                animate={imgLoaded ? "show" : "hidden"}
                transition={{ delay: 0.3 }}
              >
                <motion.a
                  href="https://keralla.kodikaraentertainments.com/?fbclid=IwZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPMjc1MjU0NjkyNTk4Mjc5AAEeR2EDGVpNBL3zuvjHJvJ93dCqldKjWlipHKuDKzNtavRx0pE_09Pv8b5Ddcc_aem_rWTPu6_RWu0SKcgMAFsMLw"
                  className="popup-ticket-btn"
                  onClick={close}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", display: "inline-block", flexShrink: 0 }} />
                  Get Tickets — Samanala Ground, Galle
                  <span>→</span>
                </motion.a>

                <div className="text-center mt-3">
                  <button
                    onClick={close}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: 9, letterSpacing: "0.22em",
                      color: "rgba(90,40,40,0.9)", textTransform: "uppercase",
                    }}
                  >
                    Maybe later
                  </button>
                </div>
              </motion.div>

              {/* ── ticker ── */}
              <div style={{ background: "linear-gradient(90deg, #880000, #cc0000, #880000)", overflow: "hidden", padding: "5px 0", position: "relative", zIndex: 40 }}>
                <div className="ticker-inner">
                  {Array.from({ length: 8 }, (_, i) => (
                    <span key={i} style={{ fontFamily: "Impact, Oswald, sans-serif", fontSize: 9, letterSpacing: "0.28em", color: "#fff", textTransform: "uppercase", marginRight: 28 }}>
                      කැරැල්ල &nbsp;🔥&nbsp; JUNE 2026 &nbsp;★&nbsp; SAMANALA GROUND &nbsp;★&nbsp; GALLE &nbsp;★&nbsp; දකුණු රටේ HIP-HOP ආගමනය &nbsp;★&nbsp;
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}