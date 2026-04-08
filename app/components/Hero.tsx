import Image from "next/image";
import artist from '@/public/artist.jpg';

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center lg:items-end overflow-hidden bg-black mt-3"
      id="home"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)"
      }}
    >
      <style>{`
        .btn-primary-hero {
          display: inline-block;
          padding: 12px 32px;
          background: #cc0000;
          color: #fff;
          font-family: 'Oswald', 'Impact', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s;
        }
        .btn-primary-hero:hover { background: #a80000; }

        .btn-outline-hero {
          display: inline-block;
          padding: 11px 32px;
          background: transparent;
          color: #fff;
          font-family: 'Oswald', 'Impact', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.35);
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-outline-hero:hover {
          border-color: #cc0000;
          color: #cc0000;
        }
      `}</style>

      {/* Background watermark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          style={{
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            fontSize: "clamp(100px, 22vw, 340px)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.06)",
            whiteSpace: "nowrap",
          }}
        >
          LIL ROME
        </span>
      </div>

      {/* Vignettes */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/30 z-10 pointer-events-none" />

      {/* Red corner accent */}
      <div
        className="absolute top-0 left-0 w-72 h-72 pointer-events-none z-10"
        style={{
          background: "rgba(180,0,0,0.18)",
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
      />

      {/* Vertical red line */}
      <div
        className="absolute left-[13%] top-0 bottom-0 w-px pointer-events-none z-10 hidden lg:block"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(200,0,0,0.35), transparent)" }}
      />

      {/* Bottom red bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px z-30 pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, #cc0000, transparent)" }}
      />

      {/* Artist image — right side */}
      <div className="absolute inset-0 flex justify-end items-stretch z-5 pointer-events-none">
        <div className="relative w-[55%] lg:w-[48%] h-full">
          <div
            className="absolute inset-0 z-10"
            style={{ background: "linear-gradient(to right, black 0%, transparent 35%)" }}
          />
          {/* Stronger bottom fade on mobile so text stays readable */}
          <div
            className="absolute inset-0 z-10 lg:hidden"
            style={{ background: "linear-gradient(to top, black 0%, black 20%, transparent 55%)" }}
          />
          <div
            className="absolute inset-0 z-10 hidden lg:block"
            style={{ background: "linear-gradient(to top, black 0%, transparent 45%)" }}
          />
          <div
            className="absolute inset-0 z-10"
            style={{ background: "radial-gradient(ellipse at 60% 60%, rgba(150,0,0,0.2) 0%, transparent 65%)" }}
          />
          <Image
            src={artist}
            alt="Lil Rome Praba"
            fill
            className="object-cover object-top"
            style={{
              filter: "contrast(1.15) brightness(0.8) saturate(0.5)",
              mixBlendMode: "luminosity",
            }}
            priority
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-14 pt-24 pb-10 lg:pt-0 lg:pb-24">
        <div className="max-w-2xl">

          {/* Label */}
          <div className="flex items-center gap-3 mb-5">
            <div style={{ width: 32, height: 2, background: "#cc0000" }} />
            <span
              style={{
                fontFamily: "'Oswald', 'Impact', sans-serif",
                fontSize: 11,
                letterSpacing: "0.3em",
                color: "#cc0000",
                textTransform: "uppercase",
              }}
            >
              Official Artist Page
            </span>
          </div>

          {/* Name */}
          <div className="overflow-hidden mb-1">
            <h1
              style={{
                fontFamily: "'Impact', 'Arial Black', 'Oswald', sans-serif",
                fontSize: "clamp(52px, 11vw, 160px)",
                fontWeight: 900,
                lineHeight: 0.88,
                color: "#fff",
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
              }}
            >
              LIL ROME
            </h1>
          </div>
          <div className="overflow-hidden mb-6">
            <h2
              style={{
                fontFamily: "'Impact', 'Arial Black', 'Oswald', sans-serif",
                fontSize: "clamp(44px, 9vw, 128px)",
                fontWeight: 900,
                lineHeight: 0.88,
                color: "transparent",
                WebkitTextStroke: "2px #cc0000",
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
              }}
            >
              PRABA
            </h2>
          </div>

          {/* Tagline */}
          <p
            className="mb-8 max-w-sm"
            style={{
              fontFamily: "'Barlow Condensed', 'Oswald', sans-serif",
              fontSize: "clamp(14px, 2vw, 17px)",
              color: "rgba(180,180,180,0.85)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              lineHeight: 1.6,
            }}
          >
            Straight from the streets.{" "}
            <span style={{ color: "#fff" }}>Every bar unfiltered</span>,{" "}
            <span style={{ color: "#cc0000" }}>unapologetic</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 items-center mb-12">
            <a href="#music" className="btn-primary-hero">Listen Now</a>
            <a href="#shows" className="btn-outline-hero">Tour Dates</a>
          </div>

          {/* Stats */}
          <div className="flex gap-8 lg:gap-14">
            {[
              { num: "2.4M", label: "Monthly Listeners" },
              { num: "18+", label: "Shows This Year" },
              { num: "3", label: "Albums Dropped" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "'Impact', 'Oswald', sans-serif",
                    fontSize: "clamp(26px, 4vw, 42px)",
                    fontWeight: 900,
                    color: "#d4a843",
                    lineHeight: 1,
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "rgba(120,120,120,0.9)",
                    marginTop: 4,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden lg:flex flex-col items-center gap-2">
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 10,
            letterSpacing: "0.3em",
            color: "rgba(100,100,100,0.8)",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, rgba(100,100,100,0.7), transparent)" }} />
      </div>
    </section>
  );
}