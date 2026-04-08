const posts = [
  {
    category: "Behind the Scenes",
    title: "Inside the 'Blood & Gold' Recording Session",
    excerpt: "48 hours straight in the booth. Here's what really went down when we recorded the title track.",
    date: "Apr 2, 2026",
    readTime: "5 min read",
    color: "from-blood/60",
  },
  {
    category: "Tour Diary",
    title: "Dubai Was Crazy — A Night I Won't Forget",
    excerpt: "3,000 people, one mic, zero rehearsal. The Dubai show went harder than anything I've done.",
    date: "Mar 28, 2026",
    readTime: "4 min read",
    color: "from-dark-4",
  },
  {
    category: "Industry Talk",
    title: "Why I Turned Down the Major Label Deal",
    excerpt: "They came with numbers I'd never seen. I walked away anyway. Here's the honest reason why.",
    date: "Mar 15, 2026",
    readTime: "7 min read",
    color: "from-dark-3",
  },
];

export default function Blog() {
  return (
    <section id="blog" className="bg-dark-1 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
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
          <div className="lg:col-span-2 blog-card group cursor-pointer">
            <div className="relative aspect-video lg:aspect-[16/9] overflow-hidden rounded-sm bg-dark-3">
              <div className={`absolute inset-0 bg-gradient-to-tr ${posts[0].color} to-transparent`} />
              {/* Pattern */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: "repeating-linear-gradient(45deg, rgba(220,20,60,0.3) 0, rgba(220,20,60,0.3) 1px, transparent 0, transparent 50%)",
                  backgroundSize: "12px 12px",
                }}
              />
              <div className="absolute inset-0 flex items-end p-6 lg:p-8">
                <div>
                  <span className="font-oswald text-xs tracking-[0.25em] uppercase text-crimson mb-3 block">
                    {posts[0].category}
                  </span>
                  <h3 className="font-display text-2xl lg:text-4xl text-white leading-tight mb-3 group-hover:text-crimson transition-colors">
                    {posts[0].title}
                  </h3>
                  <p className="font-barlow text-gray-400 text-base max-w-lg hidden lg:block">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="font-oswald text-xs text-gray-600 uppercase tracking-widest">{posts[0].date}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                    <span className="font-oswald text-xs text-gray-600 uppercase tracking-widest">{posts[0].readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side posts */}
          <div className="flex flex-col gap-5">
            {posts.slice(1).map((post) => (
              <div key={post.title} className="blog-card group cursor-pointer flex-1">
                <div className="relative h-full min-h-[180px] overflow-hidden rounded-sm bg-dark-3">
                  <div className={`absolute inset-0 bg-gradient-to-br ${post.color} to-transparent`} />
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 1px, transparent 0, transparent 50%)",
                      backgroundSize: "10px 10px",
                    }}
                  />
                  <div className="absolute inset-0 flex items-end p-5">
                    <div>
                      <span className="font-oswald text-xs tracking-[0.25em] uppercase text-crimson mb-2 block">
                        {post.category}
                      </span>
                      <h3 className="font-display text-lg lg:text-xl text-white leading-tight group-hover:text-crimson transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="font-oswald text-xs text-gray-600 uppercase tracking-widest">{post.date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                        <span className="font-oswald text-xs text-gray-600 uppercase tracking-widest">{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}