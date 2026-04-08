import Image from "next/image";
import song from '@/public/song.jpg';

export default function About() {
  return (
    <section id="about" className="bg-dark-2 py-24 lg:py-32 relative overflow-hidden">
      {/* Large faded text */}
      <div className="absolute right-0 bottom-0 overflow-hidden select-none pointer-events-none">
        <span
          className="font-display text-stroke block"
          style={{ fontSize: "clamp(80px, 20vw, 280px)", opacity: 0.04 }}
        >
          REAL
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
              <Image
                src={song}
                alt="LIL ROME PRABA"
                fill
                className="object-cover object-top"
                style={{ filter: "contrast(1.05) brightness(0.75) saturate(0.5)" }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>

            {/* Red border accent */}
            <div className="absolute -bottom-4 -right-4 w-3/4 h-3/4 border border-blood/40 rounded-sm -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-crimson/60" />

            {/* Quote overlay - FIXED: Escaped double quotes */}
            <div className="absolute bottom-8 left-0 right-0 px-6">
              <blockquote className="font-display text-xl lg:text-2xl text-white leading-tight">
                &ldquo;THE STREETS MADE ME,{" "}
                <span className="red-glow text-crimson">THE MUSIC FREED ME.&rdquo;</span>
              </blockquote>
            </div>
          </div>

          {/* Text side */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-crimson" />
              <span className="font-oswald text-xs tracking-[0.3em] uppercase text-crimson">The Story</span>
            </div>

            <h2 className="font-display text-5xl lg:text-6xl xl:text-7xl text-white mb-8 leading-none">
              WHO IS<br />
              <span className="gold-gradient"> LIL ROME PRABA</span>
            </h2>

            <div className="space-y-4 font-barlow text-gray-400 text-lg leading-relaxed">
              <p>
                Born and raised in Negombo, Sri Lanka, Lil Rome Praba didn&apos;t find rap — rap found him.
                With a genre-bending sound that fuses hip-hop, melodic rap, and global influences,
                he crafts music that reflects his journey, identity, and creative ambition.
              </p>
              <p>
                Known for his raw, expressive lyricism and instinct for storytelling, Lil Rome Praba
                is quickly building a reputation as a boundary-pushing talent. His distinct voice and
                electrifying energy — both on stage and in the studio — mark him as a defining name
                in the new wave of contemporary music.
              </p>
              <p>
                <span className="text-crimson">Personal. Powerful. Unapologetic.</span>{" "}
                Every track is a receipt from the life he&apos;s lived and the artist he&apos;s becoming.
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8">
              {["Hip Hop", "Melodic Rap", "Street Rap", "Genre-Bending", "Live Sets"].map((tag) => (
                <span
                  key={tag}
                  className="font-oswald text-xs tracking-widest uppercase border border-white/10 text-gray-500 px-3 py-1 rounded-sm hover:border-crimson/40 hover:text-white transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-10 flex gap-4">
              <a href="#music" className="btn-primary px-7 py-3 text-sm font-bold">
                Listen Now
              </a>
              <a href="#contact" className="btn-outline px-7 py-3 text-sm">
                Book Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}