"use client";

import Image from "next/image";
import bannerImg from "@/public/banners/banner-rap-reggae.jpeg";
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

/* Gold / UAE flag (green, red, white) palette matching the poster */
const COLORS = [
  "#ffd700", "#ffcc44", "#ffe066", "#d4a017",
  "#00a651", "#00732f",
  "#e4002b", "#ff2a2a",
  "#ffffff", "#fff2c2",
];

const SEQUENCE: Origin[] = ["bl", "br", "bm-left", "bm-right"];

function FireworksCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const launchRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const originIdx = useRef<number>(0);

  const getOriginXY = useCallback((origin: Origin, w: number, h: number): [number, number] => {
    const yBase = h - 8;
    switch (origin) {
      case "bl": return [14 + Math.random() * 20, yBase];
      case "br": return [w - 14 - Math.random() * 20, yBase];
      case "bm-left": return [w * 0.28 + Math.random() * w * 0.08, yBase];
      case "bm-right": return [w * 0.64 + Math.random() * w * 0.08, yBase];
    }
  }, []);

  const getAngleRange = (origin: Origin): [number, number] => {
    switch (origin) {
      case "bl": return [-Math.PI * 0.85, -Math.PI * 0.15];
      case "br": return [-Math.PI * 0.85, -Math.PI * 0.15];
      case "bm-left": return [-Math.PI * 0.9, -Math.PI * 0.1];
      case "bm-right": return [-Math.PI * 0.9, -Math.PI * 0.1];
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

    // golden ring
    for (let i = 0; i < 14; i++) {
      const angle = aMin + (i / 14) * (aMax - aMin);
      particlesRef.current.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * (5.0 + Math.random() * 1.5),
        vy: Math.sin(angle) * (5.0 + Math.random() * 1.5),
        alpha: 0.8,
        color: "#ffd700",
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
    particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.02);

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

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(frameRef.current);
      if (launchRef.current) clearInterval(launchRef.current);
      return;
    }

    frameRef.current = requestAnimationFrame(draw);

    const t1 = setTimeout(() => burst("bl"), 0);
    const t2 = setTimeout(() => burst("br"), 400);
    const t3 = setTimeout(() => burst("bm-left"), 900);
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
  }, [active, burst, draw]);

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

const TICKET_URL = "https://ticketsministry.net/concerts/rap-and-reggae-fiesta/6ac4c1270ab1a";

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
          border: 1px solid rgba(255,215,0,0.35);
          color: rgba(255,255,255,0.9);
          font-size: 14px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px);
          transition: background 0.2s, border-color 0.2s;
          z-index: 60;
          backdrop-filter: blur(4px);
        }
        .popup-close:hover { background: rgba(0,115,47,0.75); border-color: #ffd700; }
        .popup-close:focus-visible,
        .popup-ticket-btn:focus-visible,
        .popup-later:focus-visible { outline: 2px solid #ffd700; outline-offset: 2px; }

        .corner-accent {
          position: absolute; width: 20px; height: 20px;
          border-color: #d4a017; border-style: solid;
          z-index: 55; pointer-events: none;
        }

        .popup-ticket-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 14px 0;
          background: linear-gradient(135deg, #b8860b 0%, #e0a800 55%, #ffd700 100%);
          color: #1a0f00;
          font-family: 'Oswald', Impact, sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          text-decoration: none;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
          position: relative; overflow: hidden; transition: filter 0.2s;
        }
        .popup-ticket-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0.35) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.3s;
        }
        .popup-ticket-btn:hover { filter: brightness(1.1); }
        .popup-ticket-btn:hover::before { opacity: 1; }

        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-inner { animation: ticker-scroll 40s linear infinite; white-space: nowrap; display: inline-block; }

        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,215,0,0.7); }
          50%       { box-shadow: 0 0 0 5px rgba(255,215,0,0); }
        }
        .live-dot { animation: badge-pulse 1.8s ease-in-out infinite; }

        .popup-scanlines {
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px
          );
        }

        .panel-glow {
          box-shadow:
            0 0 80px rgba(212,160,23,0.30),
            0 0 160px rgba(0,115,47,0.14),
            inset 0 0 40px rgba(60,40,0,0.20);
        }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .img-skeleton {
          background: linear-gradient(90deg, #120d00 25%, #231a05 50%, #120d00 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-inner, .live-dot, .img-skeleton { animation: none; }
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
                maxHeight: "100%",
                background: "#0a0700",
                border: "1px solid rgba(212,160,23,0.55)",
              }}
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Rap & Reggae Fiesta live in Dubai"
            >
              {/* scanlines */}
              <div className="popup-scanlines absolute inset-0 pointer-events-none z-[6]" />

              {/* Fireworks — gold / UAE palette */}
              <FireworksCanvas active={open && imgLoaded} />

              {/* corner brackets */}
              <div className="corner-accent" style={{ top: 0, left: 0, borderWidth: "2px 0 0 2px" }} />
              <div className="corner-accent" style={{ top: 0, right: 0, borderWidth: "2px 2px 0 0" }} />
              <div className="corner-accent" style={{ bottom: 0, left: 0, borderWidth: "0 0 2px 2px" }} />
              <div className="corner-accent" style={{ bottom: 0, right: 0, borderWidth: "0 2px 2px 0" }} />

              {/* top accent line (UAE green → gold → red) */}
              <div
                className="absolute top-0 left-0 right-0 h-px z-[56]"
                style={{ background: "linear-gradient(to right, transparent, #00a651, #ffd700, #e4002b, transparent)" }}
              />

              {/* close */}
              <button className="popup-close" onClick={close} aria-label="Close">✕</button>

              {/* ── Banner Image ── */}
              <div
                className="relative w-full"
                style={{ aspectRatio: "1156/1600", zIndex: 20 }}
              >
                {!imgLoaded && <div className="img-skeleton absolute inset-0 z-10" />}

                <Image
                  src={bannerImg}
                  alt="Rap & Reggae Fiesta with Check Point Band, live in Dubai — November 28, Sunday Holiday International Hotel, Bur Dubai. La Fiesta Event."
                  fill
                  sizes="(max-width: 420px) 100vw, 420px"
                  className="object-cover object-top"
                  priority
                  onLoad={() => setImgLoaded(true)}
                  style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}
                />

                {/* Early bird badge */}
                <div
                  className="live-dot absolute top-3 left-3 flex items-center gap-2 px-3 py-1 z-30"
                  style={{
                    background: "rgba(0,0,0,0.85)",
                    border: "1px solid #d4a017",
                    backdropFilter: "blur(4px)",
                    opacity: imgLoaded ? 1 : 0,
                    transition: "opacity 0.4s ease 0.3s",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffd700", display: "inline-block" }} />
                  <span style={{ fontFamily: "'Oswald', Impact, sans-serif", fontSize: 9, letterSpacing: "0.28em", color: "#ffd700", textTransform: "uppercase" }}>
                    Early Bird On Sale — Until 15 Nov
                  </span>
                </div>

                {/* bottom fade */}
                <div
                  className="absolute inset-x-0 bottom-0 h-10 z-[25]"
                  style={{ background: "linear-gradient(to top, #0a0700, transparent)" }}
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
                  href={TICKET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="popup-ticket-btn"
                  onClick={close}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1a0f00", display: "inline-block", flexShrink: 0 }} />
                  Get Tickets — Bur Dubai
                  <span>→</span>
                </motion.a>

                <div className="text-center mt-3">
                  <button
                    onClick={close}
                    className="popup-later"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: 9, letterSpacing: "0.22em",
                      color: "rgba(212,160,23,0.7)", textTransform: "uppercase",
                    }}
                  >
                    Maybe later
                  </button>
                </div>
              </motion.div>

              {/* ── ticker ── */}
              <div style={{ background: "linear-gradient(90deg, #00541f, #00732f, #00541f)", overflow: "hidden", padding: "5px 0", position: "relative", zIndex: 40 }}>
                <div className="ticker-inner">
                  {Array.from({ length: 8 }, (_, i) => (
                    <span key={i} style={{ fontFamily: "Impact, Oswald, sans-serif", fontSize: 9, letterSpacing: "0.28em", color: "#fff", textTransform: "uppercase", marginRight: 28 }}>
                      RAP &amp; REGGAE FIESTA &nbsp;🔥&nbsp; LIVE IN DUBAI &nbsp;★&nbsp; NOVEMBER 28 &nbsp;★&nbsp; SUNDAY HOLIDAY INTERNATIONAL HOTEL, BUR DUBAI &nbsp;★&nbsp; 9 PM ONWARDS &nbsp;★&nbsp; EARLY BIRD AED 100 / AED 150 UNTIL 15 NOV &nbsp;★&nbsp; INFO 050 101 0176 / 052 899 8273 &nbsp;★&nbsp;
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