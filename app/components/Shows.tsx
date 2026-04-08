const shows = [
  { date: "APR 18", day: "FRI", city: "Colombo", venue: "Nelum Pokuna Amphitheatre", country: "Sri Lanka", status: "On Sale", sold: false },
  { date: "APR 25", day: "FRI", city: "Dubai", venue: "Coca-Cola Arena", country: "UAE", status: "On Sale", sold: false },
  { date: "MAY 03", day: "SAT", city: "London", venue: "O2 Forum Kentish Town", country: "UK", status: "Few Left", sold: false },
  { date: "MAY 10", day: "SAT", city: "Berlin", venue: "Tempodrom", country: "Germany", status: "Sold Out", sold: true },
  { date: "MAY 17", day: "SAT", city: "Toronto", venue: "Rebel Entertainment", country: "Canada", status: "On Sale", sold: false },
  { date: "MAY 24", day: "SAT", city: "New York", venue: "Irving Plaza", country: "USA", status: "On Sale", sold: false },
  { date: "JUN 07", day: "SAT", city: "Los Angeles", venue: "The Novo", country: "USA", status: "Coming Soon", sold: false },
];

export default function Shows() {
  return (
    <section id="shows" className="bg-black py-24 lg:py-32 relative">
      {/* Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blood/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-crimson" />
              <span className="font-oswald text-xs tracking-[0.3em] uppercase text-crimson">Live</span>
            </div>
            <h2 className="font-display text-5xl lg:text-7xl text-white">TOUR DATES</h2>
            <p className="font-barlow text-gray-500 uppercase tracking-widest text-sm mt-2">
              2026 World Tour
            </p>
          </div>

          {/* Year indicator */}
          <div className="font-display text-stroke text-6xl lg:text-8xl select-none">2026</div>
        </div>

        {/* Shows list */}
        <div className="space-y-2">
          {shows.map((show, i) => (
            <div
              key={i}
              className={`show-card bg-dark-2 rounded-sm ${show.sold ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-4 lg:gap-8 px-4 lg:px-6 py-4 lg:py-5">
                {/* Date */}
                <div className="flex-shrink-0 w-16 lg:w-20 text-center">
                  <div className="font-display text-xl lg:text-2xl text-white">{show.date}</div>
                  <div className="font-oswald text-xs tracking-widest text-gray-600 uppercase">{show.day}</div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-10 bg-white/10 flex-shrink-0" />

                {/* City / Venue */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-display text-lg lg:text-2xl text-white uppercase">{show.city}</span>
                    <span className="font-oswald text-xs tracking-widest text-gray-600 uppercase">{show.country}</span>
                  </div>
                  <div className="font-barlow text-sm text-gray-500 uppercase tracking-wide mt-0.5">
                    {show.venue}
                  </div>
                </div>

                {/* Status & CTA */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span
                    className={`font-oswald text-xs tracking-[0.2em] uppercase hidden sm:block ${
                      show.sold
                        ? "text-gray-600"
                        : show.status === "Few Left"
                        ? "text-gold"
                        : show.status === "Coming Soon"
                        ? "text-gray-500"
                        : "text-green-500"
                    }`}
                  >
                    {show.status}
                  </span>
                  {!show.sold && show.status !== "Coming Soon" ? (
                    <a
                      href="#"
                      className="btn-primary px-4 lg:px-6 py-2 text-xs font-bold flex-shrink-0"
                    >
                      Tickets
                    </a>
                  ) : show.status === "Coming Soon" ? (
                    <button className="btn-outline px-4 lg:px-6 py-2 text-xs flex-shrink-0">
                      Notify Me
                    </button>
                  ) : (
                    <span className="font-oswald text-xs tracking-widest text-gray-700 uppercase px-4 lg:px-6 py-2">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VIP Box */}
        <div className="mt-12 border border-gold/20 bg-gradient-to-r from-gold/5 to-transparent rounded-sm p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-oswald text-xs tracking-[0.3em] uppercase gold-gradient mb-2">Exclusive</div>
            <h3 className="font-display text-3xl lg:text-4xl text-white mb-2">VIP PACKAGES</h3>
            <p className="font-barlow text-gray-400 text-base max-w-md">
              Meet & greet, soundcheck access, exclusive merch bundle, and early entry to every show.
            </p>
          </div>
          <a href="#" className="btn-outline flex-shrink-0 px-8 py-3 text-sm">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}