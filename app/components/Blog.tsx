const video1 = "/blogs/v1.mp4";
const video2 = "/blogs/v2.mp4";
const video3 = "/blogs/v3.mp4";

const posts = [
  {
    category: "Behind the Scenes",
    title: "Lil Rome Praba x Tikx Kooda - අත ඇරලා දාලා Atha Arala Daala",
    excerpt: "48 hours straight in the booth. Here's what really went down when we recorded the title track.",
    readTime: "5 min read",
    video: video1,
  },
  {
    category: "Tour Diary",
    title: "Lil Rome Praba | මතක පද (Mathaka Pada) ",
    excerpt: "3,000 people, one mic, zero rehearsal. The Dubai show went harder than anything I've done.",
    readTime: "4 min read",
    video: video2,
  },
  {
    category: "On Stage",
    title: "Official live performance at Karalla 2026",
    excerpt: "They came with numbers I'd never seen. I walked away anyway. Here's the honest reason why.",
    readTime: "7 min read",
    video: video3,
  },
];

export default function Blog() {
  return (
    <section id="blog" className="relative py-24 lg:py-32 bg-dark-1">
      <style>{`
        .blog-card {
          position: relative;
          border: 1px solid rgba(220,20,60,0.12);
          background: #111111;
          transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .blog-card:hover {
          border-color: rgba(220,20,60,0.4);
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(220,20,60,0.1);
        }

        .blog-cat {
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #DC143C;
          display: block;
          margin-bottom: 10px;
          opacity: 0.9;
        }

        .blog-title {
          color: #fff;
          text-transform: uppercase;
          transition: color 0.3s ease;
          line-height: 1.05;
        }
        .blog-card:hover .blog-title { color: #DC143C; }

        .blog-meta {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        .blog-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(220,20,60,0.5);
          display: inline-block;
        }

        /* noise texture over the video */
        .blog-noise {
          background-image: repeating-linear-gradient(
            45deg,
            rgba(220,20,60,0.04) 0,
            rgba(220,20,60,0.04) 1px,
            transparent 0,
            transparent 50%
          );
          background-size: 12px 12px;
        }

        .blog-card-featured::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, transparent, #DC143C, transparent);
          opacity: 0.6;
        }

        .blog-card-side::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, transparent, #DC143C, transparent);
          opacity: 0.35;
        }

        .blog-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-crimson" />
              <span className="font-oswald text-xs tracking-[0.3em] uppercase text-crimson">Words</span>
            </div>
            <h2 className="font-display text-5xl lg:text-7xl text-white">LATEST NEWS</h2>
          </div>
          <a href="#" className="btn-outline px-6 py-2 text-xs hidden md:block">View All</a>
        </div>

        {/* Featured + side posts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Featured (large) */}
          <div className="lg:col-span-2 blog-card blog-card-featured group cursor-pointer">
            <div className="relative aspect-video overflow-hidden">
              <video
                className="blog-video"
                src={posts[0].video}
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="blog-noise absolute inset-0 opacity-50" />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, #000 5%, rgba(0,0,0,0.15) 55%, transparent 75%)" }}
              />

              <div className="absolute inset-0 flex items-end p-6 lg:p-8">
                <div>
                  <span className="blog-cat font-oswald">{posts[0].category}</span>
                  <h3 className="blog-title font-display mb-3" style={{ fontSize: "clamp(22px, 3vw, 36px)" }}>
                    {posts[0].title}
                  </h3>
                  <p className="font-barlow hidden lg:block max-w-lg" style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="blog-dot" />
                    <span className="blog-meta font-oswald">{posts[0].readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side posts */}
          <div className="flex flex-col gap-5">
            {posts.slice(1).map((post) => (
              <div key={post.title} className="blog-card blog-card-side group cursor-pointer flex-1">
                <div className="relative h-full min-h-[180px] overflow-hidden">
                  <video
                    className="blog-video"
                    src={post.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="blog-noise absolute inset-0 opacity-30" />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, #000 10%, rgba(0,0,0,0.2) 60%, transparent 80%)" }}
                  />

                  <div className="absolute inset-0 flex items-end p-5">
                    <div>
                      <span className="blog-cat font-oswald">{post.category}</span>
                      <h3 className="blog-title font-display" style={{ fontSize: "clamp(16px, 2vw, 21px)" }}>
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="blog-dot" />
                        <span className="blog-meta font-oswald">{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile view all */}
        <div className="mt-8 flex justify-center md:hidden">
          <a href="#" className="btn-outline px-6 py-2 text-xs">View All Posts</a>
        </div>
      </div>
    </section>
  );
}